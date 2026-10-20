"use client"

import { useEffect, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { useLangAlternates } from "@/components/lang-alternates"

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14.5 14.5 0 0 1 0 18" />
      <path d="M12 3a14.5 14.5 0 0 0 0 18" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9L12 15L18 9" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.5 9.2 16.5 19 7.5" />
    </svg>
  )
}

const LOCALE_LABEL_KEY = { es: "spanish", en: "english" } as const

export function FooterLangMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const t = useTranslations("LanguageMenu")
  const activeLocale = useLocale()
  const pathname = usePathname()
  const registered = useLangAlternates()

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }
    const onMouseDown = (event: MouseEvent) => {
      const menu = menuRef.current
      if (!menu) return
      if (event.target instanceof Node && !menu.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("mousedown", onMouseDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("mousedown", onMouseDown)
    }
  }, [isOpen])

  return (
    <div
      ref={menuRef}
      className={`ds-footer-site__lang-menu${isOpen ? " is-open" : ""}`}
    >
      <button
        type="button"
        className="ds-footer-site__lang-pill"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t("ariaLabel")}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="ds-footer-site__lang-leading">
          <GlobeIcon />
          <span>{t("trigger")}</span>
        </span>
        <ChevronDownIcon />
      </button>
      <div
        className="ds-footer-site__lang-dropdown"
        role="menu"
        aria-label={t("menuLabel")}
      >
        {routing.locales.map((locale) => {
          const isActive = locale === activeLocale
          // Pages with locale-specific slugs register their translated
          // pathnames; everything else swaps the locale on the same path.
          const targetPathname =
            registered?.pathname === pathname
              ? (registered.alternates[locale] ?? pathname)
              : pathname
          return (
            <Link
              key={locale}
              className={`ds-footer-site__lang-option${isActive ? " is-active" : ""}`}
              href={targetPathname}
              locale={locale}
              role="menuitem"
              aria-current={isActive ? "page" : undefined}
              onClick={() => setIsOpen(false)}
            >
              <span>{t(LOCALE_LABEL_KEY[locale])}</span>
              {isActive ? (
                <span className="ds-footer-site__lang-check" aria-hidden="true">
                  <CheckIcon />
                </span>
              ) : null}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
