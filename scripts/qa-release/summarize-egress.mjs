/**
 * Phase C summary from the run's network logs.
 *
 *   node scripts/qa-release/summarize-egress.mjs <egress-dir> <approved-host> <blob-host> <report.md>
 *
 * Node processes (egress-guard, *.jsonl not starting with "browser-"): every
 * non-loopback attempt must be "blocked" or "mirror"; nothing is transmitted.
 * Browser logs (browser-*.jsonl): the candidate side never transmits; the
 * approved side transmits only GET/HEAD to the approved host and the Blob
 * store; its other methods are "simulated" (answered locally).
 * Exit 1 when a rule is broken.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { isMain } from "./is-main.mjs"

export function summarize(entriesByFile, approvedHost, blobHost) {
  const failures = []
  const node = {}
  const browser = { candidate: {}, approved: {} }
  const blockedDestinations = new Set()
  const simulated = new Set()
  for (const [file, entries] of Object.entries(entriesByFile)) {
    for (const e of entries) {
      if (!file.startsWith("browser-")) {
        node[e.outcome] = (node[e.outcome] ?? 0) + 1
        if (e.outcome === "blocked") blockedDestinations.add(`${file.replace(/\.jsonl$/, "")}: ${e.kind} ${e.destination}`)
        if (e.outcome !== "blocked" && e.outcome !== "mirror") failures.push(`${file}: ${e.outcome} ${e.destination}`)
        continue
      }
      const side = browser[e.side] ?? (browser[e.side] = {})
      side[e.outcome] = (side[e.outcome] ?? 0) + 1
      if (e.outcome === "simulated") simulated.add(`${e.method} ${e.url}`)
      if (e.outcome !== "transmitted") continue
      if (e.side !== "approved") { failures.push(`${file}: candidate transmitted ${e.method} ${e.url}`); continue }
      const host = new URL(e.url).hostname
      if (!["GET", "HEAD"].includes(e.method) || (host !== approvedHost && host !== blobHost)) failures.push(`${file}: transmitted ${e.method} ${e.url}`)
    }
  }
  return { failures, node, browser, blockedDestinations: [...blockedDestinations].sort(), simulated: [...simulated].sort() }
}

if (isMain(import.meta.url)) {
  const [dir, approvedHost, blobHost, report] = process.argv.slice(2)
  const entriesByFile = {}
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".jsonl"))) {
    entriesByFile[file] = readFileSync(join(dir, file), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l))
  }
  const r = summarize(entriesByFile, approvedHost, blobHost)
  const md = [
    "# Fase C: salidas de red",
    "",
    `- Procesos Node (build, servidores, migraciones, seed, tareas): ${JSON.stringify(r.node)}; nada transmitido fuera de loopback.`,
    `- Navegador, candidato: ${JSON.stringify(r.browser.candidate)}`,
    `- Navegador, sitio aprobado: ${JSON.stringify(r.browser.approved)} (transmitted = solo GET/HEAD a ${approvedHost} y ${blobHost})`,
    "",
    "## Bloqueadas en procesos Node",
    "",
    ...(r.blockedDestinations.length ? r.blockedDestinations.map((d) => `- ${d}`) : ["- ninguna"]),
    "",
    "## Simuladas en el sitio aprobado (respondidas en local, no enviadas)",
    "",
    ...(r.simulated.length ? r.simulated.map((d) => `- ${d}`) : ["- ninguna"]),
    "",
    r.failures.length ? `## INCUMPLIMIENTOS\n\n${r.failures.map((f) => `- ${f}`).join("\n")}` : "## Resultado: ninguna salida fuera de la política",
    "",
  ].join("\n")
  writeFileSync(report, md)
  console.log(md)
  process.exit(r.failures.length ? 1 : 0)
}
