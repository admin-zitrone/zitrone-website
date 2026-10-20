import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  JsonLd,
  serviceJsonLd,
  webPageJsonLd,
} from "@/app/lib/json-ld"
import { canonicalFor, ogLocale } from "@/app/lib/seo"
import { assetSrc } from "@/lib/assets.generated"
import { RegisterLangAlternates } from "@/components/lang-alternates"
import { SiteNavbar } from "@/app/_components/site-navbar"
import { getResolvedHomeContent } from "@/payload/loaders"
import { resolveFooterContent } from "@/app/lib/site-footer-content"
import {
  getServiceAlternates,
  getServiceTargets,
  getServiceTemplateContent,
} from "../service-targets"
import { ServiceDetailTemplate } from "../service-detail-template"

type ServicePageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  return ["en", "es"].flatMap((locale) =>
    getServiceTargets(locale).map((service) => ({
      locale,
      slug: service.slug,
    })),
  )
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const target = getServiceTargets(locale).find((item) => item.slug === slug)

  if (!target) {
    return { title: locale === "es" ? "Servicio no encontrado" : "Service not found" }
  }

  const path = `/services/${slug}`
  const alternates = getServiceAlternates(locale, slug)

  return {
    title: target.metaTitle,
    description: target.metaDescription,
    alternates: {
      canonical: canonicalFor(locale, path),
      languages: alternates,
    },
    openGraph: {
      title: target.metaTitle,
      description: target.metaDescription,
      url: canonicalFor(locale, path),
      type: "website",
      locale: ogLocale(locale),
      images: [{ url: assetSrc("site-og-card"), width: 1200, height: 630 }],
    },
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const target = getServiceTargets(locale).find((item) => item.slug === slug)
  if (!target) notFound()

  const home = await getResolvedHomeContent(locale)
  const layer = home.serviceLayers.find((item) => item.theme === target.theme)
  if (!layer) notFound()

  const path = `/services/${slug}`
  const template = getServiceTemplateContent(locale, target.theme)
  const { footerColumns, footer: footerSection } = resolveFooterContent(locale, home)

  const langAlternates = Object.fromEntries(
    (["en", "es"] as const).map((altLocale) => [
      altLocale,
      `/services/${
        getServiceTargets(altLocale).find((item) => item.theme === target.theme)?.slug ?? slug
      }`,
    ]),
  )

  return (
    <>
      <RegisterLangAlternates pathname={path} alternates={langAlternates} />
      <JsonLd
        data={webPageJsonLd({
          locale,
          path,
          name: target.title,
          description: target.metaDescription,
        })}
      />
      <JsonLd
        data={serviceJsonLd({
          locale,
          slug,
          name: target.title,
          description: target.metaDescription,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Zitrone", url: canonicalFor(locale, "") },
          {
            name: locale === "es" ? "Servicios" : "Services",
            url: canonicalFor(locale, "/services"),
          },
          { name: target.title, url: canonicalFor(locale, path) },
        ])}
      />

      {/* Only services showing their own FAQs may claim FAQPage: the markup has
          to match what the page renders. */}
      {template.faqScope === "service" ? (
        <JsonLd data={faqPageJsonLd(template.faqs)} />
      ) : null}

      <ServiceDetailTemplate
        locale={locale}
        target={target}
        layer={layer}
        template={template}
        homeContent={home}
        navbar={
          <SiteNavbar
            locale={locale}
            variant="embedded"
            className="ds-service-lp-nav"
            panelId="service-page-nav-panel"
          />
        }
        footerColumns={footerColumns}
        footerSection={footerSection}
      />
    </>
  )
}
