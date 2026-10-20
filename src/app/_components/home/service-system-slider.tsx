"use client"

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import Image from "next/image"

import { Container } from "@/components/layout"
import { Section } from "@/components/section"
import { Link } from "@/i18n/navigation"

import { renderEmphasis } from "@/lib/emphasis"
import { ArrowLineIcon, FeatureIcon } from "./feature-icons"
import { useHomeContent } from "./home-content-context"

const SLIDE_MS = 780
const SLIDE_EASING = "cubic-bezier(0.18, 0.88, 0.28, 1)"
const AUTOPLAY_MS = 5200

export function ServiceSystemSlider({
  variant = "default",
}: {
  variant?: "default" | "study"
}) {
  const { serviceLayers, componentLabels } = useHomeContent()
  const labels = componentLabels.serviceSystem
  const isStudy = variant === "study"
  const [current, setCurrent] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [isCompactStudy, setIsCompactStudy] = useState(false)
  const [expandedStudyIndex, setExpandedStudyIndex] = useState<number | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const chipRefs = useRef<Array<HTMLButtonElement | null>>([])
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLElement | null>>([])
  const baseXRef = useRef(0)
  const prevIndexRef = useRef(0)
  const autoDirectionRef = useRef<1 | -1>(1)
  const dragRef = useRef({ active: false, startX: 0, delta: 0, pressedIndex: -1 })

  const theme = serviceLayers[current]?.theme ?? "dining"
  const count = serviceLayers.length

  const changeSlide = useCallback(
    (next: number | ((index: number) => number)) => {
      setExpandedStudyIndex(null)
      setCurrent(next)
    },
    [],
  )

  useEffect(() => {
    if (!isStudy) return undefined

    const media = window.matchMedia("(max-width: 40rem)")
    const sync = () => {
      const matches = media.matches
      setIsCompactStudy(matches)
      if (!matches) {
        setExpandedStudyIndex(null)
      }
    }

    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [isStudy])

  const computeBaseX = useCallback((index: number) => {
    const track = trackRef.current
    const cards = cardRefs.current.filter(
      (node): node is HTMLElement => node !== null,
    )
    if (!track || !cards.length) return 0

    const prev = prevIndexRef.current
    const stableCard =
      cards.find((card, i) => i !== index && i !== prev) ?? cards[0]
    const compactWidth = stableCard?.offsetWidth ?? 0
    const gap = parseFloat(window.getComputedStyle(track).gap) || 0
    return -(index * (compactWidth + gap))
  }, [])

  const setTransform = useCallback((x: number, animate: boolean) => {
    const track = trackRef.current
    if (!track) return
    track.style.transition = animate
      ? `transform ${SLIDE_MS}ms ${SLIDE_EASING}`
      : "none"
    track.style.transform = `translateX(${x}px)`
  }, [])

  useEffect(() => {
    const baseX = computeBaseX(current)
    baseXRef.current = baseX
    setTransform(baseX, true)
    prevIndexRef.current = current
  }, [current, computeBaseX, setTransform])

  useEffect(() => {
    let raf1 = 0
    let raf2 = 0
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        const baseX = computeBaseX(0)
        baseXRef.current = baseX
        setTransform(baseX, false)
        setIsReady(true)
      })
    })
    return () => {
      window.cancelAnimationFrame(raf1)
      window.cancelAnimationFrame(raf2)
    }
  }, [computeBaseX, setTransform])

  useEffect(() => {
    if (count < 2) return undefined
    if (!isInView) return undefined
    if (isInteracting) return undefined

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return undefined

    const timer = window.setTimeout(() => {
      changeSlide((currentIndex) => {
        let next = currentIndex + autoDirectionRef.current

        if (next >= count) {
          autoDirectionRef.current = -1
          next = Math.max(count - 2, 0)
        } else if (next < 0) {
          autoDirectionRef.current = 1
          next = Math.min(1, count - 1)
        }

        return next
      })
    }, AUTOPLAY_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [count, current, isInView, isInteracting, changeSlide])

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && entry.intersectionRatio > 0.35)
      },
      {
        threshold: [0, 0.2, 0.35, 0.5, 0.75],
        rootMargin: "-10% 0px -10% 0px",
      },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let resizeRaf = 0
    const onResize = () => {
      window.cancelAnimationFrame(resizeRaf)
      resizeRaf = window.requestAnimationFrame(() => {
        const baseX = computeBaseX(current)
        baseXRef.current = baseX
        setTransform(baseX, false)
      })
    }
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      window.cancelAnimationFrame(resizeRaf)
    }
  }, [current, computeBaseX, setTransform])

  useLayoutEffect(() => {
    const nav = navRef.current
    const chip = chipRefs.current[current]
    if (!nav || !chip) return

    const syncIndicator = () => {
      nav.style.setProperty("--svc-indicator-width", `${chip.offsetWidth}px`)
      nav.style.setProperty("--svc-indicator-x", `${chip.offsetLeft}px`)
    }

    syncIndicator()

    let resizeRaf = 0
    const onResize = () => {
      window.cancelAnimationFrame(resizeRaf)
      resizeRaf = window.requestAnimationFrame(syncIndicator)
    }

    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      window.cancelAnimationFrame(resizeRaf)
    }
  }, [current, serviceLayers.length])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      const target = event.target
      const pressedCard =
        target instanceof Element
          ? target.closest<HTMLElement>("[data-svc-card]")
          : null
      const pressedIndex = pressedCard
        ? cardRefs.current.indexOf(pressedCard)
        : -1
      dragRef.current = {
        active: true,
        startX: event.clientX,
        delta: 0,
        pressedIndex,
      }
      viewport.setPointerCapture(event.pointerId)
      viewport.classList.add("is-dragging")
      setTransform(baseXRef.current, false)
    }

    const onPointerMove = (event: PointerEvent) => {
      const state = dragRef.current
      if (!state.active) return
      state.delta = event.clientX - state.startX
      setTransform(baseXRef.current + state.delta, false)
    }

    const endDrag = () => {
      const state = dragRef.current
      if (!state.active) return
      state.active = false
      viewport.classList.remove("is-dragging")

      const cards = cardRefs.current
      const cardWidth =
        cards[current]?.offsetWidth ?? cards[0]?.offsetWidth ?? 0
      const threshold = cardWidth * 0.2
      const tapIndex = state.pressedIndex

      if (Math.abs(state.delta) < 8 && tapIndex > -1 && tapIndex !== current) {
        autoDirectionRef.current = tapIndex > current ? 1 : -1
        changeSlide(tapIndex)
      } else if (state.delta < -threshold) {
        autoDirectionRef.current = 1
        changeSlide((c) => Math.min(c + 1, count - 1))
      } else if (state.delta > threshold) {
        autoDirectionRef.current = -1
        changeSlide((c) => Math.max(c - 1, 0))
      } else {
        setTransform(baseXRef.current, true)
      }
    }

    viewport.addEventListener("pointerdown", onPointerDown)
    viewport.addEventListener("pointermove", onPointerMove)
    viewport.addEventListener("pointerup", endDrag)
    viewport.addEventListener("pointercancel", endDrag)
    return () => {
      viewport.removeEventListener("pointerdown", onPointerDown)
      viewport.removeEventListener("pointermove", onPointerMove)
      viewport.removeEventListener("pointerup", endDrag)
      viewport.removeEventListener("pointercancel", endDrag)
    }
  }, [current, count, setTransform, changeSlide])

  return (
    <Section
      ref={sectionRef}
      id={isStudy ? "service-system-study" : "service-system"}
      className={`ds-service-system-section semantic-service-theme-surface${
        isStudy ? " ds-service-system-section--study" : ""
      }`}
      size="large"
      pattern="service-system"
      data-svc-theme={isInView ? theme : "idle"}
      style={{ "--svc-layer-count": count } as CSSProperties}
      aria-labelledby={isStudy ? "svc-system-study-title" : "svc-system-title"}
    >
      <Container>
        <div className="ds-service-system-head ds-stack" data-gap="loose">
          <p className="semantic-kicker ds-kicker">{labels.kicker}</p>
          <h2
            className="ds-heading ds-title-reveal ds-service-system-header"
            data-title-reveal="words"
            id={isStudy ? "svc-system-study-title" : "svc-system-title"}
            aria-label={labels.titleAriaLabel}
          >
            {labels.titleLine1}
            <br />
            <em>{labels.titleLine2}</em>
          </h2>
          <nav ref={navRef} className="ds-service-system-nav" aria-label={labels.navAriaLabel}>
            {serviceLayers.map((layer, index) => {
              const isActive = index === current
              return (
                <button
                  ref={(node) => {
                    chipRefs.current[index] = node
                  }}
                  className={`ds-service-system-chip${isActive ? " is-active" : ""}`}
                  type="button"
                  data-svc-theme={layer.theme}
                  aria-pressed={isActive}
                  onClick={() => {
                    autoDirectionRef.current = index > current ? 1 : -1
                    changeSlide(index)
                  }}
                  key={layer.title}
                >
                  <span className="ds-service-system-chip-label">{layer.shortTitle ?? layer.title}</span>
                </button>
              )
            })}
            <span className="ds-service-system-nav-indicator" aria-hidden="true" />
          </nav>
        </div>
      </Container>

      <div className="ds-service-system-stage">
        <div
          ref={viewportRef}
          className="ds-service-system-viewport"
          data-ready={isReady ? "true" : "false"}
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
          onFocusCapture={() => setIsInteracting(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setIsInteracting(false)
            }
          }}
        >
          <div ref={trackRef} className="ds-service-system-track">
            {serviceLayers.map((layer, index) => {
              const isActive = index === current
              const isMobileExpanded = isStudy && isCompactStudy && expandedStudyIndex === index
              const cardTitleId = `${isStudy ? "svc-study" : "svc"}-card-title-${index}`
              return (
                <article
                  ref={(node) => {
                    cardRefs.current[index] = node
                  }}
                  className={`ds-service-system-card${
                    isStudy ? " ds-service-system-study-card" : ""
                  }${isActive ? " is-active" : ""}`}
                  data-svc-card=""
                  data-svc-theme={layer.theme}
                  data-mobile-expanded={isStudy && isCompactStudy ? String(isMobileExpanded) : undefined}
                  data-study-tone={isStudy ? (index % 2 === 0 ? "blue" : "green") : undefined}
                  aria-current={isActive ? "true" : undefined}
                  aria-labelledby={cardTitleId}
                  onClick={() => {
                    if (!isActive) changeSlide(index)
                  }}
                  key={layer.title}
                >
                  {isStudy ? (
                    <div className="ds-service-system-study-visual">
                      <div className="ds-service-system-image ds-service-system-study-image">
                        <Image
                          src={layer.image}
                          alt=""
                          fill
                          sizes="(max-width: 40rem) 92vw, 72vw"
                          priority={index === 0}
                        />
                      </div>
                      <div className="ds-service-system-scrim ds-service-system-study-scrim" />
                      <div className="ds-service-system-study-mobile-preview">
                        <h3 className="ds-service-system-study-mobile-preview-title">
                          {layer.title}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="ds-service-system-image">
                        <Image
                          src={layer.image}
                          alt=""
                          fill
                          sizes="(max-width: 40rem) 92vw, 72vw"
                          priority={index === 0}
                        />
                      </div>
                      <div className="ds-service-system-scrim" />
                    </>
                  )}
                  {isStudy ? (
                    <div className="ds-service-system-study-shell">
                      <div className="ds-service-system-study-preview">
                        <h3
                          id={cardTitleId}
                          className="ds-service-system-study-preview-title"
                        >
                          {layer.title}
                        </h3>
                      </div>

                      <div className="ds-service-system-study-panel">
                        <div className="ds-service-system-study-panel-inner">
                          <div className="ds-service-system-study-body">
                            <div className="ds-service-system-study-panel-header">
                              {layer.features[0] ? (
                                <span
                                  className="ds-service-system-study-panel-icon"
                                  aria-hidden="true"
                                >
                                  <FeatureIcon name={layer.features[0].icon} />
                                </span>
                              ) : null}
                              <h3 className="ds-service-system-study-panel-title">{layer.title}</h3>
                            </div>
                            {isCompactStudy ? (
                              <button
                                className="ds-service-system-study-disclosure"
                                type="button"
                                aria-expanded={isMobileExpanded}
                                onClick={(event) => {
                                  event.stopPropagation()
                                  setExpandedStudyIndex((currentExpanded) =>
                                    currentExpanded === index ? null : index,
                                  )
                                }}
                              >
                                <span>
                                  {isMobileExpanded
                                    ? labels.hideDetails
                                    : labels.viewDetails}
                                </span>
                                <ArrowLineIcon />
                              </button>
                            ) : null}
                            <div className="ds-service-system-study-features">
                              {layer.features.map((feature) => (
                                <div
                                  className="ds-service-system-study-feature"
                                  key={feature.title}
                                  tabIndex={0}
                                >
                                  <span className="ds-service-system-study-feature-icon">
                                    <FeatureIcon name={feature.icon} />
                                  </span>
                                  <div className="ds-service-system-study-feature-copy">
                                    <p className="ds-service-system-study-feature-title">{renderEmphasis(feature.title)}</p>
                                    <p className="ds-service-system-study-feature-text">{feature.text}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {layer.href && layer.ctaLabel ? (
                              <Link
                                className="ds-service-system-study-link"
                                href={layer.href}
                                onClick={(event) => event.stopPropagation()}
                              >
                                <span>{layer.ctaLabel}</span>
                                <ArrowLineIcon />
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="ds-service-system-card-copy">
                      <div className="ds-service-system-intro">
                        <h3 id={cardTitleId} className="ds-service-system-name">{layer.title}</h3>
                      </div>
                      <div className="ds-service-system-features">
                        {layer.features.map((feature) => (
                          <div className="ds-service-system-feature" key={feature.title}>
                            <span className="ds-service-system-feature-icon">
                              <FeatureIcon name={feature.icon} />
                            </span>
                            <div>
                              <p className="ds-service-system-feature-title">{renderEmphasis(feature.title)}</p>
                              <p className="ds-service-system-feature-text">{feature.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </div>

      <Container>
        <div className="ds-service-system-controls">
          <div className="ds-service-system-arrows">
            <button
              className="ds-carousel-button ds-service-system-arrow"
              type="button"
              data-direction="prev"
              aria-label={labels.previous}
              disabled={current === 0}
              onClick={() => {
                autoDirectionRef.current = -1
                changeSlide((c) => Math.max(c - 1, 0))
              }}
            >
              <ArrowLineIcon />
            </button>
            <button
              className="ds-carousel-button ds-service-system-arrow"
              type="button"
              aria-label={labels.next}
              disabled={current === count - 1}
              onClick={() => {
                autoDirectionRef.current = 1
                changeSlide((c) => Math.min(c + 1, count - 1))
              }}
            >
              <ArrowLineIcon />
            </button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
