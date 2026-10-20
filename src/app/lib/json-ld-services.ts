import { SITE_URL } from "./seo"
import type { ServiceLayer } from "@/app/_components/home/content/types"

const BASE_URL = SITE_URL

export function serviceCatalogJsonLd(locale: string, services: ServiceLayer[]) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: locale === "es" ? "Servicios de alimentación Zitrone" : "Zitrone workplace food services",
    url: `${BASE_URL}/${locale}/services`,
    itemListElement: services.map((service, index) => ({
      "@type": "OfferCatalog",
      position: index + 1,
      name: service.title,
      itemListElement: [
        {
          "@type": "Service",
          name: service.title,
          description: service.features.map((feature) => feature.text).join(" "),
          ...(service.href ? { url: `${BASE_URL}/${locale}${service.href}` } : {}),
          provider: {
            "@type": "Organization",
            name: "Zitrone",
            url: `${BASE_URL}/${locale}`,
          },
          areaServed: {
            "@type": "Country",
            name: "Mexico",
          },
          serviceType: service.title,
        },
      ],
    })),
  }
}

export function serviceJsonLd({
  locale,
  slug,
  name,
  description,
}: {
  locale: string
  slug: string
  name: string
  description: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${BASE_URL}/${locale}/services/${slug}`,
    provider: {
      "@type": "Organization",
      name: "Zitrone",
      url: `${BASE_URL}/${locale}`,
    },
    areaServed: {
      "@type": "Country",
      name: "Mexico",
    },
    serviceType: "Workplace food service",
  }
}
