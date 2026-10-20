import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/button"
import { Container } from "@/components/layout"
import { Section } from "@/components/section"
import { SiteFooter } from "@/components/site-footer"
import { resolveFooterContent } from "@/app/lib/site-footer-content"
import { Copy, Heading, Kicker } from "@/components/typography"
import { JsonLd, webPageJsonLd } from "@/app/lib/json-ld"
import { canonicalFor, localeAlternates, ogLocale } from "@/app/lib/seo"
import { resolveLocalizedSiteHref } from "@/lib/links"
import { getResolvedHomeContent, getResolvedPrivacyContent } from "@/payload/loaders"

type PrivacyPageProps = {
  params: Promise<{ locale: string }>
}

function sectionId(heading: string) {
  return heading
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params
  const content = await getResolvedPrivacyContent(locale)
  const path = "/privacy-notice"

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: canonicalFor(locale, path),
      languages: localeAlternates(path),
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: canonicalFor(locale, path),
      type: "website",
      locale: ogLocale(locale),
    },
  }
}

export default async function PrivacyNoticePage({ params }: PrivacyPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const [content, home, anchorSource] = await Promise.all([
    getResolvedPrivacyContent(locale),
    getResolvedHomeContent(locale),
    getResolvedPrivacyContent("en"),
  ])
  // Anchors are not translated: both locales key each section off its English
  // heading (same order in both), so a shared #link works in either language.
  const anchorFor = (index: number, heading: string) =>
    sectionId(anchorSource.sections[index]?.heading ?? heading)
  const { footerColumns, footer } = resolveFooterContent(locale, home)
  const tocHeading = locale === "es" ? "En esta página" : "On this page"
  const [responsibleLabel, responsibleBody, ...introBody] = content.intro
  // Last item is Contact; the CTA button beside the nav already covers it.
  const navLinks = home.primaryNav.slice(0, -1).map((link) => ({
    ...link,
    href: resolveLocalizedSiteHref(locale, link.href, {
      anchorBehavior: "localized-home",
    }),
  }))
  const navCtaHref = resolveLocalizedSiteHref(locale, home.sections.hero.cta.href, {
    anchorBehavior: "localized-home",
  })

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          locale,
          path: "/privacy-notice",
          name: content.title,
          description: content.metaDescription,
        })}
      />
      <div className="ds-blog-page ds-legal-page">
      <div className="ds-page-shell">
      <header className="ds-blog-masthead">
        <Container className="ds-blog-masthead-inner">
          <Link className="ds-blog-brand" href="/" aria-label="Zitrone home">
            Zitrone
          </Link>
          <nav className="ds-blog-nav" aria-label={home.sections.hero.navAriaLabel}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <Button href={navCtaHref} className="ds-blog-nav-cta">
            {home.sections.hero.cta.label}
          </Button>
        </Container>
      </header>

      {/* Skip-link / navbar target. tabIndex={-1} makes it focusable so focus
          really lands here rather than only scrolling. */}
      <main id="main-content" tabIndex={-1}>

      <Section tone="warm" size="hero" className="ds-article-hero ds-legal-hero">
        <Container>
          <div className="ds-legal-hero-grid">
            <div className="ds-article-header ds-legal-hero-copy">
              <Kicker>{content.kicker}</Kicker>
              <Heading as="h1" size="hero" className="ds-legal-title">
                {content.title}
              </Heading>
              <div className="ds-legal-responsible">
                <p className="ds-legal-responsible-label">{responsibleLabel}</p>
                <p className="ds-legal-responsible-body">{responsibleBody}</p>
              </div>
            </div>

            <div className="ds-legal-hero-notes">
              {introBody.map((paragraph) => (
                <Copy key={paragraph}>{paragraph}</Copy>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="ds-article-body-section" tone="warm">
        <Container>
          <div className="ds-article-layout">
            <aside className="ds-article-left-rail" aria-hidden="true" />

            <article className="ds-article-content">
              <div className="ds-article-rich ds-legal-rich">
                {content.sections.map((section, index) => (
                  <section key={section.heading} id={anchorFor(index, section.heading)}>
                    <h2>{section.heading}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </section>
                ))}
              </div>
            </article>

            <aside className="ds-article-sidebar">
              <div className="ds-article-toc">
                <p>{tocHeading}</p>
                <nav aria-label={tocHeading}>
                  {content.sections.map((section, index) => (
                    <a href={`#${anchorFor(index, section.heading)}`} key={section.heading}>
                      {section.heading}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
      </main>
      </div>
      <SiteFooter footerColumns={footerColumns} footer={footer} />
      </div>
    </>
  )
}
