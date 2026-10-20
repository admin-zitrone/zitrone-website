"use client"

import Image from "next/image"

import { Container } from "@/components/layout"
import { Section, SectionSurface } from "@/components/section"

import { useHomeContent } from "./home-content-context"
import {
  withHeroLogoScales,
  withServiceRibbonLogoScales,
} from "./hero-logo-scales"
import type { BentoCard, HeroLogo, ProofSection } from "./content/types"

const BENTO_COLUMN_VARIANTS = ["5", "4", "3"] as const

type ProofBentoSectionProps = {
  proofColumns: BentoCard[][]
  section: ProofSection
}

export function ProofBentoSection({
  proofColumns,
  section,
}: ProofBentoSectionProps) {
  const { heroLogos } = useHomeContent()
  const serviceRibbonLogos = withServiceRibbonLogoScales(heroLogos)
  const logoRows = splitLogos(withHeroLogoScales(heroLogos))

  return (
    <Section
      id="features"
      aria-labelledby="features-heading"
      className="semantic-bento-section semantic-service-theme-bento"
      pattern="proof"
      surface="frame"
    >
      <SectionSurface>
        <Container>
          <div className="semantic-bento-header">
            <div className="semantic-bento-title-group">
              {section.kicker ? (
                <p className="semantic-kicker ds-kicker">{section.kicker}</p>
              ) : null}
              <h2
                id="features-heading"
                className="ds-heading ds-title-reveal semantic-bento-heading"
                data-title-reveal="words"
                data-measure="wide"
                aria-label={section.headingAriaLabel}
              >
                {section.headingLead}
                {section.headingLead ? " " : null}
                <strong>{section.headingAccent}</strong>
                {section.headingTrail ? (
                  <>
                    {" "}
                    {section.headingTrail}
                  </>
                ) : null}
              </h2>
            </div>
            <p className="ds-copy semantic-bento-text">{section.copy}</p>
          </div>

          <ul className="semantic-bento-grid" role="list">
            {proofColumns.map((column, columnIndex) => (
              <li
                className={`semantic-bento-col semantic-bento-col--${BENTO_COLUMN_VARIANTS[columnIndex] ?? "3"}`}
                key={`proof-column-${columnIndex}`}
              >
                {column.map((card) => (
                  <ProofBentoCard card={card} key={card.title} logoRows={logoRows} />
                ))}
              </li>
            ))}
          </ul>

          <ClientLogoRibbon
            ariaLabel={section.clientLogosAriaLabel}
            logos={serviceRibbonLogos}
          />
        </Container>
      </SectionSurface>
    </Section>
  )
}

function ProofBentoCard({
  card,
  logoRows,
}: {
  card: BentoCard
  logoRows: [HeroLogo[], HeroLogo[]]
}) {
  const baseProps = {
    className: bentoCardClasses(card),
    "data-reveal": "fade-up",
  } as const

  const body = (
    <div className="semantic-bento-card-body">
      <h3 className="semantic-bento-card-heading">{card.title}</h3>
      {"sub" in card && card.sub ? (
        <p className="semantic-bento-card-sub">{card.sub}</p>
      ) : null}
    </div>
  )

  if (card.variant === "photo") {
    return (
      <article
        {...baseProps}
        data-image-fit={card.imageFit ?? "cover"}
        data-card-title={card.title}
      >
        {body}
        <Image
          className="semantic-bento-card-bg"
          src={card.image}
          alt={card.alt}
          width={900}
          height={680}
          quality={92}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </article>
    )
  }

  if (card.variant === "clock") {
    return (
      <article {...baseProps}>
        {body}
        <div className="semantic-bento-clock" aria-hidden="true">
          <div className="semantic-bento-clock-face">
            <div className="semantic-bento-clock-hour" />
            <div className="semantic-bento-clock-minute" />
            <div className="semantic-bento-clock-dot" />
          </div>
        </div>
      </article>
    )
  }

  if (card.variant === "logos") {
    return (
      <article {...baseProps}>
        {body}
        {card.stats?.length ? (
          <dl className="semantic-bento-proof-stats">
            {card.stats.map((stat) => (
              <div className="semantic-bento-proof-stat" key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {!card.hideLogos ? (
          <div className="semantic-bento-logo-marquee" aria-hidden="true">
            <div className="semantic-bento-logo-row semantic-bento-logo-row--forward">
              {[false, true].map((duplicate) => (
                <div
                  className="semantic-bento-logo-track"
                  key={`forward-${String(duplicate)}`}
                >
                  {logoRows[0].map((logo) => (
                    <span
                      className="semantic-bento-logo-chip"
                      data-logo-fit={logo.fit ?? "balanced"}
                      key={`${logo.id}-forward-${String(duplicate)}`}
                      style={
                        logo.scale
                          ? ({ "--logo-scale": String(logo.scale) } as React.CSSProperties)
                          : undefined
                      }
                    >
                      <Image
                        src={logo.monoSrc ?? logo.src}
                        alt=""
                        width={120}
                        height={28}
                        loading="eager"
                        decoding="async"
                        unoptimized
                      />
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <div className="semantic-bento-logo-row semantic-bento-logo-row--reverse">
              {[false, true].map((duplicate) => (
                <div
                  className="semantic-bento-logo-track"
                  key={`reverse-${String(duplicate)}`}
                >
                  {logoRows[1].map((logo) => (
                    <span
                      className="semantic-bento-logo-chip"
                      data-logo-fit={logo.fit ?? "balanced"}
                      key={`${logo.id}-reverse-${String(duplicate)}`}
                      style={
                        logo.scale
                          ? ({ "--logo-scale": String(logo.scale) } as React.CSSProperties)
                          : undefined
                      }
                    >
                      <Image
                        src={logo.monoSrc ?? logo.src}
                        alt=""
                        width={120}
                        height={28}
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
        ) : null}
      </article>
    )
  }

  if (card.variant === "specialties") {
    return (
      <article {...baseProps}>
        {body}
        <div className="semantic-bento-boxes" aria-hidden="true">
          {card.boxes.map((box) => (
            <span
              className={`semantic-bento-box semantic-bento-box--${box.size}`}
              key={box.label}
            >
              {box.label}
            </span>
          ))}
        </div>
      </article>
    )
  }

  if (card.variant === "studies") {
    return (
      <article {...baseProps}>
        {body}
        <div className="semantic-bento-icon-wrap" aria-hidden="true">
          <Image
            className="semantic-bento-icon"
            src={card.image}
            alt={card.alt}
            width={600}
            height={420}
          />
        </div>
      </article>
    )
  }

  return (
    <article {...baseProps}>
      {body}
    </article>
  )
}

function bentoCardClasses(card: BentoCard): string {
  const parts = ["semantic-bento-card", "ds-reveal"]
  if (card.variant === "clock") {
    parts.push("semantic-bento-card--clock", "semantic-bento-card--fill-slate")
  } else if (card.variant === "logos") {
    parts.push(
      card.hideLogos
        ? "semantic-bento-card--stats"
        : "semantic-bento-card--logos",
      card.tone === "slate"
        ? "semantic-bento-card--fill-slate"
        : "semantic-bento-card--fill-green",
    )
  } else if (card.variant === "specialties") {
    parts.push("semantic-bento-card--specialties")
  } else if (card.variant === "studies") {
    parts.push(
      "semantic-bento-card--studies",
      card.tone === "natural"
        ? "semantic-bento-card--fill-natural"
        : card.tone === "slate"
          ? "semantic-bento-card--fill-slate"
          : "semantic-bento-card--fill-green",
    )
  } else if (card.variant === "photo" && card.tone === "natural") {
    parts.push("semantic-bento-card--fill-natural")
  } else if (card.variant === "photo" && card.tone === "slate") {
    parts.push("semantic-bento-card--fill-slate")
  } else if (card.variant === "photo" && card.tone === "green") {
    parts.push("semantic-bento-card--fill-green")
  } else if (card.variant === "plain" && card.tone === "natural") {
    parts.push("semantic-bento-card--fill-natural")
  }
  return parts.join(" ")
}

function splitLogos(logos: HeroLogo[]): [HeroLogo[], HeroLogo[]] {
  const firstRow = logos.slice(0, Math.ceil(logos.length / 2))
  const secondRow = logos.slice(Math.ceil(logos.length / 2))
  return [firstRow, secondRow.length ? secondRow : firstRow]
}

function ClientLogoRibbon({
  ariaLabel,
  logos,
}: {
  ariaLabel: string
  logos: ReturnType<typeof withServiceRibbonLogoScales>
}) {
  return (
    <div className="semantic-bento-client-ribbon ds-service-template-results-logos">
      <div
        className="ds-media-ribbon-marquee ds-service-template-results-ribbon"
        aria-label={ariaLabel}
      >
        <div className="ds-media-ribbon-marquee-inner">
          {[false, true].map((isDuplicate) => (
            <div
              className="ds-media-ribbon-track ds-service-template-results-track"
              aria-hidden={isDuplicate ? "true" : undefined}
              key={String(isDuplicate)}
            >
              {logos.map((logo) => (
                <figure
                  className="ds-logo-chip ds-logo-chip--image"
                  data-logo-fit={logo.fit ?? "wide"}
                  key={`${String(isDuplicate)}-${logo.id}`}
                  style={{ "--logo-scale": logo.scale ?? 1 } as React.CSSProperties}
                >
                  <Image
                    src={logo.src}
                    alt={isDuplicate ? "" : logo.alt}
                    width={120}
                    height={28}
                    loading="eager"
                    decoding="async"
                    unoptimized
                  />
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
