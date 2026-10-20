"use client"

import type { ReactNode } from "react"
import Image, { type StaticImageData } from "next/image"

import { HeroMediaRotator, type HeroRotatorImage } from "./hero-media-rotator"

type SharedHeroNavItem = {
  href: string
  label: string
}

type SharedHeroNavGroup = {
  label: string
  links: SharedHeroNavItem[]
}

type SharedHeroNavPromo = {
  kicker?: string
  title: string
  copy?: string
  href: string
  label: string
  imageSrc?: string | StaticImageData
  imageAlt?: string
}

type SharedHeroShellProps = {
  panelId: string
  titleId: string
  navAriaLabel: string
  mobileNavAriaLabel: string
  menuOpenLabel: string
  menuCloseLabel: string
  dropdownLabel: string
  desktopNav: SharedHeroNavItem[]
  mobileNav: SharedHeroNavItem[]
  dropdownGroups: SharedHeroNavGroup[]
  primaryAction: SharedHeroNavItem
  secondaryAction?: SharedHeroNavItem
  promo?: SharedHeroNavPromo
  imageSrc: string | StaticImageData
  /** Optional set of frames that softly crossfade. Falls back to imageSrc. */
  images?: HeroRotatorImage[]
  imageAlt?: string
  imageSizes?: string
  /** Notified when the rotator's active frame changes. */
  onFrameChange?: (frame: number) => void
  stageClassName?: string
  frameClassName?: string
  mediaClassName?: string
  layoutClassName?: string
  ribbonClassName?: string
  heroBody: ReactNode
  heroRibbon: ReactNode
}

export function SharedHeroShell({
  titleId,
  imageSrc,
  images,
  imageAlt = "",
  imageSizes = "100vw",
  onFrameChange,
  stageClassName,
  frameClassName,
  mediaClassName,
  layoutClassName,
  ribbonClassName,
  heroBody,
  heroRibbon,
}: SharedHeroShellProps) {
  const hasRotator = Boolean(images && images.length > 1)
  return (
    <header
      className={stageClassName ?? "ds-section ds-hero-stage semantic-hero-zitrone"}
      data-tone="inverse"
      data-size="hero"
      data-pattern="hero"
      data-frame="contained"
      data-track-section="hero"
      aria-labelledby={titleId}
    >
      <div className={frameClassName ?? "ds-hero-frame"}>
        <div className={mediaClassName ?? "ds-hero-media semantic-hero-zitrone-media"} aria-hidden="true">
          {hasRotator ? (
            <HeroMediaRotator images={images!} sizes={imageSizes} onFrameChange={onFrameChange} />
          ) : (
            <Image
              className="ds-hero-media-image"
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes={imageSizes}
              priority
              fetchPriority="high"
            />
          )}
        </div>

        <div className="ds-container">
          <div className={layoutClassName ?? "ds-hero-layout semantic-hero-zitrone-copy ds-stack"} data-gap="loose">
            {heroBody}
          </div>
        </div>

        <div className={ribbonClassName ?? "ds-hero-ribbon"}>{heroRibbon}</div>
      </div>
    </header>
  )
}
