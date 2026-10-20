import assert from "node:assert/strict"
import { test } from "node:test"

import { readJsonWithLimit } from "../../src/lib/security"

function streamed(text: string, chunkSize = 1024, headers: Record<string, string> = {}) {
  const bytes = new TextEncoder().encode(text)
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (let i = 0; i < bytes.length; i += chunkSize) controller.enqueue(bytes.slice(i, i + chunkSize))
      controller.close()
    },
  })
  return new Request("http://127.0.0.1/api/contact-request", {
    method: "POST",
    headers,
    body,
    // @ts-expect-error Node's fetch requires duplex for stream bodies.
    duplex: "half",
  })
}

test("a small JSON body is parsed", async () => {
  assert.deepEqual(await readJsonWithLimit(streamed('{"name":"Ana"}'), 16_384), { ok: true, value: { name: "Ana" } })
})

test("a declared Content-Length over the limit is refused without reading", async () => {
  const result = await readJsonWithLimit(streamed("{}", 1024, { "content-length": "999999" }), 16_384)
  assert.deepEqual(result, { ok: false, reason: "too_large" })
})

test("a chunked body with no Content-Length is cut off at the limit", async () => {
  const big = JSON.stringify({ message: "x".repeat(40_000) })
  assert.deepEqual(await readJsonWithLimit(streamed(big), 16_384), { ok: false, reason: "too_large" })
})

test("an understated Content-Length does not let a larger body through", async () => {
  const big = JSON.stringify({ message: "x".repeat(40_000) })
  const result = await readJsonWithLimit(streamed(big, 4096, { "content-length": "10" }), 16_384)
  assert.deepEqual(result, { ok: false, reason: "too_large" })
})

test("malformed JSON is reported as invalid", async () => {
  assert.deepEqual(await readJsonWithLimit(streamed("{not json"), 16_384), { ok: false, reason: "invalid_json" })
})

test("a stream that errors after the first chunk is reported, not thrown", async () => {
  let sent = false
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (!sent) {
        sent = true
        controller.enqueue(new TextEncoder().encode('{"name":'))
        return
      }
      controller.error(new Error("simulated stream failure"))
    },
  })
  const request = new Request("http://127.0.0.1/api/contact-request", {
    method: "POST",
    body,
    // @ts-expect-error Node's fetch requires duplex for stream bodies.
    duplex: "half",
  })
  assert.deepEqual(await readJsonWithLimit(request, 16_384), { ok: false, reason: "read_failed" })
})

test("the contact route answers a failed body read with a controlled 400", async () => {
  const { POST } = await import("../../src/app/api/contact-request/route")
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('{"name":'))
      controller.error(new Error("simulated stream failure"))
    },
  })
  const response = await POST(new Request("http://127.0.0.1:3000/api/contact-request", {
    method: "POST",
    headers: { origin: "http://127.0.0.1:3000", "content-type": "application/json" },
    body,
    // @ts-expect-error Node's fetch requires duplex for stream bodies.
    duplex: "half",
  }))
  assert.equal(response.status, 400)
  assert.equal((await response.json()).code, "INVALID_BODY")
})
