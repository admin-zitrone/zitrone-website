import type {
  Cta,
  FooterColumn,
  FooterSocialLink,
  NavItem,
} from "@/app/_components/home/content/types"
import type {
  Footer,
  Header,
  Media,
  SiteSetting,
} from "@/payload/payload-types"

type Locale = "en" | "es"

type PayloadLink =
  | Header["primaryCta"]
  | Footer["ctaPrimary"]
  | Footer["ctaSecondary"]
  | NonNullable<NonNullable<Header["primaryNav"]>[number]["link"]>
  | NonNullable<NonNullable<NonNullable<Footer["columns"]>[number]["links"]>[number]["link"]>
  | NonNullable<NonNullable<Footer["contact"]>["links"]>[number]["link"]
  | NonNullable<NonNullable<Footer["legal"]>["links"]>[number]["link"]

export function isSupportedLocale(locale: string): locale is Locale {
  return locale === "en" || locale === "es"
}

export function resolveLocale(locale: string): Locale {
  return isSupportedLocale(locale) ? locale : "es"
}

export function cleanString(value: string | null | undefined) {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  label: string,
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

function compactItems<T>(items: Array<T | undefined>) {
  return items.filter((item): item is T => item !== undefined)
}

export function resolveMediaUrl(media: Media | number | null | undefined) {
  if (!media || typeof media === "number") return undefined
  return cleanString(media.url) ?? cleanString(media.sizes?.hero?.url)
}

export function resolvePayloadHref(link: PayloadLink | null | undefined) {
  if (!link) return undefined

  if (link.type === "external") {
    return cleanString(link.externalHref)
  }

  if (link.type === "anchor") {
    const anchor = cleanString(link.anchor)
    if (!anchor) return undefined
    if (anchor.startsWith("/") || anchor.startsWith("http://") || anchor.startsWith("https://")) {
      return anchor
    }
    return `#${anchor.replace(/^#/, "")}`
  }

  return cleanString(link.internalHref)
}

export function mapPayloadLink(link: PayloadLink | null | undefined): NavItem | undefined {
  const label = cleanString(link?.label)
  const href = resolvePayloadHref(link)

  if (!label || !href) return undefined

  return { label, href }
}

export function mapPayloadCta(link: PayloadLink | null | undefined): Cta | undefined {
  return mapPayloadLink(link)
}

export function mapFooterColumns(columns: Footer["columns"]): FooterColumn[] {
  return compactItems(
    (columns ?? []).map((column) => {
      const label = cleanString(column.label)
      const links = compactItems((column.links ?? []).map((entry) => mapPayloadLink(entry.link)))

      if (!label || links.length === 0) return undefined

      return { label, links }
    }),
  )
}

export function mapFooterSocialLinks(socialLinks: Footer["socialLinks"]): FooterSocialLink[] {
  return compactItems(
    (socialLinks ?? []).map((link) => {
      const label = cleanString(link.label)
      const href = cleanString(link.href)

      if (!label || !href) return undefined

      return {
        icon: link.icon,
        label,
        href,
      }
    }),
  )
}

export function mapAddressLines(
  lines:
    | NonNullable<Footer["contact"]>["address"]
    | SiteSetting["contacts"]["address"]
    | null
    | undefined,
) {
  return compactItems((lines ?? []).map((line) => cleanString(line.line)))
}

export function mapFooterContactLinks(footer: Footer | null | undefined, settings?: SiteSetting | null) {
  const explicitLinks = compactItems(
    (footer?.contact?.links ?? []).map((entry) => mapPayloadLink(entry.link)),
  )

  if (explicitLinks.length > 0) {
    return explicitLinks
  }

  const fallbackLinks = [
    settings?.contacts?.primaryEmail
      ? { label: settings.contacts.primaryEmail, href: `mailto:${settings.contacts.primaryEmail}` }
      : undefined,
    settings?.contacts?.billingEmail
      ? { label: settings.contacts.billingEmail, href: `mailto:${settings.contacts.billingEmail}` }
      : undefined,
    settings?.contacts?.phone
      ? { label: settings.contacts.phone, href: `tel:${settings.contacts.phone}` }
      : undefined,
  ]

  return compactItems(fallbackLinks)
}
