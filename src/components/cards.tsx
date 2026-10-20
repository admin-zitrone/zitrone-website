import { type ComponentPropsWithRef, forwardRef } from "react"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────────
   ServiceCard — flat card with accent bar (ds-service-card)
   ───────────────────────────────────────────────────────────── */

type ServiceAccent = "fertility" | "maternity" | "parenting" | "menopause"

type ServiceCardProps = ComponentPropsWithRef<"div"> & {
  accent?: ServiceAccent
  tag?: string
  title: string
  copy?: string
}

export const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(
  function ServiceCard({ className, accent, tag, title, copy, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("ds-service-card", className)}
        data-accent={accent ?? undefined}
        {...props}
      >
        <div className="ds-stack" data-gap="tight">
          <div className="ds-service-accent" />
          {tag && <p className="ds-service-tag">{tag}</p>}
          <h3 className="ds-card-title ds-heading">{title}</h3>
          {copy && <p className="ds-card-copy">{copy}</p>}
        </div>
        {children}
      </div>
    )
  },
)

/* ─────────────────────────────────────────────────────────────
   ServiceMediaCard — image card with overlay content
   ───────────────────────────────────────────────────────────── */

type ServiceMediaCardProps = ComponentPropsWithRef<"div"> & {
  accent?: ServiceAccent
  tag?: string
  title: string
  copy?: string
  imageSrc?: string
  imageAlt?: string
}

export const ServiceMediaCard = forwardRef<HTMLDivElement, ServiceMediaCardProps>(
  function ServiceMediaCard(
    { className, accent, tag, title, copy, imageSrc, imageAlt, children, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn("ds-service-media-card", className)}
        data-accent={accent ?? undefined}
        {...props}
      >
        {imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element -- Design-system cards accept arbitrary image URLs, including future CMS/remote assets.
          <img
            className="ds-service-media-image"
            src={imageSrc}
            alt={imageAlt || title}
            loading="lazy"
          />
        )}
        <div className="ds-service-media-dot" />
        <div className="ds-service-media-content ds-stack" data-gap="tight">
          {tag && <p className="ds-service-tag">{tag}</p>}
          <h3 className="ds-service-media-title">{title}</h3>
          {copy && <p className="ds-service-media-copy">{copy}</p>}
          {children}
        </div>
      </div>
    )
  },
)

/* ─────────────────────────────────────────────────────────────
   StatCard — big serif number + description (ds-stat-card)
   ───────────────────────────────────────────────────────────── */

type StatCardProps = ComponentPropsWithRef<"div"> & {
  number: string
  copy: string
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  function StatCard({ className, number, copy, ...props }, ref) {
    return (
      <div ref={ref} className={cn("ds-stat-card", className)} {...props}>
        <p className="ds-stat-number">{number}</p>
        <p className="ds-card-copy">{copy}</p>
      </div>
    )
  },
)

/* ─────────────────────────────────────────────────────────────
   ProofCard — social proof / press card (ds-proof-card)
   ───────────────────────────────────────────────────────────── */

type ProofCardProps = ComponentPropsWithRef<"div"> & {
  source: string
  quote: string
}

export const ProofCard = forwardRef<HTMLDivElement, ProofCardProps>(
  function ProofCard({ className, source, quote, ...props }, ref) {
    return (
      <div ref={ref} className={cn("ds-proof-card", className)} {...props}>
        <p className="ds-proof-title">{source}</p>
        <p className="ds-proof-copy">{quote}</p>
      </div>
    )
  },
)

/* ─────────────────────────────────────────────────────────────
   StoryCard — testimonial with quote + attribution
   ───────────────────────────────────────────────────────────── */

type StoryCardProps = ComponentPropsWithRef<"div"> & {
  quote: string
  author: string
  meta?: string
}

export const StoryCard = forwardRef<HTMLDivElement, StoryCardProps>(
  function StoryCard({ className, quote, author, meta, ...props }, ref) {
    return (
      <div ref={ref} className={cn("ds-story-card", className)} {...props}>
        <blockquote className="ds-quote">{quote}</blockquote>
        <div className="ds-stack" data-gap="tight">
          <p className="ds-card-copy ds-card-copy--strong">
            {author}
          </p>
          {meta && <p className="ds-story-meta">{meta}</p>}
        </div>
      </div>
    )
  },
)
