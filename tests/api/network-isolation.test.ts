/**
 * The API suites cannot reach providers, even with credentials present
 * (Codex review R4). The runner starts from an empty environment and preloads
 * tests/api/network-guard.mjs; this file plants fake provider keys anyway and
 * proves the CMS hooks that would use them are refused at the network.
 */
import assert from "node:assert/strict"
import { after, test } from "node:test"

import { closeTestPayload, getTestPayload } from "./harness"

const blocked = () => (globalThis as { __zitroneBlockedRequests?: string[] }).__zitroneBlockedRequests

after(async () => {
  const payload = await getTestPayload()
  await payload.delete({ collection: "blogPosts", where: { slug: { equals: "articulo-red-aislada" } } })
  await closeTestPayload()
})

test("the runner hands the suites no provider credentials", () => {
  for (const name of ["OPENAI_API_KEY", "RESEND_API_KEY", "BLOB_READ_WRITE_TOKEN", "SENTRY_DSN", "NEXT_PUBLIC_SENTRY_DSN", "SENTRY_AUTH_TOKEN"]) {
    assert.equal(process.env[name], undefined, `${name} must not be inherited`)
  }
  assert.ok(Array.isArray(blocked()), "the network guard is loaded")
})

test("any non-local request is refused", async () => {
  await assert.rejects(fetch("https://example.com/"), /network-guard/)
  assert.ok(blocked()?.some((entry) => entry.includes("example.com")))
})

test("a blog hook with a fake OpenAI key cannot reach the embeddings API", async () => {
  process.env.OPENAI_API_KEY = "sk-fake-key-for-isolation-test"
  try {
    const payload = await getTestPayload()
    const before = blocked()?.length ?? 0
    const post = await payload.create({
      collection: "blogPosts",
      locale: "es",
      data: { title: "Artículo de red aislada", slug: "articulo-red-aislada", excerpt: "Texto sintético.", _status: "published" },
    })
    assert.ok(post.id, "the save still succeeds; the embedding is simply skipped")
    const attempts = blocked()?.slice(before) ?? []
    assert.ok(attempts.some((entry) => entry.includes("api.openai.com")), `blocked: ${attempts.join(", ")}`)
  } finally {
    delete process.env.OPENAI_API_KEY
  }
})
