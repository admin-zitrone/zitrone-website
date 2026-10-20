"use client"

import { useState } from "react"

type HeroAccentWordProps = {
  /** One word per hero frame. Index 0 must match the word inside `hero.title`. */
  words: string[]
  /** Active hero frame, from the media rotator. */
  frame: number
}

type Phase = "idle" | "out" | "in"

/**
 * The hero's accent word, swapped as the hero photo crossfades. The outgoing
 * word rises and blurs away, the incoming one arrives on the same blur-and-rise
 * the title reveal uses, so the swap reads as the page's existing motion rather
 * than a new one.
 *
 * The reveal hook never touches this word: the hero renders its own word spans,
 * which makes the hook skip that heading and leaves the DOM under React.
 *
 * Under reduced motion the rotator never advances, so `frame` holds at 0 and no
 * swap is ever requested.
 */
export function HeroAccentWord({ words, frame }: HeroAccentWordProps) {
  const next = words[frame % (words.length || 1)] ?? ""

  const [shown, setShown] = useState(next)
  const [requested, setRequested] = useState(next)
  const [phase, setPhase] = useState<Phase>("idle")

  // Adjusting state during render, rather than in an effect, so the outgoing
  // word starts leaving in the same commit that the new frame arrives.
  if (next !== requested) {
    setRequested(next)
    setPhase("out")
  }

  return (
    <em
      // Remounting on the new word restarts the incoming animation.
      key={shown}
      className="ds-heading-accent semantic-hero-zitrone-accent"
      data-swap={phase}
      onAnimationEnd={() => {
        if (phase !== "out") return
        setShown(requested)
        setPhase("in")
      }}
    >
      {shown}
    </em>
  )
}
