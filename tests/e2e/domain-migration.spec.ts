import { test, expect } from "./fixtures/isolated"
import { legacyDomainRedirects } from "../../src/lib/domain-redirects"

test("known legacy paths resolve to real pages with the correct canonical", async ({ request, baseURL }) => {
  test.setTimeout(90_000)
  for (const { source, destination } of legacyDomainRedirects) {
    const response = await request.get(`${source}?utm_source=migration-test&gclid=test-only`, { maxRedirects: 0 })
    expect(response.status(), source).toBe(308)
    const location = new URL(response.headers().location, baseURL)
    expect(location.pathname, source).toBe(destination)
    expect(location.searchParams.get("utm_source")).toBe("migration-test")
    expect(location.searchParams.get("gclid")).toBe("test-only")
    // Always fetch through loopback; never follow an absolute production URL.
    const target = await request.get(destination, { maxRedirects: 0 })
    expect(target.status(), destination).toBe(200)
    const canonical = (await target.text()).match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1]
    expect(canonical, destination).toBe(`https://www.zitrone.mx${destination}`)
  }
})

test("unrecognized legacy services remain missing instead of redirecting to the index", async ({ request }) => {
  const response = await request.get("/es/servicios/nonexistent-migration-test", { maxRedirects: 0 })
  expect(response.status()).toBe(404)
})
