import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"

import { Grid } from "@/components/layout"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

import styles from "./blog-card.module.css"

/**
 * The article card used across every blog listing.
 *
 * Four pages rendered this markup by hand — index, category, author and
 * reviewer — each with a slightly different arrangement, and all four bound to
 * global classes defined in three competing places. The differences between
 * them are now the `variant` prop, so the shape of a card is decided here and
 * nowhere else.
 *
 * Variants are named for the page that needs them rather than for what they
 * look like, so a future change to "how profile listings read" has one obvious
 * home.
 */
const card = cva(styles.card)

type BlogCardVariant = "index" | "listing" | "profile"

export type BlogCardPost = {
  href: string
  title: string
  image: string
  alt?: string
  date: string
  readTime: string
  excerpt?: string
  category?: string
}

type BlogCardProps = VariantProps<typeof card> & {
  post: BlogCardPost
  /** Which listing this card belongs to. See the variant table below. */
  variant?: BlogCardVariant
  /** Category chip, rendered only when the variant shows one. */
  categoryKey?: string
  className?: string
  /**
   * Fetch this card's image first. Set it on the first row of a grid that
   * sits above the fold (author and reviewer pages), where one of those
   * images is the Largest Contentful Paint.
   */
  priority?: boolean
}

/*
 * variant   heading   meta position   excerpt   chip   title style
 * ────────  ────────  ──────────────  ───────   ────   ───────────
 * index     h3        below title     no        yes    card title
 * listing   h3        below title     yes       no     card title
 * profile   h2        above title     yes       no     global h2
 *
 * `profile` deliberately leaves its heading unstyled by this component. On the
 * author and reviewer pages the title has always been a plain `h2` picking up
 * the global heading styles, because the old CSS only ever targeted `h3`. The
 * card title's 20ch measure looks wrong there: the title wraps to a narrow
 * column while the excerpt underneath runs the full card width. Keeping the
 * global heading here preserves how those pages read. Whether all three should
 * converge is a design decision, not a refactor decision.
 */
const VARIANTS = {
  index: { heading: "h3", metaFirst: false, excerpt: false, chip: true, titled: true },
  listing: { heading: "h3", metaFirst: false, excerpt: true, chip: false, titled: true },
  profile: { heading: "h2", metaFirst: true, excerpt: true, chip: false, titled: false },
} as const

export function BlogCard({
  post,
  variant = "listing",
  categoryKey,
  className,
  priority = false,
}: BlogCardProps) {
  const config = VARIANTS[variant]
  const Heading = config.heading

  const meta = (
    <div className={styles.meta}>
      <span>{post.date}</span>
      <span aria-hidden="true">•</span>
      <span>{post.readTime}</span>
    </div>
  )

  return (
    <article className={cn(card(), className)}>
      <Link href={post.href} className={styles.link} aria-label={post.title}>
        <div className={styles.media}>
          <Image
            src={post.image}
            alt={post.alt || post.title}
            width={960}
            height={720}
            sizes="(max-width: 48rem) 100vw, (max-width: 64rem) 50vw, (max-width: 105rem) 30vw, 480px"
            loading={priority ? "eager" : undefined}
            fetchPriority={priority ? "high" : undefined}
          />
        </div>
        <div className={styles.body}>
          <div className={styles.text}>
            {config.chip && post.category ? (
              <span
                className={cn("ds-blog-chip", styles.chip)}
                data-category-key={categoryKey}
              >
                {post.category}
              </span>
            ) : null}
            {config.metaFirst ? meta : null}
            <Heading className={config.titled ? styles.title : undefined}>
              {post.title}
            </Heading>
            {config.metaFirst ? null : meta}
            {config.excerpt && post.excerpt ? (
              <p className={styles.excerpt}>{post.excerpt}</p>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  )
}

/** The grid these cards sit in. Column counts belong with the card, not the page. */
export function BlogCardGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn(styles.grid, className)}>{children}</div>
}

/** The four-column grid the recommended cards sit in. */
export function RecommendedGrid({ children }: { children: React.ReactNode }) {
  return (
    <Grid className={styles.recommendedGrid} columns="4-col" gutter="loose">
      {children}
    </Grid>
  )
}

/**
 * The "recommended reading" card at the foot of an article.
 *
 * Structurally different enough to be its own component — the image and the
 * title are separate links rather than one card-wide link — but it shares this
 * folder's stylesheet, so the two versions of an article card can never drift
 * apart again.
 */
export function RecommendedCard({
  post,
  categoryHref,
  categoryKey,
}: {
  post: BlogCardPost
  categoryHref: string
  categoryKey?: string
}) {
  return (
    <article className={styles.card}>
      <Link href={post.href} className={styles.media} aria-label={post.title}>
        <Image src={post.image} alt={post.alt || post.title} width={900} height={680} sizes="(max-width: 48rem) 100vw, (max-width: 64rem) 50vw, 25vw" />
      </Link>
      <div className={styles.body}>
        <h3 className={styles.recommendedTitle}>
          <Link href={post.href}>{post.title}</Link>
        </h3>
        <div className="ds-blog-meta">
          <Link href={categoryHref} data-category-key={categoryKey}>
            {post.category}
          </Link>
          <span>{post.readTime}</span>
        </div>
      </div>
    </article>
  )
}
