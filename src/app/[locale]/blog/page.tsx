import type { Metadata } from "next"
import Image from "next/image"
import { setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { SiteNavbar } from "@/app/_components/site-navbar"
import { BodyClassToggle } from "@/components/body-class-toggle"
import { Container } from "@/components/layout"
import { Section } from "@/components/section"
import { BlogCard, BlogCardGrid } from "@/design-system/components/blog-card"
import { collectionPageJsonLd, JsonLd } from "@/app/lib/json-ld"
import { canonicalFor, localeAlternates, ogLocale } from "@/app/lib/seo"
import {
  getBlogCategoryKey,
  getBlogCategoryPath,
  getBlogContent,
} from "./articles"
import {
  getResolvedBlogCategories,
  getResolvedBlogIndex,
  getResolvedBlogPosts,
} from "@/payload/loaders"
import { BlogSearch } from "./_blog-search"

type BlogPageProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string; q?: string; show?: string }>
}

const GRID_PAGE_SIZE = 6

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params
  const [index, posts] = await Promise.all([
    getResolvedBlogIndex(locale),
    getResolvedBlogPosts(locale),
  ])
  const featuredPost = posts[0]
  const featuredImage = featuredPost?.image

  return {
    title: index.metadataTitle,
    description: index.metadataDescription,
    alternates: {
      canonical: canonicalFor(locale, "/blog"),
      languages: localeAlternates("/blog"),
      types: {
        "application/rss+xml": canonicalFor(locale, "/blog/feed.xml"),
      },
    },
    openGraph: {
      title: index.metadataTitle,
      description: index.metadataDescription,
      url: canonicalFor(locale, "/blog"),
      type: "website",
      locale: ogLocale(locale),
      images: featuredImage
        ? [{ url: featuredImage, width: 1200, height: 630, alt: featuredPost?.alt }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: index.metadataTitle,
      description: index.metadataDescription,
      images: featuredImage ? [featuredImage] : undefined,
    },
  }
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale } = await params
  const { category: requestedCategory, q: requestedQuery, show: requestedShow } =
    await searchParams
  setRequestLocale(locale)

  const [categories, posts, index] = await Promise.all([
    getResolvedBlogCategories(locale),
    getResolvedBlogPosts(locale),
    getResolvedBlogIndex(locale),
  ])
  const content = getBlogContent(locale)
  const allLabel = categories[0]
  // Only offer categories that currently have articles.
  const usedCategories = new Set(posts.map((post) => post.category))
  const visibleCategories = [allLabel, ...categories.slice(1).filter((category) => usedCategories.has(category))]
  const activeCategory =
    requestedCategory && categories.slice(1).includes(requestedCategory)
      ? requestedCategory
      : allLabel

  const searchQuery = (requestedQuery ?? "").trim()
  const searchNeedle = searchQuery.toLocaleLowerCase(locale)
  const hasSearch = searchNeedle.length > 0

  const categoryFiltered =
    activeCategory === allLabel
      ? posts
      : posts.filter((post) => post.category === activeCategory)

  const filteredPosts = hasSearch
    ? categoryFiltered.filter((post) => {
        const haystack = `${post.title}\n${post.excerpt}`.toLocaleLowerCase(locale)
        return haystack.includes(searchNeedle)
      })
    : categoryFiltered

  const showFeatured = !hasSearch
  const featured = showFeatured ? filteredPosts[0] : undefined
  const paginatedPool = showFeatured ? filteredPosts.slice(1) : filteredPosts

  const requestedShowCount = Number.parseInt(requestedShow ?? "", 10)
  const shownCount =
    Number.isFinite(requestedShowCount) && requestedShowCount > GRID_PAGE_SIZE
      ? Math.min(requestedShowCount, paginatedPool.length)
      : GRID_PAGE_SIZE

  const gridPosts = paginatedPool.slice(0, shownCount)
  const hasMore = shownCount < paginatedPool.length

  const featuredVisible = featured
  const hasResults = filteredPosts.length > 0
  const hasFilters = activeCategory !== allLabel || hasSearch

  const buildUrl = ({
    category,
    q,
    show,
  }: {
    category?: string | null
    q?: string | null
    show?: number | null
  }) => {
    const query = new URLSearchParams()
    const nextCategory =
      category === undefined
        ? activeCategory !== allLabel
          ? activeCategory
          : null
        : category
    const nextQuery =
      q === undefined ? (searchQuery.length > 0 ? searchQuery : null) : q
    if (nextCategory) query.set("category", nextCategory)
    if (nextQuery) query.set("q", nextQuery)
    if (show && show > GRID_PAGE_SIZE) query.set("show", String(show))
    const qs = query.toString()
    return qs ? `/blog?${qs}` : "/blog"
  }

  const categoryHref = (category: string) =>
    category === allLabel ? "/blog" : getBlogCategoryPath(category)

  const viewMoreHref = buildUrl({ show: shownCount + GRID_PAGE_SIZE })
  const clearFiltersHref = "/blog"
  const collectionDescription = index.metadataDescription
  const authorName = content.article.authorName

  return (
    <>
      <BodyClassToggle className="ds-body--blog-index" />
      <JsonLd
        data={collectionPageJsonLd({
          locale,
          path: "/blog",
          name: index.metadataTitle,
          description: collectionDescription,
          items: filteredPosts.map((post) => ({
            name: post.title,
            url: post.href,
          })),
        })}
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
                          {authorName}
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
              <span>{index.heroTitleLine1}</span>
              <span>{index.heroTitleLine2}</span>
            </h1>
            <p className="ds-blog-page-copy">{index.metadataDescription}</p>
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
            <div className="ds-blog-category-inner">
              <div className="ds-blog-category-track" role="list">
                {visibleCategories.map((category) => (
                  <Link
                    key={category}
                    href={categoryHref(category)}
                    className="ds-blog-category-link"
                    data-active={category === activeCategory ? "true" : undefined}
                    data-category-key={category === allLabel ? "all" : getBlogCategoryKey(category)}
                    role="listitem"
                  >
                    {category}
                  </Link>
                ))}
              </div>
              <BlogSearch
                activeCategory={activeCategory === allLabel ? null : activeCategory}
                initialQuery={searchQuery}
                placeholder={index.searchPlaceholder}
                ariaLabel={index.searchAriaLabel}
                submitAriaLabel={index.searchSubmitAriaLabel}
              />
            </div>
          </nav>

          {hasFilters ? (
            <div className="ds-blog-filter-summary" role="status">
              <div className="ds-blog-filter-pills">
                {activeCategory !== allLabel ? (
                  <span className="ds-blog-filter-pill">{activeCategory}</span>
                ) : null}
                {hasSearch ? (
                  <span className="ds-blog-filter-pill">“{searchQuery}”</span>
                ) : null}
              </div>
              <Link className="ds-blog-filter-clear" href={clearFiltersHref}>
                {index.searchClearLabel}
              </Link>
            </div>
          ) : null}

          {hasResults ? (
            <BlogCardGrid>
              {gridPosts.map((post) => (
                <BlogCard
                  key={post.title}
                  post={post}
                  variant="index"
                  categoryKey={getBlogCategoryKey(post.category)}
                />
              ))}
            </BlogCardGrid>
          ) : (
            <div className="ds-blog-empty" role="status">
              <h3>{index.emptyStateHeading}</h3>
              <p>{index.emptyStateBody}</p>
              {hasFilters ? (
                <Link className="ds-blog-empty-clear" href={clearFiltersHref}>
                  {index.searchClearLabel}
                </Link>
              ) : null}
            </div>
          )}

          {hasMore ? (
            <div className="ds-blog-viewmore" aria-label={index.paginationAriaLabel}>
              <Link className="ds-button" href={viewMoreHref} scroll={false}>
                {index.viewMoreLabel}
              </Link>
            </div>
          ) : null}
        </Container>
      </Section>
    </>
  )
}
