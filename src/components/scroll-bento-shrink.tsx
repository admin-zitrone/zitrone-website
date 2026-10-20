"use client"

import { useEffect, useRef, type ReactNode } from "react"

type ScrollBentoShrinkProps = {
  children: ReactNode
  className?: string
  /** Range over which the shrink runs, as a fraction of viewport height. Default 0.85. */
  travel?: number
}

export function ScrollBentoShrink({
  children,
  className,
  travel = 0.85,
}: ScrollBentoShrinkProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) {
      el.style.setProperty("--bento-progress", "1")
      return
    }

    let frame = 0
    let pending = false

    const update = () => {
      pending = false
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // Progress starts when the element's top reaches 60% down the viewport
      // (i.e., the hero is roughly in middle of screen) and completes when the
      // top has scrolled to -25% of vh (just above viewport).
      const start = vh * 0.6
      const end = -vh * 0.25
      const raw = (start - rect.top) / (start - end)
      const progress = Math.min(1, Math.max(0, raw))
      el.style.setProperty("--bento-progress", progress.toFixed(4))
    }

    const schedule = () => {
      if (pending) return
      pending = true
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [travel])

  return (
    <div ref={ref} className={className} style={{ ["--bento-progress" as string]: 0 }}>
      {children}
    </div>
  )
}
