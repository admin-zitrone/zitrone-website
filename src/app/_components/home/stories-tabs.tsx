"use client"

import type { CSSProperties } from "react"
import Image from "next/image"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { SiteLink } from "@/components/site-link"
import { slugify, srcParamOf } from "@/lib/analytics/cta"

import { useHomeContent } from "./home-content-context"

const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeReduceMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCE_MOTION_QUERY)
  mq.addEventListener("change", callback)
  return () => mq.removeEventListener("change", callback)
}

function getReduceMotionSnapshot() {
  return window.matchMedia(REDUCE_MOTION_QUERY).matches
}

function getReduceMotionServerSnapshot() {
  return false
}

function renderHighlightedQuote(quote: string, highlight?: string) {
  if (!highlight) return quote

  const startIndex = quote.indexOf(highlight)
  if (startIndex === -1) return quote

  const before = quote.slice(0, startIndex)
  const after = quote.slice(startIndex + highlight.length)

  return (
    <>
      {before}
      <span className="semantic-stories-quote-highlight">{highlight}</span>
      {after}
    </>
  )
}

export function StoriesTabs() {
  const { clientStories, componentLabels, sections } = useHomeContent()
  const labels = componentLabels.storiesTabs
  const panelCta = sections.stories.panelCta
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progressMetrics, setProgressMetrics] = useState({ left: 0, width: 0 })
  const reduceMotion = useSyncExternalStore(
    subscribeReduceMotion,
    getReduceMotionSnapshot,
    getReduceMotionServerSnapshot,
  )
  const fillRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    const activeFill = fillRef.current
    if (!activeFill) return

    if (reduceMotion) {
      activeFill.style.animation = "none"
      activeFill.style.transform = "scaleX(1)"
      activeFill.style.animationPlayState = "paused"
      return
    }

    activeFill.style.transform = ""
    activeFill.style.animation = "none"
    activeFill.style.animationPlayState = "paused"
    void activeFill.offsetWidth
    activeFill.style.animation = ""
    activeFill.style.animationPlayState = "running"
  }, [activeIndex, reduceMotion])

  useEffect(() => {
    const menu = menuRef.current
    const activeButton = buttonRefs.current[activeIndex]
    if (!menu || !activeButton) return

    const updateMetrics = () => {
      const menuRect = menu.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      setProgressMetrics({
        left: buttonRect.left - menuRect.left,
        width: buttonRect.width,
      })
    }

    updateMetrics()
    window.addEventListener("resize", updateMetrics)
    return () => window.removeEventListener("resize", updateMetrics)
  }, [activeIndex, clientStories.length])

  useEffect(() => {
    const activeFill = fillRef.current
    if (!activeFill || reduceMotion) return

    activeFill.style.animationPlayState = paused ? "paused" : "running"
  }, [activeIndex, paused, reduceMotion])

  function handlePause() {
    setPaused(true)
  }

  function handleResume(event: React.FocusEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) {
    if ("relatedTarget" in event) {
      const nextTarget = event.relatedTarget
      if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
        return
      }
    }
    setPaused(false)
  }

  return (
    <div
      className="semantic-stories-tabs"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onFocusCapture={handlePause}
      onBlurCapture={handleResume}
    >
      <div
        ref={menuRef}
        className="semantic-stories-menu"
        role="tablist"
        aria-label={labels.tablistAriaLabel}
        style={{ "--stories-tab-count": String(clientStories.length) } as CSSProperties}
      >
        {clientStories.map((story, index) => {
          const isActive = index === activeIndex
          return (
            <button
              ref={(node) => {
                buttonRefs.current[index] = node
              }}
              className={`semantic-stories-tab${isActive ? " is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`story-panel-${index}`}
              aria-label={story.label}
              onClick={() => setActiveIndex(index)}
              key={story.name}
            >
              <div
                className="semantic-stories-tab-thumb"
                data-logo-context="stories"
                data-logo-fit={story.logoFit ?? "balanced"}
                style={
                  story.logoScale
                    ? ({ "--stories-logo-scale": String(story.logoScale) } as CSSProperties)
                    : undefined
                }
              >
                <Image
                  src={story.logo}
                  alt=""
                  width={72}
                  height={24}
                  loading="eager"
                  decoding="async"
                  unoptimized
                />
              </div>
            </button>
          )
        })}
        <div className="semantic-stories-progress-rail" aria-hidden="true">
          <div
            ref={fillRef}
            className="semantic-stories-progress-fill"
            style={
              {
                "--stories-progress-left": `${progressMetrics.left}px`,
                "--stories-progress-width": `${progressMetrics.width}px`,
              } as CSSProperties
            }
            onAnimationEnd={() => {
              if (reduceMotion) return
              setActiveIndex((current) => (current + 1) % clientStories.length)
            }}
          />
        </div>
      </div>

      <div className="semantic-stories-panels">
        {clientStories.map((story, index) => {
          const isActive = index === activeIndex
          return (
            <article
              className={`semantic-stories-panel${isActive ? " is-active" : ""}`}
              id={`story-panel-${index}`}
              role="tabpanel"
              hidden={!isActive}
              key={story.name}
            >
              <div className="semantic-stories-image">
                {/* The panel is a single column below 64rem and a 51% grid
                    track above it. Without `sizes` the 2x density fallback
                    resolves to w=3840, roughly six times the rendered width. */}
                <Image
                  src={story.image}
                  alt={story.imageAlt}
                  width={1200}
                  height={760}
                  sizes="(max-width: 64rem) 100vw, 48vw"
                />
              </div>
              <div className="semantic-stories-body">
                <blockquote className="semantic-stories-quote">
                  <p>{renderHighlightedQuote(story.quote, story.quoteHighlight)}</p>
                </blockquote>
                <div className="semantic-stories-bio">
                  <span className="semantic-stories-name">{story.name}</span>
                  <span className="semantic-stories-role">{story.role}</span>
                </div>
                <SiteLink
                  className="semantic-stories-panel-cta"
                  data-cta={`${srcParamOf(panelCta.href, "https://zitrone.mx")}-${slugify(story.name, 24)}`}
                  href={panelCta.href}
                >
                  <span>{panelCta.label}</span>
                  <span aria-hidden="true">→</span>
                </SiteLink>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
