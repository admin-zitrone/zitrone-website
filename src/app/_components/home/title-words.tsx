"use client"

import { Fragment } from "react"

import type { RevealWord } from "./content/types"

type TitleWordsProps = {
  ariaLabel: string
  /** Lets a section point `aria-labelledby` at this heading. */
  id?: string
  className?: string
  words: RevealWord[]
}

export function TitleWords({
  ariaLabel,
  id,
  className = "ds-heading ds-title-reveal",
  words,
}: TitleWordsProps) {
  return (
    <h2 id={id} className={className} data-title-reveal="words" aria-label={ariaLabel}>
      {words.map((word, index) => (
        <Fragment key={`${index}-${word.text}`}>
          {index > 0 ? " " : null}
          <span className={word.accent ? "ds-heading-accent" : undefined}>
            {word.text}
          </span>
        </Fragment>
      ))}
    </h2>
  )
}
