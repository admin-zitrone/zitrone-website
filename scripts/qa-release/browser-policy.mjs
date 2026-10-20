/**
 * Request policy for the Playwright QA scripts (visual-compare, visual-sweep,
 * motion-check). Hostnames are compared after parsing with URL, never by
 * prefix. Contexts must also be created with serviceWorkers: "block" so no
 * request bypasses the route handler.
 *
 * Two sides:
 * - candidate (a loopback base URL): GET/HEAD to that origin. Other methods
 *   only for the paths listed in QA_LOCAL_MUTATIONS ("POST /api/contact-request");
 *   scripts that mock an endpoint register their own page route, which runs
 *   before this one. Requests to QA_BLOB_HOST are answered from QA_BLOB_MIRROR.
 * - approved (any other base URL, the published site): GET/HEAD to that exact
 *   hostname and to QA_BLOB_HOST go out. Any other method to them is answered
 *   locally with 204 and never sent ("simulated"), so analytics beacons and
 *   form posts cannot reach production.
 * Everything else is aborted ("blocked"), Google included.
 *
 * Each decision is appended to QA_BROWSER_LOG (JSON lines: side, method,
 * origin + path without query, outcome). "transmitted" is the only outcome
 * that left the machine.
 *
 * Without QA_* variables a loopback base keeps the scripts' previous
 * behaviour, except that only reads reach the local server.
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

const LOOPBACK = new Set(["127.0.0.1", "localhost", "[::1]"])
const READ = new Set(["GET", "HEAD"])

export function policyFor(base, env = process.env) {
  const baseUrl = new URL(base)
  const mirrorDir = env.QA_BLOB_MIRROR || ""
  return {
    side: LOOPBACK.has(baseUrl.hostname) ? "candidate" : "approved",
    origin: baseUrl.origin,
    blobHost: env.QA_BLOB_HOST || "",
    mirrorDir,
    manifest: mirrorDir && existsSync(join(mirrorDir, "manifest.json"))
      ? JSON.parse(readFileSync(join(mirrorDir, "manifest.json"), "utf8"))
      : {},
    localMutations: (env.QA_LOCAL_MUTATIONS || "").split(",").map((item) => item.trim()).filter(Boolean),
    log: env.QA_BROWSER_LOG || "",
  }
}

/** Pure decision, unit-tested: { outcome, reason }. */
export function decide({ url, method }, policy) {
  if (/^(data|blob|about):/.test(url)) return { outcome: "inline" }
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return { outcome: "blocked", reason: "unparseable" }
  }
  const verb = method.toUpperCase()
  const read = READ.has(verb)
  const host = parsed.hostname
  if (policy.side === "candidate") {
    if (parsed.origin === policy.origin) {
      if (read || policy.localMutations.includes(`${verb} ${parsed.pathname}`)) return { outcome: "local" }
      return { outcome: "blocked", reason: "local mutation not agreed" }
    }
    if (policy.blobHost && host === policy.blobHost && read) return { outcome: "mirror" }
    return { outcome: "blocked" }
  }
  const approvedHost = new URL(policy.origin).hostname
  if (host === approvedHost || (policy.blobHost && host === policy.blobHost)) {
    return read ? { outcome: "transmitted" } : { outcome: "simulated" }
  }
  return { outcome: "blocked" }
}

export async function applyPolicy(context, policy) {
  await context.route("**/*", async (route) => {
    const request = route.request()
    const { outcome, reason } = decide({ url: request.url(), method: request.method() }, policy)
    if (outcome !== "inline" && policy.log) {
      let where = request.url()
      try { const u = new URL(where); where = `${u.origin}${u.pathname}` } catch {}
      appendFileSync(policy.log, JSON.stringify({ t: new Date().toISOString(), side: policy.side, method: request.method(), url: where, outcome, ...(reason ? { reason } : {}) }) + "\n")
    }
    if (outcome === "local" || outcome === "transmitted" || outcome === "inline") return route.continue()
    if (outcome === "simulated") return route.fulfill({ status: 204, body: "" })
    if (outcome === "mirror") {
      const item = policy.manifest[new URL(request.url()).pathname]
      if (!item?.file) return route.fulfill({ status: 404, body: "not in QA mirror" })
      return route.fulfill({ status: 200, contentType: item.contentType, body: readFileSync(join(policy.mirrorDir, item.file)) })
    }
    return route.abort("blockedbyclient")
  })
}
