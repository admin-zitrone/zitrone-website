'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

import { Section } from '@/components/section'
import { Heading, HeadingAccent, Kicker } from '@/components/typography'
import { FeatureIcon } from '@/app/_components/home/feature-icons'
import type { ClientStory } from '@/app/_components/home/content/types'

import { getServiceStandard } from './service-targets'

/* Long enough to read a full quote before the next client takes over. */
const STORY_ROTATION_MS = 8000

function FiveStarRating({ label }: { label: string }) {
  return (
    <div className="ds-service-operations-stars" role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          className="ds-service-operations-star"
          viewBox="0 0 24 24"
          aria-hidden="true"
          key={index}
        >
          <path d="m12 2.75 2.74 5.55 6.13.89-4.44 4.33 1.05 6.1L12 16.74l-5.48 2.88 1.05-6.1-4.44-4.33 6.13-.89L12 2.75Z" />
        </svg>
      ))}
    </div>
  )
}

type ServiceStandardSectionProps = {
  locale: string
  /** Every client story we have; the block rotates through all of them. */
  stories: ClientStory[]
  /** Story to open on, so a service page still leads with its own client. */
  initialStoryName?: string
  /** Shown if there is no story to render at all. */
  fallbackImage: string
  fallbackAlt: string
}

/**
 * The half of every service page that never changes per service: one client
 * speaking, next to how Zitrone operates. The testimonial rotates through the
 * full client set so the block shows the whole roster rather than one name.
 */
export function ServiceStandardSection({
  locale,
  stories,
  initialStoryName,
  fallbackImage,
  fallbackAlt,
}: ServiceStandardSectionProps) {
  const isSpanish = locale === 'es'
  const standard = getServiceStandard(locale)

  const initialIndex = Math.max(
    0,
    stories.findIndex((item) => item.name === initialStoryName),
  )
  const [index, setIndex] = useState(initialIndex)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (stories.length < 2 || isPaused) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % stories.length)
    }, STORY_ROTATION_MS)

    return () => window.clearInterval(timer)
  }, [isPaused, stories.length])

  const story = stories[index % stories.length]

  return (
    <Section className="ds-service-lp-operations-section semantic-service-theme-surface">
      <div className="ds-service-operations-fullwidth">
        <div className="ds-service-operations-bento" data-tone="inverse">
          <article
            className="ds-service-operations-testimonial"
            aria-label={isSpanish ? 'Testimonios de clientes' : 'Client testimonials'}
            aria-roledescription={isSpanish ? 'carrusel' : 'carousel'}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setIsPaused(false)
              }
            }}
          >
            <figure className="ds-service-operations-media">
              {/* Keying on the client restarts the cross-fade on every change. */}
              <Image
                key={story?.image ?? fallbackImage}
                src={story?.image ?? fallbackImage}
                alt={story?.imageAlt ?? fallbackAlt}
                fill
                sizes="(min-width: 1024px) 94vw, 100vw"
              />
            </figure>
            <div className="ds-service-operations-scrim" aria-hidden="true" />

            <div className="ds-service-operations-testimonial-content" key={story?.name}>
              {story?.logo ? (
                <Image
                  className="ds-service-operations-logo"
                  src={story.logo}
                  alt={story.name}
                  width={104}
                  height={36}
                  loading="lazy"
                />
              ) : (
                <span className="ds-service-operations-company">{story?.name}</span>
              )}
              <FiveStarRating label={isSpanish ? '5 de 5 estrellas' : '5 out of 5 stars'} />
              <blockquote className="ds-service-operations-quote">“{story?.quote}”</blockquote>
              <span className="ds-service-operations-role">{story?.role}</span>

              {stories.length > 1 ? (
                <div className="ds-service-operations-dots">
                  {stories.map((item, dotIndex) => (
                    <button
                      className="ds-service-operations-dot"
                      type="button"
                      data-active={dotIndex === index % stories.length || undefined}
                      aria-label={item.name}
                      aria-current={dotIndex === index % stories.length || undefined}
                      onClick={() => setIndex(dotIndex)}
                      key={item.name}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </article>

          <div className="ds-service-operations-process">
            <div className="ds-service-operations-process-head ds-stack" data-gap="loose">
              <Kicker className="ds-service-operations-kicker ds-reveal" data-reveal="fade-up">
                {standard.kicker}
              </Kicker>
              <Heading
                as="h2"
                size="section"
                className="ds-service-operations-title ds-title-reveal"
                data-title-reveal="words"
              >
                {standard.headingLead} <HeadingAccent>{standard.headingAccent}</HeadingAccent>
              </Heading>
              <p className="ds-service-operations-process-copy">{standard.intro}</p>
            </div>

            <div className="ds-service-operations-steps">
              {standard.points.map((point) => (
                <article
                  className="ds-service-operations-step ds-reveal"
                  data-reveal="fade-up"
                  key={point.title}
                >
                  <span className="ds-service-operations-step-icon" aria-hidden="true">
                    <FeatureIcon name={point.icon} />
                  </span>
                  <div className="ds-service-operations-step-body">
                    <h3 className="ds-service-operations-step-title">{point.title}</h3>
                    <p className="ds-service-operations-step-copy">{point.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
