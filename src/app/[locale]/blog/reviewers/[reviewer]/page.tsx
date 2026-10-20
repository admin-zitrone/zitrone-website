import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { RegisterLangAlternates } from "@/components/lang-alternates"
import { Container } from "@/components/layout"
import { Section } from "@/components/section"
import { BlogCard, BlogCardGrid } from "@/design-system/components/blog-card"
import { breadcrumbJsonLd, collectionPageJsonLd, JsonLd, webPageJsonLd } from "@/app/lib/json-ld"
import { canonicalFor, localizedAlternates, ogLocale } from "@/app/lib/seo"
import { blogProfileAlternatePaths } from "@/app/lib/blog-profile-alternates"
import {
  getBlogReviewerPath,
  getBlogReviewerProfileFromSlug,
  getBlogContent,
} from "../../articles"
import { getResolvedBlogPosts } from "@/payload/loaders"

type BlogReviewerPageProps = {
  params: Promise<{ locale: string; reviewer: string }>
}

function reviewerProfileJsonLd(
  locale: string,
  profile: { name: string; bio: string; path: string; role: string; entityType: "Person" | "Organization" },
) {
  if (profile.entityType === "Person") {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.name,
      jobTitle: profile.role,
      description: profile.bio,
      url: canonicalFor(locale, profile.path),
      worksFor: {
        "@type": "Organization",
        name: "Zitrone",
        url: canonicalFor(locale, ""),
      },
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: profile.name,
    description: profile.bio,
    url: canonicalFor(locale, profile.path),
    parentOrganization: {
      "@type": "Organization",
      name: "Zitrone",
      url: canonicalFor(locale, ""),
    },
  }
}

export async function generateStaticParams() {
  const params: Array<{ locale: "en" | "es"; reviewer: string }> = []
  for (const locale of ["en", "es"] as const) {
    const content = getBlogContent(locale)
    const posts = await getResolvedBlogPosts(locale)
    const uniqueNames = new Set<string>(
      posts
        .map((post) => post.reviewedByName ?? content.article.reviewedByName)
        .filter(Boolean),
    )
    for (const name of uniqueNames) {
      params.push({
        locale,
        reviewer: getBlogReviewerPath(name).split("/").pop() ?? "",
      })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: BlogReviewerPageProps): Promise<Metadata> {
  const { locale, reviewer } = await params
  const content = getBlogContent(locale)
  const posts = await getResolvedBlogPosts(locale)
  const profile = getBlogReviewerProfileFromSlug(locale, reviewer, posts, content.article)

  if (!profile) {
    return { title: "Reviewer not found" }
  }

  const otherPosts = await getResolvedBlogPosts(locale === "es" ? "en" : "es")
  const paths = blogProfileAlternatePaths({ locale, name: profile.name, kind: "reviewer", posts, otherPosts })

  return {
    title: `${profile.name} — ${content.index.metadataTitle}`,
    description: profile.summary,
    alternates: {
      canonical: canonicalFor(locale, profile.path),
      languages: localizedAlternates(paths),
    },
    openGraph: {
      title: `${profile.name} — ${content.index.metadataTitle}`,
      description: profile.summary,
      url: canonicalFor(locale, profile.path),
      type: "profile",
      locale: ogLocale(locale),
    },
    twitter: {
      card: "summary",
      title: profile.name,
      description: profile.summary,
    },
  }
}

export default async function BlogReviewerPage({ params }: BlogReviewerPageProps) {
  const { locale, reviewer } = await params
  setRequestLocale(locale)

  const content = getBlogContent(locale)
  const posts = await getResolvedBlogPosts(locale)
  const profile = getBlogReviewerProfileFromSlug(locale, reviewer, posts, content.article)

  if (!profile) {
    notFound()
  }

  const reviewedPosts = posts.filter(
    (post) => (post.reviewedByName ?? content.article.reviewedByName) === profile.name,
  )

  const otherLocale = locale === "es" ? "en" : "es"
  const otherPosts = await getResolvedBlogPosts(otherLocale)
  const langAlternates = blogProfileAlternatePaths({ locale, name: profile.name, kind: "reviewer", posts, otherPosts })

  return (
    <>
      <RegisterLangAlternates pathname={profile.path} alternates={{ ...langAlternates, [otherLocale]: langAlternates[otherLocale] ?? "/blog" }} />
      <JsonLd data={reviewerProfileJsonLd(locale, profile)} />
      <JsonLd
        data={webPageJsonLd({
          locale,
          path: profile.path,
          name: profile.name,
          description: profile.summary,
          type: "AboutPage",
        })}
      />
      <JsonLd
        data={collectionPageJsonLd({
          locale,
          path: profile.path,
          name: profile.name,
          description: profile.summary,
          items: reviewedPosts.map((post) => ({ name: post.title, url: post.href })),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: content.article.breadcrumbHome, url: canonicalFor(locale, "") },
          { name: content.article.breadcrumbBlog, url: canonicalFor(locale, "/blog") },
          { name: profile.name, url: canonicalFor(locale, profile.path) },
        ])}
      />

      <Section className="ds-blog-profile-hero" tone="warm">
        <Container>
          <div className="ds-blog-page-intro ds-blog-profile-intro">
            <p className="ds-blog-page-kicker">{locale === "es" ? "Revisión editorial" : "Editorial review"}</p>
            <h1 className="ds-blog-page-title">{profile.name}</h1>
            <p className="ds-blog-page-copy">{profile.summary}</p>
            <p className="ds-blog-profile-role">{profile.role}</p>
            <p className="ds-blog-profile-bio">{profile.bio}</p>
            <div className="ds-blog-profile-expertise" aria-label={locale === "es" ? "Áreas de revisión" : "Review areas"}>
              {profile.expertise.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="ds-blog-index" tone="warm">
        <Container>
          <BlogCardGrid>
            {reviewedPosts.map((post, index) => (
              <BlogCard key={post.slug} post={post} variant="profile" priority={index < 3} />
            ))}
          </BlogCardGrid>
        </Container>
      </Section>
    </>
  )
}
