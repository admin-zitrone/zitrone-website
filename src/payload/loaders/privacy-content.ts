import { cache } from "react"

import {
  getPrivacyContent,
  type PrivacyContent,
} from "@/app/lib/privacy-content"

import { getPayloadClient } from "./client"
import { cleanString, isSupportedLocale } from "./shared"

function mapParagraphs(items?: Array<{ paragraph?: string | null }> | null) {
  return (items ?? [])
    .map((item) => cleanString(item.paragraph))
    .filter((item): item is string => Boolean(item))
}

export const getResolvedPrivacyContent = cache(
  async (locale: string): Promise<PrivacyContent> => {
    const safeLocale = isSupportedLocale(locale) ? locale : "es"
    const base = getPrivacyContent(safeLocale)

    try {
      const payload = await getPayloadClient()
      const privacy = (await payload.findGlobal({
        slug: "privacyNotice",
        locale: safeLocale,
        fallbackLocale: "es",
      })) as {
        metaTitle?: string | null
        metaDescription?: string | null
        kicker?: string | null
        title?: string | null
        responsibleLabel?: string | null
        responsibleBody?: string | null
        intro?: Array<{ paragraph?: string | null }> | null
        sections?:
          | Array<{
              heading?: string | null
              paragraphs?: Array<{ paragraph?: string | null }> | null
            }>
          | null
      }

      const intro = [
        cleanString(privacy.responsibleLabel),
        cleanString(privacy.responsibleBody),
        ...mapParagraphs(privacy.intro),
      ].filter((item): item is string => Boolean(item))

      const sections = (privacy.sections ?? [])
        .map((section) => {
          const heading = cleanString(section.heading)
          const paragraphs = mapParagraphs(section.paragraphs)

          if (!heading || paragraphs.length === 0) return undefined

          return { heading, paragraphs }
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item))

      return {
        ...base,
        metaTitle: cleanString(privacy.metaTitle) ?? base.metaTitle,
        metaDescription: cleanString(privacy.metaDescription) ?? base.metaDescription,
        kicker: cleanString(privacy.kicker) ?? base.kicker,
        title: cleanString(privacy.title) ?? base.title,
        intro: intro.length > 0 ? intro : base.intro,
        sections: sections.length > 0 ? sections : base.sections,
      }
    } catch (error) {
      console.warn("[payload/privacy] falling back to static content:", error)
      return base
    }
  },
)
