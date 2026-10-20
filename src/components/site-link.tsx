import type { ComponentPropsWithoutRef } from "react"

import { Link } from "@/i18n/navigation"
import { isInternalHref } from "@/lib/links"

type SiteLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string
}

/**
 * The one anchor used for site chrome (navbar, footer, CTAs).
 *
 * Internal hrefs go through the next-intl `Link` so navigation stays
 * client-side and Next.js can prefetch the (statically generated) route;
 * external / `mailto:` / `tel:` hrefs fall through to a plain `<a>`.
 *
 * `href` must be *unprefixed* — `Link` adds the locale segment itself. Callers
 * holding a locale-prefixed href should normalize it with
 * `resolveLocalizedSiteHref` first.
 *
 * Renders the same `<a>` element either way, so class names and styling are
 * unaffected.
 */
export function SiteLink({ href, children, ...props }: SiteLinkProps) {
  if (isInternalHref(href)) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}
