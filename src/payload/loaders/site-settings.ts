import { cache } from "react"

import { getHomeContent } from "@/app/_components/home/home-data"
import type {
  Cta,
  FooterColumn,
  FooterSocialLink,
  NavItem,
} from "@/app/_components/home/content/types"
import type { Footer, Header, SiteSetting } from "@/payload/payload-types"

import { getPayloadClient } from "./client"
import {
  cleanString,
  isSupportedLocale,
  mapAddressLines,
  mapFooterColumns,
  mapFooterContactLinks,
  mapFooterSocialLinks,
  mapPayloadCta,
  mapPayloadLink,
  resolveMediaUrl,
  withTimeout,
} from "./shared"

type Locale = "en" | "es"

export type ResolvedSiteSettings = {
  locale: Locale
  siteName?: string
  defaultSeo?: {
    title?: string
    description?: string
    ogImage?: string
  }
  primaryNav?: NavItem[]
  primaryCta?: Cta
  footerAriaLabel?: string
  footerTagline?: string
  footerTaglineEmphasis?: string
  contactLabel?: string
  socialsLabel?: string
  footerCopyright?: string
  footerCtas?: Cta[]
  footerColumns?: FooterColumn[]
  contactAddress?: string[]
  contactLinks?: NavItem[]
  socialLinks?: FooterSocialLink[]
  legalLinks?: NavItem[]
  organization?: {
    legalName?: string
    description?: string
    phone?: string
    email?: string
  }
}

function compactItems<T>(items: Array<T | undefined>) {
  return items.filter((item): item is T => item !== undefined)
}

function buildStaticFallback(locale: Locale): ResolvedSiteSettings {
  const base = getHomeContent(locale)
  const emailLink = base.sections.footer.contactLinks.find((link) => link.href.startsWith("mailto:"))
  const phoneLink = base.sections.footer.contactLinks.find((link) => link.href.startsWith("tel:"))

  return {
    locale,
    siteName: base.meta.siteName,
    defaultSeo: {
      title: base.meta.title,
      description: base.meta.description,
      ogImage: base.meta.ogImage,
    },
    primaryNav: base.primaryNav,
    primaryCta: base.sections.hero.cta,
    footerAriaLabel: base.sections.footer.ariaLabel,
    footerTagline: base.sections.footer.tagline,
    footerTaglineEmphasis: base.sections.footer.taglineEmphasis,
    contactLabel: base.sections.footer.contactLabel,
    socialsLabel: base.sections.footer.socialsLabel,
    footerCopyright: base.sections.footer.legal.copyright,
    footerCtas: [base.sections.footer.ctaPrimary, base.sections.footer.ctaSecondary],
    footerColumns: base.footerColumns,
    contactAddress: base.sections.footer.address,
    contactLinks: base.sections.footer.contactLinks,
    socialLinks: base.sections.footer.socialLinks,
    legalLinks: base.sections.footer.legal.links,
    organization: {
      legalName: base.meta.siteName,
      description: base.meta.description,
      phone: phoneLink?.href.replace(/^tel:/, ""),
      email: emailLink?.href.replace(/^mailto:/, ""),
    },
  }
}

function mapHeaderNav(header: Header | null | undefined) {
  return compactItems((header?.primaryNav ?? []).map((item) => mapPayloadLink(item.link)))
}

function mapFooterLegalLinks(footer: Footer | null | undefined) {
  return compactItems((footer?.legal?.links ?? []).map((item) => mapPayloadLink(item.link)))
}

function mapFooterCtas(footer: Footer | null | undefined, fallback: Cta[]) {
  const mapped = compactItems([
    mapPayloadCta(footer?.ctaPrimary),
    mapPayloadCta(footer?.ctaSecondary),
  ])

  return mapped.length > 0 ? mapped : fallback
}

export const getResolvedSiteSettings = cache(
  async (locale: string): Promise<ResolvedSiteSettings> => {
    const safeLocale: Locale = isSupportedLocale(locale) ? locale : "es"
    const fallback = buildStaticFallback(safeLocale)
    const loaderTimeoutMs = 4000

    try {
      const payload = await withTimeout(
        getPayloadClient(),
        loaderTimeoutMs,
        "Payload client",
      )
      const [settings, header, footer] = await withTimeout(
        Promise.all([
          payload.findGlobal({
            slug: "siteSettings",
            locale: safeLocale,
            fallbackLocale: "es",
          }) as Promise<SiteSetting>,
          payload.findGlobal({
            slug: "header",
            locale: safeLocale,
            fallbackLocale: "es",
          }) as Promise<Header>,
          payload.findGlobal({
            slug: "footer",
            locale: safeLocale,
            fallbackLocale: "es",
          }) as Promise<Footer>,
        ]),
        loaderTimeoutMs,
        "Payload site settings query",
      )

      const primaryNav = mapHeaderNav(header)
      const footerColumns = mapFooterColumns(footer?.columns)
      const contactAddress = mapAddressLines(footer?.contact?.address) ?? []
      const fallbackContactAddress = mapAddressLines(settings?.contacts?.address) ?? []
      const contactLinks = mapFooterContactLinks(footer, settings)
      const legalLinks = mapFooterLegalLinks(footer)
      const socialLinks = mapFooterSocialLinks(footer?.socialLinks)
      const footerCtas = mapFooterCtas(footer, fallback.footerCtas ?? [])

      return {
        locale: safeLocale,
        siteName: cleanString(settings?.brand?.name) ?? fallback.siteName,
        defaultSeo: {
          title: fallback.defaultSeo?.title,
          description:
            cleanString(settings?.brand?.tagline) ??
            fallback.defaultSeo?.description,
          ogImage:
            resolveMediaUrl(settings?.brand?.defaultOgImage) ??
            fallback.defaultSeo?.ogImage,
        },
        primaryNav: primaryNav.length > 0 ? primaryNav : fallback.primaryNav,
        primaryCta: mapPayloadCta(header?.primaryCta) ?? fallback.primaryCta,
        footerAriaLabel: cleanString(footer?.ariaLabel) ?? fallback.footerAriaLabel,
        footerTagline:
          cleanString(footer?.tagline) ??
          cleanString(settings?.brand?.tagline) ??
          fallback.footerTagline,
        footerTaglineEmphasis: cleanString(footer?.taglineEmphasis),
        contactLabel: cleanString(footer?.contact?.label) ?? fallback.contactLabel,
        socialsLabel: cleanString(footer?.socialsLabel) ?? fallback.socialsLabel,
        footerCopyright:
          cleanString(footer?.legal?.copyright) ?? fallback.footerCopyright,
        footerCtas,
        footerColumns: footerColumns.length > 0 ? footerColumns : fallback.footerColumns,
        contactAddress:
          contactAddress.length > 0
            ? contactAddress
            : fallbackContactAddress.length > 0
              ? fallbackContactAddress
              : fallback.contactAddress,
        contactLinks: contactLinks.length > 0 ? contactLinks : fallback.contactLinks,
        socialLinks: socialLinks.length > 0 ? socialLinks : fallback.socialLinks,
        legalLinks: legalLinks.length > 0 ? legalLinks : fallback.legalLinks,
        organization: {
          legalName:
            cleanString(settings?.legal?.entityName) ??
            fallback.organization?.legalName,
          description:
            cleanString(settings?.brand?.tagline) ??
            fallback.organization?.description,
          phone:
            cleanString(settings?.contacts?.phone) ??
            fallback.organization?.phone,
          email:
            cleanString(settings?.contacts?.primaryEmail) ??
            fallback.organization?.email,
        },
      }
    } catch (error) {
      console.warn("[payload/site-settings] falling back to static site settings:", error)
      return fallback
    }
  },
)
