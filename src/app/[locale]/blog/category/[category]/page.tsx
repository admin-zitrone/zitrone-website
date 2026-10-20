import type { Metadata } from "next"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { SiteNavbar } from "@/app/_components/site-navbar"
import { BodyClassToggle } from "@/components/body-class-toggle"
import { Container } from "@/components/layout"
import { Section } from "@/components/section"
import { BlogCard, BlogCardGrid } from "@/design-system/components/blog-card"
import { breadcrumbJsonLd, collectionPageJsonLd, JsonLd } from "@/app/lib/json-ld"
import { canonicalFor, localeAlternates, ogLocale } from "@/app/lib/seo"
import {
  getBlogAuthorPath,
  getBlogCategoryFromSlug,
  getBlogCategoryKey,
  getBlogCategoryPath,
  getBlogContent,
} from "../../articles"
import {
  getResolvedBlogCategories,
  getResolvedBlogIndex,
  getResolvedBlogPosts,
} from "@/payload/loaders"

type BlogCategoryPageProps = {
  params: Promise<{ locale: string; category: string }>
  searchParams: Promise<{ page?: string }>
}

const GRID_PAGE_SIZE = 6

async function resolveCategoryState(locale: string, categorySlug: string) {
  const [categories, posts, index] = await Promise.all([
    getResolvedBlogCategories(locale),
    getResolvedBlogPosts(locale),
    getResolvedBlogIndex(locale),
  ])

  const allLabel = categories[0]
  const activeCategory = getBlogCategoryFromSlug(locale, categorySlug, categories.slice(1))

  if (!activeCategory || !allLabel) {
    return undefined
  }

  const filteredPosts = posts.filter((post) => post.category === activeCategory)

  // A real category with no articles right now (its posts were retired) sends
  // readers to the blog instead of an empty page or a 404. Temporary, so it
  // lifts on its own once the category has articles again.
  if (filteredPosts.length === 0) {
    redirect(`/${locale}/blog`)
  }

  const usedCategories = new Set(posts.map((post) => post.category))
  return {
    categories: [allLabel, ...categories.slice(1).filter((category) => usedCategories.has(category))],
    posts: filteredPosts,
    index,
    allLabel,
    activeCategory,
  }
}

export async function generateStaticParams() {
  const slugs = new Set<string>()

  for (const locale of ["en", "es"] as const) {
    for (const category of getBlogContent(locale).categories.slice(1)) {
      slugs.add(getBlogCategoryPath(category).split("/").pop() ?? "")
    }
  }

  return Array.from(slugs).map((category) => ({ category }))
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { locale, category: categorySlug } = await params
  const resolved = await resolveCategoryState(locale, categorySlug)

  if (!resolved) {
    return { title: "Category not found" }
  }

  const { index, activeCategory, posts } = resolved
  const path = getBlogCategoryPath(activeCategory)
  const title = `${activeCategory} — ${index.metadataTitle}`
  const description = `${index.metadataDescription} ${activeCategory}.`
  const featuredImage = posts[0]?.image

  return {
    title,
    description,
    alternates: {
      canonical: canonicalFor(locale, path),
      languages: localeAlternates(path),
      types: {
        "application/rss+xml": canonicalFor(locale, "/blog/feed.xml"),
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalFor(locale, path),
      type: "website",
      locale: ogLocale(locale),
      images: featuredImage ? [{ url: featuredImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: featuredImage ? [featuredImage] : undefined,
    },
  }
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: BlogCategoryPageProps) {
  const { locale, category: categorySlug } = await params
  const { page: requestedPage } = await searchParams
  setRequestLocale(locale)

  const resolved = await resolveCategoryState(locale, categorySlug)

  if (!resolved) {
    notFound()
  }

  const { categories, posts, index, allLabel, activeCategory } = resolved
  const content = getBlogContent(locale)
  const authorName = content.article.authorName
  const featured = posts[0]
  const paginatedPool = posts.slice(1)
  const totalPages = Math.max(1, Math.ceil(paginatedPool.length / GRID_PAGE_SIZE))
  const requestedPageNumber = Number.parseInt(requestedPage ?? "1", 10)
  const currentPage =
    Number.isFinite(requestedPageNumber) && requestedPageNumber > 0
      ? Math.min(Math.max(1, requestedPageNumber), totalPages)
      : 1
  const gridPosts = paginatedPool.slice(
    (currentPage - 1) * GRID_PAGE_SIZE,
    currentPage * GRID_PAGE_SIZE,
  )
  const featuredVisible = currentPage === 1 ? featured : undefined
  const prevPage = currentPage > 1 ? currentPage - 1 : null
  const nextPage = currentPage < totalPages ? currentPage + 1 : null
  const categoryPath = getBlogCategoryPath(activeCategory)

  const buildPageHref = (page: number | null) => {
    if (!page || page <= 1) return categoryPath
    const query = new URLSearchParams({ page: String(page) })
    return `${categoryPath}?${query.toString()}`
  }

  return (
    <>
      <BodyClassToggle className="ds-body--blog-index" />
      <JsonLd
        data={collectionPageJsonLd({
          locale,
          path: categoryPath,
          name: `${activeCategory} — ${index.metadataTitle}`,
          description: `${index.metadataDescription} ${activeCategory}.`,
          items: posts.map((post) => ({
            name: post.title,
            url: post.href,
          })),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: content.article.breadcrumbHome, url: canonicalFor(locale, "") },
          { name: content.article.breadcrumbBlog, url: canonicalFor(locale, "/blog") },
          { name: activeCategory, url: canonicalFor(locale, categoryPath) },
        ])}
      />

      <Section className="ds-blog-hero" tone="warm" size="hero" break="rounded-bottom">
        <Container>
          {featuredVisible ? (
            <article className="ds-blog-lead-story">
              <SiteNavbar locale={locale} variant="embedded" panelId="blog-nav-panel" />
              <Link
                href={featuredVisible.href}
                className="ds-blog-lead-link"
                aria-label={featuredVisible.title}
              >
                <div className="ds-blog-lead-media">
                  <Image
                    src={featuredVisible.image}
                    alt={featuredVisible.alt || featuredVisible.title}
                    width={1680}
                    height={980}
                    // Same slot as the blog index lead. Without sizes the
                    // srcset was density-based, so phones fetched 3840w.
                    sizes="(max-width: 64rem) 100vw, (max-width: 105rem) 90vw, 1512px"
                    preload
                  />
                </div>
                <div className="ds-blog-lead-overlay" />
                <div className="ds-blog-lead-content">
                  <div className="ds-blog-lead-main">
                    <span
                      className="ds-blog-chip"
                      data-category-key={getBlogCategoryKey(featuredVisible.category)}
                    >
                      {featuredVisible.category}
                    </span>
                    <h2 className="ds-blog-lead-title">{featuredVisible.title}</h2>
                  </div>
                  <div className="ds-blog-lead-side">
                    <div className="ds-blog-lead-byline">
                      <span className="ds-blog-lead-avatar" aria-hidden="true">
                        Z
                      </span>
                      <div className="ds-blog-lead-author-block">
                        <p className="ds-blog-lead-author">
                          <Link href={getBlogAuthorPath(authorName)}>{authorName}</Link>
                        </p>
                        <p className="ds-blog-lead-details">
                          <span>{featuredVisible.date}</span>
                          <span aria-hidden="true">•</span>
                          <span>{featuredVisible.readTime}</span>
                        </p>
                      </div>
                    </div>
                    <p className="ds-blog-lead-excerpt">{featuredVisible.excerpt}</p>
                  </div>
                </div>
              </Link>
            </article>
          ) : null}

          <div className="ds-blog-page-intro">
            <p className="ds-blog-page-kicker">{index.allArticlesKicker}</p>
            <h1 className="ds-blog-page-title">
              <span>{activeCategory}</span>
            </h1>
            <p className="ds-blog-page-copy">{index.allArticlesCopy}</p>
          </div>
        </Container>
      </Section>

      <Section
        className="ds-blog-index"
        tone="warm"
        id="articles"
        aria-labelledby="articles-heading"
      >
        <Container>
          <h2 id="articles-heading" className="ds-visually-hidden">
            {index.allArticlesKicker}
          </h2>
          <nav className="ds-blog-category-bar" aria-label={index.categoryNavAriaLabel}>
            <div className="ds-blog-category-track" role="list">
              <Link
                href="/blog"
                className="ds-blog-category-link"
                data-active={undefined}
                data-category-key="all"
                role="listitem"
              >
                {allLabel}
              </Link>
              {categories.slice(1).map((category) => (
                <Link
                  key={category}
                  href={getBlogCategoryPath(category)}
                  className="ds-blog-category-link"
                  data-active={category === activeCategory ? "true" : undefined}
                  data-category-key={getBlogCategoryKey(category)}
                  role="listitem"
                >
                  {category}
                </Link>
              ))}
            </div>
          </nav>

          <BlogCardGrid>
            {gridPosts.map((post) => (
              <BlogCard key={post.title} post={post} variant="listing" />
            ))}
          </BlogCardGrid>

          {totalPages > 1 ? (
            <nav className="ds-blog-pagination" aria-label={index.paginationAriaLabel}>
              {prevPage ? (
                <Link href={buildPageHref(prevPage)} aria-label={index.paginationPreviousAriaLabel}>
                  <svg width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true">
                    <path d="M7.19138 2.52341C7.36179 2.35158 7.5938 2.25492 7.83596 2.25492C8.07812 2.25492 8.31012 2.35158 8.48054 2.52341C8.65237 2.69383 8.74903 2.92584 8.74903 3.16799C8.74903 3.41015 8.65237 3.64215 8.48054 3.81257L3.66926 8.61473H16.5246C16.849 8.61473 17.1487 8.78777 17.3108 9.06862C17.4729 9.34947 17.4729 9.69557 17.3108 9.97641C17.1487 10.2573 16.849 10.4303 16.5246 10.4303H3.66926L8.48054 15.2325C8.71073 15.4629 8.8007 15.7984 8.71641 16.1129C8.63211 16.4276 8.38652 16.6732 8.07182 16.7575C7.75734 16.8418 7.4218 16.7518 7.19137 16.5216L0.836847 10.1671C0.665016 9.99669 0.56836 9.76468 0.56836 9.52252C0.56836 9.28036 0.665016 9.04837 0.836848 8.87794L7.19138 2.52341Z" fill="currentColor" />
                  </svg>
                </Link>
              ) : (
                <span className="ds-blog-pagination-disabled" aria-hidden="true">
                  <svg width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true">
                    <path d="M7.19138 2.52341C7.36179 2.35158 7.5938 2.25492 7.83596 2.25492C8.07812 2.25492 8.31012 2.35158 8.48054 2.52341C8.65237 2.69383 8.74903 2.92584 8.74903 3.16799C8.74903 3.41015 8.65237 3.64215 8.48054 3.81257L3.66926 8.61473H16.5246C16.849 8.61473 17.1487 8.78777 17.3108 9.06862C17.4729 9.34947 17.4729 9.69557 17.3108 9.97641C17.1487 10.2573 16.849 10.4303 16.5246 10.4303H3.66926L8.48054 15.2325C8.71073 15.4629 8.8007 15.7984 8.71641 16.1129C8.63211 16.4276 8.38652 16.6732 8.07182 16.7575C7.75734 16.8418 7.4218 16.7518 7.19137 16.5216L0.836847 10.1671C0.665016 9.99669 0.56836 9.76468 0.56836 9.52252C0.56836 9.28036 0.665016 9.04837 0.836848 8.87794L7.19138 2.52341Z" fill="currentColor" />
                  </svg>
                </span>
              )}
              <span>{`${currentPage} / ${totalPages}`}</span>
              {nextPage ? (
                <Link href={buildPageHref(nextPage)} aria-label={index.paginationNextAriaLabel}>
                  <svg width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true">
                    <path d="M10.8086 2.52341C10.6382 2.35158 10.4062 2.25492 10.164 2.25492C9.92188 2.25492 9.68988 2.35158 9.51946 2.52341C9.34763 2.69383 9.25097 2.92584 9.25097 3.16799C9.25097 3.41015 9.34763 3.64215 9.51946 3.81257L14.3307 8.61473H1.47541C1.15099 8.61473 0.851314 8.78777 0.689209 9.06862C0.527103 9.34947 0.527103 9.69557 0.689209 9.97641C0.851314 10.2573 1.151 10.4303 1.47541 10.4303H14.3307L9.51946 15.2325C9.28927 15.4629 9.1993 15.7984 9.28359 16.1129C9.36789 16.4276 9.61348 16.6732 9.92818 16.7575C10.2427 16.8418 10.5782 16.7518 10.8086 16.5216L17.1632 10.1671C17.335 9.99669 17.4316 9.76468 17.4316 9.52252C17.4316 9.28036 17.335 9.04837 17.1632 8.87794L10.8086 2.52341Z" fill="currentColor" />
                  </svg>
                </Link>
              ) : (
                <span className="ds-blog-pagination-disabled" aria-hidden="true">
                  <svg width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true">
                    <path d="M10.8086 2.52341C10.6382 2.35158 10.4062 2.25492 10.164 2.25492C9.92188 2.25492 9.68988 2.35158 9.51946 2.52341C9.34763 2.69383 9.25097 2.92584 9.25097 3.16799C9.25097 3.41015 9.34763 3.64215 9.51946 3.81257L14.3307 8.61473H1.47541C1.15099 8.61473 0.851314 8.78777 0.689209 9.06862C0.527103 9.34947 0.527103 9.69557 0.689209 9.97641C0.851314 10.2573 1.151 10.4303 1.47541 10.4303H14.3307L9.51946 15.2325C9.28927 15.4629 9.1993 15.7984 9.28359 16.1129C9.36789 16.4276 9.61348 16.6732 9.92818 16.7575C10.2427 16.8418 10.5782 16.7518 10.8086 16.5216L17.1632 10.1671C17.335 9.99669 17.4316 9.76468 17.4316 9.52252C17.4316 9.28036 17.335 9.04837 17.1632 8.87794L10.8086 2.52341Z" fill="currentColor" />
                  </svg>
                </span>
              )}
            </nav>
          ) : null}
        </Container>
      </Section>
    </>
  )
}
