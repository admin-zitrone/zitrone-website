import { blogContentEn } from "./content/en"
import { blogContentEs } from "./content/es"
import type { BlogArticleCopy, BlogContent, BlogPost } from "./content/types"
import { routing, type AppLocale } from "@/i18n/routing"

export type {
  ArticleSection,
  ArticleFAQ,
  BlogArticleCopy,
  BlogPost,
  BlogLinkGroup,
  BlogContent,
  BlogIndexCopy,
} from "./content/types"

const content: Record<AppLocale, BlogContent> = {
  en: blogContentEn,
  es: blogContentEs,
}

function resolveLocale(locale: string): AppLocale {
  return (routing.locales as readonly string[]).includes(locale)
    ? (locale as AppLocale)
    : routing.defaultLocale
}

export function getBlogContent(locale: string): BlogContent {
  return content[resolveLocale(locale)]
}

export function getBlogPost(locale: string, slug: string): BlogPost | undefined {
  return getBlogContent(locale).posts.find((post) => post.slug === slug)
}

export function getRecommendedPosts(locale: string, currentSlug: string): BlogPost[] {
  return getBlogContent(locale)
    .posts.filter((post) => post.slug !== currentSlug)
    .slice(0, 4)
}

/** Key that pairs one article across locales (slugs are localized). */
export function postTranslationKey(post: Pick<BlogPost, "slug" | "translationKey">): string {
  return post.translationKey ?? post.slug
}

/** Path of `post` in its own locale plus, when a translation exists, in the
    other locale. Never guesses: a missing translation is simply left out. */
export function blogPostPaths(
  locale: string,
  post: Pick<BlogPost, "slug" | "translationKey">,
  otherPosts: readonly Pick<BlogPost, "slug" | "translationKey">[],
): Partial<Record<AppLocale, string>> {
  const current = resolveLocale(locale)
  const other: AppLocale = current === "es" ? "en" : "es"
  const key = postTranslationKey(post)
  const translated = otherPosts.find((candidate) => postTranslationKey(candidate) === key)
  return {
    [current]: `/blog/${post.slug}`,
    ...(translated ? { [other]: `/blog/${translated.slug}` } : {}),
  }
}

/** Slugs are localized, so they are listed per locale. */
export function getAllSlugs(locale: string): string[] {
  return getBlogContent(locale).posts.map((post) => post.slug)
}

const BLOG_CATEGORY_KEY_LOOKUP: Record<string, string> = {
  "building a program": "building-program",
  "construir un programa": "building-program",
  "culture & retention": "culture-retention",
  "cultura y retención": "culture-retention",
  "trust & standards": "trust-standards",
  "confianza y estándares": "trust-standards",
  "wellbeing & productivity": "wellbeing-productivity",
  "bienestar y productividad": "wellbeing-productivity",
}

export function getBlogCategoryKey(category: string): string {
  return BLOG_CATEGORY_KEY_LOOKUP[category.trim().toLocaleLowerCase()] ?? "default"
}

const BLOG_CATEGORY_SLUG_BY_KEY: Record<string, string> = {
  "building-program": "building-a-program",
  "culture-retention": "culture-retention",
  "trust-standards": "trust-and-standards",
  "wellbeing-productivity": "wellbeing-and-productivity",
}

function slugifyCategory(category: string) {
  return category
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getBlogCategorySlug(category: string) {
  const key = getBlogCategoryKey(category)
  return BLOG_CATEGORY_SLUG_BY_KEY[key] ?? slugifyCategory(category)
}

export function getBlogCategoryFromSlug(
  locale: string,
  categorySlug: string,
  categories?: string[],
) {
  const source = categories ?? getBlogContent(locale).categories.slice(1)
  return source.find((category) => getBlogCategorySlug(category) === categorySlug)
}

export function getBlogCategoryPath(category: string) {
  return `/blog/category/${getBlogCategorySlug(category)}`
}

const MONTH_LOOKUP: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
  julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
}

export function postIsoDate(post: BlogPost): string {
  const [monthRaw, yearRaw] = post.date.trim().split(/\s+/)
  const month = MONTH_LOOKUP[monthRaw?.toLowerCase() ?? ""]
  const year = Number(yearRaw)
  if (month === undefined || !Number.isFinite(year)) {
    return new Date().toISOString().slice(0, 10)
  }
  const iso = new Date(Date.UTC(year, month, 1)).toISOString()
  return iso.slice(0, 10)
}

export function postPublishedIsoDate(post: BlogPost): string {
  return post.publishedAtISO ?? postIsoDate(post)
}

export function postModifiedIsoDate(post: BlogPost): string {
  return post.updatedAtISO ?? postPublishedIsoDate(post)
}

export type BlogProfileKind = "author" | "reviewer"

export type BlogProfile = {
  kind: BlogProfileKind
  slug: string
  path: string
  name: string
  role: string
  summary: string
  bio: string
  expertise: string[]
  entityType: "Person" | "Organization"
}

const BLOG_PROFILE_CONTENT = {
  en: {
    author: {
      "Zitrone Operations Team": {
        role: "Editorial and service operations team",
        summary:
          "The Zitrone Operations Team documents how workplace dining, pantry, coffee, and catering programs actually run day to day.",
        bio:
          "This editorial team works across service design, account management, culinary planning, and workplace operations. Their job is to turn operating knowledge into practical guidance for companies building food systems that are reliable, measurable, and easy to run.",
        expertise: [
          "Corporate dining operations",
          "Pantry and restocking systems",
          "Coffee and beverage programs",
          "Food-service workflow design",
        ],
      },
    },
    reviewer: {
      "Zitrone Food Safety & Operations": {
        role: "Food safety and service review team",
        summary:
          "Zitrone Food Safety & Operations reviews service guidance for operational accuracy, hygiene standards, and implementation reality.",
        bio:
          "This review group checks that published recommendations reflect real workplace food operations, documented hygiene controls, and practical service constraints. Their role is to keep every article grounded in how the program performs on-site, not just how it sounds in theory.",
        expertise: [
          "Food safety and hygiene controls",
          "Daily service continuity",
          "Kitchen and commissary operations",
          "Operational QA and standards",
        ],
      },
    },
  },
  es: {
    author: {
      "Equipo de Operaciones Zitrone": {
        role: "Equipo editorial y de operaciones del servicio",
        summary:
          "El equipo de Operaciones Zitrone documenta cómo funcionan realmente los programas de comedor, pantry, café y catering en el día a día.",
        bio:
          "Este equipo editorial trabaja entre diseño del servicio, gestión de cuentas, planeación culinaria y operación en sitio. Su trabajo es convertir conocimiento operativo en guía práctica para empresas que buscan sistemas de alimentos confiables, medibles y fáciles de operar.",
        expertise: [
          "Operación de comedores corporativos",
          "Sistemas de pantry y restocking",
          "Programas de café y bebidas",
          "Diseño operativo de food service",
        ],
      },
    },
    reviewer: {
      "Seguridad Alimentaria y Operaciones Zitrone": {
        role: "Equipo de revisión sanitaria y operativa",
        summary:
          "Seguridad Alimentaria y Operaciones Zitrone revisa el contenido para asegurar precisión operativa, inocuidad y viabilidad de implementación.",
        bio:
          "Este grupo revisa que cada recomendación publicada responda a la realidad de la operación, a los controles documentados de higiene y a las restricciones prácticas del servicio. Su función es mantener cada artículo aterrizado en cómo funciona el programa en sitio, no solo en cómo suena en teoría.",
        expertise: [
          "Inocuidad e higiene alimentaria",
          "Continuidad del servicio diario",
          "Operación de cocina y comisariato",
          "QA operativo y estándares",
        ],
      },
    },
  },
} as const

function slugifyProfileName(value: string) {
  return value
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function isTeamLikeName(name: string) {
  return /team|equipo|operations|operaciones|food safety|seguridad alimentaria/i.test(name)
}

function fallbackProfile(
  locale: AppLocale,
  kind: BlogProfileKind,
  name: string,
  role?: string,
): Omit<BlogProfile, "slug" | "path" | "kind" | "name"> {
  const isSpanish = locale === "es"
  const entityType = isTeamLikeName(name) ? "Organization" : "Person"

  if (kind === "author") {
    return {
      role:
        role ??
        (isSpanish ? "Contribuidor editorial de Zitrone" : "Zitrone editorial contributor"),
      summary: isSpanish
        ? `${name} comparte guía práctica sobre operación de servicios de alimentos en el trabajo.`
        : `${name} shares practical guidance on workplace food operations.`,
      bio: isSpanish
        ? `${name} contribuye al Journal de Zitrone con experiencia operativa sobre comedor, pantry, café y catering corporativo.`
        : `${name} contributes to the Zitrone Journal with operating insight across corporate dining, pantry, coffee, and catering.`,
      expertise: isSpanish
        ? ["Operación diaria", "Food service corporativo", "Experiencia en sitio"]
        : ["Daily operations", "Corporate food service", "On-site experience"],
      entityType,
    }
  }

  return {
    role: role ?? (isSpanish ? "Revisión operativa" : "Operational review"),
    summary: isSpanish
      ? `${name} revisa el contenido para asegurar precisión operativa y aplicabilidad real.`
      : `${name} reviews content for operational accuracy and real-world applicability.`,
    bio: isSpanish
      ? `${name} participa en la revisión de artículos del Journal de Zitrone para mantener la información alineada con la realidad operativa del servicio.`
      : `${name} participates in reviewing Zitrone Journal articles to keep guidance aligned with real operating conditions.`,
    expertise: isSpanish
      ? ["Inocuidad", "Operación del servicio", "Calidad operativa"]
      : ["Food safety", "Service operations", "Operational quality"],
    entityType,
  }
}

function buildProfile(
  locale: string,
  kind: BlogProfileKind,
  name: string,
  role?: string,
): BlogProfile {
  const safeLocale = resolveLocale(locale)
  const localized = BLOG_PROFILE_CONTENT[safeLocale][kind][
    name as keyof (typeof BLOG_PROFILE_CONTENT)[typeof safeLocale][typeof kind]
  ] as
    | {
        role: string
        summary: string
        bio: string
        expertise: string[]
      }
    | undefined
  const fallback = fallbackProfile(safeLocale, kind, name, role)
  const slug = slugifyProfileName(name)
  const segment = kind === "author" ? "authors" : "reviewers"

  return {
    kind,
    slug,
    path: `/blog/${segment}/${slug}`,
    name,
    role: localized?.role ?? fallback.role,
    summary: localized?.summary ?? fallback.summary,
    bio: localized?.bio ?? fallback.bio,
    expertise: localized?.expertise ?? fallback.expertise,
    entityType: fallback.entityType,
  }
}

export function getBlogAuthorPath(name: string) {
  return `/blog/authors/${slugifyProfileName(name)}`
}

export function getBlogReviewerPath(name: string) {
  return `/blog/reviewers/${slugifyProfileName(name)}`
}

export function getBlogAuthorProfile(locale: string, name: string, role?: string) {
  return buildProfile(locale, "author", name, role)
}

export function getBlogReviewerProfile(locale: string, name: string, role?: string) {
  return buildProfile(locale, "reviewer", name, role)
}

export function getBlogAuthorProfileFromSlug(
  locale: string,
  slug: string,
  posts: BlogPost[],
  fallbackArticleCopy?: BlogArticleCopy,
) {
  const candidates = new Map<string, { name: string; role?: string }>()

  for (const post of posts) {
    const name = post.authorName ?? fallbackArticleCopy?.authorName
    if (!name) continue
    candidates.set(slugifyProfileName(name), {
      name,
      role: post.authorRole,
    })
  }

  if (fallbackArticleCopy?.authorName) {
    candidates.set(slugifyProfileName(fallbackArticleCopy.authorName), {
      name: fallbackArticleCopy.authorName,
    })
  }

  const candidate = candidates.get(slug)
  return candidate ? getBlogAuthorProfile(locale, candidate.name, candidate.role) : undefined
}

export function getBlogReviewerProfileFromSlug(
  locale: string,
  slug: string,
  posts: BlogPost[],
  fallbackArticleCopy?: BlogArticleCopy,
) {
  const candidates = new Map<string, string>()

  for (const post of posts) {
    const name = post.reviewedByName ?? fallbackArticleCopy?.reviewedByName
    if (!name) continue
    candidates.set(slugifyProfileName(name), name)
  }

  if (fallbackArticleCopy?.reviewedByName) {
    candidates.set(
      slugifyProfileName(fallbackArticleCopy.reviewedByName),
      fallbackArticleCopy.reviewedByName,
    )
  }

  const candidate = candidates.get(slug)
  return candidate ? getBlogReviewerProfile(locale, candidate) : undefined
}
