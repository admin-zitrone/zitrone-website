"use client"

import type { CSSProperties } from "react"
import Image from "next/image"

import { Link } from "@/i18n/navigation"

import { useHomeContent } from "./home-content-context"

function ArrowLineIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        d="M1.332 8.332h13.333"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 1.664 14.666 8.331 8 14.997"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ServicesCarousel() {
  const { serviceCards } = useHomeContent()

  return (
    <div className="ds-service-showcase" role="list">
      {serviceCards.map((service, index) => {
        const hasDetailLinks = Boolean(service.relatedLinks?.length)

        return (
          <article
            className="ds-service-hover-card ds-reveal"
            data-accent={service.accent}
            data-reveal="fade-up"
            key={service.title}
            role="listitem"
            style={{ "--reveal-index": index } as CSSProperties}
          >
            <div className="ds-service-hover-media" aria-hidden="true">
              <Image
                className="ds-service-hover-image"
                src={service.image}
                alt=""
                width={900}
                height={680}
              />
            </div>

            <div className="ds-service-hover-panel">
              <div className="ds-service-hover-preview" aria-hidden="true">
                <p className="ds-service-hover-preview-title">{service.title}</p>
              </div>

              <div className="ds-service-hover-details ds-stack" data-gap="tight">
                <p className="ds-service-hover-eyebrow">{service.eyebrow}</p>
                <h3 className="ds-service-hover-title">{service.title}</h3>
                <p className="ds-service-hover-copy">{service.copy}</p>
                {service.href && service.ctaLabel ? (
                  <Link
                    className="ds-service-hover-link"
                    href={service.href}
                    aria-label={`${service.ctaLabel}: ${service.title}`}
                  >
                    <span aria-hidden="true">{service.ctaLabel}</span>
                    <ArrowLineIcon />
                  </Link>
                ) : null}

                {hasDetailLinks ? <div className="ds-service-hover-divider" aria-hidden="true" /> : null}

                {hasDetailLinks ? (
                  <ul className="ds-service-hover-list">
                    {service.relatedLinks!.map((link) => (
                      <li key={`${service.title}-${link.href}`}>
                        <Link className="ds-service-hover-secondary-link" href={link.href}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
