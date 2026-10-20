import assert from "node:assert/strict"
import { test } from "node:test"

import esMessages from "../../messages/es.json" with { type: "json" }
import enMessages from "../../messages/en.json" with { type: "json" }
import {
  CONSENT_ACCEPT_ALL,
  CONSENT_REJECT_ALL,
  CONSENT_SIGNALS,
  CONSENT_STRICT_REGIONS,
  CONSENT_VERSION,
  parseStoredConsent,
  toConsentState,
} from "../../src/lib/consent/config"
import { buildConsentBootstrap } from "../../src/lib/consent/bootstrap-script"

test("the consent panel is fully translated in both locales", () => {
  const es = Object.keys(esMessages.Consent ?? {}).sort()
  const en = Object.keys(enMessages.Consent ?? {}).sort()

  assert.ok(es.length > 0, "Spanish consent copy is missing entirely")
  assert.deepEqual(es, en, "consent copy keys differ between locales")

  for (const [locale, bundle] of [
    ["es", esMessages.Consent],
    ["en", enMessages.Consent],
  ] as const) {
    for (const [key, value] of Object.entries(bundle)) {
      assert.equal(typeof value, "string", `${locale}.${key} must be a string`)
      assert.ok(
        (value as string).trim().length > 0,
        `${locale}.${key} must not be empty — an unlabelled consent control is not a valid choice`,
      )
    }
  }
})

test("every Consent Mode v2 signal is declared in both defaults", () => {
  const script = buildConsentBootstrap()

  for (const signal of CONSENT_SIGNALS) {
    const occurrences = script.split(`'${signal}'`).length - 1
    assert.ok(
      occurrences >= 2,
      `${signal} must appear in both the regional and the global default (found ${occurrences})`,
    )
  }
})

test("the strict region default denies everything except security storage", () => {
  const script = buildConsentBootstrap()
  const regionalDefault = script.slice(0, script.indexOf("'region'"))

  for (const signal of CONSENT_SIGNALS) {
    if (signal === "security_storage") continue
    assert.ok(
      regionalDefault.includes(`'${signal}':'denied'`),
      `${signal} must default to denied for EEA/UK/CH visitors`,
    )
  }

  assert.ok(
    regionalDefault.includes("'security_storage':'granted'"),
    "security_storage is strictly necessary and must never be gated",
  )
})

test("the regional default covers the EEA, the UK and Switzerland", () => {
  const script = buildConsentBootstrap()

  // A representative sample rather than all 32 — if these are present the
  // list was serialised, and the config test below guards the list itself.
  for (const code of ["DE", "FR", "ES", "IE", "NO", "IS", "LI", "GB", "CH"]) {
    assert.ok(
      script.includes(`"${code}"`),
      `${code} must be in the strict-consent region list`,
    )
  }

  assert.equal(
    new Set(CONSENT_STRICT_REGIONS).size,
    CONSENT_STRICT_REGIONS.length,
    "the region list must not contain duplicates",
  )
  assert.equal(CONSENT_STRICT_REGIONS.length, 32, "EU27 + IS/LI/NO + GB/CH = 32")
})

test("the consent default is emitted before the container is told to start", () => {
  const script = buildConsentBootstrap()
  const firstDefault = script.indexOf("'consent','default'")
  const gtmStart = script.indexOf("gtm.start")

  assert.ok(firstDefault > -1, "no consent default is emitted at all")
  assert.ok(
    firstDefault < gtmStart,
    "consent defaults must precede gtm.start, or the tags fire ungated",
  )
})

test("gclid survives a denied consent state", () => {
  const script = buildConsentBootstrap()

  assert.ok(
    script.includes("'url_passthrough',true"),
    "url_passthrough keeps ad click ids in the URL when cookies are denied",
  )
  assert.ok(
    script.includes("'ads_data_redaction',true"),
    "ads_data_redaction must be set so denied ad_storage redacts click ids",
  )
})

test("a stored choice is only honoured when it matches the current version", () => {
  const current = encodeURIComponent(
    JSON.stringify({ analytics: "granted", marketing: "denied", v: CONSENT_VERSION }),
  )
  assert.deepEqual(parseStoredConsent(current), {
    analytics: "granted",
    marketing: "denied",
  })

  const stale = encodeURIComponent(
    JSON.stringify({ analytics: "granted", marketing: "granted", v: CONSENT_VERSION - 1 }),
  )
  assert.equal(
    parseStoredConsent(stale),
    null,
    "a choice made against an older policy must re-prompt, not carry over",
  )

  assert.equal(parseStoredConsent("not json"), null)
  assert.equal(parseStoredConsent(undefined), null)
  assert.equal(
    parseStoredConsent(encodeURIComponent(JSON.stringify({ analytics: "maybe", marketing: "granted", v: CONSENT_VERSION }))),
    null,
    "an unrecognised decision value must not be treated as consent",
  )
})

test("rejecting everything denies every signal except security storage", () => {
  const state = toConsentState(CONSENT_REJECT_ALL)

  for (const [signal, decision] of Object.entries(state)) {
    if (signal === "security_storage") {
      assert.equal(decision, "granted")
      continue
    }
    assert.equal(decision, "denied", `${signal} must be denied on reject-all`)
  }

  const accepted = toConsentState(CONSENT_ACCEPT_ALL)
  for (const decision of Object.values(accepted)) {
    assert.equal(decision, "granted")
  }
})

test("advertising signals follow the marketing category, not analytics", () => {
  const state = toConsentState({ analytics: "granted", marketing: "denied" })

  assert.equal(state.analytics_storage, "granted")
  assert.equal(state.ad_storage, "denied")
  assert.equal(state.ad_user_data, "denied", "Enhanced Conversions data is gated by marketing consent")
  assert.equal(state.ad_personalization, "denied")
})
