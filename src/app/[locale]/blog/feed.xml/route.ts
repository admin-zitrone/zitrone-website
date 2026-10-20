import { canonicalFor } from "@/app/lib/seo"
import { getResolvedBlogIndex, getResolvedBlogPosts } from "@/payload/loaders"
import { postModifiedIsoDate, postPublishedIsoDate } from "../articles"

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

type FeedRouteContext = {
  params: Promise<{ locale: string }>
}

export async function GET(_request: Request, context: FeedRouteContext) {
  const { locale } = await context.params
  const [index, posts] = await Promise.all([
    getResolvedBlogIndex(locale),
    getResolvedBlogPosts(locale),
  ])

  const feedUrl = canonicalFor(locale, "/blog/feed.xml")
  const blogUrl = canonicalFor(locale, "/blog")
  const lastBuildDate = posts[0]
    ? new Date(postModifiedIsoDate(posts[0])).toUTCString()
    : new Date().toUTCString()

  const items = posts
    .map((post) => {
      const url = canonicalFor(locale, `/blog/${post.slug}`)
      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <pubDate>${new Date(postPublishedIsoDate(post)).toUTCString()}</pubDate>
          <description>${escapeXml(post.excerpt)}</description>
          <category>${escapeXml(post.category)}</category>
        </item>`
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(index.metadataTitle)}</title>
    <link>${blogUrl}</link>
    <description>${escapeXml(index.metadataDescription)}</description>
    <language>${locale}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
