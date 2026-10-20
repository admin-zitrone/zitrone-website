"use client"

import { useEffect } from "react"

/**
 * Initializes the IntersectionObserver-based fade-up reveal
 * for any element with data-reveal="fade-up".
 *
 * Call once at the page level inside a useEffect.
 */
export function useRevealAnimations() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal="fade-up"], [data-reveal="fade-blur"]'),
    )

    if (!targets.length) return

    // Set stagger index based on matching siblings
    targets.forEach((target) => {
      const variant = target.dataset.reveal
      const siblings = Array.from(target.parentElement?.children ?? []).filter(
        (el): el is HTMLElement => el instanceof HTMLElement && el.dataset.reveal === variant,
      )
      const index = siblings.indexOf(target)
      target.style.setProperty("--reveal-index", String(Math.max(index, 0)))

      if (!reduceMotion) {
        target.dataset.revealState = "idle"
      }
    })

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((t) => {
        t.dataset.revealState = "visible"
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ;(entry.target as HTMLElement).dataset.revealState = "visible"
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    )

    targets.forEach((t) => observer.observe(t))

    return () => observer.disconnect()
  }, [])
}
