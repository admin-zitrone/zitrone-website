/**
 * When the client's GTM container is allowed to load.
 *
 * Measurement is switched on for the final production site and nothing else.
 * NODE_ENV is not a usable signal: Vercel preview builds and a local
 * `next start` both run with NODE_ENV=production, so gating on it sent preview
 * and QA visits to the live GA4 property and Google Ads account.
 *
 * Two independent conditions, both required:
 *
 *  1. Build time: VERCEL_ENV must be "production". Previews, `vercel dev` and
 *     any build outside Vercel (local, CI, Playwright) render no loader at all.
 *     GTM_MEASUREMENT=off is a kill switch for a production build.
 *  2. Run time: the page must be served from the canonical host
 *     (NEXT_PUBLIC_SITE_URL) or its www/apex twin. This covers a production
 *     deployment reached through its *.vercel.app URL, or a receiving team's
 *     temporary production project before its domain is attached.
 *
 * The dataLayer and the consent bootstrap are unaffected and always present,
 * so tests and Tag Assistant can still read every event without Google
 * receiving anything.
 */

export const GTM_CONTAINER_ID = "GTM-TSTDVS4"

export const GTM_SCRIPT_URL = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`

export type MeasurementEnv = {
  /** Vercel system variable: "production" | "preview" | "development" | undefined. */
  VERCEL_ENV?: string
  /** Optional kill switch. Only "off" is meaningful. */
  GTM_MEASUREMENT?: string
  NEXT_PUBLIC_SITE_URL?: string
}

export type MeasurementDecision =
  | { enabled: true; hosts: string[] }
  | { enabled: false; reason: "not-production" | "switched-off" | "no-site-url" }

/** The canonical host plus its www/apex twin, lower-cased. */
export function measurementHosts(siteUrl: string): string[] {
  let host: string
  try {
    host = new URL(siteUrl).hostname.toLowerCase()
  } catch {
    return []
  }
  if (!host || host === "localhost" || host === "127.0.0.1") return []
  const twin = host.startsWith("www.") ? host.slice(4) : `www.${host}`
  return [host, twin]
}

export function resolveMeasurement(env: MeasurementEnv): MeasurementDecision {
  if (env.GTM_MEASUREMENT?.trim().toLowerCase() === "off") {
    return { enabled: false, reason: "switched-off" }
  }
  if (env.VERCEL_ENV !== "production") {
    return { enabled: false, reason: "not-production" }
  }
  const hosts = measurementHosts(env.NEXT_PUBLIC_SITE_URL ?? "")
  if (hosts.length === 0) return { enabled: false, reason: "no-site-url" }
  return { enabled: true, hosts }
}

/**
 * Inline loader for gtm.js, run by next/script at `lazyOnload` (see the
 * layout for why the container is deferred). It records what it did on
 * `window.__zitroneGtm` so a support check in the console can tell a blocked
 * host from a container that never loaded.
 */
export function buildGtmLoader(hosts: string[]) {
  return (
    `(function(){var h=${JSON.stringify(hosts)};` +
    `if(h.indexOf(location.hostname.toLowerCase())<0){window.__zitroneGtm='host-not-allowed';return;}` +
    `var s=document.createElement('script');s.async=true;s.src=${JSON.stringify(GTM_SCRIPT_URL)};` +
    `document.head.appendChild(s);window.__zitroneGtm='loaded';})();`
  )
}
