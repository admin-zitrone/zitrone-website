import { setRequestLocale } from "next-intl/server"

import { HomePage } from "../_components/home/home-page"
import { faqPageJsonLd, JsonLd, serviceCatalogJsonLd, webPageJsonLd } from "../lib/json-ld"
import { getResolvedHomeContent } from "@/payload/loaders"

type HomeProps = {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const content = await getResolvedHomeContent(locale)

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          locale,
          path: "",
          name: content.meta.title,
          description: content.meta.description,
        })}
      />
      <JsonLd data={faqPageJsonLd(content.faqs)} />
      <JsonLd data={serviceCatalogJsonLd(locale, content.serviceLayers)} />
      <HomePage content={content} />
    </>
  )
}
