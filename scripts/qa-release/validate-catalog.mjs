/**
 * Decides, before any row is exported, whether the source database matches
 * what the QA copy expects, and which tables' data may be copied.
 *
 *   node scripts/qa-release/validate-catalog.mjs <catalog.json> <out-dir> [migrations-dir]
 *
 * Stops (exit 1, reasons in <out-dir>/validation.md) when:
 * - the applied migrations are not a prefix of the repository's list;
 * - the public tables or any table's columns differ from the schema snapshot
 *   of the last applied migration (src/migrations/<name>.json);
 * - a table is in neither list of scripts/qa-release/inventory.json
 *   (positive inventory: unknown tables are never copied, nor silently skipped);
 * - views, materialized views or foreign tables exist in public;
 * - a copied table has a foreign key into a schema-only table other than
 *   users. Keys into users are written to remap.json: the restore inserts a
 *   synthetic user per referenced id before foreign keys are validated.
 *
 * Writes validation.md always; data-tables.txt (one name per line, the only
 * tables pg_dump --data-only receives) and remap.json only when nothing
 * stops, deleting earlier ones otherwise. Reads names and counts only.
 */
import { readFileSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { isMain } from "./is-main.mjs"

export function validateCatalog(catalog, inventory, migrationsDir) {
  const stops = []
  const notes = []
  const index = readFileSync(join(migrationsDir, "index.ts"), "utf8")
  const repo = [...index.matchAll(/name: '([^']+)'/g)].map((m) => m[1])
  const applied = (catalog.migrations ?? []).map((m) => m.name)
  if (!applied.length) stops.push("payload_migrations is empty")
  if (applied.some((name, i) => repo[i] !== name)) stops.push(`applied migrations are not a prefix of the repository list: ${applied.join(", ")}`)
  const pending = repo.slice(applied.length)

  const last = applied.at(-1)
  let snapshot = {}
  try {
    const raw = JSON.parse(readFileSync(join(migrationsDir, `${last}.json`), "utf8"))
    snapshot = Object.fromEntries(Object.values(raw.tables).map((t) => [t.name, Object.keys(t.columns)]))
  } catch {
    stops.push(`no schema snapshot for ${last}`)
  }

  const tables = catalog.tables ?? {}
  const names = Object.keys(tables)
  const expected = Object.keys(snapshot)
  const extra = names.filter((n) => !snapshot[n])
  const missing = expected.filter((n) => !tables[n])
  if (expected.length && extra.length) stops.push(`tables not in the ${last} snapshot: ${extra.join(", ")}`)
  if (expected.length && missing.length) stops.push(`snapshot tables missing in the source: ${missing.join(", ")}`)
  for (const name of names) {
    if (!snapshot[name]) continue
    const have = [...tables[name].columns].sort().join(",")
    const want = [...snapshot[name]].sort().join(",")
    if (have !== want) stops.push(`columns of ${name} differ from the snapshot`)
  }

  const data = new Set(inventory.data)
  const schemaOnly = new Set(Object.keys(inventory.schemaOnly))
  const unclassified = names.filter((n) => !data.has(n) && !schemaOnly.has(n))
  if (unclassified.length) stops.push(`tables in neither inventory list: ${unclassified.join(", ")}`)
  if (catalog.otherRelations?.length) stops.push(`views or foreign tables in public: ${catalog.otherRelations.join(", ")}`)
  if (catalog.otherSchemas?.length) notes.push(`other schemas present, not copied: ${catalog.otherSchemas.join(", ")}`)

  const remap = []
  for (const fk of catalog.foreignKeys ?? []) {
    if (!data.has(fk.from) || !schemaOnly.has(fk.to)) continue
    if (fk.to === "users") remap.push({ table: fk.from, columns: fk.columns })
    else stops.push(`copied table ${fk.from} references schema-only ${fk.to}`)
  }

  const copy = names.filter((n) => data.has(n)).sort()
  const bytes = copy.reduce((sum, n) => sum + Number(tables[n].bytes ?? 0), 0)
  const rows = copy.reduce((sum, n) => sum + Number(tables[n].rows ?? 0), 0)
  return { stops, notes, applied, pending, copy, schemaOnlyPresent: names.filter((n) => schemaOnly.has(n)).sort(), remap, bytes, rows }
}

if (isMain(import.meta.url)) {
  const [catalogFile, outDir, migrationsDir = "src/migrations"] = process.argv.slice(2)
  const catalog = JSON.parse(readFileSync(catalogFile, "utf8"))
  const inventory = JSON.parse(readFileSync(new URL("./inventory.json", import.meta.url), "utf8"))
  const r = validateCatalog(catalog, inventory, migrationsDir)
  // The table list exists only after a clean validation (Codex R12).
  for (const f of ["data-tables.txt", "remap.json"]) rmSync(join(outDir, f), { force: true })
  if (!r.stops.length) {
    writeFileSync(join(outDir, "data-tables.txt"), r.copy.join("\n") + "\n")
    writeFileSync(join(outDir, "remap.json"), JSON.stringify(r.remap, null, 2) + "\n")
  }
  const md = [
    `# Catálogo de la fuente (${catalog.capturedAt})`,
    "",
    `- Servidor: ${catalog.serverVersionNum}; sesión de solo lectura: ${catalog.transactionReadOnly}/${catalog.defaultTransactionReadOnly}`,
    `- Migraciones aplicadas: ${r.applied.length} (última ${r.applied.at(-1)}); pendientes: ${r.pending.join(", ") || "ninguna"}`,
    `- Tablas con datos copiables: ${r.copy.length}, ${r.rows} filas, ${(r.bytes / 1048576).toFixed(1)} MiB en el servidor`,
    `- Solo estructura: ${r.schemaOnlyPresent.join(", ")}`,
    `- Remapeo a usuarios sintéticos: ${r.remap.length ? r.remap.map((x) => `${x.table}(${x.columns})`).join(", ") : "ninguno"}`,
    ...r.notes.map((n) => `- Nota: ${n}`),
    "",
    r.stops.length ? `## DETENIDO\n\n${r.stops.map((s) => `- ${s}`).join("\n")}` : "## Resultado: coincide con el inventario y el snapshot",
    "",
  ].join("\n")
  writeFileSync(join(outDir, "validation.md"), md)
  console.log(md)
  process.exit(r.stops.length ? 1 : 0)
}
