import { SITE_URL } from "./seo"
import type { FooterSection } from "@/app/_components/home/content/types"
import { assetSrc } from "@/lib/assets.generated"

const BASE_URL = SITE_URL

export function footerContactMap(footer: FooterSection) {
  const emailHref = footer.contactLinks.find((link) => link.href.startsWith("mailto:"))?.href
  const phoneHref = footer.contactLinks.find((link) => link.href.startsWith("tel:"))?.href

  const email = emailHref?.replace(/^mailto:/, "")
  const telephone = phoneHref?.replace(/^tel:/, "")

  const [streetAddress, addressLocality, addressRegionLine, postalCodeLine] = footer.address

  return {
    email,
    telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality,
      addressRegion: addressRegionLine,
      postalCode: postalCodeLine?.replace(/^Postal Code\s*/i, "").replace(/^C[óo]digo Postal\s*/i, ""),
      addressCountry: "MX",
    },
    sameAs: footer.socialLinks.map((social) => social.href),
  }
}

function brandImages() {
  // Raster PNG, not the SVG: Google's logo rich result requires a raster
  // image of at least 112px.
  const logoPath = assetSrc("brand-zitrone-logo-dark-raster")
  return {
    logo: `${BASE_URL}${logoPath}`,
    image: `${BASE_URL}${logoPath}`,
  }
}

export function organizationJsonLd(locale: string, description: string, footer: FooterSection) {
  const contact = footerContactMap(footer)
  const images = brandImages()
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Zitrone",
    url: `${BASE_URL}/${locale}`,
    logo: images.logo,
    image: images.image,
    alternateName: "Zitrone MX",
    legalName: "Servicio de Alimentación Zitrone, S.A.P.I. de C.V.",
    description,
    // foundingDate intentionally omitted: the previous value ("2020")
    // contradicted the client's own materials (decks state "17 años de
    // experiencia" / founded 2007). Re-add once the client confirms the year.
    email: contact.email,
    telephone: contact.telephone,
    address: contact.address,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: contact.email,
      telephone: contact.telephone,
      availableLanguage: ["en", "es"],
      areaServed: "MX",
    },
    areaServed: {
      "@type": "Country",
      name: "Mexico",
    },
    sameAs: contact.sameAs,
  }
}

export function localBusinessJsonLd(locale: string, description: string, footer: FooterSection) {
  const contact = footerContactMap(footer)
  const images = brandImages()
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Zitrone",
    url: `${BASE_URL}/${locale}`,
    logo: images.logo,
    image: images.image,
    description,
    email: contact.email,
    telephone: contact.telephone,
    address: contact.address,
    areaServed: {
      "@type": "Country",
      name: "Mexico",
    },
    sameAs: contact.sameAs,
  }
}

export function webSiteJsonLd(locale: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Zitrone",
    inLanguage: locale,
    url: `${BASE_URL}/${locale}`,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/${locale}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function publisherJsonLd() {
  return {
    "@type": "Organization",
    name: "Zitrone",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}${assetSrc("brand-zitrone-logo-dark-raster")}`,
    },
  }
}
