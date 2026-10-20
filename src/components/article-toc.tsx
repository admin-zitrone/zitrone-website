"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type ArticleTocItem = {
  id: string
  title: string
}

type ArticleTocProps = {
  heading: string
  ariaLabel: string
  toggleLabel: string
  items: ArticleTocItem[]
}

export function ArticleToc({ heading, ariaLabel, toggleLabel, items }: ArticleTocProps) {
  const [activeId, setActiveId] = useState<string>(() => items[0]?.id ?? "")
  const [open, setOpen] = useState(false)
  const [fill, setFill] = useState(0)

  const tocRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)

  // Bold the section currently in view.
  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    )

    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [items])

  // Continuous reading-progress fill, tied to actual scroll position.
  useEffect(() => {
    const toc = tocRef.current
    if (!toc) return

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (headings.length === 0) return

    let frame = 0
    const update = () => {
      frame = 0
      const first = headings[0]
      const last = headings[headings.length - 1]
      const startY = first.getBoundingClientRect().top + window.scrollY
      const endY = last.getBoundingClientRect().top + window.scrollY
      // Reading line sits ~28% down the viewport, matching the active-section band.
      const readingLine = window.scrollY + window.innerHeight * 0.28
      const span = Math.max(endY - startY, 1)
      const progress = Math.min(Math.max((readingLine - startY) / span, 0), 1)
      setFill(progress * toc.clientHeight)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [items])

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      const target = document.getElementById(id)
      if (!target) return

      event.preventDefault()
      setOpen(false)

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" })
      window.history.replaceState(null, "", `#${id}`)
    },
    [],
  )

  if (items.length === 0) return null

  return (
    <aside className="ds-article-sidebar" aria-label={ariaLabel}>
      <div
        ref={tocRef}
        className="ds-article-toc"
        data-open={open}
        style={{ "--toc-fill": `${fill}px` } as React.CSSProperties}
      >
        <button
          type="button"
          className="ds-article-toc-toggle"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{toggleLabel}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="ds-article-toc-progress" aria-hidden="true" />
        <p className="ds-article-toc-heading">{heading}</p>
        <nav ref={navRef}>
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-active={activeId === item.id}
              onClick={(event) => handleClick(event, item.id)}
            >
              {item.title}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}
