/**
 * Network boundary for every Node process of the isolated QA run
 * (scripts/qa-release/run.sh): builds, `next start`, migrations, seed and
 * probes. Loaded with NODE_OPTIONS=--import, so child processes inherit it.
 *
 * Only loopback is reachable. A fetch, TCP or TLS connection to any other
 * host is refused before DNS, so nothing is transmitted. One exception, when
 * QA_BLOB_HOST and QA_BLOB_MIRROR are set: a GET/HEAD fetch to exactly that
 * Blob hostname is answered from the local mirror (scripts/qa-release/
 * mirror-media.mjs), also without network. Any other method to it is refused.
 *
 * Every non-loopback attempt is appended to QA_EGRESS_LOG (JSON lines, no
 * query strings or bodies) with its outcome: "blocked" or "mirror". Nothing is
 * ever "transmitted" from these processes; tests/scripts/qa-release.test.ts
 * checks that.
 *
 * Not covered: DNS lookups by other code paths and UDP (dgram). The app uses
 * neither for providers; the log would not show them.
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs"
import net from "node:net"
import { join } from "node:path"
import tls from "node:tls"

const LOCAL = new Set(["127.0.0.1", "localhost", "::1", "[::1]"])
const LOG = process.env.QA_EGRESS_LOG
const BLOB_HOST = process.env.QA_BLOB_HOST || ""
const MIRROR = process.env.QA_BLOB_MIRROR || ""
const manifest = MIRROR && existsSync(join(MIRROR, "manifest.json"))
  ? JSON.parse(readFileSync(join(MIRROR, "manifest.json"), "utf8"))
  : {}

function record(entry) {
  if (!LOG) return
  appendFileSync(LOG, JSON.stringify({ t: new Date().toISOString(), pid: process.pid, ...entry }) + "\n")
}

function refuse(kind, destination, method) {
  record({ kind, destination, method, outcome: "blocked" })
  const error = new Error(`qa-egress-guard: blocked ${kind} ${destination}`)
  error.code = "ZITRONE_QA_EGRESS_BLOCKED"
  return error
}

function parse(input) {
  try {
    return new URL(typeof input === "string" || input instanceof URL ? input : input.url)
  } catch {
    return null
  }
}

const realFetch = globalThis.fetch
globalThis.fetch = async function qaGuardedFetch(input, init) {
  const url = parse(input)
  const method = String(init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase()
  if (url && LOCAL.has(url.hostname)) return realFetch(input, init)
  const destination = url ? `${url.protocol}//${url.host}${url.pathname}` : String(input)
  if (url && BLOB_HOST && url.hostname === BLOB_HOST && (method === "GET" || method === "HEAD")) {
    const item = manifest[url.pathname]
    record({ kind: "fetch", destination, method, outcome: "mirror", found: Boolean(item?.file) })
    if (!item?.file) return new Response("not in QA mirror", { status: 404 })
    const body = method === "HEAD" ? null : readFileSync(join(MIRROR, item.file))
    return new Response(body, { status: 200, headers: { "content-type": item.contentType, "content-length": String(item.bytes) } })
  }
  throw refuse("fetch", destination, method)
}

function connectTarget(args) {
  const [first, second] = args
  if (typeof first === "object" && first !== null) {
    if (first.path) return null
    return first.host ?? first.hostname ?? "localhost"
  }
  if (typeof first === "string" && Number.isNaN(Number(first))) return null // unix socket path
  return typeof second === "string" ? second : "localhost"
}

const realSocketConnect = net.Socket.prototype.connect
net.Socket.prototype.connect = function qaGuardedConnect(...args) {
  const target = connectTarget(Array.isArray(args[0]) ? args[0] : args)
  if (target !== null && !LOCAL.has(target)) {
    const error = refuse("tcp", target)
    process.nextTick(() => this.destroy(error))
    return this
  }
  return realSocketConnect.apply(this, args)
}

const realTlsConnect = tls.connect
tls.connect = function qaGuardedTlsConnect(...args) {
  const target = connectTarget(args)
  if (target !== null && !LOCAL.has(target)) throw refuse("tls", target)
  return realTlsConnect.apply(this, args)
}
