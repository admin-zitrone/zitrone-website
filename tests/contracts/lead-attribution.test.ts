import assert from "node:assert/strict"
import test from "node:test"

import { classifyTarget, pageTypeFor, slugify, srcParamOf } from "../../src/lib/analytics/cta"
import { channelOf, parseGaClientId, parseGaSessionId } from "../../src/lib/attribution"
import { normalizeContactRequest } from "../../src/app/lib/contact"
import { leadAttributionRows } from "../../src/emails/contact-request-email"

const base = "https://www.zitrone.mx/es"

test("page types cover both locales' localized slugs", () => {
  assert.equal(pageTypeFor("/es"), "home")
  assert.equal(pageTypeFor("/en/"), "home")
  assert.equal(pageTypeFor("/es/services"), "services")
  assert.equal(pageTypeFor("/es/services/comedor-corporativo"), "service")
  assert.equal(pageTypeFor("/en/blog"), "blog")
  assert.equal(pageTypeFor("/es/blog/comedor-industrial"), "blog-article")
  assert.equal(pageTypeFor("/es/contact"), "contact")
})

test("targets separate the two lead forms from everything else", () => {
  assert.equal(classifyTarget("/es/contact?src=nav", base), "contact")
  assert.equal(classifyTarget("#profiler", base), "profiler")
  assert.equal(classifyTarget("/es#profiler", base), "profiler")
  assert.equal(classifyTarget("#faq", base), "anchor")
  assert.equal(classifyTarget("mailto:opina@zitrone.com.mx", base), "email")
  assert.equal(classifyTarget("tel:+525512054000", base), "phone")
  assert.equal(classifyTarget("https://wa.me/525512054000", base), "whatsapp")
  assert.equal(classifyTarget("https://www.instagram.com/zitrone_mx/", base), "social")
  assert.equal(classifyTarget("/es/services/carritos-de-servicio", base), "service")
  assert.equal(classifyTarget("https://example.com", base), "external")
})

test("cta ids come from ?src= and fall back to a clean slug", () => {
  assert.equal(srcParamOf("/es/contact?src=home-faq", base), "home-faq")
  assert.equal(srcParamOf("/es/services", base), "")
  assert.equal(slugify("Encuentra tu solución →"), "encuentra-tu-solucion")
})

test("channel speaks GA4's source / medium", () => {
  assert.equal(channelOf({ utmSource: "linkedin", utmMedium: "paid-social" }), "linkedin / paid-social")
  assert.equal(channelOf({ clickId: "gclid:abc" }), "google / cpc")
  assert.equal(channelOf({ referrer: "www.google.com/" }), "google / organic")
  assert.equal(channelOf({ referrer: "mx.linkedin.com/feed" }), "mx.linkedin.com / referral")
  assert.equal(channelOf({}), "(direct) / (none)")
  // Rows saved before these fields existed come back as null.
  assert.equal(channelOf({ utmSource: null, clickId: null, referrer: null }), "(direct) / (none)")
})

test("GA4 cookies parse in both the legacy and 2025 formats", () => {
  assert.equal(parseGaClientId("GA1.1.1234567890.1700000000"), "1234567890.1700000000")
  assert.equal(parseGaClientId("garbage"), "")
  assert.equal(parseGaSessionId("GS1.1.1700000123.4.1.1700000999.0.0.0"), "1700000123")
  assert.equal(parseGaSessionId("GS2.1.s1700000123$o4$g1$t1700000999$j60$l0$h0"), "1700000123")
  assert.equal(parseGaSessionId(""), "")
})

test("new attribution fields survive normalization, bounded", () => {
  const data = normalizeContactRequest({
    name: "QA", email: "qa@example.invalid", message: "x".repeat(20),
    ctaSection: "nav-mobile", ctaText: "Hablemos", clickId: `gclid:${"a".repeat(400)}`,
    utmTerm: "comedor empresarial", gaClientId: "1.2",
  })
  assert.equal(data.ctaSection, "nav-mobile")
  assert.equal(data.utmTerm, "comedor empresarial")
  assert.equal(data.clickId.length, 200)
  assert.equal(data.gaClientId, "1.2")
})

test("sales email names the CTA, or says plainly there was none", () => {
  const withCta = normalizeContactRequest({
    source: "nav", ctaSection: "hero", ctaText: "Hablemos", fromPath: "/es", utmSource: "google", utmMedium: "cpc",
  })
  const rows = leadAttributionRows(withCta, true)
  assert.equal(rows[0].value, "/es › hero › “Hablemos”")
  assert.equal(rows[1].value, "google / cpc")

  const without = leadAttributionRows(normalizeContactRequest({}), true)
  assert.match(without[0].value, /sin pasar por un botón/)
  assert.equal(without[1].value, "(direct) / (none)")
})
