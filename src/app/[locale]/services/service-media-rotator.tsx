'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export type ServiceRotatorImage = {
  src: string
  alt: string
  /** Optional CSS object-position for frames whose subject is off-centre. */
  focus?: string
}

type ServiceMediaRotatorProps = {
  images: ServiceRotatorImage[]
  width: number
  height: number
  /** Responsive sizes hint so the browser fetches the right (retina) candidate. */
  sizes?: string
  /** Milliseconds each image stays before the soft crossfade to the next. */
  interval?: number
  /** Marks the first frame as the LCP priority image (use for the hero). */
  priority?: boolean
  /** Shows clickable bullet indicators for the active frame. */
  showIndicators?: boolean
  /** Accessible label for the indicator group (e.g. "Service spectrum"). */
  indicatorLabel?: string
  className?: string
}

/**
 * Soft, non-intrusive image rotator used across every service detail page.
 * It crossfades between curated frames to show the full spectrum of a service
 * (food, service, variety, hygiene) and respects prefers-reduced-motion.
 */
export function ServiceMediaRotator({
  images,
  width,
  height,
  sizes,
  interval = 5500,
  priority = false,
  showIndicators = false,
  indicatorLabel,
  className,
}: ServiceMediaRotatorProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const id = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length)
    }, interval)

    return () => window.clearInterval(id)
    // activeIndex is a dependency so a manual selection restarts the timer,
    // keeping the rhythm even after someone taps a bullet.
  }, [images.length, interval, activeIndex])

  return (
    <div
      className={['ds-service-media-rotator', className].filter(Boolean).join(' ')}
      data-count={images.length}
    >
      {images.map((image, index) => {
        const isActive = index === activeIndex
        return (
          <div
            className="ds-service-media-rotator-frame"
            data-active={isActive ? 'true' : 'false'}
            aria-hidden={isActive ? undefined : true}
            key={image.src}
          >
            <Image
              src={image.src}
              alt={isActive ? image.alt : ''}
              width={width}
              height={height}
              sizes={sizes}
              style={image.focus ? { objectPosition: image.focus } : undefined}
              priority={priority && index === 0}
              loading={priority && index === 0 ? undefined : 'lazy'}
            />
          </div>
        )
      })}

      {showIndicators && images.length > 1 ? (
        <div
          className="ds-service-media-rotator-indicators"
          role="group"
          aria-label={indicatorLabel}
        >
          {images.map((image, index) => {
            const isActive = index === activeIndex
            return (
              <button
                type="button"
                className="ds-service-media-rotator-dot"
                data-active={isActive ? 'true' : 'false'}
                aria-current={isActive ? 'true' : undefined}
                aria-label={image.alt}
                onClick={() => setActiveIndex(index)}
                key={image.src}
              >
                <span className="ds-service-media-rotator-dot-fill" aria-hidden="true" />
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
