import { type ComponentPropsWithRef, forwardRef } from "react"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────────
   Heading — ds-heading with size/measure variants
   ───────────────────────────────────────────────────────────── */

type HeadingProps = ComponentPropsWithRef<"h2"> & {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  size?: "hero" | "section" | "card"
  measure?: "tight" | "default" | "wide"
  reveal?: boolean
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(
    { as: Tag = "h2", className, size, measure, reveal, children, ...props },
    ref,
  ) {
    return (
      <Tag
        ref={ref}
        className={cn(
          "ds-heading",
          reveal && "ds-title-reveal",
          className,
        )}
        data-size={size ?? undefined}
        data-measure={measure && measure !== "default" ? measure : undefined}
        data-reveal-state={reveal ? "idle" : undefined}
        {...props}
      >
        {children}
      </Tag>
    )
  },
)

/* ─────────────────────────────────────────────────────────────
   HeadingAccent — serif italic word inside a heading
   ───────────────────────────────────────────────────────────── */

export function HeadingAccent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <em className={cn("ds-heading-accent", className)}>{children}</em>
}

/* ─────────────────────────────────────────────────────────────
   Copy — body text with max-width (ds-copy)
   ───────────────────────────────────────────────────────────── */

type CopyProps = ComponentPropsWithRef<"p">

export const Copy = forwardRef<HTMLParagraphElement, CopyProps>(function Copy(
  { className, children, ...props },
  ref,
) {
  return (
    <p ref={ref} className={cn("ds-copy", className)} {...props}>
      {children}
    </p>
  )
})

/* ─────────────────────────────────────────────────────────────
   Kicker — label above headings (ds-kicker)
   ───────────────────────────────────────────────────────────── */

type KickerProps = ComponentPropsWithRef<"p">

export const Kicker = forwardRef<HTMLParagraphElement, KickerProps>(
  function Kicker({ className, children, ...props }, ref) {
    return (
      <p ref={ref} className={cn("ds-kicker", className)} {...props}>
        {children}
      </p>
    )
  },
)

/* ─────────────────────────────────────────────────────────────
   Quote — serif blockquote (ds-quote)
   ───────────────────────────────────────────────────────────── */

type QuoteProps = ComponentPropsWithRef<"blockquote">

export const Quote = forwardRef<HTMLQuoteElement, QuoteProps>(function Quote(
  { className, children, ...props },
  ref,
) {
  return (
    <blockquote ref={ref} className={cn("ds-quote", className)} {...props}>
      {children}
    </blockquote>
  )
})
