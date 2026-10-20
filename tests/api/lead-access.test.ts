/**
 * Lead permissions through the real API (audit A-02).
 *
 * Synthetic users and leads only, in the throwaway database the harness
 * insists on. Covers each actor against read / update / delete / export, the
 * immutability of submitted fields, and the server's own writes (creation and
 * email-delivery bookkeeping) that must keep working.
 */
import assert from "node:assert/strict"
import { after, before, describe, test } from "node:test"

import { closeTestPayload, getTestPayload, login, rest, setSessionHeaders } from "./harness"

const PASSWORD = "Synthetic-Test-Pass-42!"
const ADMIN = { email: "admin.api-test@example.invalid", password: PASSWORD, role: "admin" as const }
const EDITOR = { email: "editor.api-test@example.invalid", password: PASSWORD, role: "editor" as const }

const SUBMITTED = {
  name: "Persona Sintética",
  company: "Empresa de Prueba",
  email: "lead.api-test@example.invalid",
  phone: "5500000000",
  interest: "comedor",
  headcount: "150",
  message: "=HYPERLINK(\"http://example.invalid\") mensaje original",
  locale: "es" as const,
  requestId: "ZC-TEST-ACCESS1",
  sourcePath: "/es/contacto",
  source: "hero-cta",
  ctaSection: "hero",
  ctaText: "Cotizar",
  fromPath: "/es",
  landingPath: "/es",
  referrer: "https://example.invalid/",
  utmSource: "test",
  utmMedium: "cpc",
  utmCampaign: "access-test",
  clickId: "gclid-test",
  gaClientId: "1.2",
  gaSessionId: "3",
}

async function exportCsv(cookie?: string) {
  const { GET } = await import("../../src/app/api/leads/export/route")
  const headers = new Headers()
  if (cookie) setSessionHeaders(headers, cookie)
  const response = await GET(new Request("http://localhost:3000/api/leads/export", { headers }))
  return { status: response.status, body: await response.text(), cacheControl: response.headers.get("cache-control") }
}

describe("contact requests: access by actor", () => {
  let leadId: number | string
  let adminCookie: string
  let editorCookie: string

  before(async () => {
    const payload = await getTestPayload()
    await payload.delete({ collection: "contactRequests", where: { requestId: { like: "ZC-TEST-" } } })
    await payload.delete({ collection: "users", where: { email: { like: "api-test@example.invalid" } } })
    for (const user of [ADMIN, EDITOR]) {
      await payload.create({ collection: "users", data: user })
    }
    // The contact route's write: server-side, no user, overrideAccess.
    const lead = await payload.create({
      collection: "contactRequests",
      overrideAccess: true,
      data: { ...SUBMITTED, status: "new", emailDelivery: { sales: { status: "pending" } } },
    })
    leadId = lead.id
    adminCookie = await login(ADMIN.email, ADMIN.password)
    editorCookie = await login(EDITOR.email, EDITOR.password)
  })

  after(async () => {
    const payload = await getTestPayload()
    await payload.delete({ collection: "contactRequests", where: { requestId: { like: "ZC-TEST-" } } })
    await payload.delete({ collection: "users", where: { email: { like: "api-test@example.invalid" } } })
    await closeTestPayload()
  })

  test("anonymous: cannot list, read, update, delete or export", async () => {
    assert.equal((await rest("GET", "contactRequests")).status, 403)
    assert.equal((await rest("GET", `contactRequests/${leadId}`)).status, 403)
    assert.equal((await rest("PATCH", `contactRequests/${leadId}`, { body: { status: "closed" } })).status, 403)
    assert.equal((await rest("DELETE", `contactRequests/${leadId}`)).status, 403)
    const csv = await exportCsv()
    assert.equal(csv.status, 401)
    assert.equal(csv.cacheControl, "no-store")
  })

  test("anonymous: cannot create a lead through the CMS API", async () => {
    const response = await rest("POST", "contactRequests", { body: { ...SUBMITTED, requestId: "ZC-TEST-ANON" } })
    assert.equal(response.status, 403)
  })

  test("editor: no access to leads or the export", async () => {
    assert.equal((await rest("GET", "contactRequests", { cookie: editorCookie })).status, 403)
    assert.equal((await rest("GET", `contactRequests/${leadId}`, { cookie: editorCookie })).status, 403)
    assert.equal(
      (await rest("PATCH", `contactRequests/${leadId}`, { cookie: editorCookie, body: { status: "closed" } })).status,
      403,
    )
    assert.equal((await rest("DELETE", `contactRequests/${leadId}`, { cookie: editorCookie })).status, 403)
    const csv = await exportCsv(editorCookie)
    assert.equal(csv.status, 403)
    assert.ok(!csv.body.includes(SUBMITTED.email), "a refused export must not leak lead data")
  })

  test("admin: can list and read", async () => {
    const list = await rest("GET", "contactRequests", { cookie: adminCookie })
    assert.equal(list.status, 200)
    assert.equal((list.json?.docs as unknown[]).length, 1)
    const one = await rest("GET", `contactRequests/${leadId}`, { cookie: adminCookie })
    assert.equal(one.status, 200)
    assert.equal(one.json?.email, SUBMITTED.email)
  })

  test("admin: status and notes change; submitted data, attribution and delivery do not", async () => {
    const response = await rest("PATCH", `contactRequests/${leadId}`, {
      cookie: adminCookie,
      body: {
        status: "contacted",
        internalNotes: "Llamada agendada (nota sintética)",
        name: "Reescrito",
        email: "rewritten@example.invalid",
        message: "mensaje reescrito",
        requestId: "ZC-FORGED",
        source: "forged",
        utmCampaign: "forged",
        clickId: "forged",
        locale: "en",
        emailDelivery: { sales: { status: "accepted" } },
      },
    })
    assert.equal(response.status, 200)

    const payload = await getTestPayload()
    const stored = await payload.findByID({ collection: "contactRequests", id: leadId, overrideAccess: true })
    assert.equal(stored.status, "contacted")
    assert.equal(stored.internalNotes, "Llamada agendada (nota sintética)")
    for (const [field, value] of Object.entries(SUBMITTED)) {
      assert.deepEqual((stored as unknown as Record<string, unknown>)[field], value, `${field} must stay as submitted`)
    }
    assert.deepEqual(stored.emailDelivery, { sales: { status: "pending" } })
  })

  test("server process: email delivery bookkeeping still updates (contact route / retry script path)", async () => {
    const payload = await getTestPayload()
    await payload.update({
      collection: "contactRequests",
      id: leadId,
      overrideAccess: true,
      data: { emailDelivery: { sales: { status: "accepted", providerId: "synthetic" } } },
    })
    const stored = await payload.findByID({ collection: "contactRequests", id: leadId, overrideAccess: true })
    assert.deepEqual(stored.emailDelivery, { sales: { status: "accepted", providerId: "synthetic" } })
    assert.equal(stored.email, SUBMITTED.email)
  })

  test("admin: export is a no-store CSV with formula cells neutralised", async () => {
    const csv = await exportCsv(adminCookie)
    assert.equal(csv.status, 200)
    assert.equal(csv.cacheControl, "no-store")
    assert.ok(csv.body.includes(SUBMITTED.email))
    assert.ok(csv.body.includes("\"'=HYPERLINK"), "a cell starting with = is prefixed with an apostrophe")
    assert.ok(csv.body.includes("Llamada agendada"))
  })

  test("admin: can delete a lead", async () => {
    const payload = await getTestPayload()
    const spare = await payload.create({
      collection: "contactRequests",
      overrideAccess: true,
      data: { ...SUBMITTED, requestId: "ZC-TEST-DELETE", status: "new" },
    })
    assert.equal((await rest("DELETE", `contactRequests/${spare.id}`, { cookie: adminCookie })).status, 200)
  })

  test("existing role protection: an editor cannot promote themselves", async () => {
    const payload = await getTestPayload()
    const editor = (await payload.find({ collection: "users", where: { email: { equals: EDITOR.email } } })).docs[0]
    assert.ok(editor)
    await rest("PATCH", `users/${editor.id}`, { cookie: editorCookie, body: { role: "admin" } })
    const stored = await payload.findByID({ collection: "users", id: editor.id })
    assert.equal(stored.role, "editor")
  })
})
