export function isInternalHref(href: string) {
  return href.startsWith("#") || (href.startsWith("/") && !href.startsWith("//"))
}

export function resolveLocalizedSiteHref(
  locale: string,
  href: string,
  options: {
    anchorBehavior?: "current-page" | "localized-home"
  } = {},
) {
  const { anchorBehavior = "current-page" } = options
  const localePrefix = `/${locale}`

  if (href === localePrefix) {
    return "/"
  }

  if (href.startsWith(`${localePrefix}/`)) {
    return href.slice(localePrefix.length)
  }

  if (href.startsWith(`${localePrefix}#`)) {
    return `/${href.slice(localePrefix.length)}`
  }

  if (anchorBehavior === "localized-home") {
    if (href.startsWith("/#")) {
      return href
    }

    if (href.startsWith("#")) {
      return `/${href}`
    }
  }

  return href
}
