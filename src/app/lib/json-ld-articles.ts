import { SITE_URL } from "./seo"
import { publisherJsonLd } from "./json-ld-entity"
import { getBlogAuthorPath, getBlogReviewerPath } from "@/app/[locale]/blog/articles"

const BASE_URL = SITE_URL

function absoluteUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://") ? url : `${BASE_URL}${url}`
}

type ArticleLike = {
  title: string
  slug: string
  excerpt: string
  image: string
  category: string
  date: string
  authorName?: string
  authorRole?: string
  reviewedByName?: string
}

function isTeamLikeName(name: string) {
  return /team|equipo|operations|operaciones|food safety|seguridad alimentaria/i.test(name)
}

function authorJsonLd(locale: string, post: ArticleLike) {
  if (post.authorName && !isTeamLikeName(post.authorName)) {
    return {
      "@type": "Person",
      name: post.authorName,
      jobTitle: post.authorRole,
      url: `${BASE_URL}/${locale}${getBlogAuthorPath(post.authorName)}`,
      worksFor: {
        "@type": "Organization",
        name: "Zitrone",
        url: `${BASE_URL}/${locale}`,
      },
    }
  }

  return {
    "@type": "Organization",
    name: post.authorName ?? "Zitrone",
    url: `${BASE_URL}/${locale}${getBlogAuthorPath(post.authorName ?? "Zitrone")}`,
  }
}

function reviewerJsonLd(locale: string, post: ArticleLike) {
  return {
    "@type": "Organization",
    name: post.reviewedByName ?? "Zitrone Food Safety & Operations",
    url: `${BASE_URL}/${locale}${getBlogReviewerPath(post.reviewedByName ?? "Zitrone Food Safety & Operations")}`,
  }
}

export function articleJsonLd(
  locale: string,
  post: ArticleLike,
  publishedIsoDate: string,
  modifiedIsoDate: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    inLanguage: locale,
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.image),
    datePublished: publishedIsoDate,
    dateModified: modifiedIsoDate,
    author: authorJsonLd(locale, post),
    reviewedBy: reviewerJsonLd(locale, post),
    publisher: publisherJsonLd(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/${locale}/blog/${post.slug}`,
    },
    articleSection: post.category,
    about: [
      { "@type": "Thing", name: post.category },
      { "@type": "Organization", name: "Zitrone", url: `${BASE_URL}/${locale}` },
    ],
    keywords: [post.category, "workplace food", "corporate dining", "office food"],
  }
}

export function blogPostingJsonLd(
  locale: string,
  post: ArticleLike,
  publishedIsoDate: string,
  modifiedIsoDate: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    inLanguage: locale,
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.image),
    datePublished: publishedIsoDate,
    dateModified: modifiedIsoDate,
    articleSection: post.category,
    isPartOf: {
      "@type": "Blog",
      name: locale === "es" ? "Blog de Zitrone" : "Zitrone Journal",
      url: `${BASE_URL}/${locale}/blog`,
    },
    author: authorJsonLd(locale, post),
    reviewedBy: reviewerJsonLd(locale, post),
    publisher: publisherJsonLd(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/${locale}/blog/${post.slug}`,
    },
    about: [
      { "@type": "Thing", name: post.category },
      { "@type": "Organization", name: "Zitrone", url: `${BASE_URL}/${locale}` },
    ],
    keywords: [post.category, "workplace food", "corporate dining", "office food"],
  }
}
