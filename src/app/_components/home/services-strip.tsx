'use client'

import Image from 'next/image'
import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react'

import { useNearViewport } from '@/hooks/use-near-viewport'
import { Link } from '@/i18n/navigation'

import { useHomeContent } from './home-content-context'

/* ── Strip ────────────────────────────────────────────────────────────────────
   One endless row of equal portrait cards drifting sideways on their own. No
   perspective, no blur, no single "active" card: every card carries its own
   name, parent service and link, and hovering one stops the row and opens its
   description.

   Vertical scroll is never taken over. The row moves by its own drift, by a
   drag, or by a sideways trackpad gesture; a plain wheel scroll passes through
   to the page. */

/* Resting drift, in px per second. Slow enough to read a name as it passes. */
const DRIFT_PX_S = 36

/* How fast the row eases toward its resting speed (per second). Lower keeps a
   flick travelling longer before it settles back into the drift. */
const EASE_PER_S = 2.4

/* A release carries the finger's speed, capped so a hard flick can't spin the
   row past more than a few cards. */
const FLICK_MAX_PX_S = 2400

const DRAG_CLICK_THRESHOLD_PX = 6

export function ServicesStrip() {
  const { componentLabels, servicesOrbitItems, serviceLinks } = useHomeContent()
  const labels = componentLabels.servicesCarousel
  const count = servicesOrbitItems.length

  const viewportRef = useRef<HTMLDivElement | null>(null)
  const imagesNear = useNearViewport(viewportRef)
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])

  /* Live state, kept out of React: it changes every frame. */
  const positionRef = useRef(0)
  const velocityRef = useRef(DRIFT_PX_S)
  const strideRef = useRef(0)
  const holdRef = useRef(false)
  const reducedRef = useRef(false)
  const dragRef = useRef<{
    pointerId: number
    lastX: number
    lastTime: number
    velocity: number
    travel: number
  } | null>(null)
  const suppressClickRef = useRef(false)

  const draw = useCallback(() => {
    const stride = strideRef.current
    if (!stride) return

    const loop = stride * count
    const position = positionRef.current

    cardRefs.current.forEach((node, index) => {
      if (!node) return
      /* Each card is drawn at whichever of its repeats sits nearest the centre,
         so the row never runs out. The wrap happens half a loop away — well
         past the viewport edge for any count this row is fed. */
      let x = index * stride - position
      x = ((x % loop) + loop) % loop
      if (x > loop / 2) x -= loop
      node.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), 0, 0)`
    })
  }, [count])

  /* Measured from a live card so the clamp() in the width resolves. */
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return undefined

    const measure = () => {
      const first = cardRefs.current[0]
      if (!first) return
      const gap = parseFloat(getComputedStyle(viewport).columnGap) || 0
      strideRef.current = first.offsetWidth + gap
      draw()
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [draw])

  /* One frame loop, running only while the row is on screen. */
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return undefined

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedRef.current = motion.matches
    if (reducedRef.current) velocityRef.current = 0

    let frame: number | null = null
    let last = 0

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      if (!dragRef.current) {
        const rest = holdRef.current || reducedRef.current ? 0 : DRIFT_PX_S
        velocityRef.current += (rest - velocityRef.current) * (1 - Math.exp(-EASE_PER_S * dt))
        positionRef.current += velocityRef.current * dt
        draw()
      }

      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && frame === null) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      } else if (!entry.isIntersecting && frame !== null) {
        cancelAnimationFrame(frame)
        frame = null
      }
    })
    observer.observe(viewport)

    /* Sideways trackpad gestures move the row. Vertical wheel input is left
       alone so the page keeps scrolling natively. */
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
      event.preventDefault()
      positionRef.current += event.deltaX
      velocityRef.current = 0
      draw()
    }
    viewport.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      observer.disconnect()
      viewport.removeEventListener('wheel', onWheel)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [draw])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragRef.current = {
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
      travel: 0,
    }
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const dx = event.clientX - drag.lastX
    const now = performance.now()
    drag.travel += Math.abs(dx)
    /* Capture only once it is clearly a drag, so a plain click still reaches
       the card link underneath. */
    if (drag.travel > DRAG_CLICK_THRESHOLD_PX && !event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    positionRef.current -= dx
    drag.velocity = (-dx / Math.max(now - drag.lastTime, 1)) * 1000
    drag.lastX = event.clientX
    drag.lastTime = now
    draw()
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    dragRef.current = null

    if (drag.travel > DRAG_CLICK_THRESHOLD_PX) suppressClickRef.current = true
    velocityRef.current = Math.max(-FLICK_MAX_PX_S, Math.min(FLICK_MAX_PX_S, drag.velocity))
  }

  const onClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return
    suppressClickRef.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  /* Tabbing onto a card pulls it to the centre so it is never read off-screen. */
  const onCardFocus = (index: number) => {
    const stride = strideRef.current
    if (!stride) return
    const loop = stride * count
    let x = index * stride - positionRef.current
    x = ((x % loop) + loop) % loop
    if (x > loop / 2) x -= loop
    positionRef.current += x
    draw()
  }

  return (
    <div className="ds-strip" role="region" aria-label={labels.regionLabel}>
      <div
        ref={viewportRef}
        className="ds-strip-viewport"
        role="list"
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') holdRef.current = true
        }}
        onPointerLeave={() => {
          holdRef.current = false
        }}
        onFocusCapture={() => {
          holdRef.current = true
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            holdRef.current = false
          }
        }}
        onClickCapture={onClickCapture}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {servicesOrbitItems.map((item, index) => {
          const service = serviceLinks[item.theme]
          return (
            <Link
              ref={(node: HTMLAnchorElement | null) => {
                cardRefs.current[index] = node
              }}
              className="ds-strip-card"
              href={service.href}
              role="listitem"
              draggable={false}
              key={item.title}
              onFocus={() => onCardFocus(index)}
            >
              {/* The strip sits ~3 screens down on a phone, and native lazy
                  loading still fetched its 20 looped cards (~1 MB) at page
                  load. They mount one screen ahead instead; the card box is
                  sized by CSS, so nothing shifts. */}
              {imagesNear ? (
                <Image
                  className="ds-strip-card-image"
                  src={item.image}
                  alt=""
                  draggable={false}
                  fill
                  sizes="(max-width: 40rem) 68vw, 24vw"
                  loading="lazy"
                />
              ) : null}
              <span className="ds-strip-card-veil" aria-hidden="true" />
              <span className="ds-strip-card-info">
                <span className="ds-strip-card-service">{service.label}</span>
                <span className="ds-strip-card-name">{item.title}</span>
                {/* Collapsed to zero height until hover/focus. The padding lives
                    on the innermost span so the collapsed row is truly empty and
                    the name sits on the card's foot, not floating above it. */}
                <span className="ds-strip-card-reveal">
                  <span className="ds-strip-card-reveal-inner">
                    <span className="ds-strip-card-copy">{item.copy}</span>
                    <span className="ds-strip-card-cta">{labels.viewService} →</span>
                  </span>
                </span>
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
