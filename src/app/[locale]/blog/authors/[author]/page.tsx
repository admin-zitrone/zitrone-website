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
  getBlogAuthorProfileFromSlug,
  getBlogAuthorPath,
  getBlogContent,
} from "../../articles"
import { getResolvedBlogPosts } from "@/payload/loaders"

type BlogAuthorPageProps = {
  params: Promise<{ locale: string; author: string }>
}

function profileJsonLd(locale: string, profile: { name: string; role: string; bio: string; path: string; entityType: "Person" | "Organization" }) {
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
  const params: Array<{ locale: "en" | "es"; author: string }> = []
  for (const locale of ["en", "es"] as const) {
    const content = getBlogContent(locale)
    const posts = await getResolvedBlogPosts(locale)
    const uniqueNames = new Set<string>(
      posts.map((post) => post.authorName ?? content.article.authorName).filter(Boolean),
    )
    for (const name of uniqueNames) {
      params.push({
        locale,
        author: getBlogAuthorPath(name).split("/").pop() ?? "",
      })
    }
  }
  return params
}

export async function generateMetadata({ params }: BlogAuthorPageProps): Promise<Metadata> {
  const { locale, author } = await params
  const content = getBlogContent(locale)
  const posts = await getResolvedBlogPosts(locale)
  const profile = getBlogAuthorProfileFromSlug(locale, author, posts, content.article)

  if (!profile) {
    return { title: "Author not found" }
  }

  const otherPosts = await getResolvedBlogPosts(locale === "es" ? "en" : "es")
  const paths = blogProfileAlternatePaths({ locale, name: profile.name, kind: "author", posts, otherPosts })

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

export default async function BlogAuthorPage({ params }: BlogAuthorPageProps) {
  const { locale, author } = await params
  setRequestLocale(locale)

  const content = getBlogContent(locale)
  const posts = await getResolvedBlogPosts(locale)
  const profile = getBlogAuthorProfileFromSlug(locale, author, posts, content.article)

  if (!profile) {
    notFound()
  }

  const authoredPosts = posts.filter(
    (post) => (post.authorName ?? content.article.authorName) === profile.name,
  )

  const otherLocale = locale === "es" ? "en" : "es"
  const otherPosts = await getResolvedBlogPosts(otherLocale)
  const langAlternates = blogProfileAlternatePaths({ locale, name: profile.name, kind: "author", posts, otherPosts })

  return (
    <>
      <RegisterLangAlternates pathname={profile.path} alternates={{ ...langAlternates, [otherLocale]: langAlternates[otherLocale] ?? "/blog" }} />
      <JsonLd data={profileJsonLd(locale, profile)} />
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
          items: authoredPosts.map((post) => ({ name: post.title, url: post.href })),
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
            <p className="ds-blog-page-kicker">{locale === "es" ? "Autores" : "Authors"}</p>
            <h1 className="ds-blog-page-title">{profile.name}</h1>
            <p className="ds-blog-page-copy">{profile.summary}</p>
            <p className="ds-blog-profile-role">{profile.role}</p>
            <p className="ds-blog-profile-bio">{profile.bio}</p>
            <div className="ds-blog-profile-expertise" aria-label={locale === "es" ? "Áreas de experiencia" : "Areas of expertise"}>
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
            {authoredPosts.map((post, index) => (
              <BlogCard key={post.slug} post={post} variant="profile" priority={index < 3} />
            ))}
          </BlogCardGrid>
        </Container>
      </Section>
    </>
  )
}
