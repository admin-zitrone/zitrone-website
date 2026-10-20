/**
 * Compare two image-audit runs (base vs candidate) page by page.
 *
 *   node scripts/image-audit-compare.mjs <base results.json[.gz]> <candidate results.json[.gz]> > comparison.md
 *
 * Both runs must come from the same optimizer (two local `next start` builds,
 * or live vs live): AVIF bytes from a local build are not comparable with
 * Vercel's. Pages are matched by path + viewport, ignoring the host.
 */
import { readFileSync } from "node:fs"
import { gunzipSync } from "node:zlib"

const [basePath, candidatePath] = process.argv.slice(2)
if (!basePath || !candidatePath) {
  console.error("usage: image-audit-compare.mjs <base results.json> <candidate results.json>")
  process.exit(2)
}

const load = (p) => {
  const raw = readFileSync(p)
  return JSON.parse((p.endsWith(".gz") ? gunzipSync(raw) : raw).toString("utf8"))
}
const base = load(basePath)
const cand = load(candidatePath)

const key = (r) => `${r.url.replace(/^https?:\/\/[^/]+/, "") || "/"} [${r.viewport}]`
const kb = (n) => Math.round((n ?? 0) / 1024)
const pct = (a, b) => (a ? `${Math.round(((b - a) / a) * 100)}%` : "")
const lcpBytes = (r) => r.responses.find((x) => x.url === r.lcp?.url)?.bytes

const candByKey = new Map(cand.live.results.map((r) => [key(r), r]))
const rows = []
const totals = { bFirst: 0, cFirst: 0, bFull: 0, cFull: 0 }
const missing = []
for (const b of [...base.live.results].sort((x, y) => key(x).localeCompare(key(y)))) {
  const c = candByKey.get(key(b))
  if (!c) { missing.push(key(b)); continue }
  totals.bFirst += b.initialBytes ?? 0
  totals.cFirst += c.initialBytes ?? 0
  totals.bFull += b.totalBytes
  totals.cFull += c.totalBytes
  rows.push(`| ${key(b)} | ${kb(b.initialBytes)} | ${kb(c.initialBytes)} | ${pct(b.initialBytes, c.initialBytes)} | ${kb(b.totalBytes)} | ${kb(c.totalBytes)} | ${pct(b.totalBytes, c.totalBytes)} | ${kb(lcpBytes(b)) || "-"} | ${kb(lcpBytes(c)) || "-"} |`)
}

const counts = (run) => {
  const out = {}
  for (const f of run.findings) out[`${f.sev} ${f.rule}`] = (out[`${f.sev} ${f.rule}`] ?? 0) + 1
  return out
}
const bc = counts(base)
const cc = counts(cand)
const rules = [...new Set([...Object.keys(bc), ...Object.keys(cc)])].sort()

const lines = [
  "# Image audit comparison",
  "",
  `Base: ${base.base} (${base.date}) · Candidate: ${cand.base} (${cand.date})`,
  "",
  "First load = image bytes received before any scrolling (1.5 s after the `load` event). Full = after scrolling to the bottom in 0.7-viewport steps every 250 ms, then network idle + 0.8 s. LCP = bytes of the image the browser reported as Largest Contentful Paint.",
  "",
  "## Totals",
  "",
  `| | Base | Candidate | Change |`,
  `|---|---|---|---|`,
  `| First load, all ${rows.length} page views | ${kb(totals.bFirst)} KB | ${kb(totals.cFirst)} KB | ${pct(totals.bFirst, totals.cFirst)} |`,
  `| Full scroll, all ${rows.length} page views | ${kb(totals.bFull)} KB | ${kb(totals.cFull)} KB | ${pct(totals.bFull, totals.cFull)} |`,
  "",
  "## Per page (KB)",
  "",
  "| Page | First base | First cand | Δ | Full base | Full cand | Δ | LCP base | LCP cand |",
  "|---|---|---|---|---|---|---|---|---|",
  ...rows,
  "",
  "## Findings by rule",
  "",
  "| Rule | Base | Candidate |",
  "|---|---|---|",
  ...rules.map((r) => `| ${r} | ${bc[r] ?? 0} | ${cc[r] ?? 0} |`),
  "",
]
if (missing.length) lines.push(`Pages missing from the candidate run: ${missing.join(", ")}`, "")
process.stdout.write(lines.join("\n"))
