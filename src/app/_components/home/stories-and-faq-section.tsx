'use client'

import { Button } from '@/components/button'
import type {
  FaqItem,
  FaqSection,
  HomeContent,
  StoriesSection,
} from '@/app/_components/home/content/types'

import { HomeContentProvider } from './home-content-context'
import { StoriesTabs } from './stories-tabs'
import { TitleWords } from './title-words'

type StoriesAndFaqSectionProps = {
  faqs: FaqItem[]
  stories: StoriesSection
  faq: FaqSection
  content?: HomeContent
  showStories?: boolean
  showCta?: boolean
  tone?: 'inverse' | 'light'
}

export function StoriesAndFaqSection({
  faqs,
  stories,
  faq,
  content,
  showStories = true,
  showCta = true,
  tone = 'inverse',
}: StoriesAndFaqSectionProps) {
  const section = (
    <StoriesAndFaqSectionInner
      faqs={faqs}
      stories={stories}
      faq={faq}
      showStories={showStories}
      showCta={showCta}
      tone={tone}
    />
  )

  if (content) {
    return <HomeContentProvider content={content}>{section}</HomeContentProvider>
  }

  return section
}

function StoriesAndFaqSectionInner({
  faqs,
  stories,
  faq,
  showStories = true,
  showCta = true,
  tone = 'inverse',
}: Omit<StoriesAndFaqSectionProps, 'content'>) {
  const isLight = tone === 'light'

  /* The stories card and the FAQ share one dark band, but they are two
     sections with two anchors. `#faq` used to sit on the band itself, so a
     "FAQs" link landed on the stories card — on mobile, where the card is
     taller than the viewport, the questions were never on screen. */
  return (
    <div
      className={`ds-faq${isLight ? ' ds-faq--light' : ''}`}
      data-tone={tone}
      data-break={isLight ? undefined : 'rounded-top'}
    >
      {showStories ? (
        <div className="ds-faq__shell semantic-stories-shell">
          <section
            id="stories"
            className="semantic-stories"
            aria-labelledby="stories-heading"
            data-track-section="stories"
          >
            <div className="semantic-stories-bg" aria-hidden="true">
              <div className="semantic-stories-bg-radial" />
              <div className="semantic-stories-bg-noise" />
            </div>

            <div className="semantic-stories-inner">
              <div className="ds-section-head ds-stack semantic-stories-head" data-gap="loose">
                <TitleWords
                  id="stories-heading"
                  className="ds-heading ds-title-reveal semantic-stories-heading"
                  ariaLabel={stories.titleAriaLabel}
                  words={stories.titleWords}
                />
                {stories.copy ? (
                  <p className="ds-copy semantic-stories-text">{stories.copy}</p>
                ) : null}
                <div className="ds-cluster" data-wrap="center-stack-compact">
                  <Button variant="inverse-primary" href={stories.cta.href}>
                    <span>{stories.cta.label}</span>
                  </Button>
                </div>
              </div>

              <StoriesTabs />
            </div>
          </section>
        </div>
      ) : null}

      <section id="faq" className="ds-faq__panel" aria-labelledby="faq-heading">
        <div className="ds-faq__shell ds-faq__shell--content">
          <div className="ds-faq__layout">
            <div className="ds-faq__header">
              <h2
                className="ds-faq__heading ds-title-reveal"
                data-title-reveal="words"
                id="faq-heading"
                aria-label={faq.heading}
              >
                <span className="ds-faq__heading-lead">{faq.headingLead ?? faq.heading}</span>
              </h2>
            </div>

            <ul className="ds-faq__list">
              {faqs.map((item) => (
                <li className="ds-faq__item" key={item.question}>
                  <details className="ds-faq__details">
                    <summary className="ds-faq__summary">
                      <span className="ds-faq__question">{item.question}</span>
                      <span className="ds-faq__icon" aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <div className="ds-faq__answer">
                      {item.answer.map((paragraph, index) => (
                        <p key={`${item.question}-${index}`}>
                          {paragraph}
                          {index < item.answer.length - 1 ? (
                            <>
                              <br />
                              <br />
                            </>
                          ) : null}
                        </p>
                      ))}
                    </div>
                  </details>
                </li>
              ))}
            </ul>
            {showCta ? (
              <div className="ds-faq__cta-bar">
                <div className="ds-faq__cta-copy">
                  {faq.ctaTitle ? <h3>{faq.ctaTitle}</h3> : null}
                  {faq.ctaCopy ? <p>{faq.ctaCopy}</p> : null}
                </div>
                <Button
                  className="ds-faq__more-link"
                  variant={isLight ? 'primary' : 'inverse-primary'}
                  href={faq.cta.href}
                >
                  <span>{faq.cta.label}</span>
                  <svg className="semantic-faq-action-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
