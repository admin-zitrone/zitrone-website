import { type ReactNode } from "react"

/**
 * Wraps the first occurrence of `accent` in the serif italic accent style
 * (`--type-accent-word-*`). The match is case-insensitive but the original
 * casing is preserved.
 *
 * Inside a `[data-title-reveal="words"]` heading the reveal hook rebuilds the
 * `<em>` as a single word span, so the accented phrase animates as one unit.
 */
export function renderHeadingAccent(text: string, accent?: string): ReactNode {
  if (!accent) return text

  const index = text.toLocaleLowerCase().indexOf(accent.toLocaleLowerCase())
  if (index === -1) return text

  return (
    <>
      {text.slice(0, index)}
      <em className="ds-heading-accent">{text.slice(index, index + accent.length)}</em>
      {text.slice(index + accent.length)}
    </>
  )
}

export type AccentTitleToken =
  | { accent: false; text: string }
  | { accent: true; before: string; word: string; after: string }

/**
 * Splits a heading into its words, isolating the accent word from any
 * punctuation glued to it ("deserves," → word "deserves", after ",").
 *
 * Use this when the heading's words must stay React-owned — the reveal hook
 * only rebuilds headings that have no `<span>` children, so rendering the
 * words yourself hands control back to React and lets a word change later.
 */
export function splitAccentTitle(title: string, accent?: string): AccentTitleToken[] {
  const words = title.split(/\s+/).filter(Boolean)
  const plain = (): AccentTitleToken[] => words.map((text) => ({ accent: false, text }))

  if (!accent) return plain()

  const needle = accent.toLocaleLowerCase()
  const index = words.findIndex((word) => word.toLocaleLowerCase().includes(needle))
  if (index === -1) return plain()

  return words.map((text, position) => {
    if (position !== index) return { accent: false, text }

    const at = text.toLocaleLowerCase().indexOf(needle)
    return {
      accent: true,
      before: text.slice(0, at),
      word: text.slice(at, at + accent.length),
      after: text.slice(at + accent.length),
    }
  })
}
