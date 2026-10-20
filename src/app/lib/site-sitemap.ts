import type { MetadataRoute } from "next"

import {
  blogPostPaths,
  getBlogAuthorPath,
  getBlogCategoryPath,
  getBlogContent,
  getBlogReviewerPath,
  postModifiedIsoDate,
  type BlogPost,
} from "../[locale]/blog/articles"
import { getServiceAlternates, getServiceTargets } from "../[locale]/services/service-targets"
import { canonicalFor, localeAlternates, localizedAlternates } from "./seo"
import { blogProfileAlternatePaths } from "./blog-profile-alternates"
import { routing, type AppLocale } from "@/i18n/routing"

export function buildSiteSitemap(content: Record<AppLocale, { posts: BlogPost[]; categories: string[] }>): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    const { posts, categories } = content[locale]
    const otherPosts = content[locale === "es" ? "en" : "es"].posts
    const latestBlogModified = posts[0]
      ? postModifiedIsoDate(posts[0])
      : undefined

    entries.push({
      url: canonicalFor(locale, ""),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: localeAlternates("") },
    })

    entries.push({
      url: canonicalFor(locale, "/services"),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: localeAlternates("/services") },
    })

    for (const service of getServiceTargets(locale)) {
      entries.push({
        url: canonicalFor(locale, `/services/${service.slug}`),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: getServiceAlternates(locale, service.slug) },
      })
    }

    entries.push({
      url: canonicalFor(locale, "/blog"),
      lastModified: latestBlogModified,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: localeAlternates("/blog") },
    })

    entries.push({
      url: canonicalFor(locale, "/blog/feed.xml"),
      lastModified: latestBlogModified,
      changeFrequency: "daily",
      priority: 0.3,
      alternates: { languages: localeAlternates("/blog/feed.xml") },
    })

    const usedCategories = new Set(posts.map((post) => post.category))
    for (const category of categories.slice(1).filter((category) => usedCategories.has(category))) {
      const categoryLastModified =
        posts.find((post) => post.category === category)?.updatedAtISO ??
        posts.find((post) => post.category === category)?.publishedAtISO ??
        latestBlogModified

      entries.push({
        url: canonicalFor(locale, getBlogCategoryPath(category)),
        lastModified: categoryLastModified,
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: { languages: localeAlternates(getBlogCategoryPath(category)) },
      })
    }

    entries.push({
      url: canonicalFor(locale, "/privacy-notice"),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: { languages: localeAlternates("/privacy-notice") },
    })

    entries.push({
      url: canonicalFor(locale, "/contact"),
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages: localeAlternates("/contact") },
    })

    for (const post of posts) {
      entries.push({
        url: canonicalFor(locale, `/blog/${post.slug}`),
        lastModified: postModifiedIsoDate(post),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: localizedAlternates(blogPostPaths(locale, post, otherPosts)) },
      })
    }

    const authorNames = new Set<string>()
    const reviewerNames = new Set<string>()

    for (const post of posts) {
      const article = getBlogContent(locale).article
      const authorName = post.authorName ?? article.authorName
      const reviewerName = post.reviewedByName ?? article.reviewedByName
      if (authorName) authorNames.add(authorName)
      if (reviewerName) reviewerNames.add(reviewerName)
    }

    for (const authorName of authorNames) {
      const path = getBlogAuthorPath(authorName)
      entries.push({
        url: canonicalFor(locale, path),
        lastModified: latestBlogModified,
        changeFrequency: "monthly",
        priority: 0.4,
        alternates: {
          languages: localizedAlternates(blogProfileAlternatePaths({ locale, name: authorName, kind: "author", posts, otherPosts })),
        },
      })
    }

    for (const reviewerName of reviewerNames) {
      const path = getBlogReviewerPath(reviewerName)
      entries.push({
        url: canonicalFor(locale, path),
        lastModified: latestBlogModified,
        changeFrequency: "monthly",
        priority: 0.4,
        alternates: {
          languages: localizedAlternates(blogProfileAlternatePaths({ locale, name: reviewerName, kind: "reviewer", posts, otherPosts })),
        },
      })
    }
  }

  return entries
}
