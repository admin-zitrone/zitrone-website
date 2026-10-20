import assert from "node:assert/strict"
import test from "node:test"
import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server"
import { buildDomainRedirects, CANONICAL_ORIGIN, legacyDomainRedirects, REDIRECT_HOSTS } from "../../src/lib/domain-redirects"

const nextConfig = { redirects: async () => buildDomainRedirects() }
const resolve = (url: string) => unstable_getResponseFromNextConfig({ url, nextConfig })

test("every known legacy path on all migration hosts goes directly to its canonical destination", async () => {
  for (const host of REDIRECT_HOSTS) {
    for (const protocol of ["http", "https"]) {
      for (const { source, destination } of legacyDomainRedirects) {
        const response = await resolve(`${protocol}://${host}${source}?utm_source=qr&utm_campaign=oto%C3%B1o&gclid=test-click&gbraid=test-braid`)
        assert.equal(response.status, 308)
        const location = new URL(response.headers.get("location")!)
        assert.equal(location.origin + location.pathname, CANONICAL_ORIGIN + destination)
        assert.equal(location.searchParams.get("utm_source"), "qr")
        assert.equal(location.searchParams.get("utm_campaign"), "otoño")
        assert.equal(location.searchParams.get("gclid"), "test-click")
        assert.equal(location.searchParams.get("gbraid"), "test-braid")
        assert.equal((await resolve(location.href)).headers.get("location"), null, `redirect chain for ${source}`)
      }
    }
  }
})

test("root, unchanged locale pages and unknown paths preserve a single canonical host", async () => {
  for (const host of REDIRECT_HOSTS) {
    for (const [source, destination] of [["/", "/es"], ["/en", "/en"], ["/es", "/es"], ["/en/contact", "/en/contact"], ["/does-not-exist", "/does-not-exist"], ["/es/servicios/unknown", "/es/servicios/unknown"]]) {
      const response = await resolve(`https://${host}${source}`)
      assert.equal(response.status, 308)
      assert.equal(response.headers.get("location"), CANONICAL_ORIGIN + destination)
    }
  }
  assert.equal((await resolve(`${CANONICAL_ORIGIN}/es/servicios/unknown`)).headers.get("location"), null)
})

test("canonical, preview and unrelated subdomains are not claimed by hostname rules", async () => {
  for (const host of ["www.zitrone.mx", "localhost:3102", "preview.vercel.app", "mail.zitrone.com.mx", "app.zitrone.com.mx", "zitroneXcomXmx"]) {
    const response = await resolve(`https://${host}/es/contact`)
    assert.equal(response.headers.get("location"), null, host)
  }
})

test("legacy paths on the new host still work and mismatched language slugs go directly to the right page", async () => {
  const oldPath = await resolve(`${CANONICAL_ORIGIN}/es/contacto`)
  assert.equal(oldPath.status, 308)
  assert.equal(oldPath.headers.get("location"), `${CANONICAL_ORIGIN}/es/contact`)
  const translated = await resolve("https://zitrone.com.mx/es/services/corporate-cafe")
  assert.equal(translated.headers.get("location"), `${CANONICAL_ORIGIN}/es/services/cafeteria-corporativa`)
})

test("moved and retired content redirects permanently in one hop, and kept articles stay put", async () => {
  const { movedContentRedirects } = await import("../../src/lib/domain-redirects")
  for (const { source, destination } of movedContentRedirects) {
    const response = await resolve(`${CANONICAL_ORIGIN}${source}?utm_source=qr`)
    assert.equal(response.status, 308, source)
    const location = new URL(response.headers.get("location")!, CANONICAL_ORIGIN)
    assert.equal(location.pathname, destination, source)
    assert.equal(location.searchParams.get("utm_source"), "qr", source)
    assert.equal((await resolve(new URL(destination, CANONICAL_ORIGIN).href)).headers.get("location"), null, `redirect chain for ${source}`)
  }
  for (const path of [
    "/en/blog/office-food-employee-retention",
    "/en/blog/afternoon-slump-office-pantry",
    "/en/blog/workplace-food-program-that-works",
    "/es/blog/como-construir-un-programa-de-alimentacion-corporativa",
  ]) {
    assert.equal((await resolve(`${CANONICAL_ORIGIN}${path}`)).headers.get("location"), null, path)
  }
})
