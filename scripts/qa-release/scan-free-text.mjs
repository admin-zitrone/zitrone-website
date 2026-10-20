/**
 * Second check on the restored local copy, after the positive inventory:
 * searches every text, varchar and jsonb column of the copied tables for
 * e-mail addresses and phone numbers that do not already appear in the
 * candidate's own source (src/, public text files; phones only where written
 * as tel:, wa.me/ or +52): those are public site contacts. Anything else stops the run before the copy is used.
 *
 *   DATABASE_URL=<local> node scripts/qa-release/scan-free-text.mjs <data-tables.txt> <report.md>
 *
 * Only loopback databases are accepted. The report names table, column and
 * row id; unknown values are shown redacted, never in full.
 */
import { execFileSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import pg from "pg"
import { isMain } from "./is-main.mjs"

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
// Not inside a longer letter-and-digit token: Payload's row ids (`_uuid`,
// 24 hex characters) contain runs of 10+ digits that are not phones.
const PHONE = /(?<![A-Za-z0-9])(?:\+?\d[\d\s().-]{8,}\d)(?![A-Za-z0-9])/g
// In the source, only numbers written as phones count as public ones.
const SOURCE_PHONE = /(?:tel:|wa\.me\/|\+52)[\s\d().-]{8,}\d/g
const digits = (value) => value.replace(/\D/g, "")

export function publicValues(files) {
  const emails = new Set()
  const phones = new Set()
  for (const text of files) {
    for (const m of text.matchAll(EMAIL)) emails.add(m[0].toLowerCase())
    for (const m of text.matchAll(SOURCE_PHONE)) if (digits(m[0]).length >= 10) phones.add(digits(m[0]).slice(-10))
  }
  return { emails, phones }
}

export function findings(value, known) {
  const out = []
  for (const m of value.matchAll(EMAIL)) {
    const email = m[0].toLowerCase()
    if (!known.emails.has(email)) out.push({ kind: "email", redacted: email.replace(/^(.).*@(.).*(\.[a-z]+)$/, "$1***@$2***$3") })
  }
  for (const m of value.matchAll(PHONE)) {
    const d = digits(m[0])
    if (d.length < 10 || d.length > 13) continue
    if (!known.phones.has(d.slice(-10))) out.push({ kind: "phone", redacted: `***${d.slice(-2)}` })
  }
  return out
}

if (isMain(import.meta.url)) {
  const [tablesFile, reportFile] = process.argv.slice(2)
  const url = new URL(process.env.DATABASE_URL ?? "")
  if (url.hostname !== "127.0.0.1" || !/_api_test$/.test(url.pathname)) throw new Error("scan-free-text: local *_api_test database only")
  const tables = readFileSync(tablesFile, "utf8").split("\n").filter(Boolean)
  const files = execFileSync("git", ["ls-files", "src", "public/*.txt", "public/*.json"], { encoding: "utf8" })
    .split("\n").filter((f) => /\.(ts|tsx|js|mjs|json|md|txt)$/.test(f))
    .map((f) => readFileSync(f, "utf8"))
  const known = publicValues(files)

  const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  const { rows: columns } = await client.query(
    `SELECT table_name, column_name, data_type FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = ANY($1)
       AND data_type IN ('text', 'character varying', 'jsonb', 'json')
     ORDER BY table_name, ordinal_position`,
    [tables],
  )
  const hits = []
  let scanned = 0
  for (const { table_name: table, column_name: column } of columns) {
    const { rows } = await client.query(
      `SELECT id::text AS id, ${pg.escapeIdentifier(column)}::text AS v FROM public.${pg.escapeIdentifier(table)}
       WHERE ${pg.escapeIdentifier(column)}::text ~* '@|[0-9][0-9 ().-]{8,}[0-9]'`,
    ).catch(() => client.query(
      `SELECT ctid::text AS id, ${pg.escapeIdentifier(column)}::text AS v FROM public.${pg.escapeIdentifier(table)}
       WHERE ${pg.escapeIdentifier(column)}::text ~* '@|[0-9][0-9 ().-]{8,}[0-9]'`,
    ))
    scanned += 1
    for (const row of rows) for (const f of findings(row.v, known)) hits.push({ table, column, id: row.id, ...f })
  }
  await client.end()
  const lines = [
    `# Texto libre de la copia: ${scanned} columnas de ${tables.length} tablas`,
    "",
    `Valores públicos conocidos (en el código del candidato): ${known.emails.size} correos, ${known.phones.size} teléfonos.`,
    "",
    hits.length
      ? `## DETENIDO: ${hits.length} valor(es) desconocido(s)\n\n${hits.map((h) => `- ${h.table}.${h.column} #${h.id}: ${h.kind} ${h.redacted}`).join("\n")}`
      : "## Resultado: ningún correo ni teléfono fuera de los públicos",
    "",
  ]
  writeFileSync(reportFile, lines.join("\n"))
  console.log(lines.join("\n"))
  process.exit(hits.length ? 1 : 0)
}
