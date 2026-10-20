import { cache } from "react"
import { assetSrc } from "@/lib/assets.generated"

import {
  blogPostPaths,
  getAllSlugs as getStaticAllSlugs,
  getBlogContent,
  getBlogPost as getStaticBlogPost,
  getRecommendedPosts as getStaticRecommendedPosts,
  type BlogPost,
} from "@/app/[locale]/blog/articles"
import type {
  BlogIndexCopy,
} from "@/app/[locale]/blog/content/types"
import { getPayloadClient } from "./client"
import {
  cleanString,
  isSupportedLocale,
  resolveMediaUrl,
} from "./shared"

type Locale = "en" | "es"

/**
 * Which list of posts the site trusts.
 *
 * - "static": the article files committed with the site. Local development
 *   without a CMS (no DATABASE_URL), or forced with BLOG_CONTENT_SOURCE=static.
 * - "cms": Payload alone decides which posts exist. An unpublished or deleted
 *   post is gone everywhere (index, page, related, sitemap, feed) even if a
 *   static file with its slug still ships; an empty result is an empty blog.
 *   A failed query is an error, not "nothing published": it propagates, so a
 *   build fails instead of shipping a different list, and on-demand
 *   revalidation keeps serving the last good page.
 *
 * In both modes the static file for the same slug still fills fields the CMS
 * post leaves empty (images, checklists, links), which is enrichment of a
 * published post, never a way to publish one.
 */
export function getBlogContentSource(): "cms" | "static" {
  if (process.env.BLOG_CONTENT_SOURCE === "static") return "static"
  return process.env.DATABASE_URL ? "cms" : "static"
}

function mapParagraphs(items?: Array<{ paragraph?: string | null }> | null) {
  return (items ?? [])
    .map((item) => cleanString(item.paragraph))
    .filter((item): item is string => Boolean(item))
}

function mapTakeaways(items?: Array<{ item?: string | null }> | null) {
  return (items ?? [])
    .map((item) => cleanString(item.item))
    .filter((item): item is string => Boolean(item))
}

// Arrays shared across locales keep empty rows for a locale that has no
// text there; those are dropped, and an empty result means "not set".
function mapChecklist(items?: Array<{ item?: string | null }> | null) {
  const list = (items ?? []).map((row) => cleanString(row.item)).filter((item): item is string => Boolean(item))
  return list.length > 0 ? list : undefined
}

function mapInlineLinks(
  items?: Array<{ before?: string | null; label?: string | null; href?: string | null; after?: string | null }> | null,
) {
  const list = (items ?? []).flatMap((row) => {
    const label = cleanString(row.label)
    const href = cleanString(row.href)
    // `before`/`after` keep their edge spaces: they join the linked words
    // mid-sentence ("…nuestro " + link + " y qué…").
    const before = cleanString(row.before) ? (row.before as string) : undefined
    if (!before || !label || !href) return []
    const after = cleanString(row.after) ? (row.after as string) : undefined
    return [{ before, label, href, ...(after ? { after } : {}) }]
  })
  return list.length > 0 ? list : undefined
}

function mapCta(cta?: { heading?: string | null; label?: string | null; href?: string | null } | null) {
  const heading = cleanString(cta?.heading)
  const label = cleanString(cta?.label)
  const href = cleanString(cta?.href)
  return heading && label && href ? { heading, label, href } : undefined
}

function mapBlogPost(
  doc: {
    id?: number | string | null
    slug?: string | null
    title?: string | null
    excerpt?: string | null
    seo?: { title?: string | null; description?: string | null } | null
    heroImage?: unknown
    heroImageSrc?: string | null
    heroImageAlt?: string | null
    dateLabel?: string | null
    readTime?: string | null
    publishedAt?: string | null
    updatedAt?: string | null
    category?: { name?: string | null } | number | null
    author?: {
      name?: string | null
      role?: string | null
    } | null
    reviewedBy?: string | null
    intro?: Array<{ paragraph?: string | null }> | null
    takeaways?: Array<{ item?: string | null }> | null
    sections?:
      | Array<{
          id?: string | null
          title?: string | null
          body?: Array<{ paragraph?: string | null }> | null
          image?: unknown
          imageSrc?: string | null
          imageAlt?: string | null
          checklist?: Array<{ item?: string | null }> | null
          links?: Array<{
            before?: string | null
            label?: string | null
            href?: string | null
            after?: string | null
          }> | null
        }>
      | null
    faqs?: Array<{ question?: string | null; answer?: string | null }> | null
    cta?: { heading?: string | null; label?: string | null; href?: string | null } | null
  },
  fallback?: BlogPost,
) {
  const slug = cleanString(doc.slug) ?? fallback?.slug
  const title = cleanString(doc.title) ?? fallback?.title
  const excerpt = cleanString(doc.excerpt) ?? fallback?.excerpt

  if (!slug || !title || !excerpt) {
    return fallback
  }

  const uploadedHeroImage = resolveMediaUrl(doc.heroImage as never)
  const fallbackHeroImage = fallback?.image
  const legacyHeroImage = cleanString(doc.heroImageSrc)
  const heroImage =
    uploadedHeroImage ??
    fallbackHeroImage ??
    legacyHeroImage ??
    assetSrc("site-service-detail-chef-hygiene-portrait")
  const heroImageAlt = uploadedHeroImage
    ? (cleanString(doc.heroImageAlt) ?? fallback?.alt ?? "")
    : (fallback?.alt ?? cleanString(doc.heroImageAlt) ?? "")
  const fallbackSectionsById = new Map(
    (fallback?.sections ?? []).map((section) => [section.id, section]),
  )

  const intro = mapParagraphs(doc.intro)
  const takeaways = mapTakeaways(doc.takeaways)
  const sections = (doc.sections ?? [])
    .map((section) => {
      const id = cleanString(section.id)
      const sectionTitle = cleanString(section.title)
      const body = mapParagraphs(section.body)

      if (!id || !sectionTitle || body.length === 0) {
        return undefined
      }

      const fallbackSection = fallbackSectionsById.get(id)
      const uploadedImage = resolveMediaUrl(section.image as never)
      const legacyImage = cleanString(section.imageSrc)
      const image = uploadedImage ?? fallbackSection?.image ?? legacyImage
      const alt = uploadedImage
        ? (cleanString(section.imageAlt) ?? fallbackSection?.alt)
        : (fallbackSection?.alt ?? cleanString(section.imageAlt))

      return {
        id,
        title: sectionTitle,
        body,
        checklist: mapChecklist(section.checklist) ?? fallbackSection?.checklist,
        links: mapInlineLinks(section.links) ?? fallbackSection?.links,
        image,
        alt,
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
  const faqs = (doc.faqs ?? [])
    .map((faq) => {
      const question = cleanString(faq.question)
      const answer = cleanString(faq.answer)

      if (!question || !answer) return undefined

      return { question, answer }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  return {
    slug,
    // The document id is shared by every locale of a CMS post, so it pairs the
    // ES and EN versions even though their slugs differ.
    translationKey:
      doc.id != null ? String(doc.id) : (fallback?.translationKey ?? slug),
    href: `/blog/${slug}`,
    title,
    seo: {
      title: cleanString(doc.seo?.title) ?? fallback?.seo?.title,
      description: cleanString(doc.seo?.description) ?? fallback?.seo?.description,
    },
    cta: mapCta(doc.cta) ?? fallback?.cta,
    category:
      (typeof doc.category === "object" && doc.category
        ? cleanString(doc.category.name)
        : undefined) ?? fallback?.category ?? "Journal",
    date: cleanString(doc.dateLabel) ?? fallback?.date ?? "",
    readTime: cleanString(doc.readTime) ?? fallback?.readTime ?? "",
    // A real CMS upload always wins. Static project covers come next so stale
    // legacy URL strings cannot mask curated placeholders committed with the site.
    image: heroImage,
    alt: heroImageAlt,
    publishedAtISO: cleanString(doc.publishedAt) ?? fallback?.publishedAtISO,
    updatedAtISO:
      cleanString(doc.updatedAt) ??
      cleanString(doc.publishedAt) ??
      fallback?.updatedAtISO ??
      fallback?.publishedAtISO,
    authorName: cleanString(doc.author?.name) ?? fallback?.authorName,
    authorRole: cleanString(doc.author?.role) ?? fallback?.authorRole,
    reviewedByName: cleanString(doc.reviewedBy) ?? fallback?.reviewedByName,
    excerpt,
    intro: intro.length > 0 ? intro : (fallback?.intro ?? []),
    takeaways: takeaways.length > 0 ? takeaways : (fallback?.takeaways ?? []),
    sections: sections.length > 0 ? sections : (fallback?.sections ?? []),
    faqs: faqs.length > 0 ? faqs : (fallback?.faqs ?? []),
    topics: fallback?.topics ?? [],
  } satisfies BlogPost
}

export const getResolvedBlogIndex = cache(async (locale: string): Promise<BlogIndexCopy> => {
  const safeLocale = isSupportedLocale(locale) ? locale : "es"
  return getBlogContent(safeLocale).index
})

export const getResolvedBlogPosts = cache(async (locale: string): Promise<BlogPost[]> => {
  const safeLocale: Locale = isSupportedLocale(locale) ? locale : "es"
  const basePosts = getBlogContent(safeLocale).posts
  const fallbackBySlug = new Map(basePosts.map((post) => [post.slug, post]))
  if (getBlogContentSource() === "static") return basePosts

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: "blogPosts",
      locale: safeLocale,
      // No cross-language fallback: a field left empty in EN (SEO, CTA,
      // checklists) must not show the ES text; the EN static copy fills it.
      fallbackLocale: false,
      where: { _status: { equals: "published" } },
      sort: "-publishedAt",
      depth: 2,
      limit: 100,
    })

    const mapped = result.docs
      .map((doc) =>
        mapBlogPost(
          doc as never,
          cleanString((doc as { slug?: string | null }).slug)
            ? fallbackBySlug.get((doc as { slug?: string }).slug as string)
            : undefined,
        ),
      )
      .filter((post): post is BlogPost => Boolean(post))

    return mapped
  } catch (error) {
    console.error("[payload/blog] could not load posts from the CMS:", error)
    throw error
  }
})

export const getResolvedBlogCategories = cache(async (locale: string): Promise<string[]> => {
  const safeLocale: Locale = isSupportedLocale(locale) ? locale : "es"
  const baseCategories = getBlogContent(safeLocale).categories
  const allLabel = baseCategories[0] ?? "All"

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: "blogCategories",
      locale: safeLocale,
      fallbackLocale: "es",
      sort: "slug",
      limit: 50,
    })

    const categories = result.docs
      .map((doc) => cleanString((doc as { name?: string | null }).name))
      .filter((name): name is string => Boolean(name))

    return categories.length > 0 ? [allLabel, ...categories] : baseCategories
  } catch (error) {
    console.warn("[payload/blog] falling back to static categories:", error)
    return baseCategories
  }
})

export const getResolvedBlogPost = cache(
  async (locale: string, slug: string): Promise<BlogPost | undefined> => {
    const safeLocale: Locale = isSupportedLocale(locale) ? locale : "es"
    const fallback = getStaticBlogPost(safeLocale, slug)
    if (getBlogContentSource() === "static") return fallback

    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: "blogPosts",
        locale: safeLocale,
        fallbackLocale: false,
        where: {
          and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
        },
        depth: 2,
        limit: 1,
      })

      const doc = result.docs[0]
      // Not published (draft, unpublished, deleted): no page, whatever ships
      // in the static files.
      if (!doc) return undefined

      return mapBlogPost(doc as never, fallback)
    } catch (error) {
      console.error("[payload/blog] could not load the post from the CMS:", error)
      throw error
    }
  },
)

export const getResolvedRecommendedPosts = cache(
  async (locale: string, currentSlug: string): Promise<BlogPost[]> => {
    const posts = await getResolvedBlogPosts(locale)
    const filtered = posts.filter((post) => post.slug !== currentSlug).slice(0, 4)

    if (filtered.length > 0 || getBlogContentSource() === "cms") return filtered

    return getStaticRecommendedPosts(locale, currentSlug)
  },
)

/** Per-locale path of the same article in every locale it exists in. Slugs are
    localized, so the translation is found by `translationKey`, never by slug. */
export const getResolvedBlogPostPaths = cache(
  async (locale: string, slug: string): Promise<Partial<Record<Locale, string>>> => {
    const safeLocale: Locale = isSupportedLocale(locale) ? locale : "es"
    const [posts, otherPosts] = await Promise.all([
      getResolvedBlogPosts(safeLocale),
      getResolvedBlogPosts(safeLocale === "es" ? "en" : "es"),
    ])
    const current = posts.find((post) => post.slug === slug) ?? { slug }
    return blogPostPaths(safeLocale, current, otherPosts)
  },
)

export const getAllResolvedBlogSlugs = cache(async (locale: string = "en"): Promise<string[]> => {
  const safeLocale: Locale = isSupportedLocale(locale) ? locale : "es"
  if (getBlogContentSource() === "static") return getStaticAllSlugs(safeLocale)
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: "blogPosts",
      locale: safeLocale,
      fallbackLocale: false,
      where: { _status: { equals: "published" } },
      sort: "-publishedAt",
      limit: 200,
    })

    const slugs = result.docs
      .map((doc) => cleanString((doc as { slug?: string | null }).slug))
      .filter((slug): slug is string => Boolean(slug))

    return slugs
  } catch (error) {
    console.error("[payload/blog] could not load slugs from the CMS:", error)
    throw error
  }
})

export async function searchFaqs(query: string, locale: Locale, limit = 5) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: "faqs",
    locale,
    where: {
      or: [{ question: { contains: query } }, { tags: { contains: query } }],
    },
    limit,
  })
}
