/**
 * How a click is described, for analytics and for lead attribution.
 *
 * Every link and button on the site gets the same three coordinates without
 * anyone having to label it by hand:
 *
 *  - page_type  what kind of page it was on ("home", "service", "blog-article")
 *  - section    which block of that page ("nav", "hero", "faq", "footer")
 *  - cta_id     which control inside the block — the `?src=` slug when the
 *               link carries one, an explicit `data-cta`, else its label
 *
 * Hand-written slugs alone were not enough: the navbar promo and the six
 * client-story panels all shipped `?src=home-proof-panel`, and the desktop
 * and mobile navbar both said `nav`. The section, read from the DOM, is what
 * tells those apart.
 *
 * Pure functions only, so they can be tested without a browser.
 */

/** Where a click leads, in the terms the sales funnel cares about. */
export type CtaTarget =
  | "contact"
  | "profiler"
  | "billing"
  | "email"
  | "phone"
  | "whatsapp"
  | "service"
  | "services"
  | "blog"
  | "anchor"
  | "internal"
  | "external"
  | "social"

/** The two places a lead can be submitted. */
export type LeadForm = "contact" | "profiler"

export const LEAD_FORMS: readonly LeadForm[] = ["contact", "profiler"]

const SOCIAL_HOSTS = /(^|\.)(instagram|facebook|twitter|x|linkedin|youtube|tiktok)\.com$/

/** Strips the locale prefix: "/es/services/x" → "/services/x". */
export function stripLocale(pathname: string) {
  return pathname.replace(/^\/(es|en)(?=\/|$)/, "") || "/"
}

/** Services and blog slugs are localized, so the type comes from the shape. */
export function pageTypeFor(pathname: string) {
  const path = stripLocale(pathname)
  if (path === "/") return "home"
  if (/^\/(services|servicios)\/?$/.test(path)) return "services"
  if (/^\/(services|servicios)\/[^/]+/.test(path)) return "service"
  if (/^\/blog\/?$/.test(path)) return "blog"
  if (/^\/blog\/(authors?|autores?|reviewers?|revisores?)\//.test(path)) return "blog-author"
  if (/^\/blog\/[^/]+/.test(path)) return "blog-article"
  if (/^\/(contact|contacto)\/?$/.test(path)) return "contact"
  if (/^\/(billing|facturacion)\/?$/.test(path)) return "billing"
  if (/^\/(privacy-notice|aviso-de-privacidad)\/?$/.test(path)) return "privacy"
  return "other"
}

/**
 * Classifies an href against the page it is on. `base` is the current URL,
 * which resolves relative hrefs and tells same-page anchors apart.
 */
export function classifyTarget(href: string, base: string): CtaTarget {
  const raw = href.trim()
  if (raw.startsWith("mailto:")) return "email"
  if (raw.startsWith("tel:")) return "phone"

  let url: URL
  let current: URL
  try {
    current = new URL(base)
    url = new URL(raw, current)
  } catch {
    return "internal"
  }

  if (url.host === "wa.me" || url.host.endsWith("whatsapp.com")) return "whatsapp"
  if (SOCIAL_HOSTS.test(url.host)) return "social"
  if (url.host !== current.host) return "external"

  const path = stripLocale(url.pathname)
  if (url.hash === "#profiler") return "profiler"
  if (/^\/(contact|contacto)\/?$/.test(path)) return "contact"
  if (/^\/(billing|facturacion)\/?$/.test(path)) return "billing"
  if (/^\/(services|servicios)\/[^/]+/.test(path)) return "service"
  if (/^\/(services|servicios)\/?$/.test(path)) return "services"
  if (/^\/blog(\/|$)/.test(path)) return "blog"
  if (url.hash && url.pathname === current.pathname) return "anchor"
  return "internal"
}

/** Lowercase, accent-free, dash-separated, at most `max` chars. */
export function slugify(value: string, max = 48) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max)
    .replace(/-+$/g, "")
}

/** The `?src=` slug on an internal link, if it carries one. */
export function srcParamOf(href: string, base: string) {
  try {
    return new URL(href, base).searchParams.get("src")?.slice(0, 64) ?? ""
  } catch {
    return ""
  }
}

/** Visible label, collapsed; falls back to aria-label for icon-only links. */
export function labelOf(el: Element) {
  const text = (el.textContent ?? "").replace(/[→←↗]/g, " ").replace(/\s+/g, " ").trim()
  const imageAlt = el.querySelector("img[alt]")?.getAttribute("alt") ?? ""
  return (text || el.getAttribute("aria-label") || el.getAttribute("title") || imageAlt).slice(0, 100)
}

/**
 * The block a control sits in. The nearest explicit `data-track-section`
 * wins, so nested markers (navbar inside the hero) resolve to the inner one.
 * Sections without a marker fall back to their id, then their aria-label.
 */
export function sectionOf(el: Element) {
  const marked = el.closest("[data-track-section]")
  const explicit = marked?.getAttribute("data-track-section")
  if (explicit) return explicit

  const block = el.closest("section[id], header[id], footer[id], article[id], aside[id]")
  if (block?.id) return slugify(block.id)

  const labelled = el.closest("section[aria-label], header[aria-label], footer[aria-label], nav[aria-label]")
  const label = labelled?.getAttribute("aria-label")
  if (label) return slugify(label, 32)

  if (el.closest("nav")) return "nav"
  if (el.closest("footer")) return "footer"
  if (el.closest("header")) return "header"
  return "body"
}

/** The id of the control itself, most specific source first. */
export function ctaIdOf(el: Element, href: string, base: string) {
  const explicit = el.getAttribute("data-cta")
  if (explicit) return explicit.slice(0, 64)
  const src = href ? srcParamOf(href, base) : ""
  if (src) return src
  return slugify(labelOf(el)) || "unlabelled"
}
