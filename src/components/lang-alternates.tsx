"use client"

import { useEffect, useSyncExternalStore } from "react"

/**
 * Pages whose slug is localized (services, blog authors/reviewers) register
 * their per-locale pathnames here so the footer language switcher can link to
 * the translated page instead of naively swapping the locale prefix (which
 * 404s when slugs differ between locales). Pathnames are locale-independent
 * (no /es|/en prefix), matching the i18n router convention.
 */
export type LangAlternates = {
  /** The locale-independent pathname these alternates belong to. */
  pathname: string
  alternates: Partial<Record<"en" | "es", string>>
}

let current: LangAlternates | null = null
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function emit() {
  for (const listener of listeners) listener()
}

export function useLangAlternates(): LangAlternates | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  )
}

export function RegisterLangAlternates({ pathname, alternates }: LangAlternates) {
  const serialized = JSON.stringify(alternates)

  useEffect(() => {
    current = { pathname, alternates: JSON.parse(serialized) }
    emit()
    return () => {
      if (current?.pathname === pathname) {
        current = null
        emit()
      }
    }
  }, [pathname, serialized])

  return null
}
