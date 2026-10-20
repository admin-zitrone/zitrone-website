/**
 * Where a lead came from.
 *
 * Three different questions, answered by three different mechanisms:
 *
 *  - Which CTA did they click?  Recorded at click time by <CtaTracker/>, which
 *    knows the section the control sits in. An internal `?src=` slug is the
 *    fallback for a click the tracker never saw (a link opened in a new tab).
 *    Internal links must NOT carry utm_* — analytics treats a utm on an
 *    internal click as a brand new session from a new source, which destroys
 *    the very attribution we are trying to collect.
 *  - How did this visit start?  The real utm_*, ad click id and external
 *    referrer on the landing URL. Captured once on the first page of the
 *    visit, because by the time someone reaches the form they are several
 *    clicks past the page that carried them.
 *  - How did they first find us?  The same record from their first visit,
 *    kept 90 days. B2B buyers rarely convert on the visit an ad paid for;
 *    without this, a lead that came back "direct" a week later erases the ad.
 *
 * All of it is best effort: blocked storage returns empty values and the form
 * still submits. A lead without attribution is a worse lead, not a lost one.
 */

import {
  LEAD_FORMS,
  pageTypeFor,
  type CtaTarget,
  type LeadForm,
} from "@/lib/analytics/cta"
import { CONSENT_COOKIE, parseStoredConsent } from "@/lib/consent/config"

/** The GA4 property the client's GTM container sends to. */
export const GA4_MEASUREMENT_ID = "G-E48BCCXZEC"

/** Ad-platform click ids, in priority order. The first one present wins. */
const CLICK_ID_PARAMS = ["gclid", "gbraid", "wbraid", "msclkid", "fbclid", "li_fat_id", "ttclid"] as const

export type Attribution = {
  /** Id of the CTA that sent them to this form, e.g. "nav" or "home-faq". */
  source: string
  /** Block of the page that CTA sat in, e.g. "hero", "nav-mobile", "faq". */
  ctaSection: string
  /** The CTA's visible label, for humans reading the lead. */
  ctaText: string
  /** The page that CTA was clicked on. The navbar and footer appear on every
      page, so the id alone cannot say which page converted. */
  fromPath: string
  /** Where this visit started, e.g. "/es/services/comedor-corporativo". */
  landingPath: string
  /** External referrer host + path, empty for direct and internal. */
  referrer: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmTerm: string
  utmContent: string
  /** "gclid:Cj0K…" — lets a qualified lead be uploaded back to the ad platform. */
  clickId: string
  /** One readable line: channel · campaign · landing · date of the first visit. */
  firstTouch: string
  /** GA4 ids, so a lead in the CMS can be joined to its GA4 journey. */
  gaClientId: string
  gaSessionId: string
}

export type CtaTouch = {
  id: string
  section: string
  text: string
  pageType: string
  path: string
  target: CtaTarget
  at: number
}

type VisitTouch = {
  landingPath: string
  referrer: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmTerm: string
  utmContent: string
  clickId: string
  at: number
}

const VISIT_KEY = "zitrone:attribution"
const CTA_KEY = "zitrone:cta"
const FIRST_TOUCH_KEY = "zitrone:first-touch"
const FIRST_TOUCH_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000
/* Client-side navigation leaves document.referrer untouched, so the page a CTA
   was clicked on has to be remembered as we go rather than read afterwards. */
const LAST_PATH_KEY = "zitrone:lastpath"

export const EMPTY_ATTRIBUTION: Attribution = {
  source: "",
  ctaSection: "",
  ctaText: "",
  fromPath: "",
  landingPath: "",
  referrer: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: "",
  clickId: "",
  firstTouch: "",
  gaClientId: "",
  gaSessionId: "",
}

/* ── Storage, never throwing ─────────────────────────────────── */

type Store = "session" | "local"

const storage = (store: Store) =>
  store === "session" ? window.sessionStorage : window.localStorage

function readJson<T>(store: Store, key: string): Partial<T> {
  try {
    const raw = storage(store).getItem(key)
    return raw ? (JSON.parse(raw) as Partial<T>) : {}
  } catch {
    /* Private windows and blocked storage: attribution is a nice-to-have,
       never a reason for the form to stop working. */
    return {}
  }
}

function writeJson(store: Store, key: string, value: unknown) {
  try {
    storage(store).setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

function readCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? match[1] : ""
}

/** An explicit "no" to analytics also means no 90-day first-touch record. */
function analyticsDenied() {
  return parseStoredConsent(readCookie(CONSENT_COOKIE))?.analytics === "denied"
}

/* ── Reading the landing URL ─────────────────────────────────── */

/** Same-origin referrers are internal navigation, not a traffic source. */
function externalReferrer() {
  const raw = document.referrer
  if (!raw) return ""
  try {
    const url = new URL(raw)
    if (url.host === window.location.host) return ""
    return `${url.host}${url.pathname}`.slice(0, 300)
  } catch {
    return ""
  }
}

function clickIdFrom(params: URLSearchParams) {
  for (const key of CLICK_ID_PARAMS) {
    const value = params.get(key)
    if (value) return `${key}:${value}`.slice(0, 200)
  }
  return ""
}

function visitFromUrl(): VisitTouch {
  const params = new URLSearchParams(window.location.search)
  const utm = (key: string) => (params.get(key) ?? "").slice(0, 120)
  return {
    landingPath: window.location.pathname.slice(0, 512),
    referrer: externalReferrer(),
    utmSource: utm("utm_source"),
    utmMedium: utm("utm_medium"),
    utmCampaign: utm("utm_campaign"),
    utmTerm: utm("utm_term"),
    utmContent: utm("utm_content"),
    clickId: clickIdFrom(params),
    at: Date.now(),
  }
}

/** A landing URL that says where the visitor came from. */
const carriesSource = (touch: VisitTouch) =>
  Boolean(touch.utmSource || touch.clickId || touch.referrer)

/* ── Channel, shared with the server (email, sheet) ──────────── */

const SEARCH_ENGINES = /(^|\.)(google|bing|yahoo|duckduckgo|ecosia|yandex|baidu)\./

/**
 * GA4-style "source / medium" for a visit, so the lead record and GA4 speak
 * the same language. Explicit utm wins, then ad click ids, then the referrer.
 */
export function channelOf(
  touch: Partial<Record<"utmSource" | "utmMedium" | "clickId" | "referrer", string | null>>,
) {
  if (touch.utmSource) return `${touch.utmSource} / ${touch.utmMedium || "(not set)"}`
  const clickKey = (touch.clickId ?? "").split(":")[0]
  if (clickKey === "gclid" || clickKey === "gbraid" || clickKey === "wbraid") return "google / cpc"
  if (clickKey === "msclkid") return "bing / cpc"
  if (clickKey === "li_fat_id") return "linkedin / cpc"
  if (clickKey === "ttclid") return "tiktok / cpc"
  if (clickKey === "fbclid") return "facebook / social"
  if (touch.referrer) {
    const host = touch.referrer.split("/")[0].replace(/^www\./, "")
    if (SEARCH_ENGINES.test(`.${host}`)) return `${host.split(".")[0]} / organic`
    return `${host} / referral`
  }
  return "(direct) / (none)"
}

function describeFirstTouch(touch: Partial<VisitTouch>) {
  if (!touch.landingPath || !touch.at) return ""
  const parts = [
    channelOf(touch),
    touch.utmCampaign,
    touch.landingPath,
    new Date(touch.at).toISOString().slice(0, 10),
  ]
  return parts.filter(Boolean).join(" · ").slice(0, 300)
}

/* ── GA4 ids, read from its own cookies ──────────────────────── */

/** `_ga` = "GA1.1.<random>.<timestamp>"; the client id is the last two parts. */
export function parseGaClientId(raw: string) {
  const parts = raw.split(".")
  return parts.length >= 4 ? `${parts[parts.length - 2]}.${parts[parts.length - 1]}` : ""
}

/** `_ga_<id>` = "GS1.1.<session>.…" or, since 2025, "GS2.1.s<session>$o…". */
export function parseGaSessionId(raw: string) {
  const modern = raw.match(/^GS2\.\d+\.s(\d+)/)
  if (modern) return modern[1]
  const legacy = raw.split(".")
  return legacy[0] === "GS1" && legacy[2] && /^\d+$/.test(legacy[2]) ? legacy[2] : ""
}

function gaIds() {
  try {
    return {
      gaClientId: parseGaClientId(decodeURIComponent(readCookie("_ga"))),
      gaSessionId: parseGaSessionId(
        decodeURIComponent(readCookie(`_ga_${GA4_MEASUREMENT_ID.replace(/^G-/, "")}`)),
      ),
    }
  } catch {
    return { gaClientId: "", gaSessionId: "" }
  }
}

/* ── Paths ───────────────────────────────────────────────────── */

const previousPath = () => {
  try {
    return window.sessionStorage.getItem(LAST_PATH_KEY) ?? ""
  } catch {
    return ""
  }
}

const rememberPath = () => {
  try {
    window.sessionStorage.setItem(LAST_PATH_KEY, window.location.pathname.slice(0, 512))
  } catch {
    /* ignore */
  }
}

/** The page they clicked from on a full page load, when that page was ours. */
const internalReferrerPath = () => {
  const raw = document.referrer
  if (!raw) return ""
  try {
    const url = new URL(raw)
    return url.host === window.location.host ? url.pathname.slice(0, 512) : ""
  } catch {
    return ""
  }
}

/* ── Public API ──────────────────────────────────────────────── */

/**
 * Called by <CtaTracker/> for clicks that lead to a lead form. Only those are
 * kept: a later "Ver servicios" click must not erase the "Hablemos" that
 * actually expressed the intent.
 */
export function recordCtaTouch(touch: CtaTouch) {
  if (typeof window === "undefined") return
  writeJson("session", CTA_KEY, touch)
}

/**
 * Run on every page load. The first load of a visit records how the visit
 * began; later loads never overwrite it, so a mid-visit page view cannot
 * replace the original source.
 */
export function captureAttribution() {
  if (typeof window === "undefined") return
  const stored = readJson<VisitTouch>("session", VISIT_KEY)
  const current = visitFromUrl()

  const firstPageOfVisit = !stored.landingPath
  if (firstPageOfVisit) writeJson("session", VISIT_KEY, current)

  if (analyticsDenied()) {
    try {
      window.localStorage.removeItem(FIRST_TOUCH_KEY)
    } catch {
      /* ignore */
    }
  } else if (firstPageOfVisit) {
    const first = readJson<VisitTouch>("local", FIRST_TOUCH_KEY)
    const expired = !first.at || Date.now() - first.at > FIRST_TOUCH_MAX_AGE_MS
    /* A new visit only replaces an expired first touch — or a "direct" one,
       once a later visit finally says where they came from. */
    if (expired || (!carriesSource(first as VisitTouch) && carriesSource(current))) {
      writeJson("local", FIRST_TOUCH_KEY, current)
    }
  }

  /* Fallback for a CTA the tracker never saw: a link opened in a new tab
     starts a fresh session with only the `?src=` on the URL. */
  const src = new URLSearchParams(window.location.search).get("src")
  if (src) {
    const last = readJson<CtaTouch>("session", CTA_KEY)
    if (last.id !== src.slice(0, 64)) {
      const fromPath = previousPath() || internalReferrerPath()
      recordCtaTouch({
        id: src.slice(0, 64),
        section: "",
        text: "",
        pageType: fromPath ? pageTypeFor(fromPath) : "",
        path: fromPath,
        target: pageTypeFor(window.location.pathname) === "contact" ? "contact" : "internal",
        at: Date.now(),
      })
    }
  }

  rememberPath()
}

/**
 * Everything known about where this lead came from, for the given form.
 *
 * The CTA fields are only filled when the last CTA clicked led to THIS form.
 * Someone who clicked "Hablemos" in the navbar, came back to the home and
 * then filled the profiler did not submit the profiler because of the navbar.
 */
export function readAttribution(form: LeadForm): Attribution {
  if (typeof window === "undefined") return EMPTY_ATTRIBUTION
  const visit = readJson<VisitTouch>("session", VISIT_KEY)
  const cta = readJson<CtaTouch>("session", CTA_KEY)
  const first = analyticsDenied() ? {} : readJson<VisitTouch>("local", FIRST_TOUCH_KEY)
  const ctaMatches = LEAD_FORMS.includes(form) && cta.target === form

  return {
    ...EMPTY_ATTRIBUTION,
    source: ctaMatches ? cta.id ?? "" : "",
    ctaSection: ctaMatches ? cta.section ?? "" : "",
    ctaText: ctaMatches ? cta.text ?? "" : "",
    fromPath: ctaMatches ? cta.path ?? "" : "",
    landingPath: visit.landingPath ?? "",
    referrer: visit.referrer ?? "",
    utmSource: visit.utmSource ?? "",
    utmMedium: visit.utmMedium ?? "",
    utmCampaign: visit.utmCampaign ?? "",
    utmTerm: visit.utmTerm ?? "",
    utmContent: visit.utmContent ?? "",
    clickId: visit.clickId || first.clickId || "",
    firstTouch: describeFirstTouch(first),
    ...gaIds(),
  }
}
