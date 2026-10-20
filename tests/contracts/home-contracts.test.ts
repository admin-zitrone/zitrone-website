import test from "node:test"
import assert from "node:assert/strict"

import { homeContentEn } from "@/app/_components/home/content/en"
import { homeContentEs } from "@/app/_components/home/content/es"
import {
  blogPostingJsonLd,
  localBusinessJsonLd,
  organizationJsonLd,
  serviceCatalogJsonLd,
} from "@/app/lib/json-ld"
import { verifyHomeReleaseHtml } from "../../scripts/payload/release-home-verifier"
import { getServiceTargets, getServiceTemplateContent } from "@/app/[locale]/services/service-targets"

test("localized home content stays structurally aligned", () => {
  assert.equal(homeContentEn.heroLogos.length, homeContentEs.heroLogos.length)
  assert.equal(homeContentEn.serviceCards.length, homeContentEs.serviceCards.length)
  assert.equal(homeContentEn.servicesOrbitItems.length, homeContentEs.servicesOrbitItems.length)
  assert.equal(homeContentEn.systemTabs.length, homeContentEs.systemTabs.length)
  assert.equal(homeContentEn.proofColumns.length, homeContentEs.proofColumns.length)
  assert.equal(homeContentEn.serviceLayers.length, homeContentEs.serviceLayers.length)
  assert.equal(homeContentEn.clientStories.length, homeContentEs.clientStories.length)
})

test("footer service links stay aligned with the service catalog", () => {
  for (const content of [homeContentEn, homeContentEs]) {
    const footerServiceHrefs = content.footerColumns[1]?.links.map((link) => link.href)
    const serviceHrefs = content.serviceLayers.map((service) => service.href)

    assert.deepEqual(footerServiceHrefs, ["/services", ...serviceHrefs])
  }
})

/* The home card for a service previews its page: the same three points, in the
   same order and words, as the service page's "resolves" block. The page is
   the source; edit it there and copy here. */
test("home service cards repeat their service page's three points", () => {
  for (const [locale, content] of [["en", homeContentEn], ["es", homeContentEs]] as const) {
    for (const target of getServiceTargets(locale)) {
      const layer = content.serviceLayers.find((item) => item.theme === target.theme)
      assert.ok(layer, `${locale}: no home card for ${target.theme}`)
      const points = getServiceTemplateContent(locale, target.theme).resolves?.points
      assert.ok(points, `${locale}/${target.theme}: service page has no resolves points`)
      assert.deepEqual(
        layer.features.map(({ title, text }) => ({ title, text })),
        points.map(({ title, copy }) => ({ title, text: copy })),
        `${locale}/${target.theme}: home card points drifted from the service page`,
      )
    }
  }
})

test("entity schema includes contact and service signals", () => {
  const organization = organizationJsonLd("en", homeContentEn.meta.description, homeContentEn.sections.footer)
  const business = localBusinessJsonLd("en", homeContentEn.meta.description, homeContentEn.sections.footer)

  assert.equal(organization["@type"], "Organization")
  assert.equal(organization.legalName, "Servicio de Alimentación Zitrone, S.A.P.I. de C.V.")
  assert.ok(organization.contactPoint)
  assert.ok(Array.isArray(organization.sameAs))
  assert.equal(business["@type"], "LocalBusiness")
  assert.equal(business.address.addressCountry, "MX")
})

test("service catalog emits one item per service layer", () => {
  const catalog = serviceCatalogJsonLd("en", homeContentEn.serviceLayers)
  assert.equal(catalog["@type"], "OfferCatalog")
  assert.match(catalog.url, /\/en\/services$/)
  assert.equal(catalog.itemListElement.length, homeContentEn.serviceLayers.length)
  assert.ok(
    catalog.itemListElement.every((item) => item.itemListElement[0]?.url?.includes("/en/services/")),
  )
})

test("blog posting schema stays publisher-consistent", () => {
  const post = {
    title: "Test Post",
    slug: "test-post",
    excerpt: "Excerpt",
    image: "/blog.jpg",
    category: "Operations",
    date: "2026-05-22",
  }
  const schema = blogPostingJsonLd(
    "en",
    post,
    "2026-05-22T00:00:00.000Z",
    "2026-06-01T00:00:00.000Z",
  )
  assert.equal(schema["@type"], "BlogPosting")
  assert.equal(schema.datePublished, "2026-05-22T00:00:00.000Z")
  assert.equal(schema.dateModified, "2026-06-01T00:00:00.000Z")
  assert.equal(schema.publisher.name, "Zitrone")
  // Raster PNG (not SVG): Google's logo rich result requires raster >=112px.
  assert.match(schema.publisher.logo.url, /\/img\/shared\/brand\/zitrone-logo-dark\.png$/)
})

test("release verifier catches stale homepage markers", () => {
  const html = [
    homeContentEn.sections.services.titleAriaLabel,
    homeContentEn.sections.featuredMedia.label,
    homeContentEn.sections.stories.cta.label,
    homeContentEn.sections.operatingSystem.titleAriaLabel,
    homeContentEn.sections.proof.headingAriaLabel,
    "\"@type\":\"FAQPage\"",
    "\"@type\":\"LocalBusiness\"",
    "\"@type\":\"OfferCatalog\"",
    "\"@type\":\"Service\"",
    "\"contactPoint\"",
    "salesforce-lockup",
  ].join("\n")

  const result = verifyHomeReleaseHtml(html)
  assert.deepEqual(result.missing, [])
  assert.deepEqual(result.unexpected, [])
})
