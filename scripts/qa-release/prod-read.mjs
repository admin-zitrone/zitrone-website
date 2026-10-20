/**
 * The only process of the QA run that holds the source database credential
 * (docs/plan-qa-aislado-2026-10-18.md, phase B1). Separate from every QA
 * process: it never starts the app, Payload or a Node client.
 *
 *   node scripts/qa-release/prod-read.mjs version <run-id>
 *   node scripts/qa-release/prod-read.mjs catalog <run-id> <out.json>
 *   node scripts/qa-release/prod-read.mjs dump    <run-id> <dir> <data-tables.txt> <major>
 *
 * Refuses unless QA_PROD_READ_AUTHORIZED equals <run-id>, so a stray call
 * cannot read production. Reads only DATABASE_URL from QA_SOURCE_ENV_FILE
 * (default: the main checkout's .env.production-cms); the file is neither
 * copied nor printed. The connection reaches the Postgres tools as PG*
 * variables (docker run -e NAME, value inherited), never on a command line,
 * and with PGOPTIONS default_transaction_read_only=on. A Neon "-pooler" host is
 * replaced by its direct endpoint: pg_dump and session options need it.
 *
 * - version: server_version_num, to choose the postgres:<major> client image.
 * - catalog: scripts/qa-release/catalog.sql (names, sizes, FKs, migrations,
 *   counts of copyable tables). Fails unless the session reports read-only.
 * - catalog also records `source`: SHA-256 of host, port, database and user
 *   (no password), so the approval in gate.mjs is bound to this source.
 * - dump: refuses unless QA_SOURCE_FINGERPRINT (from gate.mjs check) equals
 *   the current source's. <dir>/schema.dump = pg_dump --schema-only of public (structure of
 *   every table, needed to run the real migrations); <dir>/data.dump =
 *   pg_dump --data-only of exactly the tables listed (from validate-catalog).
 *   pg_dump itself runs in a read-only snapshot transaction.
 *
 * QA_SOURCE_DOCKER_NETWORK (e.g. container:zitrone-qa-<id>) runs the client
 * inside another container's network: only for the runner's dry run, whose
 * stand-in source lives in the QA container.
 */
import { spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import { closeSync, openSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { parseEnv } from "node:util"

const [command, runId, ...rest] = process.argv.slice(2)
const fail = (message) => { console.error(`prod-read: ${message}`); process.exit(1) }

if (!/^[a-z0-9-]+$/.test(runId ?? "")) fail("usage: prod-read.mjs <version|catalog|dump> <run-id> ...")
if (process.env.QA_PROD_READ_AUTHORIZED !== runId) fail(`QA_PROD_READ_AUTHORIZED must equal ${runId}; nothing was read`)

const envFile = process.env.QA_SOURCE_ENV_FILE ?? "../Zitrone Website/.env.production-cms"
const raw = parseEnv(readFileSync(envFile, "utf8")).DATABASE_URL
if (!raw) fail(`no DATABASE_URL in ${envFile}`)
const url = new URL(raw)
if (!/^postgres(ql)?:$/.test(url.protocol)) fail("DATABASE_URL is not a postgres URL")

const host = url.hostname.replace(/-pooler(?=\.)/, "")
const network = process.env.QA_SOURCE_DOCKER_NETWORK
if (network && !/^container:zitrone-qa-[a-z0-9-]+$/.test(network)) fail("QA_SOURCE_DOCKER_NETWORK must name a QA container")
const pg = {
  PGHOST: host,
  PGPORT: url.port || "5432",
  PGUSER: decodeURIComponent(url.username),
  PGPASSWORD: decodeURIComponent(url.password),
  PGDATABASE: decodeURIComponent(url.pathname.slice(1)),
  PGSSLMODE: url.searchParams.get("sslmode") ?? "require",
  PGOPTIONS: "-c default_transaction_read_only=on",
  PGAPPNAME: `zitrone-qa-read-${runId}`,
  PGCONNECT_TIMEOUT: "20",
}
const fingerprint = createHash("sha256").update(`${pg.PGHOST}|${pg.PGPORT}|${pg.PGDATABASE}|${pg.PGUSER}`).digest("hex")
const channelBinding = url.searchParams.get("channel_binding")
if (channelBinding) pg.PGCHANNELBINDING = channelBinding

const schemaOnly = Object.keys(JSON.parse(readFileSync(new URL("./inventory.json", import.meta.url), "utf8")).schemaOnly)

/** Runs a Postgres client inside postgres:<major>-alpine; stdin/stdout as given. */
function client(major, args, { stdin = "ignore", stdout = "pipe" } = {}) {
  const passEnv = Object.keys(pg).flatMap((name) => ["-e", name])
  const net = network ? ["--network", network] : []
  const result = spawnSync("docker", ["run", "--rm", "-i", ...net, ...passEnv, `postgres:${major}-alpine`, ...args], {
    env: { PATH: process.env.PATH, HOME: process.env.HOME, ...pg },
    stdio: [stdin, stdout, "pipe"],
    maxBuffer: 64 * 1024 * 1024,
  })
  // libpq never prints the password; the host is shown only as "source".
  const stderr = String(result.stderr ?? "").replaceAll(pg.PGHOST, "<source>")
  if (result.status !== 0) fail(`${args[0]} failed (${result.status}): ${stderr.trim().split("\n").slice(-3).join(" | ")}`)
  return String(result.stdout ?? "")
}

if (command === "version") {
  const num = client("16", ["psql", "-X", "-At", "-c", "SELECT current_setting('server_version_num')"]).trim()
  if (!/^\d+$/.test(num)) fail("unexpected version output")
  console.log(num)
} else if (command === "catalog") {
  const [out] = rest
  const sql = openSync(new URL("./catalog.sql", import.meta.url), "r")
  const text = client("16", ["psql", "-X", "-At", "-v", `schema_only=${schemaOnly.join(",")}`, "-f", "-"], { stdin: sql })
  closeSync(sql)
  const json = text.split("\n").find((line) => line.startsWith("{"))
  if (!json) fail("catalog returned no JSON")
  const catalog = JSON.parse(json)
  if (catalog.transactionReadOnly !== "on" || catalog.defaultTransactionReadOnly !== "on") fail("session was not read-only; catalog discarded")
  catalog.source = fingerprint
  writeFileSync(out, JSON.stringify(catalog, null, 2) + "\n", { mode: 0o600 })
  console.log(`catalog: ${Object.keys(catalog.tables).length} tables, server ${catalog.serverVersionNum}, read-only session`)
} else if (command === "dump") {
  const [dir, tablesFile, major] = rest
  if (!/^\d+$/.test(major ?? "")) fail("dump needs the server major version")
  if (process.env.QA_SOURCE_FINGERPRINT !== fingerprint) fail("source differs from the validated catalog's; nothing was dumped")
  const tables = readFileSync(tablesFile, "utf8").split("\n").filter(Boolean)
  for (const table of tables) if (!/^[a-z0-9_]+$/.test(table)) fail(`unexpected table name ${table}`)
  const common = ["pg_dump", "-Fc", "--no-owner", "--no-privileges", "--no-comments"]
  const schemaFd = openSync(join(dir, "schema.dump"), "w", 0o600)
  client(major, [...common, "--schema-only", "-n", "public"], { stdout: schemaFd })
  closeSync(schemaFd)
  const dataFd = openSync(join(dir, "data.dump"), "w", 0o600)
  client(major, [...common, "--data-only", ...tables.flatMap((table) => ["-t", `public.${table}`])], { stdout: dataFd })
  closeSync(dataFd)
  console.log(`dump: schema of public, data of ${tables.length} tables`)
} else {
  fail(`unknown command ${command}`)
}
