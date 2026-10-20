/**
 * Header/footer links the site shows, per locale, in each state of the copy
 * (written by run.sh states with probe-site-globals.ts read), against
 * production's code on the untouched copy (b0).
 *
 *   node scripts/qa-release/compare-states.mjs <private-states-dir> <qa-run>
 *
 * Migration alone must change nothing: FAIL in status.tsv and exit 1. There
 * is no seed (the home stays in the code files). What the previous code shows
 * after migrate:down is INFO (expected by design, docs/cms-home-rollout.md). The link-by-link list (CMS content)
 * goes to <private-states-dir>/summary.md; <qa-run>/work/states-links.md gets
 * counts only.
 */
import { appendFileSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const [dir, qaRun] = process.argv.slice(2)
const read = (file) => JSON.parse(readFileSync(join(dir, file), "utf8"))

export function linkDiff(a, b) {
  return ["es", "en"].flatMap((locale) => {
    const keys = new Set([...Object.keys(a[locale].shown), ...Object.keys(b[locale].shown)])
    const links = [...keys].filter((k) => a[locale].shown[k] !== b[locale].shown[k])
      .map((k) => `${locale} ${k}: ${a[locale].shown[k] ?? "(none)"}  =>  ${b[locale].shown[k] ?? "(none)"}`)
    const cta = a[locale].ctaLabel !== b[locale].ctaLabel ? [`${locale} CTA: ${a[locale].ctaLabel} => ${b[locale].ctaLabel}`] : []
    return [...links, ...cta]
  })
}

const base = read("b0-old-links.json")
// [file, label, kind]: "equal" must not differ; "info" is expected.
const rows = [
  ["b5-old-code-migrated.json", "código anterior tras migrar", "equal"],
  ["b5-new-code-migrated.json", "código nuevo tras migrar", "equal"],
  ["rb3-old-code-after-down.json", "código anterior tras migrate:down", "info"],
]
const detail = ["# Enlaces visibles de header y pie frente a producción (b0) — privado", ""]
const report = ["# Enlaces visibles de header y pie frente a producción (b0)", "", "Solo conteos; el detalle está en el directorio privado de la ejecución.", ""]
const status = []
let migrated = 0
for (const [file, label, kind] of rows) {
  const d = linkDiff(base, read(file))
  if (kind === "equal") migrated += d.length
  detail.push(`## ${label}: ${d.length} diferencia(s)`, "", ...d.map((x) => `- ${x}`), "")
  report.push(`- ${label}: ${d.length} diferencia(s)`)
  if (kind === "info") status.push([`states:${file.split("-")[0]}-links`, "INFO", `${label}: ${d.length} diferencia(s), esperadas por diseño`])
}
status.unshift(["states:links-after-migrate", migrated ? "FAIL" : "PASS", migrated ? `${migrated} enlace(s) cambian solo por migrar` : "migrar no cambia ningún enlace, con el código anterior ni con el nuevo"])
writeFileSync(join(dir, "summary.md"), detail.join("\n"), { mode: 0o600 })
writeFileSync(join(qaRun, "work", "states-links.md"), report.join("\n") + "\n")
for (const [check, state, text] of status) {
  appendFileSync(join(qaRun, "status.tsv"), `${check}\t${state}\t${text}\n`)
  console.log(`  [${state}] ${check}: ${text}`)
}
process.exit(migrated ? 1 : 0)
