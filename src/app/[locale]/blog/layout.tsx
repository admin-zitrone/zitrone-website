import { setRequestLocale } from "next-intl/server"
import { BodyClassToggle } from "@/components/body-class-toggle"
import { SiteFooter } from "@/components/site-footer"
import { resolveLocalizedSiteHref } from "@/lib/links"
import {
  getResolvedHomeContent,
} from "@/payload/loaders"

type BlogLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function BlogLayout({ children, params }: BlogLayoutProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const home = await getResolvedHomeContent(locale)
  const footerGroups = home.footerColumns.map((group) => ({
    ...group,
    links: group.links.map((link) => ({
      ...link,
      href: resolveLocalizedSiteHref(locale, link.href, {
        anchorBehavior: "localized-home",
      }),
    })),
  }))
  const footerSection = {
    ...home.sections.footer,
    ctaPrimary: {
      ...home.sections.footer.ctaPrimary,
      href: resolveLocalizedSiteHref(locale, home.sections.footer.ctaPrimary.href, {
        anchorBehavior: "localized-home",
      }),
    },
    ctaSecondary: {
      ...home.sections.footer.ctaSecondary,
      href: resolveLocalizedSiteHref(locale, home.sections.footer.ctaSecondary.href, {
        anchorBehavior: "localized-home",
      }),
    },
    contactLinks: home.sections.footer.contactLinks.map((link) => ({
      ...link,
      href: isMailOrTel(link.href)
        ? link.href
        : resolveLocalizedSiteHref(locale, link.href, {
            anchorBehavior: "localized-home",
          }),
    })),
    legal: {
      ...home.sections.footer.legal,
      links: home.sections.footer.legal.links.map((link) => ({
        ...link,
        href: resolveLocalizedSiteHref(locale, link.href, {
          anchorBehavior: "localized-home",
        }),
      })),
    },
  }

  return (
    <main className="ds-blog-page" id="main-content" tabIndex={-1}>
      <BodyClassToggle className="ds-body--blog" />

      <div className="ds-page-shell">
        {children}
      </div>

      <div className="ds-blog-bottom">
        <SiteFooter footerColumns={footerGroups} footer={footerSection} integrated tone="dark" />
      </div>
    </main>
  )
}

function isMailOrTel(href: string) {
  return href.startsWith("mailto:") || href.startsWith("tel:")
}
