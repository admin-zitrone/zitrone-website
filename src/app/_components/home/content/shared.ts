import type { HeroLogo } from "./types"

export const assetPath = ""
export const contactMailto = "mailto:opina@zitrone.com.mx"

/**
 * A CTA that lands on the contact form, tagged with the call to action that
 * sent it. The slug is read back on submit and stored with the lead, which is
 * how "which page converts" gets answered.
 *
 * Deliberately NOT utm_*: analytics reads a utm on an internal click as a new
 * session from a new source, which would erase the original traffic source.
 */
export const contactHref = (src: string) => `/contact?src=${src}`

export const homeAssetPaths = {
  // Client testimonial portraits — migrated to the asset manifest in Phase 2.
  testimonialPhotos: `${assetPath}/img/site/testimonials`,
} as const

const heroLogoDefinitions = [
  {
    id: "amex",
    path: "/img/shared/clients/wide/american-express.svg",
    alt: "American Express",
    fit: "wide",
  },
  {
    id: "uber",
    path: "/img/shared/clients/uber.svg",
    alt: "Uber",
    fit: "wide",
  },
  {
    id: "doordash",
    path: "/img/shared/clients/wide/doordash.svg",
    alt: "DoorDash",
    fit: "wide",
  },
  {
    id: "amazon",
    path: "/img/shared/clients/amazon.svg",
    alt: "Amazon",
    fit: "wide",
  },
  {
    id: "chobani",
    path: "/img/shared/clients/chobani.svg",
    alt: "Chobani",
    fit: "wide",
  },
  {
    id: "stripe",
    path: "/img/shared/clients/stripe.svg",
    alt: "Stripe",
    fit: "wide",
  },
  {
    id: "mercado-libre",
    path: "/img/shared/clients/mercado-libre-color.svg",
    monoPath: "/img/shared/clients/mono/mercado-libre.svg",
    alt: "Mercado Libre",
    fit: "wide",
  },
  {
    id: "att",
    path: "/img/shared/clients/wide/att.svg",
    alt: "AT&T",
    fit: "balanced",
  },
  {
    id: "ford",
    path: "/img/shared/clients/ford.svg",
    alt: "Ford",
    fit: "balanced",
  },
  {
    id: "pinterest",
    path: "/img/shared/clients/wide/pinterest.svg",
    monoPath: "/img/shared/clients/mono/pinterest-wide.svg",
    alt: "Pinterest",
    fit: "wide",
  },
  {
    id: "pg",
    path: "/img/shared/clients/pg.svg",
    monoPath: "/img/shared/clients/mono/pg.svg",
    alt: "P&G",
    fit: "balanced",
  },
  {
    id: "crunchyroll",
    path: "/img/shared/clients/crunchyroll.svg",
    alt: "Crunchyroll",
    fit: "wide",
  },
  {
    id: "nike",
    path: "/img/shared/clients/nike.svg",
    alt: "Nike",
    fit: "wide",
  },
  {
    id: "disney",
    path: "/img/shared/clients/wide/disney.svg",
    alt: "Disney",
    fit: "wide",
  },
  {
    id: "coca-cola",
    path: "/img/shared/clients/wide/coca-cola.svg",
    alt: "Coca-Cola",
    fit: "wide",
  },
  {
    id: "paypal",
    path: "/img/shared/clients/paypal.svg",
    monoPath: "/img/shared/clients/mono/paypal.svg",
    alt: "PayPal",
    fit: "wide",
  },
  {
    /* Retired at the client's request. Kept here (with its artwork) so the
       entry can be reactivated by deleting this flag. */
    id: "chanel",
    path: "/img/shared/clients/chanel.svg",
    alt: "Chanel",
    fit: "wide",
    active: false,
  },
  {
    id: "henkel",
    path: "/img/shared/clients/henkel.svg",
    monoPath: "/img/shared/clients/mono/henkel.svg",
    alt: "Henkel",
    fit: "balanced",
  },
  {
    id: "galderma",
    path: "/img/shared/clients/galderma.svg",
    alt: "Galderma",
    fit: "wide",
  },
  {
    id: "hilton",
    path: "/img/shared/clients/hilton.svg",
    alt: "Hilton",
    fit: "balanced",
  },
  {
    /* No longer a client. Kept here (with its artwork) so the entry can be
       reactivated by deleting this flag if the account ever comes back. */
    id: "odoo",
    path: "/img/shared/clients/odoo.svg",
    alt: "Odoo",
    fit: "balanced",
    active: false,
  },
  {
    id: "santander",
    path: "/img/shared/clients/wide/santander.svg",
    monoPath: "/img/shared/clients/mono/santander.svg",
    alt: "Santander",
    fit: "wide",
  },
  {
    id: "ufc",
    path: "/img/shared/clients/ufc.svg",
    alt: "UFC",
    fit: "compact",
  },
  {
    id: "salesforce",
    path: "/img/shared/clients/mono/salesforce-lockup.svg",
    alt: "Salesforce",
    fit: "balanced",
  },
  {
    /* Pending contract. Hidden until signed: delete the flag to publish it. */
    id: "bacardi",
    path: "/img/shared/clients/bacardi.svg",
    alt: "Bacardí",
    fit: "wide",
    active: false,
  },
  {
    /* Pending contract. Hidden until signed: delete the flag to publish it. */
    id: "jose-cuervo",
    path: "/img/shared/clients/jose-cuervo.svg",
    alt: "Jose Cuervo",
    fit: "wide",
    active: false,
  },
] as const satisfies ReadonlyArray<{
  id: string
  path: string
  monoPath?: string
  alt: string
  fit: HeroLogo["fit"]
  /* Omitted means active. Set to false to retire a logo from every surface
     (hero marquee, proof ribbon, service pages) without losing its definition. */
  active?: boolean
}>

export function createHeroLogos(): HeroLogo[] {
  return heroLogoDefinitions
    .filter((logo) => !("active" in logo) || logo.active !== false)
    .map((logo) => ({
      id: logo.id,
      src: `${assetPath}${logo.path}`,
      monoSrc:
        "monoPath" in logo && logo.monoPath
          ? `${assetPath}${logo.monoPath}`
          : undefined,
      alt: logo.alt,
      fit: logo.fit,
    }))
}
