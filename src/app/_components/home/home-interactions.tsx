"use client"

import { useHeroParallax } from "@/hooks/use-hero-parallax"
import { useRevealAnimations } from "@/hooks/use-reveal"
import { useTitleReveal } from "@/hooks/use-title-reveal"

export function HomeInteractions() {
  useTitleReveal()
  useHeroParallax()
  useRevealAnimations()

  return null
}
