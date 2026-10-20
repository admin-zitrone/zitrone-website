/**
 * Ties `extract` to a successful `catalog` of the same run (Codex R12).
 *
 *   node scripts/qa-release/gate.mjs approve <qa-run> <run-id> <cand-sha>
 *   node scripts/qa-release/gate.mjs check   <qa-run> <run-id> <cand-sha>   -> prints the source fingerprint
 *
 * run.sh catalog deletes any previous approval first, and calls `approve`
 * only when validate-catalog.mjs exited 0. The approval
 * (<qa-run>/private/catalog.ok) records the run, the candidate SHA, the
 * source fingerprint and the SHA-256 of the catalog, the inventory, the data
 * table list and the remap. `check` refuses unless every value still matches.
 * prod-read.mjs dump then refuses a source with another fingerprint.
 */
import { createHash } from "node:crypto"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { isMain } from "./is-main.mjs"

const sha = (file) => createHash("sha256").update(readFileSync(file)).digest("hex")

export function inputs(qaRun) {
  return {
    catalog: join(qaRun, "private", "catalog.json"),
    inventory: new URL("./inventory.json", import.meta.url).pathname,
    tables: join(qaRun, "work", "data-tables.txt"),
    remap: join(qaRun, "work", "remap.json"),
  }
}

export function approval(qaRun, runId, candSha) {
  const files = inputs(qaRun)
  const missing = Object.entries(files).filter(([, f]) => !existsSync(f)).map(([k]) => k)
  if (missing.length) throw new Error(`missing ${missing.join(", ")}`)
  const source = JSON.parse(readFileSync(files.catalog, "utf8")).source
  if (!/^[0-9a-f]{64}$/.test(source ?? "")) throw new Error("catalog has no source fingerprint")
  return { runId, candSha, source, ...Object.fromEntries(Object.entries(files).map(([k, f]) => [k, sha(f)])) }
}

export function check(qaRun, runId, candSha) {
  const file = join(qaRun, "private", "catalog.ok")
  if (!existsSync(file)) throw new Error("no successful catalog validation in this run")
  const saved = JSON.parse(readFileSync(file, "utf8"))
  const now = approval(qaRun, runId, candSha)
  const changed = Object.keys(now).filter((k) => saved[k] !== now[k])
  if (changed.length) throw new Error(`catalog approval no longer matches: ${changed.join(", ")}`)
  return saved.source
}

if (isMain(import.meta.url)) {
  const [command, qaRun, runId, candSha] = process.argv.slice(2)
  try {
    if (command === "approve") {
      writeFileSync(join(qaRun, "private", "catalog.ok"), JSON.stringify(approval(qaRun, runId, candSha), null, 2) + "\n", { mode: 0o600 })
    } else if (command === "check") {
      console.log(check(qaRun, runId, candSha))
    } else {
      throw new Error("usage: gate.mjs <approve|check> <qa-run> <run-id> <cand-sha>")
    }
  } catch (error) {
    console.error(`gate: ${error.message}; extract refused`)
    process.exit(1)
  }
}
