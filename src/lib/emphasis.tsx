import { Fragment, type ReactNode } from "react"

/* Content strings may mark short spans as **bold**. Renders them as <strong>
   so copy can stress a phrase without per-string markup in components. */
export function renderEmphasis(text: string): ReactNode {
  if (!text.includes("**")) return text
  return text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : <Fragment key={index}>{part}</Fragment>,
  )
}

