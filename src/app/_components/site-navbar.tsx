import { CaladanNavbar } from "@/components/caladan-navbar"
import { resolveLocalizedSiteHref } from "@/lib/links"
import { getResolvedHomeContent } from "@/payload/loaders"

import { heroImage } from "./home/home-data"

/**
 * Site-wide navigation. Rendered once in the locale layout as a top-level
 * sibling of the page content so its `position: fixed` is relative to the
 * viewport and never clipped by a section's stacking/overflow context.
 */
export async function SiteNavbar({
  locale,
  variant = "global",
  className,
  panelId = "site-nav-menu-panel",
}: {
  locale: string
  variant?: "global" | "embedded"
  /** Positioning wrapper for an embedded instance; never restyles the navbar. */
  className?: string
  /** Must be unique per page: an embedded instance coexists with the global one. */
  panelId?: string
}) {
  const { primaryNav, footerColumns, sections, serviceCards } = await getResolvedHomeContent(locale)
  const hero = sections.hero

  // Hrefs are handed to `SiteLink`, which routes internal ones through the
  // next-intl `Link` — so they must be locale-*un*prefixed and the `Link` adds
  // the segment back. `localized-home` keeps home-section anchors pointing at
  // the localized home page instead of the current document.
  const resolveHref = (href: string) =>
    resolveLocalizedSiteHref(locale, href, { anchorBehavior: "localized-home" })

  // Desktop and mobile list the same links: everything after the Services
  // dropdown, minus Contact (the primary CTA covers it).
  const desktopNav = primaryNav.slice(1, -1).map((link) => ({
    ...link,
    href: resolveHref(link.href),
  }))

  // The last nav item is Contact, which the primary CTA already covers —
  // listing it again beside or above that button duplicates it.
  const mobileNav = primaryNav.slice(0, -1).map((link) => ({
    ...link,
    href: resolveHref(link.href),
  }))

  // Services only: Blog is already a top-level link, and the footer keeps the
  // full resources column (Blog + RSS).
  const dropdownGroups = footerColumns.slice(1, 2).map((group) => ({
    ...group,
    links: group.links.map((link) => ({
      ...link,
      href: resolveHref(link.href),
    })),
  }))

  return (
    <CaladanNavbar
      className={[
        variant === "embedded" ? "ds-nav-caladan--embedded" : "ds-nav-caladan--global",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      panelId={panelId}
      navAriaLabel={hero.navAriaLabel}
      mobileNavAriaLabel={hero.mobileNavAriaLabel}
      menuOpenLabel={hero.menuOpenLabel}
      menuCloseLabel={hero.menuCloseLabel}
      dropdownLabel={primaryNav[0]?.label ?? "Services"}
      desktopLinks={desktopNav}
      mobileLinks={mobileNav}
      dropdownGroups={dropdownGroups}
      dropdownCards={serviceCards
        .filter((card) => card.href)
        .map((card) => ({
          label: card.title,
          href: resolveHref(card.href!),
          imageSrc: card.image,
          imageAlt: card.title,
        }))}
      primaryAction={{ ...hero.cta, href: resolveHref(hero.cta.href) }}
      promo={{
        title: sections.stories.cta.label,
        copy: sections.stories.copy,
        href: resolveHref(sections.stories.panelCta.href),
        label: sections.stories.panelCta.label,
        imageSrc: heroImage,
        imageAlt: hero.title,
      }}
      homeHref="/"
      disableScrollMagnet={variant === "embedded"}
    />
  )
}
