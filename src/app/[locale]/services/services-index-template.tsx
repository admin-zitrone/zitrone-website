'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'

import { Button } from '@/components/button'
import { SiteFooter } from '@/components/site-footer'
import { Section } from '@/components/section'
import { Copy, Heading, Kicker } from '@/components/typography'
import type { HomeContent } from '@/app/_components/home/content/types'
import { FeatureIcon } from '@/app/_components/home/feature-icons'
import { withServiceRibbonLogoScales } from '@/app/_components/home/hero-logo-scales'
import { StoriesAndFaqSection } from '@/app/_components/home/stories-and-faq-section'

import { renderEmphasis } from '@/lib/emphasis'
import { ServiceMediaRotator } from './service-media-rotator'
import { ServiceStandardSection } from './service-standard-section'
import type { ServiceTarget } from './service-targets'

type ServicesIndexTemplateProps = {
  locale: string
  /** Home service layers paired with the detail page each one links to. */
  services: { target: ServiceTarget; layer: HomeContent['serviceLayers'][number] }[]
  homeContent: HomeContent
  title: string
  kicker: string
  lede: string
  navbar: ReactNode
  footerColumns: HomeContent['footerColumns']
  footerSection: HomeContent['sections']['footer']
}

/**
 * The services index reads as the front door to the six detail pages, so it is
 * built from the same blocks they are: the same hero shell, the same client
 * ribbon, the same Zitrone standard, the same FAQ and footer. Card wording and
 * imagery come straight from the home service layers, so a visitor arriving
 * from the home page sees the same six services described the same way.
 */
export function ServicesIndexTemplate({
  locale,
  services,
  homeContent,
  title,
  kicker,
  lede,
  navbar,
  footerColumns,
  footerSection,
}: ServicesIndexTemplateProps) {
  const isSpanish = locale === 'es'
  const heroImages = services.map(({ target, layer }) => ({
    src: layer.image,
    alt: target.title,
  }))
  const resultLogos = withServiceRibbonLogoScales(homeContent.heroLogos)

  return (
    <>
      {/* The skip link and the navbar both target this. tabIndex={-1} makes it
          programmatically focusable so focus actually moves here on activation;
          without it the browser scrolls but leaves focus at the top of the
          document. */}
      <main className="ds-page-shell ds-page-shell--normal-flow" id="main-content" tabIndex={-1}>
        {/* The band carries a theme for the same reason a detail page's does:
            it resolves the service-lp accent tokens the hero and cards read,
            and it is what marks these sections as reveal-complete. Dining is
            the flagship service and the frame the hero rotation opens on. */}
        <div className="semantic-service-theme-band" data-svc-theme="dining">
          <header
            className="ds-section ds-service-lp-hero semantic-service-theme-surface"
            aria-labelledby="services-index-title"
            data-track-section="hero"
          >
            <div className="ds-service-template-shell">
              <article className="ds-service-lp-hero-stage">
                {navbar}

                <figure className="ds-service-lp-hero-media">
                  <ServiceMediaRotator
                    images={heroImages}
                    width={1680}
                    height={1040}
                    sizes="100vw"
                    interval={4500}
                    priority
                  />
                </figure>
                <div className="ds-service-lp-hero-overlay" aria-hidden="true" />
                <div className="ds-service-lp-hero-glow" aria-hidden="true" />

                <div className="ds-service-lp-hero-content">
                  <div className="ds-service-lp-hero-main ds-stack" data-gap="loose">
                    <Kicker className="ds-reveal" data-reveal="fade-blur">
                      {kicker}
                    </Kicker>
                    <Heading
                      as="h1"
                      size="hero"
                      className="ds-service-lp-hero-title ds-reveal"
                      data-reveal="fade-blur"
                      id="services-index-title"
                    >
                      {title}
                    </Heading>
                    <Copy className="ds-service-lp-hero-lede ds-reveal" data-reveal="fade-blur">
                      {lede}
                    </Copy>
                    <div className="ds-service-lp-hero-actions ds-reveal" data-reveal="fade-blur">
                      <Button
                        className="ds-service-lp-hero-cta"
                        variant="accent"
                        href="#services-list"
                      >
                        <span>{isSpanish ? 'Ver los servicios' : 'See the services'}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </header>

          <Section className="ds-service-lp-hero-logos semantic-service-theme-surface">
            <div className="ds-service-template-shell">
              <div className="ds-service-template-results-logos ds-reveal" data-reveal="fade-up">
                <div
                  className="ds-media-ribbon-marquee ds-service-template-results-ribbon"
                  aria-label={isSpanish ? 'Logotipos de clientes' : 'Client logos'}
                >
                  <div className="ds-media-ribbon-marquee-inner">
                    {[0, 1].map((copyIndex) => (
                      <div
                        className="ds-media-ribbon-track ds-service-template-results-track"
                        key={copyIndex}
                        aria-hidden={copyIndex === 1 ? true : undefined}
                      >
                        {resultLogos.map((logo) => (
                          <figure
                            className="ds-logo-chip ds-logo-chip--image"
                            data-logo-fit={logo.fit ?? 'wide'}
                            key={`${copyIndex}-${logo.id}`}
                            style={{ ['--logo-scale' as string]: logo.scale ?? 1 }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={logo.src} alt={logo.alt} loading="eager" />
                          </figure>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section
            id="services-list"
            aria-label={isSpanish ? 'Todos los servicios' : 'All services'}
            className="ds-service-lp-overview semantic-service-theme-surface"
          >
            <div className="ds-service-template-shell ds-stack" data-gap="loose">
              <div className="ds-services-index-cards">
                {services.map(({ target, layer }) => (
                  <article
                    className="ds-services-index-card ds-reveal"
                    data-reveal="fade-up"
                    data-svc-theme={target.theme}
                    key={target.slug}
                  >
                    <figure className="ds-services-index-card-media">
                      <Image
                        src={layer.image}
                        alt={layer.title}
                        fill
                        // Measured slot widths: ~87vw on phones, ~43vw on
                        // tablets, ~21vw in the desktop row, capped at ~22rem.
                        sizes="(min-width: 105rem) 22rem, (min-width: 68.0625rem) 21vw, (min-width: 40.0625rem) 43vw, 90vw"
                        loading="lazy"
                      />
                    </figure>

                    <div className="ds-services-index-card-body">
                      <h2 className="ds-services-index-card-title">{layer.title}</h2>
                      <p className="ds-services-index-card-copy">{layer.copy}</p>

                      <ul className="ds-services-index-card-features">
                        {layer.features.map((feature) => (
                          <li className="ds-services-index-card-feature" key={feature.title}>
                            <span
                              className="ds-services-index-card-feature-icon"
                              aria-hidden="true"
                            >
                              <FeatureIcon name={feature.icon} />
                            </span>
                            <span>{renderEmphasis(feature.title)}</span>
                          </li>
                        ))}
                      </ul>

                      {/* The home card's pill: light ground, ink label, lime
                          chip carrying the arrow. Six of these on one screen,
                          so the light rest state keeps the photos leading. */}
                      <Button
                        className="ds-services-index-card-cta"
                        variant="inverse-primary"
                        href={layer.href ?? `/services/${target.slug}`}
                      >
                        <span>{layer.ctaLabel ?? (isSpanish ? 'Ver servicio' : 'View service')}</span>
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </Section>

          <ServiceStandardSection
            locale={locale}
            stories={homeContent.clientStories}
            fallbackImage={services[0]?.layer.image ?? ''}
            fallbackAlt={title}
          />
        </div>
      </main>

      <div className="ds-service-footer-flow">
        <StoriesAndFaqSection
          faqs={homeContent.faqs}
          stories={homeContent.sections.stories}
          faq={homeContent.sections.faq}
          content={homeContent}
          showStories={false}
          showCta={false}
          tone="light"
        />
        <SiteFooter footerColumns={footerColumns} footer={footerSection} integrated />
      </div>
    </>
  )
}
