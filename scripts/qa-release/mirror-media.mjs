/**
 * Downloads, once, the public Blob files the copy needs, so the QA servers
 * never reach Blob. The only process of the run that reads Blob.
 *
 *   QA_BLOB_HOST=<store>.public.blob.vercel-storage.com DATABASE_URL=<local copy> \
 *     node scripts/qa-release/mirror-media.mjs <mirror-dir> <media-dir>
 *
 * Two uses, same files:
 * - <media-dir>: the media library under each stored filename, taken from its
 *   own stored URL (media.url/filename and each sizes_*_url/_filename pair;
 *   the Blob names carry a random suffix, so a filename is never turned into a
 *   URL). Without a Blob token Payload serves uploads from PAYLOAD_MEDIA_DIR at
 *   /api/media/file/<name>, so the candidate shows the same files locally.
 * - <mirror-dir>/manifest.json: every https://<store>.public.blob... URL
 *   stored in a text column or in the candidate's tracked src/ files, which
 *   egress-guard.mjs and browser-policy.mjs answer from here. Each entry has a
 *   role: "size" for the sizes_*_url columns of media (only the admin's
 *   thumbnails use them; the site reads media.url), "required" otherwise.
 *
 * QA_BLOB_HOST comes from the copy's media library (run.sh mirror). URLs of
 * any other store stop the run. GET only, no redirects, no credentials.
 */
import { createHash } from "node:crypto"
import { execFileSync } from "node:child_process"
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { basename, join } from "node:path"
import pg from "pg"

const BLOB = /https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/[^\s"'<>)\\]+/gi
const [dir, mediaDir] = process.argv.slice(2)
const host = process.env.QA_BLOB_HOST ?? ""
if (!/^[a-z0-9]+\.public\.blob\.vercel-storage\.com$/.test(host)) throw new Error("mirror-media: QA_BLOB_HOST must be one public Blob store hostname")
const url = new URL(process.env.DATABASE_URL ?? "")
if (url.hostname !== "127.0.0.1" || !/_api_test$/.test(url.pathname)) throw new Error("mirror-media: local *_api_test database only")

const urls = new Set()
const required = new Set()
const pairs = []
const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
const { rows: columns } = await client.query(
  `SELECT table_name, column_name FROM information_schema.columns
   WHERE table_schema = 'public' AND data_type IN ('text', 'character varying', 'jsonb', 'json')`,
)
for (const { table_name: table, column_name: column } of columns) {
  const { rows } = await client.query(
    `SELECT ${pg.escapeIdentifier(column)}::text AS v FROM public.${pg.escapeIdentifier(table)}
     WHERE ${pg.escapeIdentifier(column)}::text LIKE '%.public.blob.vercel-storage.com/%'`,
  )
  // The media library's own URL columns are read whole below: the pattern stops
  // at ")" and would cut names like "El_Universal_(México)_Logo-….svg".
  if (table === "media" && /^(sizes_[a-z]+_)?url$/.test(column)) continue
  for (const row of rows) for (const m of row.v.matchAll(BLOB)) { urls.add(m[0]); required.add(m[0]) }
}
for (const prefix of ["", "sizes_thumbnail_", "sizes_card_", "sizes_feature_", "sizes_hero_"]) {
  const { rows } = await client.query(`SELECT ${prefix}url AS url, ${prefix}filename AS filename FROM public.media`)
  for (const { url: stored, filename } of rows) {
    if (!stored?.includes(".public.blob.vercel-storage.com/")) continue
    urls.add(stored)
    if (!prefix) required.add(stored)
    if (filename) pairs.push({ url: stored, filename })
  }
}
await client.end()
for (const file of execFileSync("git", ["ls-files", "src"], { encoding: "utf8" }).split("\n").filter(Boolean)) {
  for (const m of readFileSync(file, "utf8").matchAll(BLOB)) { urls.add(m[0]); required.add(m[0]) }
}
const requiredPaths = new Set([...required].map((u) => new URL(u).pathname))

const others = [...urls].map((u) => new URL(u).hostname).filter((h) => h !== host)
if (others.length) throw new Error(`mirror-media: URLs of another Blob store: ${[...new Set(others)].join(", ")}`)
mkdirSync(dir, { recursive: true, mode: 0o700 })
mkdirSync(mediaDir, { recursive: true, mode: 0o700 })

const manifest = {}
let bytes = 0
for (const item of [...urls].sort()) {
  const target = new URL(item)
  if (manifest[target.pathname]) continue
  const response = await fetch(target, { method: "GET", redirect: "error", signal: AbortSignal.timeout(60_000) })
  const role = requiredPaths.has(target.pathname) ? "required" : "size"
  if (!response.ok) { manifest[target.pathname] = { missing: response.status, role }; continue }
  const body = Buffer.from(await response.arrayBuffer())
  const file = createHash("sha256").update(target.pathname).digest("hex").slice(0, 24)
  writeFileSync(join(dir, file), body)
  manifest[target.pathname] = { file, role, contentType: response.headers.get("content-type") ?? "application/octet-stream", bytes: body.length }
  bytes += body.length
}
for (const { url: stored, filename } of pairs) {
  const entry = manifest[new URL(stored).pathname]
  if (entry?.file && basename(filename) === filename) copyFileSync(join(dir, entry.file), join(mediaDir, filename))
}
writeFileSync(join(dir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n")
const missing = Object.entries(manifest).filter(([, m]) => m.missing)
writeFileSync(join(dir, "missing.txt"), missing.map(([p, m]) => `${m.missing} ${m.role} ${p}`).join("\n") + "\n")
console.log(`mirror: ${Object.keys(manifest).length} files (${pairs.length} media library entries), ${(bytes / 1048576).toFixed(1)} MiB, ${missing.length} not found`)
