"use client"

import Image from "next/image"
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"

import { useHomeContent } from "./home-content-context"
import { FeatureIcon } from "./feature-icons"

function SystemArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path
        d="M1.66406 10.4102H18.3306"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
      <path
        d="M10 2.07422L18.3333 10.4074L10 18.7406"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
    </svg>
  )
}

function getVisibleCount() {
  if (window.matchMedia("(max-width: 64rem)").matches) return 1
  return 2
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function SystemTabs() {
  const { systemTabs, componentLabels } = useHomeContent()
  const labels = componentLabels.systemTabs
  const viewportRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLElement | null>>([])
  const [rawActiveIndex, setActiveIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(1)
  const [hasActivated, setHasActivated] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const total = systemTabs.length
  const activeIndex = total > 0 ? clamp(rawActiveIndex, 0, total - 1) : 0
  const scrollIndex = hasActivated ? activeIndex : 0
  const expandedIndex = hoveredIndex ?? (hasActivated ? activeIndex : -1)

  useEffect(() => {
    const syncVisibleCount = () => {
      setVisibleCount(getVisibleCount())
    }

    syncVisibleCount()
    window.addEventListener("resize", syncVisibleCount)
    return () => window.removeEventListener("resize", syncVisibleCount)
  }, [])

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const target = cardRefs.current[scrollIndex]
    if (!viewport || !target) return

    const viewportRect = viewport.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const nextLeft = Math.max(targetRect.left - viewportRect.left + viewport.scrollLeft, 0)

    if (Math.abs(viewport.scrollLeft - nextLeft) < 1) return

    viewport.scrollTo({
      left: nextLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    })
  }, [scrollIndex, visibleCount])

  const activate = (index: number, reveal = true) => {
    if (total === 0) return
    if (reveal) setHasActivated(true)
    setActiveIndex(clamp(index, 0, total - 1))
  }

  const goPrevious = () => {
    if (total === 0) return
    if (activeIndex === 0) {
      setHasActivated(false)
      return
    }

    setHasActivated(true)
    setActiveIndex((current) => clamp(current - 1, 0, total - 1))
  }

  const goNext = () => {
    if (total === 0) return
    setHasActivated(true)
    setActiveIndex((current) => clamp(current + 1, 0, total - 1))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault()
        goNext()
        break
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault()
        goPrevious()
        break
      case "Home":
        event.preventDefault()
        setHasActivated(false)
        setActiveIndex(0)
        break
      case "End":
        event.preventDefault()
        activate(total - 1)
        break
      default:
        break
    }
  }

  const handleArrowActivate = (direction: "next" | "prev") => {
    if (direction === "next") {
      goNext()
      return
    }

    goPrevious()
  }

  if (!systemTabs.length) return null

  return (
    <div className="ds-system-tabs" data-current={systemTabs[activeIndex]?.key}>
      <div
        className="ds-system-tabs-content"
        ref={viewportRef}
        role="group"
        aria-label={labels.listAriaLabel}
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="ds-system-tabs-track">
          {systemTabs.map((tab, index) => (
            <article
              className={`ds-system-tabs-panel${index === activeIndex ? " is-active" : ""}`}
              data-expanded={index === expandedIndex ? "true" : "false"}
              data-tone={tab.tone ?? "ocean"}
              id={`system-panel-${index}`}
              key={tab.key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${total}`}
              onBlur={() => setHoveredIndex(null)}
              onClick={() => activate(index)}
              onFocus={() => setHoveredIndex(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              ref={(node) => {
                cardRefs.current[index] = node
              }}
              tabIndex={0}
            >
              <div className="ds-system-tabs-visual" aria-hidden="true">
                {/* Fills an absolutely positioned panel, so the intrinsic
                    width is not the rendered width; without `sizes` the 2x
                    density fallback overshoots badly. */}
                <Image
                  src={tab.image}
                  alt=""
                  width={1200}
                  height={760}
                  sizes="(max-width: 64rem) 100vw, 60vw"
                />
              </div>

              <div className="ds-system-tabs-card">
                <div className="ds-system-tabs-preview" aria-hidden="true">
                  <div className="ds-system-tabs-title-row">
                    {tab.icon ? (
                      <span className="ds-system-tabs-icon" aria-hidden="true">
                        <FeatureIcon name={tab.icon} />
                      </span>
                    ) : null}
                    <h3 className="ds-system-tabs-preview-title">{tab.panelTitle}</h3>
                  </div>
                </div>

                <div className="ds-system-tabs-details">
                  <div className="ds-system-tabs-title-row">
                    {tab.icon ? (
                      <span className="ds-system-tabs-icon" aria-hidden="true">
                        <FeatureIcon name={tab.icon} />
                      </span>
                    ) : null}
                    <h3 className="ds-system-tabs-title">{tab.panelTitle}</h3>
                  </div>
                  <p className="ds-system-tabs-copy">{tab.panelCopy}</p>
                </div>
              </div>
            </article>
          ))}
          <div className="ds-system-tabs-track-end" aria-hidden="true" />
        </div>
      </div>

      <div className="ds-system-tabs-controls" aria-label={labels.listAriaLabel}>
        <button
          className="ds-carousel-button ds-system-tabs-arrow"
          type="button"
          data-direction="prev"
          aria-label={labels.previous}
          disabled={activeIndex === 0 && !hasActivated}
          onClick={() => handleArrowActivate("prev")}
        >
          <SystemArrowIcon />
        </button>
        <button
          className="ds-carousel-button ds-system-tabs-arrow"
          type="button"
          data-direction="next"
          aria-label={labels.next}
          disabled={activeIndex >= total - 1}
          onClick={() => handleArrowActivate("next")}
        >
          <SystemArrowIcon />
        </button>
      </div>
    </div>
  )
}
