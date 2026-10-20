"use client"

import { useEffect } from "react"

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function applyParallax() {
  const heroes = document.querySelectorAll<HTMLElement>(".ds-hero-stage")

  heroes.forEach((hero) => {
    const media = hero.querySelector<HTMLElement>(".ds-hero-media")
    if (!media) return

    // The hero pins (sticky "cover" pattern), so its own rect stops moving once
    // pinned. Map the parallax over ~one viewport of scroll — the span during
    // which the hero is the visible backdrop — so the image drifts 0.5 → 1.0
    // (-7.5% → -15%) instead of crawling across the whole page.
    const cover = hero.closest<HTMLElement>("[data-hero-cover]")
    let progress: number

    if (cover) {
      const coverRect = cover.getBoundingClientRect()
      const scrolled = clamp(-coverRect.top / window.innerHeight, 0, 1)
      progress = 0.5 + scrolled * 0.5
    } else {
      const rect = hero.getBoundingClientRect()
      const range = window.innerHeight + rect.height
      progress = clamp((window.innerHeight - rect.top) / range, 0, 1)
    }

    media.style.setProperty("--hero-media-parallax-progress", progress.toFixed(4))
  })
}

export function useHeroParallax() {
  useEffect(() => {
    if (!document.querySelector(".ds-hero-stage")) return

    // Driven off native scroll so it works whether or not Lenis is mounted.
    // When Lenis is active it updates the document scroll position every frame,
    // so the parallax reads the already-smoothed position and inherits its
    // easing; when Lenis is off (e.g. reduced motion) it tracks scroll 1:1.
    // Intentionally NOT gated on prefers-reduced-motion — the hero animates
    // for everyone by design decision.
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        applyParallax()
        ticking = false
      })
    }

    applyParallax()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])
}
