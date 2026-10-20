import { buildSiteSitemap } from "./lib/site-sitemap"
import { getResolvedBlogCategories, getResolvedBlogPosts } from "@/payload/loaders"

export default async function sitemap() {
  const [esPosts, enPosts, esCategories, enCategories] = await Promise.all([
    getResolvedBlogPosts("es"),
    getResolvedBlogPosts("en"),
    getResolvedBlogCategories("es"),
    getResolvedBlogCategories("en"),
  ])

  return buildSiteSitemap({
    es: { posts: esPosts, categories: esCategories },
    en: { posts: enPosts, categories: enCategories },
  })
}
