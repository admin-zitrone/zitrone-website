/**
 * The sales role and the content boundary (user decision 2026-10-07; role
 * table in src/payload/access/roles.ts), through Payload's real REST API on
 * the throwaway database.
 *
 * Sales: reads leads, changes status/notes, exports; cannot delete leads,
 * rewrite submitted data, edit site content or promote itself.
 * Editor: edits content (collections and globals), still no leads.
 */
import assert from "node:assert/strict"
import { after, before, describe, test } from "node:test"

import { closeTestPayload, getTestPayload, login, rest, setSessionHeaders } from "./harness"

const PASSWORD = "Synthetic-Test-Pass-42!"
// A valid site-settings body, so the only thing that differs between roles
// is access (an empty body fails the global's own required fields).
const SETTINGS = { brand: { name: "Zitrone" }, contacts: { primaryEmail: "roles-test@example.invalid" } }
const SALES = { email: "sales.roles-test@example.invalid", password: PASSWORD, role: "sales" as const }
const EDITOR = { email: "editor.roles-test@example.invalid", password: PASSWORD, role: "editor" as const }

async function exportCsv(cookie: string) {
  const { GET } = await import("../../src/app/api/leads/export/route")
  const headers = new Headers()
  setSessionHeaders(headers, cookie)
  const response = await GET(new Request("http://localhost:3000/api/leads/export", { headers }))
  return { status: response.status, body: await response.text() }
}

describe("roles: sales works leads, editors work content", () => {
  let leadId: number | string
  let postId: number | string
  let salesCookie: string
  let editorCookie: string

  before(async () => {
    const payload = await getTestPayload()
    await payload.delete({ collection: "users", where: { email: { like: "roles-test@example.invalid" } } })
    for (const user of [SALES, EDITOR]) await payload.create({ collection: "users", data: user })
    const lead = await payload.create({
      collection: "contactRequests",
      overrideAccess: true,
      data: { name: "Lead de roles", email: "lead.roles-test@example.invalid", requestId: "ZC-ROLES-0001", status: "new", locale: "es" },
    })
    leadId = lead.id
    const post = await payload.create({
      collection: "blogPosts",
      locale: "es",
      data: { title: "Artículo de roles", slug: "articulo-de-roles", excerpt: "Sintético.", _status: "published" },
    })
    postId = post.id
    salesCookie = await login(SALES.email, SALES.password)
    editorCookie = await login(EDITOR.email, EDITOR.password)
  })

  after(async () => {
    const payload = await getTestPayload()
    await payload.delete({ collection: "contactRequests", where: { requestId: { equals: "ZC-ROLES-0001" } } })
    await payload.delete({ collection: "blogPosts", where: { slug: { equals: "articulo-de-roles" } } })
    await payload.delete({ collection: "users", where: { email: { like: "roles-test@example.invalid" } } })
    await closeTestPayload()
  })

  test("sales: reads leads and changes status/notes only", async () => {
    assert.equal((await rest("GET", "contactRequests", { cookie: salesCookie })).status, 200)
    const patch = await rest("PATCH", `contactRequests/${leadId}`, {
      cookie: salesCookie,
      body: { status: "contacted", internalNotes: "Llamada (sintética)", email: "rewritten@example.invalid" },
    })
    assert.equal(patch.status, 200)
    const payload = await getTestPayload()
    const stored = await payload.findByID({ collection: "contactRequests", id: leadId, overrideAccess: true })
    assert.equal(stored.status, "contacted")
    assert.equal(stored.internalNotes, "Llamada (sintética)")
    assert.equal(stored.email, "lead.roles-test@example.invalid")
  })

  test("sales: exports leads", async () => {
    const csv = await exportCsv(salesCookie)
    assert.equal(csv.status, 200)
    assert.ok(csv.body.includes("lead.roles-test@example.invalid"))
  })

  test("sales: cannot delete a lead", async () => {
    assert.equal((await rest("DELETE", `contactRequests/${leadId}`, { cookie: salesCookie })).status, 403)
  })

  test("sales: cannot edit or create site content", async () => {
    assert.equal((await rest("PATCH", `blogPosts/${postId}`, { cookie: salesCookie, body: { title: "x" } })).status, 403)
    assert.equal((await rest("POST", "faqs", { cookie: salesCookie, body: { question: "q", answer: "a" } })).status, 403)
    assert.equal((await rest("POST", "globals/siteSettings", { cookie: salesCookie, body: SETTINGS })).status, 403)
  })

  test("sales: cannot promote itself", async () => {
    const payload = await getTestPayload()
    const me = (await payload.find({ collection: "users", where: { email: { equals: SALES.email } } })).docs[0]
    assert.ok(me)
    await rest("PATCH", `users/${me.id}`, { cookie: salesCookie, body: { role: "admin" } })
    assert.equal((await payload.findByID({ collection: "users", id: me.id })).role, "sales")
  })

  test("editor: edits content and globals, still no leads", async () => {
    assert.equal((await rest("PATCH", `blogPosts/${postId}`, { cookie: editorCookie, body: { title: "Editado" } })).status, 200)
    assert.equal((await rest("POST", "globals/siteSettings", { cookie: editorCookie, body: SETTINGS })).status, 200)
    assert.equal((await rest("GET", "contactRequests", { cookie: editorCookie })).status, 403)
    assert.equal((await exportCsv(editorCookie)).status, 403)
  })
})
