import assert from "node:assert/strict"
import test from "node:test"
import { NextRequest } from "next/server"
import proxy from "@/proxy"

import { getBlogContent } from "@/app/[locale]/blog/articles"
import { blogProfileAlternatePaths } from "@/app/lib/blog-profile-alternates"
import { canonicalFor, localeAlternates, localizedAlternates } from "@/app/lib/seo"
import { buildSiteSitemap } from "@/app/lib/site-sitemap"

const es = [{ slug: "shared-post", authorName: "Equipo Zitrone", reviewedByName: "Operaciones Zitrone" }]
const en = [{ slug: "shared-post", authorName: "Zitrone Team", reviewedByName: "Zitrone Operations" }]

test("locale middleware preserves routing without advertising fabricated alternate URLs", () => {
  const response = proxy(new NextRequest("https://www.zitrone.mx/es/blog/authors/equipo-de-operaciones-zitrone"))
  assert.equal(response.status, 200)
  assert.equal(response.headers.get("link"), null)
  assert.equal(response.headers.get("x-middleware-request-x-next-intl-locale"), "es")
  const redirect = proxy(new NextRequest("https://www.zitrone.mx/contact"))
  assert.equal(redirect.status, 307)
  assert.equal(redirect.headers.get("location"), "https://www.zitrone.mx/es/contact")
})

test("translated profile alternates point directly to reciprocal author and reviewer slugs", () => {
  for (const kind of ["author", "reviewer"] as const) {
    const field = kind === "author" ? "authorName" : "reviewedByName"
    const fromEs = blogProfileAlternatePaths({ locale: "es", name: es[0][field], kind, posts: es, otherPosts: en })
    const fromEn = blogProfileAlternatePaths({ locale: "en", name: en[0][field], kind, posts: en, otherPosts: es })
    assert.deepEqual(localizedAlternates(fromEs), localizedAlternates(fromEn))
    const segment = kind === "author" ? "authors" : "reviewers"
    assert.equal(fromEs.es, `/blog/${segment}/${kind === "author" ? "equipo-zitrone" : "operaciones-zitrone"}`)
    assert.equal(fromEs.en, `/blog/${segment}/${kind === "author" ? "zitrone-team" : "zitrone-operations"}`)
    assert.equal(localizedAlternates(fromEs)["x-default"], canonicalFor("es", fromEs.es!))
  }
})

test("a missing translated article does not invent an unrelated default author", () => {
  const paths = blogProfileAlternatePaths({ locale: "en", name: en[0].authorName, kind: "author", posts: en, otherPosts: [{ ...es[0], slug: "unrelated" }] })
  assert.deepEqual(paths, { en: "/blog/authors/zitrone-team" })
  assert.deepEqual(localizedAlternates(paths), {
    en: canonicalFor("en", "/blog/authors/zitrone-team"),
    "x-default": canonicalFor("en", "/blog/authors/zitrone-team"),
  })
})

test("ambiguous profile mappings are omitted in both directions", () => {
  const source = [...es, { ...es[0], slug: "second-post" }]
  const translated = [...en, { ...en[0], slug: "second-post", authorName: "Another Author" }]
  assert.deepEqual(blogProfileAlternatePaths({ locale: "es", name: es[0].authorName, kind: "author", posts: source, otherPosts: translated }), { es: "/blog/authors/equipo-zitrone" })
  for (const name of ["Zitrone Team", "Another Author"]) {
    const paths = blogProfileAlternatePaths({ locale: "en", name, kind: "author", posts: translated, otherPosts: source })
    assert.equal(paths.es, undefined)
  }
})

test("default editorial credits resolve using each locale's actual profile names", () => {
  const posts = [{ slug: "shared-post" }]
  for (const kind of ["author", "reviewer"] as const) {
    const field = kind === "author" ? "authorName" : "reviewedByName"
    const name = getBlogContent("es").article[field]
    const paths = blogProfileAlternatePaths({ locale: "es", name, kind, posts, otherPosts: posts })
    assert.ok(paths.es)
    assert.ok(paths.en)
    assert.notEqual(paths.es, paths.en)
  }
})

test("shared paths preserve both locales and Spanish x-default", () => {
  assert.deepEqual(localeAlternates("/contact"), {
    es: canonicalFor("es", "/contact"),
    en: canonicalFor("en", "/contact"),
    "x-default": canonicalFor("es", "/contact"),
  })
  assert.deepEqual(localizedAlternates({}), {})
})

test("the actual sitemap builder includes contact and only existing reciprocal profile URLs", () => {
  const sitemap = buildSiteSitemap({ es: getBlogContent("es"), en: getBlogContent("en") })
  const byUrl = new Map(sitemap.map((entry) => [entry.url, entry]))
  assert.equal(byUrl.size, sitemap.length, "duplicate canonical sitemap URLs")
  for (const locale of ["es", "en"]) {
    assert.deepEqual(byUrl.get(canonicalFor(locale, "/contact"))?.alternates?.languages, localeAlternates("/contact"))
  }
  const profiles = sitemap.filter((entry) => /\/blog\/(authors|reviewers)\//.test(entry.url))
  assert.ok(profiles.length >= 4, "both localized author and reviewer profiles must be covered")
  for (const entry of profiles) {
    const languages = entry.alternates!.languages!
    for (const url of Object.values(languages)) {
      assert.equal(typeof url, "string")
      const counterpart = byUrl.get(url as string)
      assert.ok(counterpart, `alternate is not a canonical sitemap destination: ${url}`)
      assert.deepEqual(counterpart.alternates?.languages, languages, "alternates must be reciprocal")
    }
  }
})
