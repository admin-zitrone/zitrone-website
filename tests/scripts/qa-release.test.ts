/**
 * Isolation pieces of the QA runner (scripts/qa-release/), checked without
 * network or database: the browser request policy, the Node egress guard, the
 * catalog validator, the free-text matcher and the network summary.
 * Codex review of the QA plan, 2026-10-18.
 */
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { after, before, describe, test } from "node:test"

import { decide } from "../../scripts/qa-release/browser-policy.mjs"
import { findings, publicValues } from "../../scripts/qa-release/scan-free-text.mjs"
import { summarize } from "../../scripts/qa-release/summarize-egress.mjs"
import { validateCatalog } from "../../scripts/qa-release/validate-catalog.mjs"

const ROOT = path.resolve(import.meta.dirname, "../..")
const BLOB = "abc123.public.blob.vercel-storage.com"

describe("browser policy", () => {
  const candidate = { side: "candidate", origin: "http://127.0.0.1:3106", blobHost: BLOB, localMutations: ["POST /api/contact-request"] }
  const approved = { side: "approved", origin: "https://www.zitrone.mx", blobHost: BLOB, localMutations: [] }
  const cases: [object, string, string, string][] = [
    [candidate, "GET", "http://127.0.0.1:3106/es", "local"],
    [candidate, "POST", "http://127.0.0.1:3106/api/contact-request", "local"],
    [candidate, "POST", "http://127.0.0.1:3106/api/users/login", "blocked"],
    [candidate, "GET", "http://127.0.0.1:3105/es", "blocked"],
    [candidate, "GET", `https://${BLOB}/a.webp`, "mirror"],
    [candidate, "PUT", `https://${BLOB}/a.webp`, "blocked"],
    [candidate, "GET", "https://www.zitrone.mx/es", "blocked"],
    [candidate, "GET", "https://www.googletagmanager.com/gtm.js?id=x", "blocked"],
    [approved, "GET", "https://www.zitrone.mx/es", "transmitted"],
    [approved, "HEAD", "https://www.zitrone.mx/_next/image?url=x", "transmitted"],
    [approved, "POST", "https://www.zitrone.mx/_vercel/insights/view", "simulated"],
    [approved, "POST", "https://www.zitrone.mx/api/contact-request", "simulated"],
    [approved, "GET", `https://${BLOB}/a.webp`, "transmitted"],
    [approved, "GET", "https://www.zitrone.mx.evil.example/es", "blocked"],
    [approved, "GET", "https://evil.example/?next=https://www.zitrone.mx", "blocked"],
    [approved, "GET", "https://zitrone.mx/es", "blocked"],
    [approved, "GET", "https://other.public.blob.vercel-storage.com/a.webp", "blocked"],
    [approved, "POST", "https://www.google-analytics.com/g/collect", "blocked"],
  ]
  for (const [policy, method, url, outcome] of cases) {
    test(`${(policy as { side: string }).side} ${method} ${url} -> ${outcome}`, () => {
      assert.equal(decide({ url, method }, policy).outcome, outcome)
    })
  }
})

describe("egress guard (child process)", () => {
  let dir: string
  before(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "zitrone-qa-guard-"))
    fs.mkdirSync(path.join(dir, "mirror"))
    fs.writeFileSync(path.join(dir, "mirror", "f1"), "IMAGE")
    fs.writeFileSync(path.join(dir, "mirror", "manifest.json"), JSON.stringify({ "/a.webp": { file: "f1", contentType: "image/webp", bytes: 5 } }))
  })
  after(() => fs.rmSync(dir, { recursive: true, force: true }))

  test("loopback works, Blob reads come from the mirror, everything else is refused before sending", () => {
    const log = path.join(dir, "egress.jsonl")
    // The loopback server lives in the child: spawnSync blocks this process.
    const script = `
      const server = require("node:http").createServer((_, res) => res.end("local ok")).listen(0, "127.0.0.1")
      await new Promise((r) => server.once("listening", r))
      const port = server.address().port
      const out = {}
      const attempt = async (name, fn) => { try { out[name] = await fn() } catch (e) { out[name] = e.code ?? e.cause?.code ?? e.message } }
      await attempt("local", async () => (await fetch(\`http://127.0.0.1:\${port}/\`)).text())
      await attempt("mirror", async () => (await fetch("https://${BLOB}/a.webp")).text())
      await attempt("missing", async () => (await fetch("https://${BLOB}/b.webp")).status)
      await attempt("blobPut", async () => (await fetch("https://${BLOB}/a.webp", { method: "PUT", body: "x" })).status)
      await attempt("blobRequest", async () => (await fetch(new Request("https://${BLOB}/a.webp", { method: "DELETE" }))).status)
      await attempt("remote", async () => (await fetch("https://api.resend.com/emails", { method: "POST" })).status)
      await attempt("https", () => new Promise((ok, ko) => require("node:https").get("https://api.openai.com/v1", ok).on("error", (e) => ko(e))))
      await attempt("tcp", () => new Promise((ok, ko) => require("node:net").connect(443, "1.1.1.1", ok).on("error", (e) => ko(e))))
      server.close()
      console.log(JSON.stringify(out))
      process.exit(0)`
    const result = spawnSync(process.execPath, ["--input-type=commonjs", "-e", `(async () => {${script}})()`], {
      env: {
        NODE_ENV: "test",
        PATH: process.env.PATH,
        NODE_OPTIONS: `--import=${pathToFileURL(path.join(ROOT, "scripts/qa-release/egress-guard.mjs")).href}`,
        QA_EGRESS_LOG: log, QA_BLOB_HOST: BLOB, QA_BLOB_MIRROR: path.join(dir, "mirror"),
      },
      encoding: "utf8",
      timeout: 30_000,
    })
    assert.equal(result.status, 0, result.stderr)
    const out = JSON.parse(result.stdout.trim().split("\n").at(-1)!)
    assert.equal(out.local, "local ok")
    assert.equal(out.mirror, "IMAGE")
    assert.equal(out.missing, 404)
    for (const key of ["blobPut", "blobRequest", "remote", "https", "tcp"]) assert.equal(out[key], "ZITRONE_QA_EGRESS_BLOCKED", key)
    const entries = fs.readFileSync(log, "utf8").trim().split("\n").map((l) => JSON.parse(l))
    assert.deepEqual([...new Set(entries.map((e) => e.outcome))].sort(), ["blocked", "mirror"])
    assert.ok(entries.every((e) => !String(e.destination).includes("?")))
  })
})

describe("catalog validation", () => {
  const migrations = path.join(ROOT, "src/migrations")
  const inventory = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/qa-release/inventory.json"), "utf8"))
  const index = fs.readFileSync(path.join(migrations, "index.ts"), "utf8")
  const names = [...index.matchAll(/name: '([^']+)'/g)].map((m) => m[1])
  function catalogAt(last: string) {
    const snap = JSON.parse(fs.readFileSync(path.join(migrations, `${last}.json`), "utf8"))
    const tables: Record<string, { columns: string[]; rows: number | null; bytes: number }> = {}
    for (const t of Object.values(snap.tables) as { name: string; columns: Record<string, unknown> }[]) {
      tables[t.name] = { columns: Object.keys(t.columns), rows: t.name in inventory.schemaOnly ? null : 1, bytes: 8192 }
    }
    const foreignKeys = (Object.values(snap.tables) as { name: string; foreignKeys?: Record<string, { tableTo: string; columnsFrom: string[] }> }[])
      .flatMap((t) => Object.values(t.foreignKeys ?? {}).map((fk) => ({ from: t.name, to: fk.tableTo, columns: fk.columnsFrom })))
    return { migrations: names.slice(0, names.indexOf(last) + 1).map((name) => ({ name, batch: 1 })), tables, foreignKeys, otherRelations: null, otherSchemas: null }
  }

  test("production-shaped catalogs pass: before and after remove_billing_page", () => {
    for (const last of ["20260925_013853_blog_checklists_links_cta", "20261008_133454_sales_role"]) {
      const r = validateCatalog(catalogAt(last), inventory, migrations)
      assert.deepEqual(r.stops, [], last)
      assert.ok(!r.copy.includes("contact_requests") && !r.copy.includes("users") && !r.copy.some((t: string) => t.includes("billing")))
      assert.ok(r.copy.includes("payload_migrations") && r.copy.includes("header_primary_nav_locales"))
      assert.deepEqual(r.remap, [])
    }
  })

  test("unknown table, changed columns, view, or a copied table pointing at leads stop the run", () => {
    const last = "20261008_133454_sales_role"
    const extra = catalogAt(last); extra.tables.newsletter = { columns: ["id", "email"], rows: 3, bytes: 1 }
    assert.ok(validateCatalog(extra, inventory, migrations).stops.some((s: string) => s.includes("newsletter")))
    const drift = catalogAt(last); drift.tables.faqs.columns.push("owner_email")
    assert.ok(validateCatalog(drift, inventory, migrations).stops.some((s: string) => s.includes("columns of faqs")))
    const view = catalogAt(last); (view as { otherRelations: unknown }).otherRelations = ["leads_view:v"]
    assert.ok(validateCatalog(view, inventory, migrations).stops.length > 0)
    const fk = catalogAt(last); fk.foreignKeys.push({ from: "faqs", to: "contact_requests", columns: ["lead_id"] })
    assert.ok(validateCatalog(fk, inventory, migrations).stops.some((s: string) => s.includes("contact_requests")))
    const notPrefix = catalogAt(last); notPrefix.migrations.splice(1, 1)
    assert.ok(validateCatalog(notPrefix, inventory, migrations).stops.length > 0)
  })

  test("a copied table pointing at users is remapped, not stopped", () => {
    const c = catalogAt("20261008_133454_sales_role")
    c.foreignKeys.push({ from: "blog_posts", to: "users", columns: ["author_id"] })
    const r = validateCatalog(c, inventory, migrations)
    assert.deepEqual(r.stops, [])
    assert.deepEqual(r.remap, [{ table: "blog_posts", columns: ["author_id"] }])
  })
})

test("free text: public contacts pass, anything else is reported redacted", () => {
  const known = publicValues(['contact: "opina@zitrone.com.mx", phone: "+52 55 1234 5678"'])
  assert.deepEqual(findings("Escríbenos a opina@zitrone.com.mx o al 55 1234 5678", known), [])
  const hits = findings("Ana: ana.perez@empresa.com, cel 55 9876 5432; 15,000 comidas", known)
  assert.deepEqual(findings("68fd1234567890f1234567c64", known), [], "a Payload row id (24 hex) is not a phone")
  assert.equal(findings("id 68fd1234567890f1234567c64, cel (55) 9876-5432", known).length, 1, "a phone next to an id is still found")
  assert.deepEqual(hits.map((h: { kind: string }) => h.kind), ["email", "phone"])
  assert.ok(hits.every((h: { redacted: string }) => !h.redacted.includes("perez") && !h.redacted.includes("9876")))
})

test("network summary: only approved reads may leave the machine", () => {
  const ok = summarize({
    "serve-seed.jsonl": [{ outcome: "blocked", kind: "fetch", destination: "https://api.openai.com/v1" }, { outcome: "mirror", destination: `https://${BLOB}/a` }],
    "browser-c1.jsonl": [
      { side: "approved", method: "GET", url: "https://www.zitrone.mx/es", outcome: "transmitted" },
      { side: "approved", method: "POST", url: "https://www.zitrone.mx/_vercel/insights/view", outcome: "simulated" },
      { side: "candidate", method: "GET", url: "http://127.0.0.1:3106/es", outcome: "local" },
    ],
  }, "www.zitrone.mx", BLOB)
  assert.deepEqual(ok.failures, [])
  const bad = summarize({
    "browser-c1.jsonl": [
      { side: "candidate", method: "GET", url: "https://www.zitrone.mx/es", outcome: "transmitted" },
      { side: "approved", method: "POST", url: "https://www.zitrone.mx/api/contact-request", outcome: "transmitted" },
    ],
    "build-seed.jsonl": [{ outcome: "transmitted", destination: "https://x" }],
  }, "www.zitrone.mx", BLOB)
  assert.equal(bad.failures.length, 3)
})
