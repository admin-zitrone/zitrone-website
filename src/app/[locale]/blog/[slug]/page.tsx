import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { ArticleFaq } from "@/components/article-faq"
import { ArticleToc } from "@/components/article-toc"
import { RevealInit } from "@/components/reveal-init"
import { RegisterLangAlternates } from "@/components/lang-alternates"
import { Button } from "@/components/button"
import { Container } from "@/components/layout"
import { Section } from "@/components/section"
import { RecommendedCard, RecommendedGrid } from "@/design-system/components/blog-card"
import { Copy, Heading, HeadingAccent, Kicker } from "@/components/typography"
import { blogPostingJsonLd, breadcrumbJsonLd, faqPageJsonLd, JsonLd, webPageJsonLd } from "@/app/lib/json-ld"
import { canonicalFor, localizedAlternates, ogLocale } from "@/app/lib/seo"
import {
  getBlogAuthorPath,
  getBlogCategoryPath,
  getBlogCategoryKey,
  getBlogContent,
  getBlogReviewerPath,
  postModifiedIsoDate,
  postPublishedIsoDate,
} from "../articles"
import {
  getAllResolvedBlogSlugs,
  getResolvedBlogPost,
  getResolvedBlogPostPaths,
  getResolvedRecommendedPosts,
} from "@/payload/loaders"

type BlogPostPageProps = {
  params: Promise<{
    locale: string
    slug: string
  }>
}

// Slugs are localized: each locale only pre-renders its own.
export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const slugs = await getAllResolvedBlogSlugs(params.locale)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const { article } = getBlogContent(locale)
  const post = await getResolvedBlogPost(locale, slug)

  if (!post) {
    return {
      title: article.notFoundTitle,
    }
  }

  const fullTitle = post.seo?.title ?? `${post.title}${article.metadataSuffix}`
  const description = post.seo?.description ?? post.excerpt
  const path = `/blog/${slug}`
  const publishedIsoDate = postPublishedIsoDate(post)
  const modifiedIsoDate = postModifiedIsoDate(post)
  const authorName = post.authorName ?? article.authorName

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalFor(locale, path),
      languages: localizedAlternates(await getResolvedBlogPostPaths(locale, slug)),
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalFor(locale, path),
      type: "article",
      locale: ogLocale(locale),
      publishedTime: publishedIsoDate,
      modifiedTime: modifiedIsoDate,
      authors: [authorName],
      images: [{ url: post.image, width: 1200, height: 630, alt: post.alt }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@ZitroneNatural",
      title: post.title,
      description,
      images: [post.image],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const { article } = getBlogContent(locale)
  const post = await getResolvedBlogPost(locale, slug)

  if (!post) {
    notFound()
  }

  const [recommendedPosts, langAlternates] = await Promise.all([
    getResolvedRecommendedPosts(locale, post.slug),
    getResolvedBlogPostPaths(locale, post.slug),
  ])
  const shareSubject = encodeURIComponent(post.title)
  const shareBody = encodeURIComponent(`${article.shareSubjectPrefix}${post.title}`)
  const publishedIsoDate = postPublishedIsoDate(post)
  const modifiedIsoDate = postModifiedIsoDate(post)
  const authorName = post.authorName ?? article.authorName
  const reviewedByName = post.reviewedByName ?? article.reviewedByName

  return (
    <>
      <RegisterLangAlternates pathname={`/blog/${post.slug}`} alternates={langAlternates} />
      <JsonLd data={blogPostingJsonLd(locale, post, publishedIsoDate, modifiedIsoDate)} />
      <JsonLd
        data={webPageJsonLd({
          locale,
          path: `/blog/${post.slug}`,
          name: post.title,
          description: post.excerpt,
        })}
      />
      {post.faqs.length > 0 && <JsonLd data={faqPageJsonLd(post.faqs)} />}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: article.breadcrumbHome, url: canonicalFor(locale, "") },
          { name: article.breadcrumbBlog, url: canonicalFor(locale, "/blog") },
          { name: post.title, url: canonicalFor(locale, `/blog/${post.slug}`) },
        ])}
      />
      <RevealInit />
      <Section className="ds-article-hero" size="hero">
        <Container>
          <div className="ds-article-header">
            <Link href="/blog" className="ds-article-back-link">
              {article.backLinkLabel}
            </Link>
            <Link
              href={getBlogCategoryPath(post.category)}
              className="ds-blog-category-link ds-article-eyebrow"
              data-category-key={getBlogCategoryKey(post.category)}
            >
              {post.category}
            </Link>
            <h1 className="ds-article-title">{post.title}</h1>
            <p className="ds-article-deck">{post.excerpt}</p>

            <div className="ds-article-byline" aria-label={article.metaCardAriaLabel}>
              <Link href={getBlogAuthorPath(authorName)}>{authorName}</Link>
              <span aria-hidden="true">·</span>
              <span>{post.readTime}</span>
              <span aria-hidden="true">·</span>
              <span>{post.date}</span>
            </div>

            <div className="ds-article-share-row">
              <a className="ds-article-share-button" href={`mailto:?subject=${shareSubject}&body=${shareBody}`}>
                <svg width="13" height="16" viewBox="0 0 13 16" fill="none" aria-hidden="true">
                  <path d="M9.33398 2.95638L8.32815 3.96221L7.2019 2.83596V10.748H5.7994V2.83596L4.67315 3.96221L3.66732 2.95638L6.50065 0.123047L9.33398 2.95638ZM12.1673 6.49805V14.2897C12.1673 15.0689 11.5298 15.7064 10.7507 15.7064H2.25065C1.4644 15.7064 0.833984 15.0689 0.833984 14.2897V6.49805C0.833984 5.7118 1.4644 5.08138 2.25065 5.08138H4.37565V6.49805H2.25065V14.2897H10.7507V6.49805H8.62565V5.08138H10.7507C11.5298 5.08138 12.1673 5.7118 12.1673 6.49805Z" fill="currentColor" />
                </svg>
                {article.shareLabel}
              </a>
              <div className="ds-article-review-note">
                <span>{article.reviewedByLabel}</span>
                <strong>
                  <Link href={getBlogReviewerPath(reviewedByName)}>{reviewedByName}</Link>
                </strong>
              </div>
            </div>
          </div>

          <figure className="ds-article-hero-image">
            <Image src={post.image} alt={post.alt} width={1500} height={880} sizes="(max-width: 64rem) 100vw, (max-width: 105rem) 90vw, 1512px" preload />
          </figure>
        </Container>
      </Section>

      <Section className="ds-article-body-section">
        <Container>
          <div className="ds-article-layout ds-article-layout--index-left">
            <ArticleToc
              heading={article.onThisPageHeading}
              ariaLabel={article.onThisPageAriaLabel}
              toggleLabel={article.tocToggleLabel}
              items={post.sections.map((section) => ({
                id: section.id,
                title: section.title,
              }))}
            />

            <article className="ds-article-content">
              <section className="ds-article-takeaways ds-reveal" data-reveal="fade-up" aria-labelledby="takeaways-title">
                <h2 id="takeaways-title">{article.takeawaysHeading}</h2>
                <ul>
                  {post.takeaways.map((takeaway) => (
                    <li key={takeaway}>{takeaway}</li>
                  ))}
                </ul>
              </section>

              <div className="ds-article-rich">
                {post.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                {post.sections.map((section) => (
                  <section key={section.id} id={section.id} className="ds-reveal" data-reveal="fade-up">
                    <h2>{section.title}</h2>
                    {section.image ? (
                      <figure>
                        <Image src={section.image} alt={section.alt ?? ""} width={1200} height={760} sizes="(max-width: 64rem) 100vw, (max-width: 105rem) 53vw, 882px" />
                      </figure>
                    ) : null}
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.checklist?.length ? (
                      <ul>
                        {section.checklist.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    ) : null}
                    {section.links?.map((link) => (
                      <p key={link.href}>
                        {link.before}<Link href={link.href}>{link.label}</Link>{link.after}
                      </p>
                    ))}
                  </section>
                ))}
              </div>

              <section className="ds-article-inline-cta ds-reveal" data-reveal="fade-up" aria-labelledby="article-cta-title">
                <Kicker>{article.inlineCtaKicker}</Kicker>
                <h2 id="article-cta-title">
                  {post.cta ? post.cta.heading : <>
                    {article.inlineCtaLeading}
                    <em>{article.inlineCtaEmphasis}</em>
                    {article.inlineCtaTrailing}
                  </>}
                </h2>
                <Button href={post.cta?.href ?? article.inlineCtaHref} variant="accent">
                  {post.cta?.label ?? article.inlineCtaButton}
                </Button>
              </section>

              <div className="ds-reveal" data-reveal="fade-up">
                <ArticleFaq
                  title={article.faqHeading}
                  titleId="faq-title"
                  items={post.faqs}
                />
              </div>

              {post.topics && post.topics.length > 0 ? (
                <section className="ds-article-topics ds-reveal" data-reveal="fade-up" aria-labelledby="topics-title">
                  <h2 id="topics-title">{article.topicsHeading}</h2>
                  <ul>
                    {post.topics.map((topic) => (
                      <li key={topic} className="ds-article-topic">
                        {topic}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </article>

            <aside className="ds-article-right-rail" aria-hidden="true" />
          </div>
        </Container>
      </Section>

      <Section className="ds-article-recommended">
        <Container>
          <div className="ds-blog-section-head">
            <div>
              <Kicker>{article.recommendedKicker}</Kicker>
              <Heading>
                {article.recommendedHeadingLead}
                <HeadingAccent>{article.recommendedHeadingAccent}</HeadingAccent>
                {article.recommendedHeadingTrail}
              </Heading>
            </div>
            <Copy>{article.recommendedCopy}</Copy>
          </div>

          <RecommendedGrid>
            {recommendedPosts.map((recommendedPost) => (
              <RecommendedCard
                key={recommendedPost.slug}
                post={recommendedPost}
                categoryHref={getBlogCategoryPath(recommendedPost.category)}
                categoryKey={getBlogCategoryKey(recommendedPost.category)}
              />
            ))}
          </RecommendedGrid>
        </Container>
      </Section>
    </>
  )
}
