/**
 * Seed Payload from the existing hardcoded TypeScript content.
 *
 * Usage: npm run payload:seed
 *
 * Prerequisites:
 *   - DATABASE_URL is set in .env.local
 *   - PAYLOAD_SECRET is set in .env.local
 *   - PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD are set
 *   - `npm run payload:migrate` has been run successfully
 *
 * This script is idempotent: re-running it updates existing globals and
 * upserts collection items by stable slug/key. Re-seeding will not duplicate.
 */

import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import { getPayload } from "payload"

import payloadConfig from "../../src/payload/payload.config"
import { blogContentEn } from "../../src/app/[locale]/blog/content/en"
import { blogContentEs } from "../../src/app/[locale]/blog/content/es"
import { homeContentEn } from "../../src/app/_components/home/content/en"
import { homeContentEs } from "../../src/app/_components/home/content/es"
import { getPrivacyContent } from "../../src/app/lib/privacy-content"

const BLOG_CATEGORY_SLUGS: Record<string, string> = {
  "Culture & retention": "culture-retention",
  "Wellbeing & productivity": "wellbeing-productivity",
  "Building a program": "building-a-program",
  "Trust & standards": "trust-standards",
  "Cultura y retención": "culture-retention",
  "Bienestar y productividad": "wellbeing-productivity",
  "Construir un programa": "building-a-program",
  "Confianza y estándares": "trust-standards",
}

function internalLink(label: string, href: string) {
  return {
    type: "internal" as const,
    label,
    internalHref: href,
  }
}

function anchorLink(label: string, href: string) {
  return {
    type: "anchor" as const,
    label,
    anchor: href.replace(/^#/, ""),
  }
}

function siteLink(label: string, href: string) {
  return href.startsWith("#") ? anchorLink(label, href) : internalLink(label, href)
}

/**
 * Copies array row ids, by position, from a saved document onto new data.
 *
 * Arrays that are not localized share their rows across locales. Writing the
 * second locale without the first locale's row ids replaces the rows, which
 * wipes the first locale's localized text inside them (FAQ answers, footer
 * links). Reusing the ids updates the same rows instead.
 */
function withRowIds<T>(data: T, saved: unknown): T {
  if (Array.isArray(data)) {
    const rows = Array.isArray(saved) ? saved : []
    return data.map((item, index) => {
      const row = rows[index] as Record<string, unknown> | undefined
      const merged = withRowIds(item, row)
      if (merged && typeof merged === "object" && row && typeof row.id === "string") {
        return { ...merged, id: row.id }
      }
      return merged
    }) as T
  }
  if (data && typeof data === "object") {
    const source = (saved && typeof saved === "object" ? saved : {}) as Record<string, unknown>
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, withRowIds(value, source[key])]),
    ) as T
  }
  return data
}

function contactLink(label: string, href: string) {
  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
    return {
      type: "external" as const,
      label,
      externalHref: href,
    }
  }

  return {
    type: "internal" as const,
    label,
    internalHref: href,
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to seed Payload")
  }
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is required to seed Payload")
  }

  const payload = await getPayload({ config: payloadConfig })
  const scope = process.env.PAYLOAD_SEED_SCOPE ?? "all"

  if (scope === "home") {
    // Everything the home, navigation and footer read; no users, blog or privacy.
    await seedSiteSettings(payload)
    await seedHeader(payload)
    await seedFooter(payload)
    await seedFaqs(payload)
    const logoIdsByKey = await seedHomeLogos(payload)
    const serviceIds = await seedServiceCards(payload)
    const storyIds = await seedClientStories(payload, logoIdsByKey)
    await seedHomePage(payload, { logoIdsByKey, serviceIds, storyIds })
    console.log("\n✓ Home seed complete.\n")
    process.exit(0)
  }

  await ensureAdminUser(payload)
  await ensureClientAdmins(payload)
  await seedSiteSettings(payload)
  await seedHeader(payload)
  await seedFooter(payload)
  await seedFaqs(payload)
  await seedPrivacyNotice(payload)
  const categoryIds = await seedBlogCategories(payload)
  await seedBlogPosts(payload, categoryIds)
  const logoIdsByKey = await seedHomeLogos(payload)
  const serviceIds = await seedServiceCards(payload)
  const storyIds = await seedClientStories(payload, logoIdsByKey)
  await seedHomePage(payload, { logoIdsByKey, serviceIds, storyIds })

  console.log("\n✓ Seed complete.\n")
  process.exit(0)
}

async function ensureAdminUser(payload: Awaited<ReturnType<typeof getPayload>>) {
  const email = process.env.PAYLOAD_ADMIN_EMAIL
  const password = process.env.PAYLOAD_ADMIN_PASSWORD

  if (!email || !password) {
    console.warn(
      "⚠ Skipping admin user — set PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD to bootstrap one.",
    )
    return
  }

  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    console.log(`✓ Admin user already exists: ${email}`)
    return
  }

  await payload.create({
    collection: "users",
    data: { email, password, role: "admin", name: "Sebastian" },
  })
  console.log(`✓ Created admin user: ${email}`)
}

const CLIENT_ADMINS: Array<{ email: string; name: string; role: "admin" | "editor" }> = [
  { email: "opina@zitrone.com.mx", name: "Zitrone", role: "admin" },
]

async function ensureClientAdmins(payload: Awaited<ReturnType<typeof getPayload>>) {
  const { randomBytes } = await import("node:crypto")

  for (const { email, name, role } of CLIENT_ADMINS) {
    const existing = await payload.find({
      collection: "users",
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      console.log(`✓ Client user already exists: ${email}`)
      continue
    }

    // base64 alone can miss a character class the users collection requires.
    const tempPassword = `${randomBytes(18).toString("base64")}Aa1!`
    await payload.create({
      collection: "users",
      data: { email, password: tempPassword, role, name },
    })

    if (process.env.RESEND_API_KEY) {
      try {
        await payload.forgotPassword({ collection: "users", data: { email } })
        console.log(`✓ Created ${email} (${role}) — invite email sent via Resend`)
      } catch (error) {
        console.warn(`✓ Created ${email} (${role}) — temp password: ${tempPassword}`)
        console.warn(`  (forgotPassword failed: ${(error as Error).message})`)
      }
    } else {
      console.log(`✓ Created ${email} (${role})`)
      console.log(`  Temp password (Resend not configured): ${tempPassword}`)
      console.log(`  Share this securely. Once Resend is configured, the user can use "Forgot password" instead.`)
    }
  }
}

async function seedSiteSettings(payload: Awaited<ReturnType<typeof getPayload>>) {
  const es = homeContentEs.sections.footer
  const en = homeContentEn.sections.footer

  for (const locale of ["es", "en"] as const) {
    const footer = locale === "es" ? es : en
    const saved = await payload.findGlobal({ slug: "siteSettings", locale: "es", depth: 0 })
    await payload.updateGlobal({
      slug: "siteSettings",
      locale,
      data: withRowIds({
        brand: {
          name: "Zitrone",
          tagline: footer.tagline,
        },
        contacts: {
          primaryEmail:
            footer.contactLinks.find((l) => l.href.startsWith("mailto:"))
              ?.href.replace("mailto:", "") || "hola@zitrone.mx",
          phone:
            footer.contactLinks.find((l) => l.href.startsWith("tel:"))
              ?.href.replace("tel:", "") || undefined,
          address: footer.address.map((line) => ({ line })),
        },
      }, saved),
    })
  }
  console.log("✓ Seeded siteSettings")
}

async function seedHeader(payload: Awaited<ReturnType<typeof getPayload>>) {
  for (const locale of ["es", "en"] as const) {
    const content = locale === "es" ? homeContentEs : homeContentEn
    const saved = await payload.findGlobal({ slug: "header", locale: "es", depth: 0 })
    await payload.updateGlobal({
      slug: "header",
      locale,
      data: withRowIds({
        navAriaLabel: content.sections.hero.navAriaLabel,
        primaryNav: content.primaryNav.map((item) => ({
          link: siteLink(item.label, item.href),
        })),
        primaryCta: internalLink(
          content.sections.hero.cta.label,
          content.sections.hero.cta.href,
        ),
      }, saved),
    })
  }
  console.log("✓ Seeded header")
}

async function seedFooter(payload: Awaited<ReturnType<typeof getPayload>>) {
  for (const locale of ["es", "en"] as const) {
    const content = locale === "es" ? homeContentEs : homeContentEn
    const footer = content.sections.footer
    const saved = await payload.findGlobal({ slug: "footer", locale: "es", depth: 0 })

    await payload.updateGlobal({
      slug: "footer",
      locale,
      data: withRowIds({
        ariaLabel: footer.ariaLabel,
        tagline: footer.tagline,
        taglineEmphasis: footer.taglineEmphasis,
        ctaPrimary: internalLink(footer.ctaPrimary.label, footer.ctaPrimary.href),
        ctaSecondary: internalLink(footer.ctaSecondary.label, footer.ctaSecondary.href),
        columns: content.footerColumns.map((column) => ({
          label: column.label,
          links: column.links.map((link) => ({
            link: internalLink(link.label, link.href),
          })),
        })),
        contact: {
          label: footer.contactLabel,
          address: footer.address.map((line) => ({ line })),
          links: footer.contactLinks.map((link) => ({
            link: contactLink(link.label, link.href),
          })),
        },
        legal: {
          copyright: footer.legal.copyright,
          links: footer.legal.links.map((link) => ({
            link: internalLink(link.label, link.href),
          })),
        },
        socialsLabel: footer.socialsLabel,
        socialLinks: footer.socialLinks.map((link) => ({
          icon: link.icon,
          label: link.label,
          href: link.href,
        })),
      }, saved),
    })
  }
  console.log("✓ Seeded footer")
}

async function seedFaqs(payload: Awaited<ReturnType<typeof getPayload>>) {
  // FAQs from each language are written as separate documents per locale,
  // then later you can merge them into single docs once translations are
  // verified equivalent.
  for (let index = 0; index < homeContentEs.faqs.length; index++) {
    const es = homeContentEs.faqs[index]
    const en = homeContentEn.faqs[index]
    if (!es) continue

    const slugTag = `faq-${index + 1}`
    const existing = await payload.find({
      collection: "faqs",
      where: { tags: { contains: slugTag } },
      limit: 1,
    })

    const data = {
      question: es.question,
      answer: es.answer.map((paragraph) => ({ paragraph })),
      tags: [slugTag],
      _status: "published" as const,
    }

    let id: string | number
    if (existing.totalDocs > 0 && existing.docs[0]) {
      const updated = await payload.update({
        collection: "faqs",
        id: existing.docs[0].id,
        locale: "es",
        data,
      })
      id = updated.id
    } else {
      const created = await payload.create({
        collection: "faqs",
        locale: "es",
        data,
      })
      id = Number(created.id)
    }

    if (en) {
      const saved = await payload.findByID({ collection: "faqs", id, locale: "es", depth: 0 })
      await payload.update({
        collection: "faqs",
        id,
        locale: "en",
        data: withRowIds(
          {
            question: en.question,
            answer: en.answer.map((paragraph) => ({ paragraph })),
            _status: "published" as const,
          },
          saved,
        ),
      })
    }
  }
  console.log(`✓ Seeded ${homeContentEs.faqs.length} FAQs`)
}

async function seedPrivacyNotice(payload: Awaited<ReturnType<typeof getPayload>>) {
  for (const locale of ["es", "en"] as const) {
    const content = getPrivacyContent(locale)
    const [responsibleLabel = "", responsibleBody = "", ...introBody] = content.intro

    await payload.updateGlobal({
      slug: "privacyNotice",
      locale,
      data: {
        metaTitle: content.metaTitle,
        metaDescription: content.metaDescription,
        kicker: content.kicker,
        title: content.title,
        responsibleLabel,
        responsibleBody,
        intro: introBody.map((paragraph) => ({ paragraph })),
        sections: content.sections.map((section) => ({
          heading: section.heading,
          paragraphs: section.paragraphs.map((paragraph) => ({ paragraph })),
        })),
        lastUpdated: "2026-04-30T00:00:00.000Z",
      },
    })
  }

  console.log("✓ Seeded privacy notice")
}

async function seedBlogCategories(payload: Awaited<ReturnType<typeof getPayload>>) {
  const englishCategories = blogContentEn.categories.slice(1)
  const spanishCategories = blogContentEs.categories.slice(1)
  const categoryIds = new Map<string, string | number>()

  for (let index = 0; index < englishCategories.length; index++) {
    const en = englishCategories[index]
    const es = spanishCategories[index]

    if (!en || !es) continue

    const slug = BLOG_CATEGORY_SLUGS[en]
    if (!slug) continue

    const existing = await payload.find({
      collection: "blogCategories",
      where: { slug: { equals: slug } },
      limit: 1,
    })

    let id: string | number
    if (existing.totalDocs > 0 && existing.docs[0]) {
      const updated = await payload.update({
        collection: "blogCategories",
        id: existing.docs[0].id,
        locale: "en",
        data: { name: en, slug },
      })
      id = updated.id
    } else {
      const created = await payload.create({
        collection: "blogCategories",
        locale: "en",
        data: { name: en, slug },
      })
      id = Number(created.id)
    }

    await payload.update({
      collection: "blogCategories",
      id,
      locale: "es",
      data: { name: es },
    })

    categoryIds.set(slug, id)
  }

  console.log(`✓ Seeded ${categoryIds.size} blog categories`)
  return categoryIds
}

async function seedBlogPosts(
  payload: Awaited<ReturnType<typeof getPayload>>,
  categoryIds: Map<string, string | number>,
) {
  for (let index = 0; index < blogContentEn.posts.length; index++) {
    const en = blogContentEn.posts[index]
    const es = blogContentEs.posts[index]

    if (!en || !es) continue

    console.log(`↻ Seeding blog post ${index + 1}/${blogContentEn.posts.length}: ${en.slug}`)

    const categorySlug = BLOG_CATEGORY_SLUGS[en.category]
    const categoryId = normalizeRelationId(
      categorySlug ? categoryIds.get(categorySlug) : undefined,
    )

    const baseData = {
      slug: en.slug,
      heroImageSrc: en.image,
      category: categoryId,
      publishedAt: toPublishedAt(en.date),
      tags: [categorySlug ?? "blog"],
    }

    const enData = {
      ...baseData,
      title: en.title,
      excerpt: en.excerpt,
      heroImageAlt: en.alt,
      dateLabel: en.date,
      readTime: en.readTime,
      intro: en.intro.map((paragraph) => ({ paragraph })),
      takeaways: en.takeaways.map((item) => ({ item })),
      sections: en.sections.map((section) => ({
        id: section.id,
        title: section.title,
        body: section.body.map((paragraph) => ({ paragraph })),
        imageSrc: section.image,
        imageAlt: section.alt,
      })),
      faqs: en.faqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      })),
      _status: "published" as const,
    }

    const existing = await payload.find({
      collection: "blogPosts",
      where: { slug: { equals: en.slug } },
      limit: 1,
    })

    let id: string | number
    if (existing.totalDocs > 0 && existing.docs[0]) {
      const updated = await payload.update({
        collection: "blogPosts",
        id: existing.docs[0].id,
        locale: "en",
        data: enData,
      })
      id = updated.id
    } else {
      const created = await payload.create({
        collection: "blogPosts",
        locale: "en",
        data: enData,
      })
      id = Number(created.id)
    }

    await payload.update({
      collection: "blogPosts",
      id,
      locale: "es",
      data: {
        ...baseData,
        title: es.title,
        excerpt: es.excerpt,
        heroImageAlt: es.alt,
        dateLabel: es.date,
        readTime: es.readTime,
        intro: es.intro.map((paragraph) => ({ paragraph })),
        takeaways: es.takeaways.map((item) => ({ item })),
        sections: es.sections.map((section) => ({
          id: section.id,
          title: section.title,
          body: section.body.map((paragraph) => ({ paragraph })),
          imageSrc: section.image,
          imageAlt: section.alt,
        })),
        faqs: es.faqs.map((faq) => ({
          question: faq.question,
          answer: faq.answer,
        })),
        _status: "published" as const,
      },
    })

    console.log(`✓ Seeded blog post: ${en.slug}`)
  }

  console.log(`✓ Seeded ${blogContentEn.posts.length} blog posts`)
}

function mimeFromPath(path: string): string {
  if (path.endsWith(".svg")) return "image/svg+xml"
  if (path.endsWith(".png")) return "image/png"
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg"
  if (path.endsWith(".webp")) return "image/webp"
  return "application/octet-stream"
}

const mediaCache = new Map<string, Promise<number | null>>()

/* Sections upload their images in parallel and reuse photos, so the same file
   can be requested twice at once. Sharing the in-flight upload keeps it to one. */
function uploadMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  publicPath: string,
  altEs: string,
  altEn?: string,
): Promise<number | null> {
  const cached = mediaCache.get(publicPath)
  if (cached) return cached
  const upload = uploadMediaFile(payload, publicPath, altEs, altEn)
  mediaCache.set(publicPath, upload)
  return upload
}

async function uploadMediaFile(
  payload: Awaited<ReturnType<typeof getPayload>>,
  publicPath: string,
  altEs: string,
  altEn?: string,
): Promise<number | null> {

  const fullPath = resolve(process.cwd(), "public", publicPath.replace(/^\//, ""))
  let buffer: Buffer
  try {
    buffer = readFileSync(fullPath)
  } catch {
    console.warn(`  ⚠ media file not found, skipping: ${publicPath}`)
    return null
  }

  // Named after the whole path: different folders reuse names (clients/henkel.svg
  // and clients/mono/henkel.svg), and a bare name would match the wrong file.
  const filename = publicPath.replace(/^\/+(img\/)?/, "").replace(/\//g, "-")
  // Media converts raster uploads to webp, so photo.jpg is stored as photo.webp.
  // Looking up only the source name never matched and re-uploaded on every run.
  const storedName = filename.endsWith(".svg")
    ? filename
    : filename.replace(/\.[^.]+$/, ".webp")

  const existing = await payload.find({
    collection: "media",
    where: { filename: { in: [filename, storedName] } },
    limit: 1,
  })

  if (existing.totalDocs > 0 && existing.docs[0]) {
    const id = Number(existing.docs[0].id)
    await payload.update({
      collection: "media",
      id,
      locale: "es",
      data: { alt: altEs },
    })
    if (altEn && altEn !== altEs) {
      await payload.update({
        collection: "media",
        id,
        locale: "en",
        data: { alt: altEn },
      })
    }
    return id
  }

  const created = await payload.create({
    collection: "media",
    locale: "es",
    data: { alt: altEs },
    file: {
      data: buffer,
      name: filename,
      mimetype: mimeFromPath(filename),
      size: buffer.length,
    },
  })

  if (altEn && altEn !== altEs) {
    await payload.update({
      collection: "media",
      id: created.id,
      locale: "en",
      data: { alt: altEn },
    })
  }

  const id = Number(created.id)
  return id
}

async function seedHomeLogos(
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<Record<string, number>> {
  const ids: Record<string, number> = {}
  const allLogos = [
    ...homeContentEs.heroLogos.map((l) => ({ ...l, context: "hero" as const })),
    ...homeContentEs.sections.featuredMedia.logos.map((l) => ({
      ...l,
      context: "ribbon" as const,
    })),
  ]

  for (const logo of allLogos) {
    const existing = await payload.find({
      collection: "logos",
      where: { name: { equals: logo.id } },
      limit: 1,
    })

    const mediaId = await uploadMedia(payload, logo.src, logo.alt, logo.alt)
    if (!mediaId) continue
    const monoImage = logo.monoSrc
      ? await uploadMedia(payload, logo.monoSrc, logo.alt, logo.alt)
      : null

    if (existing.totalDocs > 0 && existing.docs[0]) {
      const id = Number(existing.docs[0].id)
      const currentContexts = Array.isArray(existing.docs[0].usageContext)
        ? existing.docs[0].usageContext
        : []
      const usageContext = Array.from(new Set([...currentContexts, logo.context]))

      await payload.update({
        collection: "logos",
        id,
        locale: "es",
        data: {
          image: mediaId,
          monoImage,
          alt: logo.alt,
          fit: logo.fit ?? "balanced",
          scale: logo.scale,
          usageContext,
        },
      })
      await payload.update({
        collection: "logos",
        id,
        locale: "en",
        data: { alt: logo.alt },
      })
      ids[logo.id] = id
      continue
    }

    const created = await payload.create({
      collection: "logos",
      locale: "es",
      data: {
        name: logo.id,
        image: mediaId,
        monoImage,
        alt: logo.alt,
        fit: logo.fit ?? "balanced",
        scale: logo.scale,
        usageContext: [logo.context],
      },
    })
    ids[logo.id] = Number(created.id)
  }
  console.log(`✓ Seeded ${Object.keys(ids).length} logos`)
  return ids
}

async function seedServiceCards(
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<Array<number>> {
  const ids: Array<number> = []

  for (let i = 0; i < homeContentEs.serviceCards.length; i++) {
    const es = homeContentEs.serviceCards[i]
    const en = homeContentEn.serviceCards[i]
    if (!es) continue
    const slug = `service-${i + 1}`

    const existing = await payload.find({
      collection: "services",
      where: { slug: { equals: slug } },
      limit: 1,
    })

    let id: number
    const mediaId = await uploadMedia(payload, es.image, es.title, en?.title)
    if (!mediaId) continue

    if (existing.totalDocs > 0 && existing.docs[0]) {
      id = Number(existing.docs[0].id)
    } else {
      const created = await payload.create({
        collection: "services",
        locale: "es",
        data: {
          slug,
          title: es.title,
          eyebrow: es.eyebrow,
          accent: es.accent,
          copy: es.copy,
          image: mediaId,
          href: es.href,
          ctaLabel: es.ctaLabel,
          relatedLinks: es.relatedLinks ?? [],
          _status: "published" as const,
        },
      })
      id = Number(created.id)
    }

    await payload.update({
      collection: "services",
      id,
      locale: "es",
      data: {
        slug,
        title: es.title,
        eyebrow: es.eyebrow,
        accent: es.accent,
        copy: es.copy,
        image: mediaId,
        href: es.href,
        ctaLabel: es.ctaLabel,
        relatedLinks: es.relatedLinks ?? [],
        _status: "published" as const,
      },
    })

    if (en) {
      await payload.update({
        collection: "services",
        id,
        locale: "en",
        data: {
          slug,
          title: en.title,
          eyebrow: en.eyebrow,
          accent: en.accent,
          copy: en.copy,
          image: mediaId,
          href: en.href,
          ctaLabel: en.ctaLabel,
          relatedLinks: en.relatedLinks ?? [],
          _status: "published" as const,
        },
      })
    }

    ids.push(id)
  }
  console.log(`✓ Seeded ${ids.length} services`)
  return ids
}

async function seedClientStories(
  payload: Awaited<ReturnType<typeof getPayload>>,
  logoIdsByKey: Record<string, string | number>,
): Promise<Array<number>> {
  const ids: Array<number> = []

  for (let i = 0; i < homeContentEs.clientStories.length; i++) {
    const es = homeContentEs.clientStories[i]
    const en = homeContentEn.clientStories[i]
    if (!es) continue
    const name = es.name

    const existing = await payload.find({
      collection: "stories",
      where: { name: { equals: name } },
      limit: 1,
    })

    let id: number
    const photoId = await uploadMedia(payload, es.image, es.imageAlt, en?.imageAlt)
    const logoMediaId = await uploadMedia(payload, es.logo, `${name} logo`)
    if (!photoId || !logoMediaId) continue

    if (existing.totalDocs > 0 && existing.docs[0]) {
      id = Number(existing.docs[0].id)
    } else {
      const created = await payload.create({
        collection: "stories",
        locale: "es",
        data: {
          name,
          label: es.label,
          role: es.role,
          logo: logoMediaId,
          logoFit: es.logoFit ?? "balanced",
          logoScale: es.logoScale,
          image: photoId,
          imageAlt: es.imageAlt,
          quote: es.quote,
          quoteHighlight: es.quoteHighlight,
          location: es.location,
          repeatsHero: es.repeatsHero ?? false,
          _status: "published" as const,
        },
      })
      id = Number(created.id)
    }

    await payload.update({
      collection: "stories",
      id,
      locale: "es",
      data: {
        name,
        label: es.label,
        role: es.role,
        logo: logoMediaId,
        logoFit: es.logoFit ?? "balanced",
        logoScale: es.logoScale,
        image: photoId,
        imageAlt: es.imageAlt,
        quote: es.quote,
        quoteHighlight: es.quoteHighlight,
        location: es.location,
        repeatsHero: es.repeatsHero ?? false,
        _status: "published" as const,
      },
    })

    if (en) {
      await payload.update({
        collection: "stories",
        id,
        locale: "en",
        data: {
          name,
          label: en.label,
          role: en.role,
          logo: logoMediaId,
          logoFit: en.logoFit ?? "balanced",
          logoScale: en.logoScale,
          image: photoId,
          imageAlt: en.imageAlt,
          quote: en.quote,
          quoteHighlight: en.quoteHighlight,
          location: en.location,
          repeatsHero: en.repeatsHero ?? false,
          _status: "published" as const,
        },
      })
    }

    ids.push(id)
  }
  void logoIdsByKey
  console.log(`✓ Seeded ${ids.length} client stories`)
  return ids
}

async function seedHomePage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  refs: {
    logoIdsByKey: Record<string, number>
    serviceIds: Array<number>
    storyIds: Array<number>
  },
) {
  const faqDocs = await payload.find({
    collection: "faqs",
    locale: "es",
    sort: "createdAt",
    limit: 50,
  })
  const faqIds = faqDocs.docs.map((d) => Number(d.id))

  for (const locale of ["es", "en"] as const) {
    const content = locale === "es" ? homeContentEs : homeContentEn
    const cl = content.componentLabels
    const rowId = (...parts: Array<string | number>) =>
      [locale, ...parts].join("-")

    const heroBlock = {
      id: rowId("hero"),
      blockType: "hero" as const,
      navAriaLabel: content.sections.hero.navAriaLabel,
      mobileNavAriaLabel: content.sections.hero.mobileNavAriaLabel,
      menuOpenLabel: content.sections.hero.menuOpenLabel,
      menuCloseLabel: content.sections.hero.menuCloseLabel,
      title: content.sections.hero.title,
      titleEmphasis: content.sections.hero.titleEmphasis,
      frames: (
        await Promise.all(
          content.sections.hero.frames.map(async (frame, index) => {
            const image = await uploadMedia(payload, frame.image, frame.alt)
            if (!image) return null
            return {
              id: rowId("hero-frame", index),
              pillar: frame.pillar,
              accentWord: frame.accentWord,
              image,
              alt: frame.alt,
            }
          }),
        )
      ).filter((f): f is NonNullable<typeof f> => f !== null),
      copy: content.sections.hero.copy,
      copyShort: content.sections.hero.copyShort,
      ribbonLabel: content.sections.hero.ribbonLabel,
      ribbonStat: content.sections.hero.ribbonStat ?? { value: null, label: null },
      marqueeAriaLabel: content.sections.hero.marqueeAriaLabel,
      cta: contactLink(content.sections.hero.cta.label, content.sections.hero.cta.href),
      // The navigation is edited in the header global.
      primaryNav: [],
      heroLogos: content.heroLogos
        .map((logo) => refs.logoIdsByKey[logo.id])
        .filter((id): id is number => typeof id === "number"),
    }

    const servicesBlock = {
      id: rowId("services"),
      blockType: "servicesCarousel" as const,
      kicker: content.sections.services.kicker,
      titleWords: content.sections.services.titleWords.map((w, index) => ({
        id: rowId("services-title", index),
        text: w.text,
        emphasis: (w.accent ? "accent" : "regular") as "accent" | "regular",
      })),
      titleAriaLabel: content.sections.services.titleAriaLabel,
      copy: content.sections.services.copy,
      coverCopy: content.sections.services.coverCopy,
      ctaPrimary: contactLink(content.sections.services.ctaPrimary.label, content.sections.services.ctaPrimary.href),
      ctaSecondary: contactLink(content.sections.services.ctaSecondary.label, content.sections.services.ctaSecondary.href),
      services: refs.serviceIds,
      labels: cl.servicesCarousel,
      orbitItems: (
        await Promise.all(
          content.servicesOrbitItems.map(async (item, index) => {
            const image = await uploadMedia(payload, item.image, item.title)
            if (!image) return null
            return {
              id: rowId("orbit-item", index),
              title: item.title,
              theme: item.theme,
              image,
              copy: item.copy,
            }
          }),
        )
      ).filter((i): i is NonNullable<typeof i> => i !== null),
    }

    const proofColumns = await Promise.all(
      content.proofColumns.map(async (cards, columnIndex) => ({
        id: rowId("proof-column", columnIndex),
        cards: (
          await Promise.all(
            cards.map(async (card, cardIndex) => {
              const id = rowId("proof-card", columnIndex, cardIndex)
              if (card.variant === "photo") {
                const altText = card.alt || card.title
                const image = await uploadMedia(payload, card.image, altText)
                if (!image) return null
                return {
                  id,
                  blockType: "photoCard" as const,
                  title: card.title,
                  sub: card.sub,
                  image,
                  alt: altText,
                }
              }
              if (card.variant === "clock") {
                return {
                  id,
                  blockType: "clockCard" as const,
                  title: card.title,
                  tone: "slate" as const,
                }
              }
              if (card.variant === "logos") {
                return {
                  id,
                  blockType: "logosCard" as const,
                  title: card.title,
                  sub: card.sub,
                  tone: card.tone,
                  stats: (card.stats ?? []).map((stat, statIndex) => ({
                    ...stat,
                    id: rowId("proof-stat", columnIndex, cardIndex, statIndex),
                  })),
                  hideLogos: card.hideLogos ?? false,
                }
              }
              if (card.variant === "specialties") {
                return {
                  id,
                  blockType: "specialtiesCard" as const,
                  title: card.title,
                  sub: card.sub,
                  boxes: card.boxes.map((box, boxIndex) => ({
                    ...box,
                    id: rowId("proof-box", columnIndex, cardIndex, boxIndex),
                  })),
                }
              }
              if (card.variant === "studies") {
                const altText = card.alt || card.title
                const image = await uploadMedia(payload, card.image, altText)
                if (!image) return null
                return {
                  id,
                  blockType: "studiesCard" as const,
                  title: card.title,
                  sub: card.sub,
                  image,
                  alt: altText,
                }
              }
              return {
                id,
                blockType: "plainCard" as const,
                title: card.title,
                sub: card.sub,
                tone: (card.tone === "natural" ? "natural" : "ocean") as "natural" | "ocean",
              }
            }),
          )
        ).filter((c): c is NonNullable<typeof c> => c !== null),
      })),
    )

    const proofBlock = {
      id: rowId("proof"),
      blockType: "proofBento" as const,
      kicker: content.sections.proof.kicker,
      clientLogosAriaLabel: content.sections.proof.clientLogosAriaLabel,
      headingAriaLabel: content.sections.proof.headingAriaLabel,
      headingLead: content.sections.proof.headingLead,
      headingAccent: content.sections.proof.headingAccent,
      headingTrail: content.sections.proof.headingTrail,
      copy: content.sections.proof.copy,
      columns: proofColumns,
    }

    const featuredMediaBlock = {
      id: rowId("featured-media"),
      blockType: "featuredMedia" as const,
      label: content.sections.featuredMedia.label,
      ariaLabel: content.sections.featuredMedia.ariaLabel,
      logos: content.sections.featuredMedia.logos
        .map((logo) => refs.logoIdsByKey[logo.id])
        .filter((id): id is number => typeof id === "number"),
    }

    const operatingSystemBlock = {
      id: rowId("operating-system"),
      blockType: "operatingSystem" as const,
      kicker: content.sections.operatingSystem.kicker,
      titleWords: content.sections.operatingSystem.titleWords.map((w, index) => ({
        id: rowId("operating-title", index),
        text: w.text,
        emphasis: (w.accent ? "accent" : "regular") as "accent" | "regular",
      })),
      titleAriaLabel: content.sections.operatingSystem.titleAriaLabel,
      copy: content.sections.operatingSystem.copy,
      ctaPrimary: contactLink(
        content.sections.operatingSystem.ctaPrimary.label,
        content.sections.operatingSystem.ctaPrimary.href,
      ),
      ctaSecondary: content.sections.operatingSystem.ctaSecondary
        ? contactLink(
            content.sections.operatingSystem.ctaSecondary.label,
            content.sections.operatingSystem.ctaSecondary.href,
          )
        : undefined,
      tabs: (
        await Promise.all(
          content.systemTabs.map(async (tab, index) => {
            const image = await uploadMedia(payload, tab.image, tab.title)
            if (!image) return null
            return {
              id: rowId("operating-tab", index),
              key: tab.key,
              icon: tab.icon,
              tone: tab.tone,
              stage: tab.stage,
              stageCopy: tab.stageCopy,
              title: tab.title,
              copy: tab.copy,
              panelTitle: tab.panelTitle,
              panelCopy: tab.panelCopy,
              image,
            }
          }),
        )
      ).filter((t): t is NonNullable<typeof t> => t !== null),
      labels: cl.systemTabs,
    }

    const serviceSystemBlock = {
      id: rowId("service-system"),
      blockType: "serviceSystemSlider" as const,
      labels: cl.serviceSystem,
      layers: (
        await Promise.all(
          content.serviceLayers.map(async (layer, layerIndex) => {
            const image = await uploadMedia(payload, layer.image, layer.title)
            if (!image) return null
            return {
              id: rowId("service-layer", layerIndex),
              title: layer.title,
              shortTitle: layer.shortTitle,
              theme: layer.theme,
              image,
              copy: layer.copy,
              href: layer.href,
              ctaLabel: layer.ctaLabel,
              features: layer.features.map((feature, featureIndex) => ({
                ...feature,
                id: rowId("service-feature", layerIndex, featureIndex),
              })),
            }
          }),
        )
      ).filter((l): l is NonNullable<typeof l> => l !== null),
    }

    /* The profiler section is static-only (its logic and copy live in the app
       content files); it is intentionally not seeded into the CMS. */
    const storiesBlock = {
      id: rowId("stories"),
      blockType: "stories" as const,
      kicker: content.sections.stories.kicker,
      titleWords: content.sections.stories.titleWords.map((w, index) => ({
        id: rowId("stories-title", index),
        text: w.text,
        emphasis: (w.accent ? "accent" : "regular") as "accent" | "regular",
      })),
      titleAriaLabel: content.sections.stories.titleAriaLabel,
      copy: content.sections.stories.copy,
      cta: contactLink(content.sections.stories.cta.label, content.sections.stories.cta.href),
      panelCta: contactLink(content.sections.stories.panelCta.label, content.sections.stories.panelCta.href),
      stories: refs.storyIds,
      labels: cl.storiesTabs,
    }

    const faqBlock = {
      id: rowId("faq"),
      blockType: "faq" as const,
      heading: content.sections.faq.heading,
      headingLead: content.sections.faq.headingLead,
      cta: contactLink(content.sections.faq.cta.label, content.sections.faq.cta.href),
      ctaTitle: content.sections.faq.ctaTitle,
      ctaCopy: content.sections.faq.ctaCopy,
      faqs: faqIds,
    }

    await payload.updateGlobal({
      slug: "home",
      locale,
      data: {
        meta: {
          title: content.meta.title,
          description: content.meta.description,
          siteName: content.meta.siteName,
          ogImage: await uploadMedia(payload, content.meta.ogImage, content.meta.siteName),
        },
        _status: "published" as const,
        sections: [
          heroBlock,
          servicesBlock,
          proofBlock,
          featuredMediaBlock,
          operatingSystemBlock,
          serviceSystemBlock,
          storiesBlock,
          faqBlock,
        ],
      },
    })
  }
  console.log("✓ Seeded home page (9 blocks × 2 locales)")
}

const MONTH_LOOKUP: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
  enero: 0,
  febrero: 1,
  marzo: 2,
  abril: 3,
  mayo: 4,
  junio: 5,
  julio: 6,
  agosto: 7,
  septiembre: 8,
  octubre: 9,
  noviembre: 10,
  diciembre: 11,
}

function toPublishedAt(label: string) {
  const [monthRaw, yearRaw] = label.trim().split(/\s+/)
  const month = MONTH_LOOKUP[monthRaw?.toLowerCase() ?? ""]
  const year = Number(yearRaw)

  if (month === undefined || !Number.isFinite(year)) {
    return "2026-01-01T00:00:00.000Z"
  }

  return new Date(Date.UTC(year, month, 1)).toISOString()
}

function normalizeRelationId(value: string | number | undefined) {
  if (typeof value === "number") return value
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  return undefined
}

main().catch((error) => {
  console.error("Seed failed:", error)
  process.exit(1)
})
