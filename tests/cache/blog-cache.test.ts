/**
 * Blog publishing against Next's real cache (Codex review R1).
 *
 * Runs against `next start` on a production build whose CMS is a throwaway
 * local database (scripts/test-blog-cache.sh). Pages are warmed first and
 * must be served from the full-route cache (x-nextjs-cache: HIT); then the
 * post is edited, unpublished and republished through the app's own Payload
 * REST API, so the afterChange hook runs inside the app and calls
 * revalidatePath exactly as in production. Checked in ES and EN: article,
 * index, sitemap and feed.
 */
import assert from "node:assert/strict"
import { before, describe, test } from "node:test"

const BASE = process.env.CACHE_TEST_BASE ?? "http://127.0.0.1:3110"
const SEED = JSON.parse(process.env.CACHE_TEST_SEED ?? "{}") as { id: number; es: string; en: string }
const ADMIN = { email: "cache.admin@example.invalid", password: "Cache-Synthetic-Pass-1!" }

let cookie = ""

async function get(path: string) {
  const response = await fetch(`${BASE}${path}`, { redirect: "manual" })
  return { status: response.status, cache: response.headers.get("x-nextjs-cache"), body: await response.text() }
}

async function api(method: string, path: string, body?: unknown) {
  const response = await fetch(`${BASE}/api/${path}`, {
    method,
    headers: { cookie, "content-type": "application/json", "sec-fetch-site": "same-origin" },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  assert.ok(response.ok, `${method} ${path} -> ${response.status} ${await response.clone().text()}`)
  return response
}

/** Revalidation regenerates on the next visit; allow a few visits (and
 * record how many) rather than assuming the very first one. */
async function eventually(path: string, check: (page: Awaited<ReturnType<typeof get>>) => boolean) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const page = await get(path)
    if (check(page)) return attempt
    await new Promise((resolve) => setTimeout(resolve, 300))
  }
  const last = await get(path)
  assert.fail(`${path} never reached the expected state (status ${last.status}, cache ${last.cache})`)
}

const pages = () => ({
  esArticle: `/es/blog/${SEED.es}`,
  enArticle: `/en/blog/${SEED.en}`,
})

describe("blog: publish/unpublish through Next's cache", () => {
  before(async () => {
    assert.ok(SEED.id, "seed info missing")
    const login = await fetch(`${BASE}/api/users/login`, {
      method: "POST",
      headers: { "content-type": "application/json", "sec-fetch-site": "same-origin" },
      body: JSON.stringify(ADMIN),
    })
    assert.equal(login.status, 200)
    cookie = login.headers.get("set-cookie")?.split(";")[0] ?? ""
    assert.ok(cookie)
  })

  test("pre-rendered pages are served from the cache before any change", async () => {
    for (const path of Object.values(pages())) {
      await get(path)
      const warm = await get(path)
      assert.equal(warm.status, 200, path)
      assert.equal(warm.cache, "HIT", `${path} must come from the full-route cache`)
    }
    assert.ok((await get(pages().esArticle)).body.includes("Título inicial de caché"))
  })

  test("editing a published post replaces the cached page", async () => {
    await api("PATCH", `blogPosts/${SEED.id}?locale=es`, { title: "Título editado de caché" })
    const visits = await eventually(pages().esArticle, (page) => page.status === 200 && page.body.includes("Título editado de caché"))
    console.log(`edit visible after ${visits} visit(s)`)
  })

  test("unpublishing removes the cached article, index entry, sitemap and feed, in ES and EN", async () => {
    await api("PATCH", `blogPosts/${SEED.id}`, { _status: "draft" })
    const esVisits = await eventually(pages().esArticle, (page) => page.status === 404)
    const enVisits = await eventually(pages().enArticle, (page) => page.status === 404)
    console.log(`unpublish: ES 404 after ${esVisits}, EN 404 after ${enVisits} visit(s)`)
    await eventually("/es/blog", (page) => page.status === 200 && !page.body.includes(`/blog/${SEED.es}"`))
    await eventually("/en/blog", (page) => page.status === 200 && !page.body.includes(`/blog/${SEED.en}"`))
    await eventually("/sitemap.xml", (page) => !page.body.includes(`/blog/${SEED.es}<`) && !page.body.includes(`/blog/${SEED.en}<`))
    await eventually("/es/blog/feed.xml", (page) => !page.body.includes(`/blog/${SEED.es}`))
  })

  test("republishing brings everything back", async () => {
    await api("PATCH", `blogPosts/${SEED.id}`, { _status: "published" })
    await eventually(pages().esArticle, (page) => page.status === 200 && page.body.includes("Título editado de caché"))
    await eventually(pages().enArticle, (page) => page.status === 200)
    await eventually("/es/blog", (page) => page.body.includes(`/blog/${SEED.es}`))
    await eventually("/sitemap.xml", (page) => page.body.includes(`/blog/${SEED.es}<`) && page.body.includes(`/blog/${SEED.en}<`))
    await eventually("/en/blog/feed.xml", (page) => page.body.includes(`/blog/${SEED.en}`))
  })
})
