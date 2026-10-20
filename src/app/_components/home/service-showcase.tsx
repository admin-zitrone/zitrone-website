'use client'

import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import Image from 'next/image'

import { Button } from '@/components/button'
import { Container } from '@/components/layout'
import { Section } from '@/components/section'

import { renderEmphasis } from '@/lib/emphasis'
import { FeatureIcon } from './feature-icons'
import { withServiceRibbonLogoScales } from './hero-logo-scales'
import { useHomeContent } from './home-content-context'

const AUTOPLAY_MS = 7200

/* A drag becomes a slide change once the pointer crosses this share of the panel
   width; anything shorter springs back to the slide it started on. */
const SWIPE_THRESHOLD_RATIO = 0.15

/* Below this the drag reads as a tap, so the CTA underneath keeps its click. */
const DRAG_CLICK_SUPPRESS_PX = 6

/* A middle, canonical copy is flanked by two visual copies. That gives the
   rail somewhere to travel at either end before it is silently returned to
   the equivalent panel in the middle copy. */
const LOOP_COPIES = 3

export function ServiceShowcase() {
  const { serviceLayers, componentLabels, heroLogos, sections } = useHomeContent()
  const labels = componentLabels.serviceSystem
  const ribbonLabels = componentLabels.servicesCarousel
  const ribbonLogos = withServiceRibbonLogoScales(heroLogos)
  const count = serviceLayers.length

  const [current, setCurrent] = useState(0)
  const [loopIndex, setLoopIndex] = useState(count)
  /* Starts true so the first alignment lands without sweeping the rail in
     from zero; the reset effect below releases it two frames later. */
  const [isLoopResetting, setIsLoopResetting] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [isInView, setIsInView] = useState(false)

  const loopedLayers = Array.from({ length: LOOP_COPIES }, (_, copy) =>
    serviceLayers.map((layer, logicalIndex) => ({ layer, copy, logicalIndex })),
  ).flat()

  const sectionRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const chipRefs = useRef<Array<HTMLButtonElement | null>>([])
  const trackRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<Array<HTMLElement | null>>([])
  const dragRef = useRef({ active: false, pointerId: -1, startX: 0, delta: 0, width: 0 })
  const suppressClickUntilRef = useRef(0)

  const step = useCallback(
    (direction: 1 | -1) => {
      setCurrent((index) => (index + direction + count) % count)
      /* Never step outside the rendered copies: if a reset has not landed yet
         (steps faster than the slide), wrap by one copy instead. */
      setLoopIndex((index) => {
        const next = index + direction
        return next < 0 ? next + count : next >= count * LOOP_COPIES ? next - count : next
      })
    },
    [count],
  )

  const selectSlide = useCallback(
    (logicalIndex: number, physicalIndex = count + logicalIndex) => {
      setCurrent(logicalIndex)
      setLoopIndex(physicalIndex)
    },
    [count],
  )

  /* Cards cross-fade in place, so a swipe is only a gesture to read — there is
     no track to drag along with the finger. Pointer position is never written
     back to the DOM during the move. */
  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const viewport = event.currentTarget
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      delta: 0,
      width: viewport.offsetWidth,
    }
  }, [])

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag.active || drag.pointerId !== event.pointerId) return
    drag.delta = event.clientX - drag.startX
  }, [])

  const endDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current
      if (!drag.active || drag.pointerId !== event.pointerId) return
      drag.active = false

      /* A browser can omit the synthetic click after a touch swipe. Store an
         expiry rather than a boolean, so that missed synthetic click cannot
         consume the next intentional card selection. */
      suppressClickUntilRef.current =
        Math.abs(drag.delta) >= DRAG_CLICK_SUPPRESS_PX ? window.performance.now() + 400 : 0

      const threshold = drag.width * SWIPE_THRESHOLD_RATIO
      if (drag.delta <= -threshold) step(1)
      else if (drag.delta >= threshold) step(-1)
    },
    [step],
  )

  const onClickCapture = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (window.performance.now() >= suppressClickUntilRef.current) {
      suppressClickUntilRef.current = 0
      return
    }
    suppressClickUntilRef.current = 0
    event.preventDefault()
    event.stopPropagation()
  }, [])

  /* The active card is centred in the rail, so slivers of both neighbours stay
     on screen either side of it. Centring is what makes this read as a rail you
     are moving along rather than a series of full-width slides. */
  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    const align = () => {
      const card = panelRefs.current[loopIndex]
      const rail = track.parentElement
      if (!card || !rail) return
      const centred = (rail.clientWidth - card.offsetWidth) / 2 - card.offsetLeft
      track.style.setProperty('--spotlight-offset', `${Math.round(centred)}px`)
    }

    align()

    let resizeRaf = 0
    const onResize = () => {
      window.cancelAnimationFrame(resizeRaf)
      resizeRaf = window.requestAnimationFrame(align)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.cancelAnimationFrame(resizeRaf)
    }
  }, [loopIndex, count])

  /* After the animated step reaches either visual copy, jump to its identical
     card in the middle copy with transitions paused for two frames. The user
     sees one continuous rail, while the DOM remains finite and predictable.

     Timed off the slide duration rather than `transitionend`: that event is
     skipped when the tab is in the background or a slide is interrupted, and a
     missed reset let autoplay walk the index off the end of the rail — no card
     active, every card faded, an empty stage. */
  useEffect(() => {
    if (isLoopResetting) return undefined

    const resetIndex =
      loopIndex < count ? loopIndex + count : loopIndex >= count * 2 ? loopIndex - count : null
    if (resetIndex === null) return undefined

    const track = trackRef.current
    const duration = track ? getComputedStyle(track).transitionDuration.split(',')[0].trim() : '0s'
    const ms = duration.endsWith('ms') ? parseFloat(duration) : parseFloat(duration) * 1000

    const timer = window.setTimeout(() => {
      setIsLoopResetting(true)
      setLoopIndex(resetIndex)
    }, (Number.isFinite(ms) ? ms : 0) + 60)

    return () => window.clearTimeout(timer)
  }, [count, isLoopResetting, loopIndex])

  useEffect(() => {
    if (!isLoopResetting) return undefined

    let nextFrame = window.requestAnimationFrame(() => {
      nextFrame = window.requestAnimationFrame(() => setIsLoopResetting(false))
    })

    return () => window.cancelAnimationFrame(nextFrame)
  }, [isLoopResetting])

  /* Autoplay only while the section is on screen and nobody is interacting. */
  useEffect(() => {
    if (count < 2 || !isInView || isPaused) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const timer = window.setTimeout(() => step(1), AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
  }, [count, current, isInView, isPaused, step])

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return undefined

    /* Keyed off overlap with the middle band of the viewport rather than an
       intersection ratio: the section is taller than most viewports, so a ratio
       threshold is unreachable on short screens and autoplay would never run. */
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      rootMargin: '-25% 0px -25% 0px',
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  /* Slide the nav underline to sit under the active chip. */
  useLayoutEffect(() => {
    const nav = navRef.current
    const chip = chipRefs.current[current]
    if (!nav || !chip) return undefined

    const syncIndicator = () => {
      nav.style.setProperty('--svc-indicator-width', `${chip.offsetWidth}px`)
      nav.style.setProperty('--svc-indicator-x', `${chip.offsetLeft}px`)

      if (window.matchMedia('(max-width: 40rem)').matches) {
        const targetLeft = Math.max(0, chip.offsetLeft - (nav.clientWidth - chip.offsetWidth) / 2)
        nav.scrollTo({
          left: targetLeft,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        })
      }
    }

    syncIndicator()

    let resizeRaf = 0
    const onResize = () => {
      window.cancelAnimationFrame(resizeRaf)
      resizeRaf = window.requestAnimationFrame(syncIndicator)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.cancelAnimationFrame(resizeRaf)
    }
  }, [current, count])

  const pause = () => setIsPaused(true)
  const resume = () => setIsPaused(false)

  return (
    <Section
      ref={sectionRef}
      id="service-system"
      className="ds-service-spotlight"
      size="large"
      pattern="services"
      aria-labelledby="service-spotlight-title"
    >
      <Container>
        <div className="ds-service-spotlight-intro">
          <p className="semantic-kicker ds-kicker">{labels.kicker}</p>
          <h2
            className="ds-heading ds-title-reveal ds-service-spotlight-title"
            data-title-reveal="words"
            id="service-spotlight-title"
            aria-label={labels.titleAriaLabel}
          >
            {labels.titleLine1}
            <br />
            <em>{labels.titleLine2}</em>
          </h2>
          <p className="ds-service-spotlight-intro-copy">{sections.services.copy}</p>
        </div>

        <div className="ds-service-spotlight-head">
          <nav ref={navRef} className="ds-service-system-nav" aria-label={labels.navAriaLabel}>
            {serviceLayers.map((layer, index) => {
              const isActive = index === current

              return (
                <button
                  ref={(node) => {
                    chipRefs.current[index] = node
                  }}
                  className={`ds-service-system-chip${isActive ? ' is-active' : ''}`}
                  type="button"
                  data-svc-theme={layer.theme}
                  aria-pressed={isActive}
                  onClick={() => selectSlide(index)}
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

      {/* Full-bleed: the rail must reach the viewport edges or the neighbouring
          cards have nowhere to peek from. */}
      <div className="ds-service-spotlight-stage">
        <div
          className="ds-service-spotlight-viewport"
          onClickCapture={onClickCapture}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocusCapture={pause}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) resume()
          }}
        >
          <div
            ref={trackRef}
            className="ds-service-spotlight-track"
            data-loop-resetting={isLoopResetting || undefined}
          >
            {loopedLayers.map(({ layer, copy, logicalIndex }, physicalIndex) => {
              const isActive = physicalIndex === loopIndex
              const isVisualCopy = copy !== 1

              return (
                <article
                  ref={(node) => {
                    panelRefs.current[physicalIndex] = node
                  }}
                  className="ds-service-spotlight-panel"
                  data-svc-theme={layer.theme}
                  data-active={isActive}
                  aria-hidden={isVisualCopy || undefined}
                  aria-roledescription="slide"
                  aria-label={labels.progressValueTextTemplate
                    .replace('{current}', String(logicalIndex + 1))
                    .replace('{total}', String(count))}
                  key={`${layer.title}-${copy}`}
                >
                  {/* The flanking copies are visual only, avoiding repeated slide
                      content for assistive tech. Pointer selection still works on
                      them, and the canonical middle copy remains in tab order. */}
                  <div
                    className="ds-service-spotlight-card"
                    onClick={() => {
                      if (!isActive && !window.getSelection()?.toString()) {
                        selectSlide(logicalIndex, physicalIndex)
                      }
                    }}
                  >
                    <div className="ds-service-spotlight-media">
                      <Image
                        src={layer.image}
                        alt=""
                        fill
                        // Measured slot widths: ~70vw on phones, ~66vw on
                        // tablets (single-column card), a third of the viewport
                        // on desktop, capped at ~29rem.
                        sizes="(min-width: 90rem) 29rem, (min-width: 64.0625rem) 33vw, (min-width: 40.0625rem) 66vw, 72vw"
                        // Below the fold, and each slide is rendered three times
                        // as carousel clones, so eager here multiplied the
                        // initial burst without ever being the LCP.
                        loading="lazy"
                      />
                    </div>

                    <div className="ds-service-spotlight-detail">
                      <h3 className="ds-service-spotlight-name">{layer.title}</h3>
                      <p className="ds-service-spotlight-copy">{layer.copy}</p>

                      <ul className="ds-service-spotlight-features">
                        {layer.features.map((feature) => (
                          <li className="ds-service-spotlight-feature" key={feature.title}>
                            <span className="ds-service-spotlight-feature-icon" aria-hidden="true">
                              <FeatureIcon name={feature.icon} />
                            </span>
                            <div>
                              <p className="ds-service-spotlight-feature-title">{renderEmphasis(feature.title)}</p>
                            </div>
                          </li>
                        ))}
                      </ul>

                      {layer.href && layer.ctaLabel ? (
                        <Button
                          className="ds-service-spotlight-cta"
                          href={layer.href}
                          tabIndex={isVisualCopy ? -1 : undefined}
                        >
                          <span>{layer.ctaLabel}</span>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        {/* The looping steps sit in the gutters either side of the active card,
            level with its middle. */}
        <button
          className="ds-service-spotlight-arrow"
          type="button"
          data-direction="previous"
          aria-label={labels.previous}
          onClick={() => step(-1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button
          className="ds-service-spotlight-arrow"
          type="button"
          data-direction="next"
          aria-label={labels.next}
          onClick={() => step(1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <Container>
        {/* Position dots, centred under the rail. They drive the same
            `selectSlide` as the pills. */}
        <div className="ds-service-spotlight-controls" onMouseEnter={pause} onMouseLeave={resume}>
          <div className="ds-service-spotlight-dots" role="group" aria-label={labels.progressAriaLabel}>
            {serviceLayers.map((layer, index) => (
              <button
                className="ds-service-spotlight-dot"
                type="button"
                aria-current={index === current || undefined}
                aria-label={labels.progressValueTextTemplate
                  .replace('{current}', String(index + 1))
                  .replace('{total}', String(count))}
                onClick={() => selectSlide(index)}
                key={layer.title}
              />
            ))}
          </div>
        </div>

        {/* Closes the section on proof: the service programmes above are the ones
            these companies actually run. Same client set, order, and optical
            balance the service pages use, so no surface re-tunes its own. */}
        <div className="ds-client-ribbon">
          <div className="ds-media-ribbon-marquee" aria-label={ribbonLabels.logosAriaLabel}>
            <div className="ds-media-ribbon-marquee-inner">
              {[false, true].map((isDuplicate) => (
                <div
                  className="ds-media-ribbon-track"
                  aria-hidden={isDuplicate ? 'true' : undefined}
                  key={String(isDuplicate)}
                >
                  {ribbonLogos.map((logo) => (
                    <span
                      className="ds-logo-chip ds-logo-chip--image"
                      data-logo-id={logo.id}
                      data-logo-fit={logo.fit ?? 'wide'}
                      style={{ '--logo-scale': String(logo.scale ?? 1) } as CSSProperties}
                      key={`${logo.id}-${String(isDuplicate)}`}
                    >
                      {/* Full-colour marks: this ribbon carries each brand as it
                          actually looks, so it takes `src` rather than the mono
                          artwork the silhouette ribbons use. */}
                      <Image
                        src={logo.src}
                        alt={isDuplicate ? '' : logo.alt}
                        width={96}
                        height={28}
                        loading="eager"
                        decoding="async"
                        unoptimized
                      />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
