/**
 * Google Consent Mode v2 configuration.
 *
 * The site runs GA4 (G-E48BCCXZEC) and a Google Ads conversion tag with
 * Enhanced Conversions through GTM-TSTDVS4. Enhanced Conversions hashes and
 * transmits user-provided data, so the consent signal is not decorative — it
 * is the lawful basis for that transmission in jurisdictions that require one.
 *
 * The gating is region-scoped rather than global. Google evaluates the
 * `region` key on a `consent default` command against its own geo lookup, so
 * this needs no IP header on our side — which matters, because reading one
 * would opt every page out of static generation.
 */

/** Consent categories Google reads. All seven must be declared. */
export const CONSENT_SIGNALS = [
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
  "analytics_storage",
  "functionality_storage",
  "personalization_storage",
  "security_storage",
] as const

export type ConsentSignal = (typeof CONSENT_SIGNALS)[number]

export type ConsentDecision = "granted" | "denied"

/** What the visitor actually chooses between. */
export type ConsentChoice = {
  /** GA4 — audience measurement. */
  analytics: ConsentDecision
  /** Google Ads conversion tracking + Enhanced Conversions. */
  marketing: ConsentDecision
}

/**
 * EEA + UK + Switzerland, ISO 3166-1 alpha-2.
 *
 * EU27 plus the three EEA states (IS, LI, NO), plus GB and CH which are
 * outside the EEA but run equivalent regimes (UK GDPR / revFADP). Google's
 * own EU User Consent Policy covers this same set.
 */
export const CONSENT_STRICT_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  "IS", "LI", "NO",
  "GB", "CH",
] as const

/**
 * First-party cookie holding the visitor's decision. Read by the inline
 * bootstrap before GTM loads, so it must be a cookie rather than
 * localStorage — the bootstrap runs during parse, and localStorage reads
 * there are both slower and blocked in some privacy modes.
 */
export const CONSENT_COOKIE = "zitrone_consent"

/** Six months. Long enough not to nag, short enough to re-ask on policy change. */
export const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 182

/**
 * Bumped when the categories or their meaning change. A stored choice with a
 * different version is treated as absent, so the banner re-asks rather than
 * silently carrying an old decision onto a new policy.
 */
export const CONSENT_VERSION = 1

export type StoredConsent = ConsentChoice & { v: number }

export const CONSENT_ACCEPT_ALL: ConsentChoice = {
  analytics: "granted",
  marketing: "granted",
}

export const CONSENT_REJECT_ALL: ConsentChoice = {
  analytics: "denied",
  marketing: "denied",
}

/** Event the footer link dispatches to reopen the banner after a choice. */
export const CONSENT_REOPEN_EVENT = "zitrone:consent-reopen"

/**
 * Maps a visitor's two-category choice onto the seven signals Google reads.
 *
 * `security_storage` is never gated: it covers anti-fraud and authentication
 * state, which is strictly necessary and outside consent under both GDPR and
 * the LFPDPPP.
 */
export function toConsentState(choice: ConsentChoice): Record<ConsentSignal, ConsentDecision> {
  return {
    ad_storage: choice.marketing,
    ad_user_data: choice.marketing,
    ad_personalization: choice.marketing,
    analytics_storage: choice.analytics,
    functionality_storage: choice.analytics,
    personalization_storage: choice.marketing,
    security_storage: "granted",
  }
}

export function parseStoredConsent(raw: string | undefined | null): ConsentChoice | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<StoredConsent>

    if (parsed.v !== CONSENT_VERSION) return null
    if (parsed.analytics !== "granted" && parsed.analytics !== "denied") return null
    if (parsed.marketing !== "granted" && parsed.marketing !== "denied") return null

    return { analytics: parsed.analytics, marketing: parsed.marketing }
  } catch {
    return null
  }
}
