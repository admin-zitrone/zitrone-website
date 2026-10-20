import { routing, type AppLocale } from "@/i18n/routing"
import { publicEnv } from "@/env/public"

const DEFAULT_SITE_URL = "https://www.zitrone.mx"

function normalizeSiteUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url
}

export const SITE_URL = normalizeSiteUrl(publicEnv.siteUrl || DEFAULT_SITE_URL)

export function localeAlternates(path: string) {
  return localizedAlternates(Object.fromEntries(routing.locales.map((locale) => [locale, path])))
}

/** Convert actual translated paths to metadata URLs without inventing routes. */
export function localizedAlternates(paths: Partial<Record<AppLocale, string>>) {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) {
    if (paths[locale] !== undefined) {
      languages[locale] = canonicalFor(locale, paths[locale])
    }
  }
  const defaultUrl = languages[routing.defaultLocale] ?? Object.values(languages)[0]
  if (defaultUrl) languages["x-default"] = defaultUrl
  return languages
}

export function canonicalFor(locale: string, path: string) {
  return `${SITE_URL}/${locale}${path}`
}

// og:locale expects language_TERRITORY, not the bare app locale.
export function ogLocale(locale: string) {
  return locale === "es" ? "es_MX" : "en_US"
}
