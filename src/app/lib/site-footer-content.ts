import type { HomeContent } from "@/app/_components/home/content/types"
import { resolveLocalizedSiteHref } from "@/lib/links"

/**
 * Footer content with every href resolved for a page that is not the home page.
 * Home-section anchors ("#faq") have to point back at the localized home
 * document, and mail/phone links must be left alone. Every page outside the
 * home rendered its own copy of this mapping; they now share this one.
 */
export function resolveFooterContent(locale: string, home: HomeContent) {
  const resolve = (href: string) =>
    href.startsWith("mailto:") || href.startsWith("tel:")
      ? href
      : resolveLocalizedSiteHref(locale, href, { anchorBehavior: "localized-home" })

  const footerColumns = home.footerColumns.map((group) => ({
    ...group,
    links: group.links.map((link) => ({ ...link, href: resolve(link.href) })),
  }))

  const footer = {
    ...home.sections.footer,
    ctaPrimary: {
      ...home.sections.footer.ctaPrimary,
      href: resolve(home.sections.footer.ctaPrimary.href),
    },
    ctaSecondary: {
      ...home.sections.footer.ctaSecondary,
      href: resolve(home.sections.footer.ctaSecondary.href),
    },
    contactLinks: home.sections.footer.contactLinks.map((link) => ({
      ...link,
      href: resolve(link.href),
    })),
    legal: {
      ...home.sections.footer.legal,
      links: home.sections.footer.legal.links.map((link) => ({
        ...link,
        href: resolve(link.href),
      })),
    },
  }

  return { footerColumns, footer }
}
