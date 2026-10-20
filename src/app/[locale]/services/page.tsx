import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"

import { collectionPageJsonLd, faqPageJsonLd, JsonLd, webPageJsonLd } from "@/app/lib/json-ld"
import { canonicalFor, localeAlternates, ogLocale } from "@/app/lib/seo"
import { resolveFooterContent } from "@/app/lib/site-footer-content"
import { SiteNavbar } from "@/app/_components/site-navbar"
import { getResolvedHomeContent } from "@/payload/loaders"
import { serviceNameList } from "@/lib/service-names"
import { getServiceTargets } from "./service-targets"
import { ServicesIndexTemplate } from "./services-index-template"

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

type ServicesIndexPageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ServicesIndexPageProps): Promise<Metadata> {
  const { locale } = await params
  const title =
    locale === "es"
      ? "Servicios de alimentación corporativa | Zitrone"
      : "Corporate food services for offices | Zitrone"
  const description =
    locale === "es"
      ? `${capitalize(serviceNameList("es"))} para oficinas en México.`
      : `${capitalize(serviceNameList("en"))} for workplaces in Mexico.`
  const path = "/services"

  return {
    title,
    description,
    alternates: {
      canonical: canonicalFor(locale, path),
      languages: localeAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: canonicalFor(locale, path),
      type: "website",
      locale: ogLocale(locale),
    },
  }
}

export default async function ServicesIndexPage({ params }: ServicesIndexPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const home = await getResolvedHomeContent(locale)
  const targets = getServiceTargets(locale)

  // The home service layers are the source of truth for how each service is
  // named, described and pictured; the targets only supply the detail-page
  // route. A target without a layer has nothing to show, so it is dropped.
  const services = targets
    .map((target) => {
      const layer = home.serviceLayers.find((item) => item.theme === target.theme)
      return layer ? { target, layer } : undefined
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  const pageTitle =
    locale === "es" ? "Comida que sostiene el día" : "Food that carries the day"
  const pageKicker =
    home.sections.services.kicker ?? (locale === "es" ? "Servicios" : "Services")
  const pageCopy =
    locale === "es"
      ? `Seis servicios que operamos con el mismo estándar: ${serviceNameList("es")}.`
      : `Six services run to the same standard: ${serviceNameList("en")}.`

  const { footerColumns, footer } = resolveFooterContent(locale, home)

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          locale,
          path: "/services",
          name: pageTitle,
          description: pageCopy,
          type: "CollectionPage",
        })}
      />
      <JsonLd
        data={collectionPageJsonLd({
          locale,
          path: "/services",
          name: pageTitle,
          description: pageCopy,
          items: services.map(({ target }) => ({
            name: target.title,
            url: `/services/${target.slug}`,
          })),
        })}
      />
      {/* The page renders the general FAQ set, so it may claim FAQPage. */}
      <JsonLd data={faqPageJsonLd(home.faqs)} />

      <ServicesIndexTemplate
        locale={locale}
        services={services}
        homeContent={home}
        title={pageTitle}
        kicker={pageKicker}
        lede={pageCopy}
        navbar={
          <SiteNavbar
            locale={locale}
            variant="embedded"
            className="ds-service-lp-nav"
            panelId="services-index-nav-panel"
          />
        }
        footerColumns={footerColumns}
        footerSection={footer}
      />
    </>
  )
}
