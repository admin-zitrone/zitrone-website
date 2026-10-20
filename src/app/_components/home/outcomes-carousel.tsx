'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { Container } from '@/components/layout'
import { Section } from '@/components/section'
import { useNearViewport } from '@/hooks/use-near-viewport'

import { useHomeContent } from './home-content-context'
import { ServicesStrip } from './services-strip'
import { TitleWords } from './title-words'

/* The cover behind the heading is the client-story photography. It turns on
   its own clock — a slow dissolve with a calm push-in on each photo — so the
   panel reads as a sequence of client sites rather than a still. Deliberately
   not the service card images (those run along the strip below), and not the
   client photos that show the same spaces as the home hero above. */
const COVER_STEP_MS = 6000

export function OutcomesCarousel() {
  const { sections, clientStories } = useHomeContent()
  const section = sections.services
  const coverStories = clientStories.filter((story) => !story.repeatsHero)

  const [storyIndex, setStoryIndex] = useState(0)
  const [isInView, setIsInView] = useState(false)

  const coverRef = useRef<HTMLDivElement | null>(null)
  const coverMediaRef = useRef<HTMLDivElement | null>(null)
  const coverNear = useNearViewport(coverRef)

  /* Offscreen the cover is not worth a timer. */
  useEffect(() => {
    const cover = coverRef.current
    if (!cover) return undefined

    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting))
    observer.observe(cover)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView || coverStories.length < 2) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const timer = window.setInterval(
      () => setStoryIndex((index) => (index + 1) % coverStories.length),
      COVER_STEP_MS,
    )
    return () => window.clearInterval(timer)
  }, [isInView, coverStories.length])

  /* Parallax on the establishing photo above. Same shape as the hero's. */
  useEffect(() => {
    const cover = coverRef.current
    const media = coverMediaRef.current
    if (!cover || !media) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let ticking = false

    const apply = () => {
      const rect = cover.getBoundingClientRect()
      const range = window.innerHeight + rect.height
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / range))
      media.style.setProperty('--section-cover-progress', progress.toFixed(4))
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const activeStory = coverStories[storyIndex]

  return (
    <>
      {/* Tucked under the white service sheet's curve and emerging from beneath
          it as the page scrolls. Carries the panel's ground so the strip below
          continues it without a seam. */}
      <div ref={coverRef} className="ds-outcomes-reveal">
        <div className="ds-section-cover">
          <div ref={coverMediaRef} className="ds-section-cover-media">
            {coverStories.map((story) => (
              <div
                className="ds-section-cover-frame"
                data-active={story === activeStory || undefined}
                key={story.name}
              >
                {/* Below the fold (it emerges from under the service sheet),
                    so none of these may compete with the hero: `priority` on
                    the first frame used to preload it in <head>, and native
                    lazy loading still fetched all four at page load on phones.
                    They mount one screen ahead, all together, so the
                    crossfade never shows a gap. */}
                {coverNear ? (
                  <Image src={story.image} alt="" fill sizes="100vw" loading="lazy" />
                ) : null}
              </div>
            ))}
          </div>
          <div className="ds-section-cover-veil" aria-hidden="true" />
          <p className="ds-section-cover-credit" key={activeStory.name}>
            <span>{activeStory.name}</span>
            {activeStory.location ? <span>{activeStory.location}</span> : null}
          </p>
          <Container>
            <div className="ds-section-cover-copy ds-stack">
              {section.kicker ? (
                <p className="semantic-kicker ds-kicker">{section.kicker}</p>
              ) : null}
              <TitleWords
                className="ds-heading ds-title-reveal"
                ariaLabel={section.titleAriaLabel}
                words={section.titleWords}
              />
              {section.coverCopy ?? section.copy ? (
                <p className="ds-copy">{section.coverCopy ?? section.copy}</p>
              ) : null}
            </div>
          </Container>
        </div>
      </div>

      <Section
        className="ds-outcomes-section"
        tone="inverse"
        size="large"
        break="rounded-bottom"
        aria-label={section.titleAriaLabel}
        data-track-section="service-carousel"
      >
        <ServicesStrip />
      </Section>
    </>
  )
}
