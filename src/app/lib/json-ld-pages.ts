import { SITE_URL } from "./seo"

const BASE_URL = SITE_URL

function absoluteUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://") ? url : `${BASE_URL}${url}`
}

export function webPageJsonLd({
  locale,
  path,
  name,
  description,
  type = "WebPage",
}: {
  locale: string
  path: string
  name: string
  description: string
  type?: "WebPage" | "AboutPage" | "ContactPage" | "FAQPage" | "CollectionPage"
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: `${BASE_URL}/${locale}${path}`,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: "Zitrone",
      url: `${BASE_URL}/${locale}`,
    },
    about: {
      "@type": "Organization",
      name: "Zitrone",
      url: `${BASE_URL}/${locale}`,
    },
  }
}

export function collectionPageJsonLd({
  locale,
  path,
  name,
  description,
  items,
}: {
  locale: string
  path: string
  name: string
  description: string
  items: Array<{ name: string; url: string }>
}) {
  return {
    ...webPageJsonLd({
      locale,
      path,
      name,
      description,
      type: "CollectionPage",
    }),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.url),
      })),
    },
  }
}

export function faqPageJsonLd(faqs: { question: string; answer: string[] | string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: Array.isArray(faq.answer) ? faq.answer.join(" ") : faq.answer,
      },
    })),
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
