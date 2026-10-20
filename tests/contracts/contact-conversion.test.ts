import assert from "node:assert/strict"
import test from "node:test"
import { submitContactRequest, type ContactSubmission } from "../../src/app/lib/contact"

const input: ContactSubmission = {
  locale: "es", name: "QA", company: "", email: "qa@example.invalid",
  phone: "", interest: "cafeteria", headcount: "", message: "", sourcePath: "/es/contact",
}

test("only persisted 201 leads qualify for conversion; honeypot success does not", async (t) => {
  for (const status of [201, 202, 200]) {
    const mocked = t.mock.method(globalThis, "fetch", async () =>
      Response.json({ ok: true, requestId: "ZC-TEST" }, { status }))
    const result = await submitContactRequest(input, "contact")
    assert.deepEqual(result, { ok: true, requestId: "ZC-TEST", persisted: status === 201 })
    mocked.mock.restore()
  }
})

test("failed or malformed acknowledgements never qualify for conversion", async (t) => {
  for (const [status, body] of [[422, { ok: false }], [502, { ok: false }], [201, { ok: true }]] as const) {
    const mocked = t.mock.method(globalThis, "fetch", async () => Response.json(body, { status }))
    assert.equal((await submitContactRequest(input, "contact")).ok, false)
    mocked.mock.restore()
  }
})
