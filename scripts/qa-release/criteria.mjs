/**
 * The plan's automatic criteria as code (Codex R13). Each evaluator returns
 * rows { check, status, detail } with status PASS, FAIL, PENDING (needs the
 * user's classification) or INFO. The CLI appends them to <qa-run>/status.tsv
 * and exits 1 on any FAIL, so run.sh stops; evidence can still be saved.
 *
 *   node scripts/qa-release/criteria.mjs <kind> <qa-run> <inputs...>
 *     states        <home-migrated.json> <home-roll-forward.json>
 *     integrations  <http-code> <lead.log> <touch.log> <gtm-count>
 *     sweep         <sweep/results.json> [<motion-diff.txt>]
 *     visual        <name> <visual.json>
 *     sitemap       <pages-diff.txt> <pages-approved.txt>
 *     mirror        <mirror/manifest.json>
 *     status        -> prints the overall verdict from status.tsv
 *     pending       -> prints the checks whose latest row is PENDING, one per line
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { isMain } from "./is-main.mjs"

const row = (check, ok, detail, failStatus = "FAIL") => ({ check, status: ok ? "PASS" : failStatus, detail })

/** The home the candidate reads after migrating, and again after migrate:down + migrate. */
export function states({ homeMigrated, homeRollForward }) {
  return [
    row("states:roll-forward", homeMigrated !== "" && homeMigrated === homeRollForward, homeMigrated === homeRollForward ? "home igual a la copia migrada" : "home distinta tras volver a avanzar"),
  ]
}

export function integrations({ httpCode, leadLog, touchLog, gtmCount }) {
  const leads = Number(leadLog.match(/QA_TASK leads (\d+)/)?.[1] ?? -1)
  const touched = (touchLog.match(/QA_TASK touch \w+ #\d+/g) ?? []).length
  const invalid = (touchLog.match(/QA_TASK invalid \w+ #\d+ \w+: [^\n]*/g) ?? []).map((l) => l.replace("QA_TASK invalid ", ""))
  const skipped = (touchLog.match(/embedding skipped/g) ?? []).length
  return [
    row("integrations:lead-http", httpCode === "201", `HTTP ${httpCode}`),
    row("integrations:lead-saved", leads === 1, `${leads} lead(s) con el correo de la prueba`),
    row("integrations:lead-email", /EMAIL_NOT_CONFIGURED/.test(leadLog), /EMAIL_NOT_CONFIGURED/.test(leadLog) ? "entrega EMAIL_NOT_CONFIGURED, nada enviado" : "sin EMAIL_NOT_CONFIGURED en el registro del lead"),
    row("integrations:embeddings", touched === 2 && skipped >= 2, `${touched} documento(s) guardados, ${skipped} 'embedding skipped'`),
    row("integrations:gtm", gtmCount === "0", `${gtmCount} referencia(s) a GTM en el HTML`),
    ...(invalid.length ? [{ check: "integrations:cms-invalid", status: "INFO", detail: `${invalid.length} documento/idioma no se pueden guardar tal como están: ${invalid.slice(0, 5).join("; ")}` }] : []),
  ]
}

// Vercel serves these two scripts only on its platform; locally they 404.
export const OFF_VERCEL = /\/_vercel\/(insights|speed-insights)\/script\.js/
const realErrors = (list) => (list ?? []).filter((m) => !OFF_VERCEL.test(m))

/** @param {{ results: any, motionDiff?: string }} input */
export function sweep({ results, motionDiff }) {
  const bad = results.pages.filter((p) => p.status !== 200 || p.overflowPx > 0 || p.brokenImages?.length || realErrors(p.consoleErrors).length)
  const badStates = (results.states ?? []).filter((s) => realErrors(s.consoleErrors).length)
  const excluded = [...results.pages, ...(results.states ?? [])].reduce((n, p) => n + (p.consoleErrors ?? []).filter((m) => OFF_VERCEL.test(m)).length, 0)
  const out = [
    { check: "sweep:off-vercel", status: "INFO", detail: `${excluded} error(es) de consola excluidos: scripts /_vercel/insights y /_vercel/speed-insights, que solo existen en Vercel` },
    row("sweep:pages", results.pages.length > 0 && bad.length === 0, `${results.pages.length} páginas; ${bad.length} con estado distinto de 200, desbordamiento, imágenes rotas o errores de consola${bad.length ? ": " + bad.slice(0, 5).map((p) => `${p.locale}${p.route}@${p.width}`).join(", ") : ""}`),
    row("sweep:states", badStates.length === 0, `${(results.states ?? []).length} estados, ${badStates.length} con errores de consola`),
  ]
  if (motionDiff !== undefined) {
    const same = /same as the approved site/.test(motionDiff)
    out.push({ check: "sweep:motion", status: same ? "PASS" : "PENDING", detail: same ? "igual al sitio aprobado" : `${motionDiff.trim().split("\n").length} diferencia(s) por clasificar` })
  }
  return out
}

export function visual(name, report) {
  const errors = report.results.filter((r) => r.error)
  const differ = report.results.filter((r) => !r.error && (!r.sameSize || r.changedPct > 0.1))
  return [
    row(`visual:${name}:errors`, report.results.length > 0 && errors.length === 0, `${report.results.length} comparaciones, ${errors.length} error(es)`),
    { check: `visual:${name}:differences`, status: differ.length ? "PENDING" : "PASS", detail: `${differ.length} página(s) por encima de 0.1 %${differ.length ? ", por clasificar" : ""}` },
  ]
}

export function sitemap({ diff, approved }) {
  const pages = approved.split("\n").filter(Boolean).length
  return [
    row("sitemap:approved", pages > 0, `${pages} páginas en el sitemap publicado`),
    { check: "sitemap:same", status: diff.trim() ? "PENDING" : "PASS", detail: diff.trim() ? "el candidato tiene otras páginas, por clasificar" : "mismas páginas" },
  ]
}

/** Size variants (role "size") are used only by the admin's thumbnails: their misses are INFO. */
export function mirror(manifest) {
  const entries = Object.entries(manifest)
  const missing = entries.filter(([, m]) => !m.file && m.role !== "size")
  const sizes = entries.filter(([, m]) => !m.file && m.role === "size")
  return [
    row("mirror:complete", entries.length > 0 && missing.length === 0, `${entries.length} archivo(s), ${missing.length} de los que usa el sitio no encontrados`),
    ...(sizes.length ? [{ check: "mirror:size-variants", status: "INFO", detail: `${sizes.length} variante(s) de tamaño no existen en Blob (solo miniaturas del admin; el sitio usa el original)` }] : []),
  ]
}

/** Overall verdict. Missing required checks make the run INCOMPLETO. */
export const REQUIRED = [
  "catalog", "restore:counts", "restore:free-text", "states:links-after-migrate", "states:roll-forward",
  "mirror:complete", "build", "serve", "sitemap:approved", "visual:approved-vs-mig:errors", "sweep:pages", "sweep:motion", "integrations:lead-http",
  "integrations:lead-saved", "integrations:lead-email", "integrations:embeddings", "integrations:gtm", "network",
]
export function verdict(rows) {
  const last = new Map(rows.map((r) => [r.check, r]))
  const all = [...last.values()]
  const missing = REQUIRED.filter((c) => !last.has(c) || last.get(c).status === "SKIPPED")
  if (all.some((r) => r.status === "FAIL")) return { verdict: "FALLIDO", missing }
  if (missing.length) return { verdict: "INCOMPLETO", missing }
  if (all.some((r) => r.status === "PENDING")) return { verdict: "PENDIENTE DE CLASIFICACIÓN", missing }
  return { verdict: "CRITERIOS AUTOMÁTICOS CUMPLIDOS", missing }
}

export function readStatus(qaRun) {
  const file = join(qaRun, "status.tsv")
  if (!existsSync(file)) return []
  return readFileSync(file, "utf8").split("\n").filter(Boolean).map((l) => {
    const [check, status, detail] = l.split("\t")
    return { check, status, detail }
  })
}

if (isMain(import.meta.url)) {
  const [kind, qaRun, ...args] = process.argv.slice(2)
  const text = (f) => (existsSync(f) ? readFileSync(f, "utf8") : "")
  const json = (f) => JSON.parse(readFileSync(f, "utf8"))
  let rows
  if (kind === "states") rows = states({ homeMigrated: text(args[0]), homeRollForward: text(args[1]) })
  else if (kind === "integrations") rows = integrations({ httpCode: args[0], leadLog: text(args[1]), touchLog: text(args[2]), gtmCount: args[3] })
  else if (kind === "sweep") rows = sweep({ results: json(args[0]), motionDiff: args[1] ? text(args[1]) : undefined })
  else if (kind === "visual") rows = visual(args[0], json(args[1]))
  else if (kind === "sitemap") rows = sitemap({ diff: text(args[0]), approved: text(args[1]) })
  else if (kind === "mirror") rows = mirror(json(args[0]))
  else if (kind === "status") {
    const v = verdict(readStatus(qaRun))
    console.log(v.verdict + (v.missing.length ? ` (faltan: ${v.missing.join(", ")})` : ""))
    process.exit(0)
  } else if (kind === "pending") {
    const last = new Map(readStatus(qaRun).map((r) => [r.check, r.status]))
    for (const [check, status] of last) if (status === "PENDING") console.log(check)
    process.exit(0)
  } else throw new Error(`unknown kind ${kind}`)
  for (const r of rows) {
    appendFileSync(join(qaRun, "status.tsv"), `${r.check}\t${r.status}\t${r.detail.replace(/[\t\n]/g, " ")}\n`)
    console.log(`  [${r.status}] ${r.check}: ${r.detail}`)
  }
  process.exit(rows.some((r) => r.status === "FAIL") ? 1 : 0)
}
