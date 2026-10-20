"use client"

import NumberFlow from "@number-flow/react"
import { useEffect, useRef, useState } from "react"

type HeroDailyStatProps = {
  value: number
  label: string
  locale: string
}

const EASE = "cubic-bezier(0.22, 0.76, 0.2, 1)"
const COUNT_UP_MS = 1400

/**
 * Hero ribbon lead-in: the daily meals figure counts up once, from 0, the
 * first time the ribbon is on screen, and lands on the stated figure. It
 * never moves after that: the number is a typical day, not a live count, so
 * it must not tick as if it were measuring today. Under reduced motion the
 * figure appears without counting.
 *
 * Screen readers get the fixed sentence with the figure; the animated digits
 * are hidden from them so no change is ever announced.
 */
export function HeroDailyStat({ value, label, locale }: HeroDailyStatProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [shown, setShown] = useState(0)
  const formatLocale = locale === "es" ? "es-MX" : "en-US"
  const formatted = new Intl.NumberFormat(formatLocale).format(value)

  useEffect(() => {
    const node = ref.current
    // IntersectionObserver is in every browser Next.js 16 supports.
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        setShown(value)
      },
      { threshold: 0.6 },
    )
    observer.observe(node)

    return () => observer.disconnect()
  }, [value])

  const timing = { duration: COUNT_UP_MS, easing: EASE }

  return (
    <p className="ds-hero-ribbon-label ds-hero-ribbon-stat" ref={ref}>
      <span className="ds-hero-ribbon-stat-sr">{`${label} ${formatted}`}</span>
      <span className="ds-hero-ribbon-stat-label" aria-hidden="true">
        {label}
      </span>
      <span className="ds-hero-ribbon-stat-number" aria-hidden="true">
        <NumberFlow
          value={shown}
          locales={formatLocale}
          format={{ maximumFractionDigits: 0 }}
          transformTiming={timing}
          spinTiming={timing}
          trend={1}
          // NumberFlow already skips its animation under reduced motion.
          respectMotionPreference
        />
      </span>
    </p>
  )
}
