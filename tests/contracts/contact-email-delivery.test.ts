import assert from "node:assert/strict"
import test from "node:test"
import { normalizeContactRequest } from "@/app/lib/contact"
import { acceptContactRequest } from "@/lib/email/accept-contact"
import { createResendSender, deliverContactEmails, prepareContactEmails, EmailDeliveryError, type ContactEmailDelivery } from "@/lib/email/contact-delivery"
import { SALES_EMAIL } from "@/emails/contact-request-email"

const data = normalizeContactRequest({ locale: "es", name: "QA <script>alert(1)</script>", email: "qa@example.invalid", company: "QA & Co", message: "Servicios: Comedor, Pantry\nDesayuno: 20\nComida: 80\nCena: 40", headcount: "150", sourcePath: "/es/contact" })
const reference = "ZC-20260914-TEST"
const now = new Date("2026-09-14T18:00:00Z")

test("both language templates preserve the complete brief, escape HTML and route replies", () => {
  for (const locale of ["es", "en"] as const) {
    const batch = prepareContactEmails({ ...data, locale }, reference, now)
    const [sales, confirmation] = batch.items
    assert.deepEqual(sales.message.to, [SALES_EMAIL])
    assert.equal(sales.message.reply_to, data.email)
    assert.deepEqual(confirmation.message.to, [data.email])
    assert.equal(confirmation.message.reply_to, SALES_EMAIL)
    for (const { message } of batch.items) {
      assert.ok(message.subject.includes(reference))
      assert.ok(message.text.includes(data.message))
      assert.ok(message.html.includes("&lt;script&gt;"))
      assert.ok(!message.html.includes("<script>"))
      assert.ok(message.html.includes(`lang="${locale}"`))
    }
    assert.ok(!confirmation.message.text.includes(data.sourcePath))
    assert.notEqual(sales.key, confirmation.key)
  }
})

test("provider retries preserve body and idempotency key across timeouts, 429 and success", async () => {
  const calls: RequestInit[] = []
  const sender = createResendSender("fake-test-key", async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails")
    calls.push(options!)
    if (calls.length === 1) throw new Error("simulated timeout")
    if (calls.length === 2) return new Response("", { status: 429 })
    return Response.json({ id: "provider-test-id" })
  }, async () => {})
  const item = prepareContactEmails(data, reference, now).items[0]
  assert.equal(await sender(item.message, item.key), "provider-test-id")
  assert.equal(calls.length, 3)
  assert.equal(calls[0].body, calls[2].body)
  assert.equal(new Headers(calls[2].headers).get("Idempotency-Key"), item.key)
})

test("missing credentials, permanent rejection and malformed success are failures with safe codes", async () => {
  const item = prepareContactEmails(data, reference, now).items[0]
  let calls = 0
  const fetcher = async () => { calls++; return new Response("private provider details", { status: 403 }) }
  await assert.rejects(createResendSender("", fetcher)(item.message, item.key), /EMAIL_NOT_CONFIGURED/)
  assert.equal(calls, 0)
  await assert.rejects(createResendSender("fake", fetcher)(item.message, item.key), /^Error: EMAIL_HTTP_403$/)
  assert.equal(calls, 1)
  await assert.rejects(createResendSender("fake", async () => Response.json({}))(item.message, item.key), /EMAIL_INVALID_RESPONSE/)
})

test("no message is sent if saving the lead fails", async () => {
  let sends = 0
  await assert.rejects(acceptContactRequest(data, reference, {
    persist: async () => { throw new Error("database offline") },
    saveEmails: async () => {}, report: () => {}, send: async () => { sends++; return "sent" },
  }), /database offline/)
  assert.equal(sends, 0)
})

for (const sourcePath of ["/es/contact", "/en"]) {
  test(`${sourcePath}: saves before sending, accepts lead on partial failure and recovers only failed email`, async () => {
    let stored: ContactEmailDelivery | undefined
    const reports: string[] = []
    let sends = 0
    const result = await acceptContactRequest({ ...data, sourcePath }, reference, {
      persist: async (contact, id, emails) => {
        assert.equal(contact.sourcePath, sourcePath)
        assert.equal(id, reference)
        stored = structuredClone(emails)
        assert.ok(stored.items.every(item => item.status === "pending"))
        return 7
      },
      saveEmails: async (id, emails) => { assert.equal(id, 7); stored = structuredClone(emails) },
      report: code => reports.push(code),
      send: async () => {
        assert.ok(stored)
        sends++
        if (sends === 2) throw new EmailDeliveryError("EMAIL_HTTP_503")
        return "sales-id"
      },
    })
    assert.deepEqual(result, { ok: true, requestId: reference })
    assert.equal(stored!.items[0].status, "accepted")
    assert.equal(stored!.items[1].status, "failed")
    assert.deepEqual(reports, ["CONTACT_EMAIL_PENDING"])
    let retried = 0
    const recovered = await deliverContactEmails(stored!, async emails => { stored = emails }, async (message, key) => {
      assert.equal(key, stored!.items[1].key)
      assert.deepEqual(message, stored!.items[1].message)
      retried++
      return "confirmation-id"
    })
    assert.equal(retried, 1)
    assert.ok(recovered.items.every(item => item.status === "accepted"))
  })
}

test("crash after send leaves recoverable exact snapshot; expired snapshots require manual review", async () => {
  const stored = prepareContactEmails(data, reference, now)
  let sends = 0
  await assert.rejects(deliverContactEmails(stored, async () => { throw new Error("save failure") }, async () => { sends++; return "id" }, now), /save failure/)
  assert.equal(sends, 1)
  assert.equal(stored.items[0].status, "pending")
  const keys: string[] = []
  await deliverContactEmails(stored, async () => {}, async (_, key) => { keys.push(key); return "id" }, now)
  assert.equal(keys[0], stored.items[0].key)
  const expired = await deliverContactEmails(stored, async () => {}, async () => { throw new Error("must not send") }, new Date(now.getTime() + 23 * 3600_000))
  assert.ok(expired.items.every(item => item.status === "review"))
})

test("email status save failure still acknowledges the durable lead", async () => {
  const reports: string[] = []
  const result = await acceptContactRequest(data, reference, {
    persist: async () => 1,
    saveEmails: async () => { throw new Error("database offline after send") },
    report: code => reports.push(code), send: async () => "id",
  })
  assert.equal(result.ok, true)
  assert.deepEqual(reports, ["CONTACT_EMAIL_STATUS_SAVE_FAILED"])
})

test("CONTACT_SALES_EMAIL reroutes sales mail for staging and falls back safely", () => {
  const previous = process.env.CONTACT_SALES_EMAIL
  try {
    process.env.CONTACT_SALES_EMAIL = "staging-qa@example.invalid"
    const [sales, confirmation] = prepareContactEmails(data, reference, now).items
    assert.deepEqual(sales.message.to, ["staging-qa@example.invalid"])
    assert.equal(confirmation.message.reply_to, "staging-qa@example.invalid")
    process.env.CONTACT_SALES_EMAIL = "not an address"
    assert.deepEqual(prepareContactEmails(data, reference, now).items[0].message.to, [SALES_EMAIL])
  } finally {
    if (previous === undefined) delete process.env.CONTACT_SALES_EMAIL
    else process.env.CONTACT_SALES_EMAIL = previous
  }
})
