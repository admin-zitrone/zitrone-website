import type { NextConfig } from "next"

export const CANONICAL_ORIGIN = "https://www.zitrone.mx"
export const REDIRECT_HOSTS = ["zitrone.com.mx", "www.zitrone.com.mx", "zitrone.mx"] as const

export const crossLocaleSlugRedirects = [
  // ES locale reached with EN service slugs.
  { source: "/es/services/corporate-dining", destination: "/es/services/comedor-corporativo" },
  { source: "/es/services/corporate-cafe", destination: "/es/services/cafeteria-corporativa" },
  { source: "/es/services/pantry-restocking", destination: "/es/services/pantry-y-restocking" },
  { source: "/es/services/coffee-water", destination: "/es/services/cafe-y-agua" },
  { source: "/es/services/corporate-catering", destination: "/es/services/catering-corporativo" },
  { source: "/es/services/service-carts", destination: "/es/services/carritos-de-servicio" },
  // EN locale reached with ES service slugs.
  { source: "/en/services/comedor-corporativo", destination: "/en/services/corporate-dining" },
  { source: "/en/services/cafeteria-corporativa", destination: "/en/services/corporate-cafe" },
  { source: "/en/services/pantry-y-restocking", destination: "/en/services/pantry-restocking" },
  { source: "/en/services/cafe-y-agua", destination: "/en/services/coffee-water" },
  { source: "/en/services/catering-corporativo", destination: "/en/services/corporate-catering" },
  { source: "/en/services/carritos-de-servicio", destination: "/en/services/service-carts" },
  // EN locale reached with ES blog slugs (blog slugs are localized since 2026-09-24).
  { source: "/en/blog/comida-en-la-oficina-y-retencion-de-talento", destination: "/en/blog/office-food-employee-retention" },
  { source: "/en/blog/caida-de-las-3pm-pantry-de-oficina", destination: "/en/blog/afternoon-slump-office-pantry" },
  { source: "/en/blog/como-construir-un-programa-de-alimentacion-corporativa", destination: "/en/blog/workplace-food-program-that-works" },
  // Blog author/reviewer profile slugs.
  { source: "/es/blog/authors/zitrone-operations-team", destination: "/es/blog/authors/equipo-de-operaciones-zitrone" },
  { source: "/en/blog/authors/equipo-de-operaciones-zitrone", destination: "/en/blog/authors/zitrone-operations-team" },
  { source: "/es/blog/reviewers/zitrone-food-safety-and-operations", destination: "/es/blog/reviewers/seguridad-alimentaria-y-operaciones-zitrone" },
  { source: "/en/blog/reviewers/seguridad-alimentaria-y-operaciones-zitrone", destination: "/en/blog/reviewers/zitrone-food-safety-and-operations" },
].map((redirect) => ({ ...redirect, permanent: false }))

const serviceFor = {
  dining: { es: "/es/services/comedor-corporativo", en: "/en/services/corporate-dining" },
  pantry: { es: "/es/services/pantry-y-restocking", en: "/en/services/pantry-restocking" },
  coffee: { es: "/es/services/cafe-y-agua", en: "/en/services/coffee-water" },
  catering: { es: "/es/services/catering-corporativo", en: "/en/services/corporate-catering" },
  all: { es: "/es/services", en: "/en/services" },
} as const

// The nine placeholder articles removed 2026-09-24 were live and in the
// sitemap. Each goes to the page closest to its topic (never a blanket
// /blog redirect, which search engines treat as a soft 404).
const removedBlogPosts: [slug: string, target: keyof typeof serviceFor][] = [
  ["daily-dining-without-vendor-juggling", "dining"],
  ["menus-people-actually-choose", "dining"],
  ["hybrid-work-office-meals", "dining"],
  ["pantry-restocking-without-side-job", "pantry"],
  ["great-coffee-service-workday", "coffee"],
  ["corporate-catering-service-flow", "catering"],
  ["food-safety-commissary-to-table", "all"],
  ["operational-accountability-real-benefit", "all"],
  ["scale-service-first-meal-to-enterprise", "all"],
]

// URLs that moved or were retired for good: permanent, one hop.
export const movedContentRedirects = [
  // Carts shared one "grab-and-go" slug in both locales until 2026-09-24.
  { source: "/es/services/grab-and-go", destination: "/es/services/carritos-de-servicio" },
  { source: "/en/services/grab-and-go", destination: "/en/services/service-carts" },
  // ES articles used the EN slug until they got Spanish URLs.
  { source: "/es/blog/office-food-employee-retention", destination: "/es/blog/comida-en-la-oficina-y-retencion-de-talento" },
  { source: "/es/blog/afternoon-slump-office-pantry", destination: "/es/blog/caida-de-las-3pm-pantry-de-oficina" },
  { source: "/es/blog/workplace-food-program-that-works", destination: "/es/blog/como-construir-un-programa-de-alimentacion-corporativa" },
  // The billing form never went live; invoices are requested by email from
  // the footer link, so the old sitemap URL goes to the locale home.
  { source: "/es/billing", destination: "/es" },
  { source: "/en/billing", destination: "/en" },
  ...removedBlogPosts.flatMap(([slug, target]) =>
    (["es", "en"] as const).map((locale) => ({
      source: `/${locale}/blog/${slug}`,
      destination: serviceFor[target][locale],
    })),
  ),
].map((redirect) => ({ ...redirect, permanent: true }))

// Known legacy paths. Broad unknown-service redirects are deliberately absent:
// unknown URLs must remain missing rather than become misleading soft 404s.
// Consolidated home and integrity destinations still require content sign-off.
export const legacyDomainRedirects = [
  // ES service pages (legacy base was /es/servicios/).
  { source: "/es/servicios/comedores-corporativos-industriales", destination: "/es/services/comedor-corporativo" },
  { source: "/es/servicios/cafeteria", destination: "/es/services/cafeteria-corporativa" },
  { source: "/es/servicios/pantry", destination: "/es/services/pantry-y-restocking" },
  { source: "/es/servicios/catering", destination: "/es/services/catering-corporativo" },
  { source: "/es/servicios/carritos", destination: "/es/services/carritos-de-servicio" },
  { source: "/es/servicios", destination: "/es/services" },
  // EN service pages (same /en/services/ base, retired slugs).
  { source: "/en/services/corporate-industrial-canteens", destination: "/en/services/corporate-dining" },
  { source: "/en/services/coffee-shop", destination: "/en/services/corporate-cafe" },
  { source: "/en/services/pantry", destination: "/en/services/pantry-restocking" },
  { source: "/en/services/catering", destination: "/en/services/corporate-catering" },
  { source: "/en/services/food-carts", destination: "/en/services" },
  // Legacy pages with no standalone equivalent -> locale home.
  { source: "/es/nosotros", destination: "/es" },
  { source: "/es/clientes", destination: "/es" },
  { source: "/es/contacto", destination: "/es/contact" },
  { source: "/es/diferenciadores", destination: "/es" },
  { source: "/es/politica-de-integridad", destination: "/es" },
  { source: "/en/about", destination: "/en" },
  { source: "/en/clients", destination: "/en" },
  { source: "/en/differentiators", destination: "/en" },
  { source: "/en/integrity-policy", destination: "/en" },
  // Legacy privacy pages.
  { source: "/es/aviso-de-privacidad", destination: "/es/privacy-notice" },
  { source: "/en/privacy", destination: "/en/privacy-notice" },
  // Unprefixed template routes the legacy build served publicly (HTTP 200).
  { source: "/_global/about", destination: "/es" },
  { source: "/_global/clients", destination: "/es" },
  { source: "/_global/contact", destination: "/es/contact" },
  { source: "/_global/differentiators", destination: "/es" },
  { source: "/_global/integrity", destination: "/es" },
  { source: "/_global/privacy", destination: "/es/privacy-notice" },
  { source: "/_global/service", destination: "/es/services" },
].map((redirect) => ({ ...redirect, permanent: true }))

// Vercel must route these hostnames to this project before these rules apply.
// Platform-level domain redirects run earlier and must not bypass this map.
// No wildcard hosts: mail/app/other subdomains are outside this migration.
export function buildDomainRedirects(): Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>> {
  const pathRedirects = [...crossLocaleSlugRedirects, ...movedContentRedirects, ...legacyDomainRedirects]
  return [
    ...REDIRECT_HOSTS.flatMap((host) => {
      const has = [{ type: "host" as const, value: host.replaceAll(".", "\\.") }]
      return [
        ...pathRedirects.map(({ source, destination }) => ({
          source, destination: `${CANONICAL_ORIGIN}${destination}`, permanent: true, has,
        })),
        { source: "/", destination: `${CANONICAL_ORIGIN}/es`, permanent: true, has },
        { source: "/:path+", destination: `${CANONICAL_ORIGIN}/:path+`, permanent: true, has },
      ]
    }),
    ...pathRedirects,
  ]
}
