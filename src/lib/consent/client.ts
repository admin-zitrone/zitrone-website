"use client"

import {
  CONSENT_COOKIE,
  CONSENT_COOKIE_MAX_AGE,
  CONSENT_REOPEN_EVENT,
  CONSENT_VERSION,
  parseStoredConsent,
  toConsentState,
  type ConsentChoice,
} from "./config"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    /** Set by the inline bootstrap when a stored choice was found. */
    __zitroneConsent?: ConsentChoice & { v: number }
  }
}

/**
 * The stored decision, exposed as an external store.
 *
 * The cookie is browser state that React does not own, so it is read through
 * `useSyncExternalStore` rather than copied into component state inside an
 * effect. That keeps the read out of render on the server and gives the
 * banner a single source of truth that `saveConsentChoice` can update from
 * anywhere — including the footer link, which lives in a different tree.
 */

type Listeners = Set<() => void>

const listeners: Listeners = new Set()

/** Cached so getSnapshot stays referentially stable between renders. */
let cachedRaw: string | null = null
let cachedChoice: ConsentChoice | null = null
let primed = false

function readCookie(name: string) {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? match[1] : null
}

export function subscribeConsent(onChange: () => void) {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

/**
 * `undefined` means "not known yet" — the server, and the first client render
 * before hydration. `null` means the visitor genuinely has not chosen. The
 * distinction is what stops the banner flashing for returning visitors.
 */
export function getConsentSnapshot(): ConsentChoice | null | undefined {
  const raw = readCookie(CONSENT_COOKIE)

  if (!primed || raw !== cachedRaw) {
    cachedRaw = raw
    cachedChoice = parseStoredConsent(raw)
    primed = true
  }

  return cachedChoice
}

export function getConsentServerSnapshot(): ConsentChoice | null | undefined {
  return undefined
}

function emit() {
  for (const listener of listeners) listener()
}

/**
 * Persists the choice and tells Google about it.
 *
 * The cookie is written before the gtag call so that a page navigated away
 * from mid-update still carries the decision on the next load — the tag
 * update is replayable, the visitor's answer is not.
 */
export function saveConsentChoice(choice: ConsentChoice) {
  const payload = encodeURIComponent(
    JSON.stringify({ ...choice, v: CONSENT_VERSION }),
  )
  const secure = typeof location !== "undefined" && location.protocol === "https:"

  document.cookie =
    `${CONSENT_COOKIE}=${payload}; path=/; max-age=${CONSENT_COOKIE_MAX_AGE}; ` +
    `SameSite=Lax${secure ? "; Secure" : ""}`

  try {
    window.gtag?.("consent", "update", toConsentState(choice))
  } catch {
    // A tracking failure must never break the consent UI itself.
  }

  window.__zitroneConsent = { ...choice, v: CONSENT_VERSION }
  emit()
}

/** Reopens the banner — wired to the footer's preferences link. */
export function openConsentPreferences() {
  window.dispatchEvent(new CustomEvent(CONSENT_REOPEN_EVENT))
}
