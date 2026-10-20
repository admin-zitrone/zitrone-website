"use client"

import { Fragment, useState, type CSSProperties } from "react"
import Image from "next/image"
import { useLocale } from "next-intl"

import { splitAccentTitle } from "@/components/heading-accent"

import { HeroAccentWord } from "./hero-accent-word"
import { HeroDailyStat } from "./hero-daily-stat"
import { withHeroLogoScales } from "./hero-logo-scales"
import { heroImage } from "./home-data"
import { useHomeContent } from "./home-content-context"
import { SharedHeroShell } from "./shared-hero-shell"

/* ── Constants ──────────────────────────────────────────────── */

const PANEL_ID = "main-hero-menu-panel"

/* ── Component ──────────────────────────────────────────────── */

export function HeroSection() {
  const locale = useLocale()
  const { componentLabels, heroLogos, primaryNav, profilerServices, sections } =
    useHomeContent()
  const hero = sections.hero
  const [frame, setFrame] = useState(0)

  const titleTokens = splitAccentTitle(hero.title, hero.titleEmphasis)
  const heroFrames = hero.frames?.length
    ? hero.frames
    : [
        {
          pillar: "nourishment" as const,
          accentWord: hero.titleEmphasis ?? "",
          image: heroImage,
          alt: hero.title,
        },
      ]
  const heroImages = heroFrames.map(({ image, alt }) => ({ src: image, alt }))
  const activeHeroImage = heroImages[0]?.src ?? heroImage
  const accentWords = heroFrames.map(({ accentWord }) => accentWord)
  const heroMarqueeLogos = withHeroLogoScales(heroLogos)
  const resolveHref = (href: string) => {
    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("http://") ||
      href.startsWith("https://")
    ) {
      return href
    }

    if (href.startsWith(`/${locale}`)) return href
    return `/${locale}${href}`
  }

  // Same links as mobile: everything after the Services dropdown, minus Contact.
  const desktopNav = primaryNav
    .slice(1, -1)
    .map((link) => ({
      ...link,
      href: resolveHref(link.href),
    }))

  // The last nav item is Contact, which the primary CTA already covers —
  // listing it again beside or above that button duplicates it.
  const mobileNav = primaryNav.slice(0, -1).map((link) => ({
    ...link,
    href: resolveHref(link.href),
  }))

  const dropdownGroups = [
    {
      label: componentLabels.serviceSystem.kicker,
      links: profilerServices.map((service) => ({
        label: service.title,
        href: resolveHref(service.href),
      })),
    },
  ]

  return (
    <SharedHeroShell
      panelId={PANEL_ID}
      titleId="hero-main-title"
      navAriaLabel={hero.navAriaLabel}
      mobileNavAriaLabel={hero.mobileNavAriaLabel}
      menuOpenLabel={hero.menuOpenLabel}
      menuCloseLabel={hero.menuCloseLabel}
      dropdownLabel={primaryNav[0]?.label ?? "Services"}
      desktopNav={desktopNav}
      mobileNav={mobileNav}
      dropdownGroups={dropdownGroups}
      primaryAction={hero.cta}
      promo={{
        title: sections.stories.cta.label,
        copy: sections.stories.copy,
        href: sections.stories.panelCta.href,
        label: sections.stories.panelCta.label,
        imageSrc: activeHeroImage,
        imageAlt: hero.title,
      }}
      imageSrc={activeHeroImage}
      images={heroImages}
      onFrameChange={setFrame}
      stageClassName="ds-section ds-hero-stage semantic-hero-zitrone"
      frameClassName="ds-hero-frame"
      mediaClassName="ds-hero-media semantic-hero-zitrone-media"
      layoutClassName="ds-hero-layout semantic-hero-zitrone-copy ds-stack"
      ribbonClassName="ds-hero-ribbon"
      heroBody={
        <>
          <h1
            className="ds-heading ds-title-reveal"
            data-size="hero"
            data-title-reveal="words"
            id="hero-main-title"
          >
            {titleTokens.map((token, index) => (
              <Fragment key={index}>
                {index > 0 ? " " : null}
                <span className={token.accent ? "semantic-hero-zitrone-title-accent-line" : undefined}>
                  {token.accent ? (
                    <>
                      {token.before}
                      <HeroAccentWord words={accentWords} frame={frame} />
                      {token.after}
                    </>
                  ) : (
                    token.text
                  )}
                </span>
              </Fragment>
            ))}
          </h1>
          <p className="ds-copy ds-hero-copy ds-reveal" data-reveal="fade-blur">
            {hero.copyShort ? (
              <>
                <span className="semantic-hero-zitrone-copy-full">{hero.copy}</span>
                <span className="semantic-hero-zitrone-copy-short">{hero.copyShort}</span>
              </>
            ) : (
              hero.copy
            )}
          </p>
        </>
      }
      heroRibbon={
        <>
          {hero.ribbonStat ? (
            <HeroDailyStat
              value={hero.ribbonStat.value}
              label={hero.ribbonStat.label}
              locale={locale}
            />
          ) : (
            <p className="ds-hero-ribbon-label">{hero.ribbonLabel}</p>
          )}
          <div className="semantic-hero-zitrone-marquee" aria-label={hero.marqueeAriaLabel}>
            <div className="ds-hero-marquee">
              {[false, true].map((isDuplicate) => (
                <div
                  className="ds-hero-marquee-track"
                  aria-hidden={isDuplicate ? "true" : undefined}
                  key={String(isDuplicate)}
                >
                  {heroMarqueeLogos.map((logo) => (
                    <span
                      className="ds-logo-chip ds-logo-chip--image"
                      data-logo-context="hero"
                      data-logo-id={logo.id}
                      data-logo-fit={logo.fit ?? "balanced"}
                      style={
                        logo.scale
                          ? ({ "--logo-scale": String(logo.scale) } as CSSProperties)
                          : undefined
                      }
                      key={`${logo.id}-${isDuplicate}`}
                    >
                      <Image
                        src={logo.monoSrc ?? logo.src}
                        alt={isDuplicate ? "" : logo.alt}
                        width={72}
                        height={24}
                        // Eager: the marquee's overflow clip keeps logos past the
                        // first screen "off-viewport" to the lazy loader, so they
                        // never load even as the animation slides them in.
                        loading="eager"
                        decoding="async"
                        unoptimized
                      />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      }
    />
  )
}
