import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"

import { JsonLd, webPageJsonLd } from "@/app/lib/json-ld"
import { canonicalFor, localeAlternates, ogLocale } from "@/app/lib/seo"
import { resolveFooterContent } from "@/app/lib/site-footer-content"
import { getContactContent } from "@/app/lib/contact-content"
import { Container } from "@/components/layout"
import { Section } from "@/components/section"
import { SiteFooter } from "@/components/site-footer"
import { Copy, Heading } from "@/components/typography"
import { getResolvedHomeContent } from "@/payload/loaders"

import { ContactForm } from "./contact-form"

type ContactPageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params
  const content = getContactContent(locale)
  const path = "/contact"

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

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const content = getContactContent(locale)
  const home = await getResolvedHomeContent(locale)
  // The footer's "#faq"-style links point at home sections; off the home page
  // they have to be resolved to the localized home, or they go nowhere.
  const { footerColumns, footer } = resolveFooterContent(locale, home)

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          locale,
          path: "/contact",
          name: content.title,
          description: content.metaDescription,
        })}
      />
      <div className="semantic-shell ds-contact-page">
        <main id="main-content" tabIndex={-1}>
          <div className="ds-page-shell">
            <Section tone="inverse" size="hero" className="ds-contact-section">
            <Container>
              <div className="ds-contact-shell">
                {/* ── Rail: the promise, then the ways around the form ── */}
                <aside className="ds-contact-rail">
                  <Heading as="h1" size="hero" className="ds-contact-title">
                    {content.title}
                  </Heading>
                  <Copy className="ds-contact-lead">{content.intro}</Copy>
                </aside>

                <div className="ds-contact-panel">
                  <ContactForm locale={locale} content={content} home={home} />
                </div>
              </div>
            </Container>
          </Section>
          </div>
          <SiteFooter footerColumns={footerColumns} footer={footer} />
        </main>
      </div>
    </>
  )
}
