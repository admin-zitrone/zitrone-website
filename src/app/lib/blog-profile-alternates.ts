import {
  getBlogAuthorPath,
  getBlogContent,
  getBlogReviewerPath,
  postTranslationKey,
  type BlogPost,
} from "@/app/[locale]/blog/articles"
import { routing, type AppLocale } from "@/i18n/routing"

type ProfilePost = Pick<BlogPost, "slug" | "translationKey" | "authorName" | "reviewedByName">

/** The translation key (CMS document id) identifies the same article across
 * locales; slugs are localized and no longer match.
 * Only advertise a profile translation when that relationship is unambiguous
 * in both directions. An unrelated default profile is not an alternate. */
export function blogProfileAlternatePaths({
  locale,
  name,
  kind,
  posts,
  otherPosts,
}: {
  locale: string
  name: string
  kind: "author" | "reviewer"
  posts: readonly ProfilePost[]
  otherPosts: readonly ProfilePost[]
}): Partial<Record<AppLocale, string>> {
  const currentLocale = locale === "en" ? "en" : routing.defaultLocale
  const otherLocale = currentLocale === "es" ? "en" : "es"
  const field = kind === "author" ? "authorName" : "reviewedByName"
  const pathFor = kind === "author" ? getBlogAuthorPath : getBlogReviewerPath
  const currentFallback = getBlogContent(currentLocale).article[field]
  const otherFallback = getBlogContent(otherLocale).article[field]
  const paths: Partial<Record<AppLocale, string>> = {
    [currentLocale]: pathFor(name),
  }
  const translatedPosts = new Map(otherPosts.map((post) => [postTranslationKey(post), post]))
  const pairs = posts.flatMap((post) => {
    const translated = translatedPosts.get(postTranslationKey(post))
    if (!translated) return []
    const sourceName = post[field] ?? currentFallback
    const translatedName = translated[field] ?? otherFallback
    return sourceName && translatedName ? [[sourceName, translatedName] as const] : []
  })
  const candidates = new Set(pairs.filter(([source]) => source === name).map(([, target]) => target))
  if (candidates.size !== 1) return paths

  const [translatedName] = candidates
  const reverse = new Set(pairs.filter(([, target]) => target === translatedName).map(([source]) => source))
  if (reverse.size === 1) paths[otherLocale] = pathFor(translatedName)
  return paths
}
