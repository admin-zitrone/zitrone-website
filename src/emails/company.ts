/** Single source for company facts shared by every email footer.
 * Mirrors the site footer (home content) so both read as the same company.
 * Address = Zitrone Natural, Google Business listing (user-confirmed 2026-09-16). */
export const EMAIL_BASE_URL = "https://www.zitrone.mx" // www: the apex 307-redirects and mail image proxies drop redirected images

export const COMPANY_NAME = "Zitrone Natural"
export const COMPANY_ADDRESS = {
  es: ["Calle 3 13-1, Alce Blanco", "53370 Naucalpan de Juárez, Estado de México"],
  en: ["Calle 3 13-1, Alce Blanco", "53370 Naucalpan de Juárez, State of Mexico"],
} as const
export const COMPANY_PHONE = "+52 55 1205 4000"
export const COMPANY_EMAIL = "opina@zitrone.com.mx"
export const COMPANY_SOCIALS = [
  { icon: "instagram", label: "Instagram", href: "https://www.instagram.com/zitrone_mx/" },
  { icon: "linkedin", label: "LinkedIn", href: "https://mx.linkedin.com/company/zitrone-natural" },
  { icon: "facebook", label: "Facebook", href: "https://www.facebook.com/ZitroneMx/" },
  { icon: "x", label: "X", href: "https://twitter.com/ZitroneNatural" },
]

/** Footer base for a customer-facing email (photo/social template). */
export function customerFooterBase(locale: "es" | "en") {
  return {
    address: [...COMPANY_ADDRESS[locale]],
    contactEmail: COMPANY_EMAIL,
    phone: COMPANY_PHONE,
    socials: COMPANY_SOCIALS,
    websiteHref: EMAIL_BASE_URL,
  }
}

/** Footer base for an internal notification: same facts, no social row. */
export function internalFooterBase(locale: "es" | "en") {
  return { ...customerFooterBase(locale), socials: [] }
}
