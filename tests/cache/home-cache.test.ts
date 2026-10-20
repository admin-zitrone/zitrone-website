/**
 * Home, navigation and footer editing against Next's real cache.
 *
 * Runs against `next start` on a CMS-mode production build whose database was
 * seeded from the code content (scripts/test-home-cache.sh). Pages are warmed
 * first and must be served from the full-route cache; then content is changed
 * through the app's own Payload REST API, so the afterChange hooks run inside
 * the app and call revalidatePath exactly as in production.
 *
 * The navigation and footer come from the home content on every page, so a
 * header or footer edit must reach the service, blog, contact and privacy
 * pages too, not only the home.
 */
import assert from "node:assert/strict"
import { before, describe, test } from "node:test"

const BASE = process.env.HOME_CACHE_TEST_BASE ?? "http://127.0.0.1:3111"
const ADMIN = { email: "home.cache.admin@example.invalid", password: "Home-Synthetic-Pass-1!" }

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
  return response.json()
}

async function eventually(path: string, check: (page: Awaited<ReturnType<typeof get>>) => boolean) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const page = await get(path)
    if (check(page)) return attempt
    await new Promise((resolve) => setTimeout(resolve, 300))
  }
  const last = await get(path)
  assert.fail(`${path} never reached the expected state (status ${last.status}, cache ${last.cache})`)
}

/** Every page that renders the shared navigation and footer, in Spanish. */
const SITE_PAGES_ES = ["/es", "/es/services", "/es/services/comedor-corporativo", "/es/blog", "/es/contact", "/es/privacy-notice"]

type HomeGlobal = { sections: Array<Record<string, unknown> & { blockType: string }> }

async function editHero(locale: "es" | "en", patch: Record<string, unknown>, query = "") {
  const home = (await api("GET", `globals/home?locale=${locale}&depth=0&draft=true`)) as HomeGlobal
  const sections = home.sections.map((block) => (block.blockType === "hero" ? { ...block, ...patch } : block))
  await api("POST", `globals/home?locale=${locale}${query}`, { sections })
}

describe("home: CMS edits through Next's cache", () => {
  before(async () => {
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
    // The blog index reads its search params, so it renders per request and is
    // checked for edits below but has no cache entry to hit.
    for (const path of [...SITE_PAGES_ES.filter((page) => page !== "/es/blog"), "/en"]) {
      await get(path)
      const warm = await get(path)
      assert.equal(warm.status, 200, path)
      assert.equal(warm.cache, "HIT", `${path} must come from the full-route cache`)
    }
  })

  test("a saved draft of the home does not reach the site; publishing does", async () => {
    await editHero("es", { copy: "Texto de prueba en borrador." }, "&draft=true")
    await new Promise((resolve) => setTimeout(resolve, 600))
    assert.ok(!(await get("/es")).body.includes("Texto de prueba en borrador."), "a draft must stay off the site")

    await editHero("es", { copy: "Texto de prueba publicado." })
    const visits = await eventually("/es", (page) => page.status === 200 && page.body.includes("Texto de prueba publicado."))
    console.log(`home edit visible after ${visits} visit(s)`)
    assert.ok(!(await get("/en")).body.includes("Texto de prueba publicado."), "a Spanish edit must not change English")
  })

  test("a header navigation edit reaches every page", async () => {
    const header = (await api("GET", "globals/header?locale=es&depth=0")) as {
      primaryNav: Array<{ id: string; link: Record<string, unknown> }>
    }
    const primaryNav = header.primaryNav.map((item, index) =>
      index === 2 ? { ...item, link: { ...item.link, label: "Menú de prueba" } } : item,
    )
    await api("POST", "globals/header?locale=es", { primaryNav })
    for (const path of SITE_PAGES_ES) {
      const visits = await eventually(path, (page) => page.status === 200 && page.body.includes("Menú de prueba"))
      console.log(`nav edit on ${path} after ${visits} visit(s)`)
    }
  })

  test("a footer edit reaches every page", async () => {
    await api("POST", "globals/footer?locale=es", { tagline: "Pie de prueba editado." })
    for (const path of SITE_PAGES_ES) {
      await eventually(path, (page) => page.status === 200 && page.body.includes("Pie de prueba editado."))
    }
  })

  test("removing the ribbon figure falls back to the ribbon label", async () => {
    await editHero("es", { ribbonStat: { value: null, label: null }, ribbonLabel: "Etiqueta de prueba" })
    await eventually("/es", (page) => page.body.includes("Etiqueta de prueba"))
  })
})
