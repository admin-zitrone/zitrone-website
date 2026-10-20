/**
 * Seeds the throwaway CMS for blog-cache.test.ts before `next build`: one
 * admin and one published post in ES and EN, using a committed article's
 * slugs so the build pre-renders it. Prints SEED {...} for the runner.
 */
import { assertIsolatedDatabase } from "../api/harness"

assertIsolatedDatabase()
const { getPayload } = await import("payload")
const config = (await import("../../src/payload/payload.config")).default
const { getBlogContent } = await import("../../src/app/[locale]/blog/articles")
const payload = await getPayload({ config })

const es = getBlogContent("es").posts[0]
const en = getBlogContent("en").posts.find((post) => post.translationKey === es?.translationKey)
if (!es || !en) throw new Error("no ES/EN article pair in the static content")

await payload.create({
  collection: "users",
  data: { email: "cache.admin@example.invalid", password: "Cache-Synthetic-Pass-1!", role: "admin" },
})
const post = await payload.create({
  collection: "blogPosts",
  locale: "es",
  data: { title: "Título inicial de caché", slug: es.slug, excerpt: es.excerpt, _status: "published" },
})
await payload.update({
  collection: "blogPosts",
  id: post.id,
  locale: "en",
  data: { title: "Initial cache title", slug: en.slug, excerpt: en.excerpt, _status: "published" },
})
console.log(`SEED ${JSON.stringify({ id: post.id, es: es.slug, en: en.slug })}`)
process.exit(0)
