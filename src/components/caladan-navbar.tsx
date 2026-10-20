"use client"

import { useEffect, useId, useRef, useState } from "react"
import Image, { type StaticImageData } from "next/image"

import { Link } from "@/i18n/navigation"
import { SiteLink } from "./site-link"

type NavItem = {
  href: string
  label: string
}

type NavGroup = {
  label: string
  links: NavItem[]
}

type NavCard = {
  href: string
  label: string
  imageSrc: string | StaticImageData
  imageAlt?: string
}

type NavPromo = {
  kicker?: string
  title: string
  copy?: string
  href: string
  label: string
  imageSrc?: string | StaticImageData
  imageAlt?: string
}

type CaladanNavbarProps = {
  panelId: string
  navAriaLabel: string
  mobileNavAriaLabel: string
  menuOpenLabel: string
  menuCloseLabel: string
  dropdownLabel: string
  desktopLinks: NavItem[]
  mobileLinks: NavItem[]
  dropdownGroups: NavGroup[]
  /** When provided, the desktop dropdown renders these image cards instead of
      the link groups + promo. Mobile keeps the text accordion. */
  dropdownCards?: NavCard[]
  primaryAction: NavItem
  secondaryAction?: NavItem
  promo?: NavPromo
  homeHref?: string
  homeAriaLabel?: string
  className?: string
  disableScrollMagnet?: boolean
}

type NavAnchorProps = {
  className: string
  href: string
  label: string
  onClick?: () => void
  showArrow?: boolean
}

function NavAnchor({ className, href, label, onClick, showArrow = false }: NavAnchorProps) {
  return (
    <SiteLink className={className} href={href} onClick={onClick}>
      <span>{label}</span>
      {showArrow ? (
        <span className="ds-nav-caladan__nav-link-arrow" aria-hidden="true">
          →
        </span>
      ) : null}
    </SiteLink>
  )
}

export function CaladanNavbar({
  panelId,
  navAriaLabel,
  mobileNavAriaLabel,
  menuOpenLabel,
  menuCloseLabel,
  dropdownLabel,
  desktopLinks,
  mobileLinks,
  dropdownGroups,
  dropdownCards,
  primaryAction,
  secondaryAction,
  promo,
  homeHref = "/",
  homeAriaLabel = "Zitrone home",
  className,
  disableScrollMagnet = false,
}: CaladanNavbarProps) {
  const dropdownId = useId()
  const dropdownPanelId = `${dropdownId.replace(/:/g, "")}-panel`
  const rootRef = useRef<HTMLDivElement>(null)
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileSubOpen, setMobileSubOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const hasDropdown = dropdownGroups.length > 0
  // In the mobile menu the dropdown collapses into an accordion row, so the
  // flat link list drops the entry that the accordion already represents.
  const plainMobileLinks = mobileLinks.filter((link) => link.label !== dropdownLabel)

  /* Closing a panel makes it `inert`, which drops whatever was focused inside
     it. Left alone, focus falls back to <body> and a keyboard user restarts
     from the top of the document. So when the focused element is inside a
     panel we are closing, hand focus back to the control that opened it. */
  function closePanels() {
    const active = document.activeElement
    const insideDropdown = Boolean(
      dropdownOpen && active && document.getElementById(dropdownPanelId)?.contains(active),
    )
    const insideMenu = Boolean(
      menuOpen && active && document.getElementById(panelId)?.contains(active),
    )

    setMenuOpen(false)
    setDropdownOpen(false)
    setMobileSubOpen(false)

    if (insideDropdown) dropdownTriggerRef.current?.focus()
    else if (insideMenu) menuTriggerRef.current?.focus()
  }

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        closePanels()
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePanels()
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
    // closePanels reads menuOpen/dropdownOpen to decide where focus goes; with
    // an empty dep array these listeners kept the first render's copy, which
    // saw both panels as permanently closed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen, dropdownOpen, panelId, dropdownPanelId])

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"

    return () => {
      document.documentElement.style.overflow = previousOverflow
    }
  }, [menuOpen])

  useEffect(() => {
    if (disableScrollMagnet) {
      return
    }

    let frame = 0

    function updateScrolled() {
      frame = 0
      setScrolled(window.scrollY > 28)
    }

    function handleScroll() {
      if (frame) return
      frame = window.requestAnimationFrame(updateScrolled)
    }

    updateScrolled()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [disableScrollMagnet])

  return (
    <div
      className={["ds-nav-caladan", className].filter(Boolean).join(" ")}
      data-track-section="nav"
      data-dropdown-open={dropdownOpen ? "true" : "false"}
      data-menu-open={menuOpen ? "true" : "false"}
      data-scrolled={!disableScrollMagnet && scrolled ? "true" : "false"}
      ref={rootRef}
    >
      <button
        aria-hidden="true"
        className="ds-nav-caladan__backdrop"
        onClick={closePanels}
        tabIndex={-1}
        type="button"
      />
      <div className="ds-nav-caladan__wrap">
        <div className="ds-nav-caladan__shell">
          <div className="ds-nav-caladan__left">
            <button
              aria-controls={panelId}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? menuCloseLabel : menuOpenLabel}
              className="ds-nav-caladan__menu-button"
              ref={menuTriggerRef}
              onClick={() => {
                setDropdownOpen(false)
                setMenuOpen((open) => !open)
              }}
              type="button"
            >
              <span className="ds-nav-caladan__menu-icon ds-nav-caladan__menu-icon--open" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L10 6M2 9H10M2 3L10 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="ds-nav-caladan__menu-icon ds-nav-caladan__menu-icon--close" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>

            <nav className="ds-nav-caladan__desktop" aria-label={navAriaLabel}>
              {hasDropdown ? (
                <div
                  className="ds-nav-caladan__dropdown"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    aria-controls={dropdownPanelId}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="menu"
                    className="ds-nav-caladan__dropdown-trigger"
                    onClick={() => setDropdownOpen((open) => !open)}
                    ref={dropdownTriggerRef}
                    type="button"
                  >
                    <span>{dropdownLabel}</span>
                    <span className="ds-nav-caladan__dropdown-chevron" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>

                  {/* Both attributes, deliberately. aria-hidden alone was the
                      bug: it hid the closed panel from screen readers while
                      leaving every link inside focusable, so keyboard users
                      tabbed into an invisible menu. `inert` is what removes it
                      from the tab order. They are kept together because tools
                      that read the tree — including Playwright's role engine —
                      do not all infer hidden-ness from `inert` yet. */}
                  <div
                    aria-hidden={dropdownOpen ? undefined : "true"}
                    className="ds-nav-caladan__dropdown-panel"
                    data-track-section="nav-menu"
                    id={dropdownPanelId}
                    inert={!dropdownOpen}
                    role="group"
                  >
                    {dropdownCards?.length ? (
                      <div className="ds-nav-caladan__dropdown-cards">
                        {dropdownCards.map((card) => (
                          <SiteLink
                            className="ds-nav-caladan__dropdown-card"
                            href={card.href}
                            key={card.href}
                            onClick={closePanels}
                          >
                            <Image
                              className="ds-nav-caladan__dropdown-card-image"
                              src={card.imageSrc}
                              alt={card.imageAlt ?? ""}
                              fill
                              sizes="14rem"
                            />
                            <span className="ds-nav-caladan__dropdown-card-overlay" aria-hidden="true" />
                            <span className="ds-nav-caladan__dropdown-card-label">{card.label}</span>
                          </SiteLink>
                        ))}
                      </div>
                    ) : (
                    <div className="ds-nav-caladan__dropdown-main">
                      <div className="ds-nav-caladan__dropdown-groups">
                        {dropdownGroups.map((group) => (
                          <section className="ds-nav-caladan__dropdown-group" key={group.label}>
                            <p className="ds-nav-caladan__dropdown-label">{group.label}</p>
                            <div className="ds-nav-caladan__dropdown-links">
                              {group.links.map((link) => (
                                <NavAnchor
                                  className="ds-nav-caladan__dropdown-link"
                                  href={link.href}
                                  key={`${group.label}-${link.href}`}
                                  label={link.label}
                                  onClick={closePanels}
                                  showArrow
                                />
                              ))}
                            </div>
                          </section>
                        ))}
                      </div>

                      {promo ? (
                        <aside className="ds-nav-caladan__promo" data-track-section="nav-promo">
                          {promo.imageSrc ? (
                            <Image
                              className="ds-nav-caladan__promo-image"
                              src={promo.imageSrc}
                              alt={promo.imageAlt ?? promo.title}
                              fill
                              sizes="20rem"
                            />
                          ) : null}
                          <div className="ds-nav-caladan__promo-overlay" aria-hidden="true" />
                          <div className="ds-nav-caladan__promo-body">
                            {promo.kicker ? (
                              <p className="ds-nav-caladan__promo-kicker">{promo.kicker}</p>
                            ) : null}
                            <p className="ds-nav-caladan__promo-title">{promo.title}</p>
                            {promo.copy ? (
                              <p className="ds-nav-caladan__promo-copy">{promo.copy}</p>
                            ) : null}
                            <NavAnchor
                              className="ds-nav-caladan__promo-cta"
                              href={promo.href}
                              label={promo.label}
                              onClick={closePanels}
                              showArrow
                            />
                          </div>
                        </aside>
                      ) : null}
                    </div>
                    )}
                  </div>
                </div>
              ) : null}

              {desktopLinks.map((link) => (
                <NavAnchor
                  className="ds-nav-caladan__link"
                  href={link.href}
                  key={link.href}
                  label={link.label}
                  onClick={closePanels}
                />
              ))}
            </nav>
          </div>

          <Link className="ds-nav-caladan__brand" href={homeHref} aria-label={homeAriaLabel}>
            <Image
              src="/img/shared/brand/zitrone-logo-dark.svg"
              alt="Zitrone"
              width={714}
              height={150}
              unoptimized
            />
          </Link>

          <div className="ds-nav-caladan__right">
            {secondaryAction ? (
              <SiteLink className="ds-nav-caladan__tertiary" href={secondaryAction.href}>
                <span className="ds-nav-caladan__tertiary-label">{secondaryAction.label}</span>
                <span className="ds-nav-caladan__tertiary-bg" aria-hidden="true" />
              </SiteLink>
            ) : null}
            <SiteLink className="ds-nav-caladan__primary" href={primaryAction.href}>
              <span className="ds-nav-caladan__btn-mask">
                <span className="ds-nav-caladan__btn-text">{primaryAction.label}</span>
              </span>
              <span className="ds-nav-caladan__btn-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="ds-nav-caladan__btn-bg" aria-hidden="true" />
            </SiteLink>
          </div>
        </div>

        <div
          aria-hidden={menuOpen ? undefined : "true"}
          className="ds-nav-caladan__mobile-panel"
          data-track-section="nav-mobile"
          id={panelId}
          inert={!menuOpen}
        >
          <nav className="ds-nav-caladan__mobile-links" aria-label={mobileNavAriaLabel}>
            {hasDropdown ? (
              <div
                className="ds-nav-caladan__mobile-accordion"
                data-open={mobileSubOpen ? "true" : "false"}
              >
                <button
                  type="button"
                  className="ds-nav-caladan__mobile-row ds-nav-caladan__mobile-accordion-toggle"
                  aria-expanded={mobileSubOpen}
                  onClick={() => setMobileSubOpen((open) => !open)}
                >
                  <span>{dropdownLabel}</span>
                  <span className="ds-nav-caladan__mobile-plus" aria-hidden="true" />
                </button>
                <div className="ds-nav-caladan__mobile-accordion-panel">
                  <div className="ds-nav-caladan__mobile-accordion-inner">
                    {dropdownGroups.map((group) => (
                      <section className="ds-nav-caladan__mobile-group" key={group.label}>
                        <p className="ds-nav-caladan__mobile-label">{group.label}</p>
                        <div className="ds-nav-caladan__mobile-group-links">
                          {group.links.map((link) => (
                            <NavAnchor
                              className="ds-nav-caladan__mobile-group-link"
                              href={link.href}
                              key={`${group.label}-${link.href}`}
                              label={link.label}
                              onClick={closePanels}
                              showArrow
                            />
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {plainMobileLinks.map((link) => (
              <SiteLink
                className="ds-nav-caladan__mobile-row ds-nav-caladan__mobile-link"
                href={link.href}
                key={link.href}
                onClick={closePanels}
              >
                <span>{link.label}</span>
              </SiteLink>
            ))}
          </nav>

          <div className="ds-nav-caladan__mobile-footer">
            <SiteLink
              className="ds-nav-caladan__mobile-primary"
              href={primaryAction.href}
              onClick={closePanels}
            >
              <span className="ds-nav-caladan__mobile-primary-label">{primaryAction.label}</span>
              <span className="ds-nav-caladan__btn-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </SiteLink>
          </div>
        </div>
      </div>
    </div>
  )
}
