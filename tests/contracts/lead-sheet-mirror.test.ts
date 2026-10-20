import assert from "node:assert/strict"
import test from "node:test"
import { normalizeContactRequest } from "@/app/lib/contact"
import { LEAD_SHEET_COLUMNS, isSheetMirrorConfigured, mirrorLeadToSheet, toLeadSheetRow } from "@/lib/leads/sheet-mirror"

const data = normalizeContactRequest({ locale: "es", name: "QA", email: "qa@example.invalid", company: "QA & Co", message: "Servicios: Comedor", headcount: "150", sourcePath: "/es/contact" })
const row = toLeadSheetRow(data, "ZC-TEST", new Date("2026-09-16T12:00:00Z"))
const env = { LEADS_SHEET_WEBHOOK_URL: "https://script.example/exec", LEADS_SHEET_WEBHOOK_SECRET: "s3cret" }

test("sheet row covers every declared column and carries the folio", () => {
  for (const column of LEAD_SHEET_COLUMNS) assert.ok(column in row, column)
  assert.equal(row.Folio, "ZC-TEST")
  assert.equal(row.Fecha, "2026-09-16T12:00:00.000Z")
})

test("mirror is a no-op without configuration and never throws", async () => {
  assert.equal(isSheetMirrorConfigured({}), false)
  assert.equal(await mirrorLeadToSheet(row, {}), "not_configured")
  assert.equal(await mirrorLeadToSheet(row, env, async () => { throw new Error("network") }), "failed")
  assert.equal(await mirrorLeadToSheet(row, env, async () => new Response("nope", { status: 500 })), "failed")
})

test("mirror posts secret + row and reports duplicates distinctly", async () => {
  let seen: { secret?: string; row?: Record<string, string>; columns?: string[] } = {}
  const ok = await mirrorLeadToSheet(row, env, async (_url, init) => {
    seen = JSON.parse(String(init?.body))
    return Response.json({ ok: true })
  })
  assert.equal(ok, "mirrored")
  assert.equal(seen.secret, "s3cret")
  assert.equal(seen.row?.Folio, "ZC-TEST")
  assert.deepEqual(seen.columns, [...LEAD_SHEET_COLUMNS])
  assert.equal(await mirrorLeadToSheet(row, env, async () => Response.json({ ok: true, duplicate: true })), "duplicate")
})
