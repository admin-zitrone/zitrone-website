/**
 * Codex review of the QA runner (docs/codex-qa-runner-review-2026-10-18.md):
 * R12 extract only after a successful catalog of the same run, R13 failed
 * criteria fail, R14 only sanitized reports reach the evidence. run.sh is
 * driven for real with a stub prod-read.mjs (no credentials, no network, no
 * Docker); the criteria are also checked one by one.
 */
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { after, before, describe, test } from "node:test"

import { integrations, mirror, states, sweep, verdict, visual, REQUIRED } from "../../scripts/qa-release/criteria.mjs"

const ROOT = path.resolve(import.meta.dirname, "../..")
const QA = path.join(ROOT, "scripts/qa-release")
const RUN_ID = "20990101-0000-test"
const SHA = "a".repeat(40)

describe("criteria (R13)", () => {
  const status = (rows: { check: string; status: string }[], check: string) => rows.find((r) => r.check === check)?.status
  const lead = "QA_TASK leads 1; delivery \"error\":\"EMAIL_NOT_CONFIGURED\" \"status\":\"failed\""
  const touch = "QA_TASK touch faqs #5\nembedding skipped\nQA_TASK touch blogPosts #3\nembedding skipped"

  test("integrations pass only with 201, exactly one lead, EMAIL_NOT_CONFIGURED, hooks skipped and no GTM", () => {
    assert.ok(integrations({ httpCode: "201", leadLog: lead, touchLog: touch, gtmCount: "0" }).every((r) => r.status === "PASS"))
    assert.equal(status(integrations({ httpCode: "500", leadLog: lead, touchLog: touch, gtmCount: "0" }), "integrations:lead-http"), "FAIL")
    assert.equal(status(integrations({ httpCode: "201", leadLog: "QA_TASK leads 0; delivery none", touchLog: touch, gtmCount: "0" }), "integrations:lead-saved"), "FAIL")
    assert.equal(status(integrations({ httpCode: "201", leadLog: lead.replace("leads 1", "leads 2"), touchLog: touch, gtmCount: "0" }), "integrations:lead-saved"), "FAIL")
    assert.equal(status(integrations({ httpCode: "201", leadLog: "QA_TASK leads 1; delivery \"status\":\"accepted\"", touchLog: touch, gtmCount: "0" }), "integrations:lead-email"), "FAIL")
    assert.equal(status(integrations({ httpCode: "201", leadLog: lead, touchLog: "QA_TASK touch faqs #5", gtmCount: "0" }), "integrations:embeddings"), "FAIL")
    const withInvalid = integrations({ httpCode: "201", leadLog: lead, touchLog: "QA_TASK invalid faqs #1 es: The following field is invalid: Answer 1 > Paragraph\n" + touch, gtmCount: "0" })
    assert.equal(status(withInvalid, "integrations:embeddings"), "PASS", "a document that does not validate is skipped, not counted")
    assert.equal(status(withInvalid, "integrations:cms-invalid"), "INFO")
    assert.equal(status(integrations({ httpCode: "201", leadLog: lead, touchLog: touch, gtmCount: "1" }), "integrations:gtm"), "FAIL")
    assert.equal(status(integrations({ httpCode: "201", leadLog: "", touchLog: touch, gtmCount: "0" }), "integrations:lead-saved"), "FAIL")
  })

  test("states fail on a different or missing home after migrate:down + migrate", () => {
    const ok = { homeMigrated: "{\"a\":1}", homeRollForward: "{\"a\":1}" }
    assert.ok(states(ok).every((r) => r.status === "PASS"))
    assert.equal(status(states({ ...ok, homeRollForward: "{\"a\":2}" }), "states:roll-forward"), "FAIL")
    assert.equal(status(states({ homeMigrated: "", homeRollForward: "" }), "states:roll-forward"), "FAIL")
  })

  test("sweep fails on a 404, overflow or a real console error; Vercel-only scripts are excluded and counted", () => {
    const page = { locale: "es", route: "/", width: 390, status: 200, overflowPx: 0, brokenImages: [], consoleErrors: ["Refused to execute script from 'http://127.0.0.1:3106/_vercel/insights/script.js'"] }
    assert.equal(status(sweep({ results: { pages: [page], states: [] } }), "sweep:pages"), "PASS")
    assert.equal(status(sweep({ results: { pages: [{ ...page, status: 404 }], states: [] } }), "sweep:pages"), "FAIL")
    assert.equal(status(sweep({ results: { pages: [{ ...page, overflowPx: 12 }], states: [] } }), "sweep:pages"), "FAIL")
    assert.equal(status(sweep({ results: { pages: [{ ...page, consoleErrors: ["TypeError: x is undefined"] }], states: [] } }), "sweep:pages"), "FAIL")
    assert.equal(status(sweep({ results: { pages: [page], states: [] }, motionDiff: "es 390px moves: approved true, candidate false" }), "sweep:motion"), "PENDING")
  })

  test("visual differences are pending, errors fail; a missing mirror file fails", () => {
    assert.equal(status(visual("x", { results: [{ path: "/es", sameSize: true, changedPct: 4 }] }), "visual:x:differences"), "PENDING")
    assert.equal(status(visual("x", { results: [{ path: "/es", error: "timeout" }] }), "visual:x:errors"), "FAIL")
    assert.equal(status(visual("x", { results: [] }), "visual:x:errors"), "FAIL")
    assert.equal(mirror({ "/a": { file: "f", bytes: 1 }, "/b": { missing: 404 } })[0].status, "FAIL")
    const sizesOnly = mirror({ "/a": { file: "f", role: "required" }, "/a-320x200.jpg": { missing: 404, role: "size" } })
    assert.equal(status(sizesOnly, "mirror:complete"), "PASS", "a missing size variant does not fail the mirror")
    assert.equal(status(sizesOnly, "mirror:size-variants"), "INFO")
    assert.equal(mirror({ "/a": { missing: 404, role: "required" } })[0].status, "FAIL")
  })

  test("verdict: any FAIL, a missing or skipped check, or a PENDING item prevents a passing verdict", () => {
    const all = REQUIRED.map((check) => ({ check, status: "PASS", detail: "" }))
    assert.equal(verdict(all).verdict, "CRITERIOS AUTOMÁTICOS CUMPLIDOS")
    assert.equal(verdict([...all, { check: "visual:approved-vs-mig:differences", status: "PENDING", detail: "" }]).verdict, "PENDIENTE DE CLASIFICACIÓN")
    assert.equal(verdict(all.slice(1)).verdict, "INCOMPLETO")
    assert.equal(verdict([...all.slice(1), { check: all[0].check, status: "SKIPPED", detail: "" }]).verdict, "INCOMPLETO")
    assert.equal(verdict([...all, { check: "network", status: "FAIL", detail: "" }]).verdict, "FALLIDO")
  })
})

describe("run.sh with a stub extractor (R12, R14)", () => {
  let dir: string, qaRun: string, cand: string, stubLog: string
  const catalogFile = (name: string) => path.join(dir, `${name}.json`)

  function run(step: string, env: Record<string, string> = {}) {
    return spawnSync("zsh", [path.join(QA, "run.sh"), step], {
      env: { NODE_ENV: "test", PATH: process.env.PATH, HOME: process.env.HOME, QA_RUN: qaRun, QA_PROD_READ_AUTHORIZED: RUN_ID, STUB_LOG: stubLog, ...env },
      encoding: "utf8",
    })
  }
  const dumps = () => (fs.existsSync(stubLog) ? fs.readFileSync(stubLog, "utf8").split("\n").filter((l) => l.startsWith("dump")).length : 0)

  before(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "zitrone-qa-gates-"))
    qaRun = path.join(dir, "zitrone-qa", RUN_ID)
    cand = path.join(qaRun, "wt", "cand-seed")
    stubLog = path.join(dir, "stub.log")
    for (const d of ["private", "work", "logs", "egress"]) fs.mkdirSync(path.join(qaRun, d), { recursive: true })
    fs.mkdirSync(path.join(cand, "scripts", "qa-release"), { recursive: true })
    for (const f of fs.readdirSync(QA)) if (f !== "prod-read.mjs") fs.symlinkSync(path.join(QA, f), path.join(cand, "scripts", "qa-release", f))
    fs.symlinkSync(path.join(ROOT, "src"), path.join(cand, "src"))
    // Stub: records each call; the catalog it "reads" is STUB_CATALOG.
    fs.writeFileSync(path.join(cand, "scripts", "qa-release", "prod-read.mjs"), `
      import { appendFileSync, copyFileSync, readFileSync, writeFileSync } from "node:fs"
      import { join } from "node:path"
      const [command, runId, ...rest] = process.argv.slice(2)
      appendFileSync(process.env.STUB_LOG, [command, runId, process.env.QA_SOURCE_FINGERPRINT ?? ""].join(" ") + "\\n")
      if (command === "version") console.log("160015")
      if (command === "catalog") copyFileSync(process.env.STUB_CATALOG, rest[0])
      if (command === "dump") { writeFileSync(join(rest[0], "schema.dump"), "s"); writeFileSync(join(rest[0], "data.dump"), "d") }
    `)
    fs.writeFileSync(path.join(qaRun, "state.env"), [`RUN_ID=${RUN_ID}`, `RUN_TAG=${RUN_ID.replace(/-/g, "_")}`, `CAND_SHA=${SHA}`, `OLD_SHA=${"b".repeat(40)}`, "PG_MAJOR=16", `REPO=${ROOT}`, "DRY_RUN=1"].join("\n") + "\n")

    // A valid catalog: the sales_role snapshot as production would report it.
    const inventory = JSON.parse(fs.readFileSync(path.join(QA, "inventory.json"), "utf8"))
    const names = [...fs.readFileSync(path.join(ROOT, "src/migrations/index.ts"), "utf8").matchAll(/name: '([^']+)'/g)].map((m) => m[1])
    const last = "20261008_133454_sales_role"
    const snap = JSON.parse(fs.readFileSync(path.join(ROOT, `src/migrations/${last}.json`), "utf8"))
    const tables = Object.fromEntries((Object.values(snap.tables) as { name: string; columns: object }[]).map((t) => [t.name, { columns: Object.keys(t.columns), rows: t.name in inventory.schemaOnly ? null : 1, bytes: 1 }]))
    const valid = { capturedAt: "2099-01-01T00:00:00Z", serverVersionNum: 160015, transactionReadOnly: "on", defaultTransactionReadOnly: "on", source: "f".repeat(64),
      migrations: names.slice(0, names.indexOf(last) + 1).map((name) => ({ name, batch: 1 })), tables, foreignKeys: [], otherRelations: null, otherSchemas: null }
    fs.writeFileSync(catalogFile("valid"), JSON.stringify(valid))
    fs.writeFileSync(catalogFile("invalid"), JSON.stringify({ ...valid, tables: { ...tables, newsletter: { columns: ["id", "email"], rows: 2, bytes: 1 } } }))
  })
  after(() => fs.rmSync(dir, { recursive: true, force: true }))

  test("R12: a rejected catalog blocks extract; approval, tampering and a failed repeat behave", () => {
    let r = run("extract")
    assert.notEqual(r.status, 0, "extract without any catalog")
    r = run("catalog", { STUB_CATALOG: catalogFile("invalid") })
    assert.notEqual(r.status, 0, "invalid catalog must fail")
    assert.ok(!fs.existsSync(path.join(qaRun, "work", "data-tables.txt")), "no table list after a rejection")
    r = run("extract")
    assert.notEqual(r.status, 0)
    assert.equal(dumps(), 0, "the dump was never invoked")

    r = run("catalog", { STUB_CATALOG: catalogFile("valid") })
    assert.equal(r.status, 0, r.stderr)
    r = run("extract")
    assert.equal(r.status, 0, r.stderr)
    assert.equal(dumps(), 1)
    assert.match(fs.readFileSync(stubLog, "utf8"), new RegExp(`dump ${RUN_ID} f{64}`), "dump receives the approved source fingerprint")

    const catalog = path.join(qaRun, "private", "catalog.json")
    fs.appendFileSync(catalog, " ")
    assert.notEqual(run("extract").status, 0, "a changed catalog voids the approval")
    assert.equal(dumps(), 1)

    assert.equal(run("catalog", { STUB_CATALOG: catalogFile("valid") }).status, 0)
    assert.notEqual(run("catalog", { STUB_CATALOG: catalogFile("invalid") }).status, 0)
    assert.notEqual(run("extract").status, 0, "a failed repeat voids the earlier approval")
    assert.equal(dumps(), 1)

    assert.notEqual(run("extract", { QA_PROD_READ_AUTHORIZED: "other" }).status, 0, "authorization is per run")
    const status = fs.readFileSync(path.join(qaRun, "status.tsv"), "utf8")
    assert.match(status, /^catalog\tFAIL/m)
    assert.match(status, /^catalog\tPASS/m)
  })

  test("R14: evidence exports only the fixed list of sanitized reports, and states the verdict", () => {
    const MARK = "CONFIDENCIAL-QA-7f3a"
    fs.mkdirSync(path.join(qaRun, "private", "states"), { recursive: true })
    fs.writeFileSync(path.join(qaRun, "private", "states", "4-capture-new-code.json"), JSON.stringify({ es: { note: MARK } }))
    fs.writeFileSync(path.join(qaRun, "private", "states", "summary.md"), MARK)
    fs.mkdirSync(path.join(qaRun, "private", "visual-approved-vs-mig"), { recursive: true })
    fs.writeFileSync(path.join(qaRun, "private", "visual-approved-vs-mig", "es-desktop-candidate.jpg"), MARK)
    fs.writeFileSync(path.join(qaRun, "logs", "seed.log"), MARK)
    fs.writeFileSync(path.join(qaRun, "egress", "serve-mig.jsonl"), JSON.stringify({ destination: MARK }) + "\n")
    fs.writeFileSync(path.join(qaRun, "work", "stray-export.json"), MARK)
    fs.writeFileSync(path.join(qaRun, "work", "states-report.md"), "# Estados\n")
    fs.writeFileSync(path.join(qaRun, "work", "network.md"), "# Red\n")
    const dest = path.join(dir, "evidence-out")
    const r = run("evidence", { QA_EVIDENCE_DIR: dest })
    assert.equal(r.status, 0, r.stderr)
    const files = fs.readdirSync(dest)
    for (const f of files) assert.ok(!fs.readFileSync(path.join(dest, f), "utf8").includes(MARK), `${f} leaked the marker`)
    assert.ok(!files.includes("stray-export.json"))
    assert.ok(files.includes("states-report.md") && files.includes("network.md") && files.includes("status.tsv"))
    const readme = fs.readFileSync(path.join(dest, "README.md"), "utf8")
    assert.match(readme, /Veredicto: FALLIDO/, "the failed catalog above makes the run FALLIDO")
  })

  test("pause: cleanup refuses while a PENDING check is unclassified or the classification is not exported", () => {
    fs.appendFileSync(path.join(qaRun, "status.tsv"), "sitemap:same\tPENDING\t1\nvisual:approved-vs-mig:differences\tPENDING\t2\n")
    const dest = path.join(dir, "evidence-out")
    assert.equal(run("evidence", { QA_EVIDENCE_DIR: dest }).status, 0, "re-export to this run's own destination")
    let r = run("cleanup")
    assert.notEqual(r.status, 0)
    assert.match(r.stderr, /classify first: sitemap:same visual:approved-vs-mig:differences/)
    assert.ok(fs.existsSync(path.join(qaRun, "private", "visual-approved-vs-mig")), "the private captures are kept")

    const cls = path.join(qaRun, "work", "classification.md")
    fs.writeFileSync(cls, "- sitemap:same: página nueva aceptada\n")
    assert.match(run("cleanup").stderr, /does not cover visual:approved-vs-mig:differences/)
    fs.appendFileSync(cls, "- visual:approved-vs-mig:differences: es/blog@390, rediseño del artículo\n")
    fs.utimesSync(cls, new Date(), new Date(Date.now() + 5000))
    assert.match(run("cleanup").stderr, /run evidence again/)

    fs.mkdirSync(path.join(dir, "other-dest"))
    assert.notEqual(run("evidence", { QA_EVIDENCE_DIR: path.join(dir, "other-dest") }).status, 0, "another existing directory is never replaced")
    fs.utimesSync(cls, new Date(), new Date(Date.now() - 5000))
    assert.equal(run("evidence", { QA_EVIDENCE_DIR: dest }).status, 0)
    assert.ok(fs.readdirSync(dest).includes("classification.md"))
    assert.match(fs.readFileSync(path.join(dest, "README.md"), "utf8"), /decisiones en classification.md/)
    // Past the pause, stop at the first external command (a failing `sleep`) so nothing is removed.
    const stop = path.join(dir, "stop-bin")
    fs.mkdirSync(stop)
    fs.writeFileSync(path.join(stop, "sleep"), "#!/bin/sh\necho STOPPED-AFTER-GATE >&2\nexit 1\n", { mode: 0o755 })
    fs.writeFileSync(path.join(qaRun, "created"), "")
    r = run("cleanup", { PATH: `${stop}:${process.env.PATH}` })
    assert.match(r.stderr, /STOPPED-AFTER-GATE/, "the pause is satisfied")
    assert.ok(fs.existsSync(qaRun))
  })
})
