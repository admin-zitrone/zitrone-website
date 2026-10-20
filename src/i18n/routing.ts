import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
  // Metadata and sitemap resolve translated CMS slugs. Middleware only knows
  // the locale prefix and would emit conflicting hreflang Link headers.
  alternateLinks: false,
})

export type AppLocale = (typeof routing.locales)[number]
