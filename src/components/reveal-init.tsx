"use client"

import { useRevealAnimations } from "@/hooks/use-reveal"

/**
 * Mounts the IntersectionObserver-based reveal animations for any
 * elements on the page marked with `data-reveal`. Render once per page.
 */
export function RevealInit() {
  useRevealAnimations()
  return null
}
