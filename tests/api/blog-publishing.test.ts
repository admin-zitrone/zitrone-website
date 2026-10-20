/**
 * Blog publishing lifecycle against a real (throwaway) CMS (audit A-04).
 *
 * With a CMS configured, Payload alone decides which posts exist: a draft is
 * never shown, unpublishing or deleting removes the post from the index, its
 * page, related posts, the sitemap and the feed, and a static article file with
 * the same slug must not bring it back. The ES/EN pair stays linked through
 * the shared document id even though the slugs differ.
 */
import assert from "node:assert/strict"
import { after, before, describe, test } from "node:test"

import { closeTestPayload, getTestPayload } from "./harness"

type Loaders = typeof import("../../src/payload/loaders/blog")

let loaders: Loaders
let staticEs: { slug: string; title: string; excerpt: string; sections: { id: string }[] }
let staticEn: { slug: string; title: string; excerpt: string }

async function sitemapUrls() {
  const sitemap = (await import("../../src/app/sitemap")).default
  return (await sitemap()).map((entry) => entry.url)
}

async function feed(locale: "es" | "en") {
  const { GET } = await import("../../src/app/[locale]/blog/feed.xml/route")
  const response = await GET(new Request(`http://localhost:3000/${locale}/blog/feed.xml`), {
    params: Promise.resolve({ locale }),
  })
  return response.text()
}

async function visible(slugEs: string, slugEn: string) {
  const [esPosts, enPosts, esPost, enPost, esSlugs, urls, esFeed] = await Promise.all([
    loaders.getResolvedBlogPosts("es"),
    loaders.getResolvedBlogPosts("en"),
    loaders.getResolvedBlogPost("es", slugEs),
    loaders.getResolvedBlogPost("en", slugEn),
    loaders.getAllResolvedBlogSlugs("es"),
    sitemapUrls(),
    feed("es"),
  ])
  return {
    inEsIndex: esPosts.some((post) => post.slug === slugEs),
    inEnIndex: enPosts.some((post) => post.slug === slugEn),
    esPost,
    enPost,
    inEsSlugs: esSlugs.includes(slugEs),
    inSitemap: urls.some((url) => url.endsWith(`/blog/${slugEs}`)),
    inEnSitemap: urls.some((url) => url.endsWith(`/blog/${slugEn}`)),
    inFeed: esFeed.includes(`/blog/${slugEs}`),
  }
}

function assertGone(state: Awaited<ReturnType<typeof visible>>, when: string) {
  assert.equal(state.inEsIndex, false, `${when}: not in the ES index`)
  assert.equal(state.inEnIndex, false, `${when}: not in the EN index`)
  assert.equal(state.esPost, undefined, `${when}: no ES page`)
  assert.equal(state.enPost, undefined, `${when}: no EN page`)
  assert.equal(state.inEsSlugs, false, `${when}: not pre-rendered`)
  assert.equal(state.inSitemap, false, `${when}: not in the sitemap`)
  assert.equal(state.inEnSitemap, false, `${when}: EN not in the sitemap`)
  assert.equal(state.inFeed, false, `${when}: not in the feed`)
}

describe("blog: CMS publishing lifecycle", () => {
  let postId: number | string

  before(async () => {
    const payload = await getTestPayload()
    await payload.delete({ collection: "blogPosts", where: { id: { exists: true } } })
    loaders = await import("../../src/payload/loaders/blog")
    assert.equal(loaders.getBlogContentSource(), "cms")

    // A real committed article, so the test proves its static file cannot
    // stand in for the CMS.
    const { getBlogContent } = await import("../../src/app/[locale]/blog/articles")
    const es = getBlogContent("es").posts[0]
    assert.ok(es)
    const en = getBlogContent("en").posts.find((post) => post.translationKey === es.translationKey)
    assert.ok(en, "the static ES article has an EN twin")
    staticEs = es as typeof staticEs
    staticEn = en
  })

  after(async () => {
    const payload = await getTestPayload()
    await payload.delete({ collection: "blogPosts", where: { id: { exists: true } } })
    await closeTestPayload()
  })

  test("an empty CMS is an empty blog: static files do not fill it", async () => {
    assertGone(await visible(staticEs.slug, staticEn.slug), "no CMS posts")
    assert.deepEqual(await loaders.getResolvedRecommendedPosts("es", "anything"), [])
  })

  test("a draft is not published by any fallback", async () => {
    const payload = await getTestPayload()
    const draft = await payload.create({
      collection: "blogPosts",
      locale: "es",
      draft: true,
      data: { title: "Borrador sintético", slug: staticEs.slug, excerpt: staticEs.excerpt, _status: "draft" },
    })
    postId = draft.id
    await payload.update({
      collection: "blogPosts",
      id: postId,
      locale: "en",
      draft: true,
      data: { title: "Synthetic draft", slug: staticEn.slug, excerpt: staticEn.excerpt },
    })
    assertGone(await visible(staticEs.slug, staticEn.slug), "draft")
  })

  test("publishing shows it in both languages, paired, enriched by the static file", async () => {
    const payload = await getTestPayload()
    await payload.update({
      collection: "blogPosts",
      id: postId,
      locale: "es",
      data: { title: "Título publicado", _status: "published" },
    })
    const state = await visible(staticEs.slug, staticEn.slug)
    assert.ok(state.inEsIndex && state.inEnIndex && state.inEsSlugs && state.inSitemap && state.inEnSitemap && state.inFeed)
    assert.equal(state.esPost?.title, "Título publicado")
    assert.equal(state.enPost?.title, "Synthetic draft")
    // Same document id on both sides: the language switch finds the twin.
    assert.equal(state.esPost?.translationKey, String(postId))
    assert.equal(state.enPost?.translationKey, String(postId))
    const paths = await loaders.getResolvedBlogPostPaths("es", staticEs.slug)
    assert.equal(paths.en, `/blog/${staticEn.slug}`)
    // Sections the CMS post left empty come from the static article.
    assert.equal(state.esPost?.sections.length, staticEs.sections.length)
  })

  test("editing a published post changes what is shown", async () => {
    const payload = await getTestPayload()
    await payload.update({ collection: "blogPosts", id: postId, locale: "es", data: { title: "Título editado" } })
    assert.equal((await loaders.getResolvedBlogPost("es", staticEs.slug))?.title, "Título editado")
  })

  test("unpublishing removes it everywhere, though its static file still ships", async () => {
    const payload = await getTestPayload()
    await payload.update({ collection: "blogPosts", id: postId, data: { _status: "draft" } })
    assertGone(await visible(staticEs.slug, staticEn.slug), "unpublished")
  })

  test("republishing recovers it", async () => {
    const payload = await getTestPayload()
    await payload.update({ collection: "blogPosts", id: postId, data: { _status: "published" } })
    const state = await visible(staticEs.slug, staticEn.slug)
    assert.ok(state.inEsIndex && state.esPost && state.enPost && state.inSitemap)
  })

  test("related posts never link to an unpublished post", async () => {
    const payload = await getTestPayload()
    const other = await payload.create({
      collection: "blogPosts",
      locale: "es",
      data: { title: "Otro artículo", slug: "otro-articulo-sintetico", excerpt: "Resumen.", _status: "published" },
    })
    let related = await loaders.getResolvedRecommendedPosts("es", "otro-articulo-sintetico")
    assert.deepEqual(related.map((post) => post.slug), [staticEs.slug])
    await payload.update({ collection: "blogPosts", id: postId, data: { _status: "draft" } })
    related = await loaders.getResolvedRecommendedPosts("es", "otro-articulo-sintetico")
    assert.deepEqual(related, [])
    await payload.delete({ collection: "blogPosts", id: other.id })
    await payload.update({ collection: "blogPosts", id: postId, data: { _status: "published" } })
  })

  test("deleting removes it everywhere", async () => {
    const payload = await getTestPayload()
    await payload.delete({ collection: "blogPosts", id: postId })
    assertGone(await visible(staticEs.slug, staticEn.slug), "deleted")
  })
})
