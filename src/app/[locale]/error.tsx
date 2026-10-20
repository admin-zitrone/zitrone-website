"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"
import { useLocale } from "next-intl"

import { Container } from "@/components/layout"
import { Section } from "@/components/section"
import { Button } from "@/components/button"
import { Heading, Kicker } from "@/components/typography"
import { getBoundaryCopy } from "@/app/lib/error-content"

type ErrorBoundaryProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function LocaleError({ error, reset }: ErrorBoundaryProps) {
  const locale = useLocale()
  const copy = getBoundaryCopy(locale)

  useEffect(() => {
    Sentry.captureException(error, {
      tags: {
        boundary: "locale",
        locale,
      },
      extra: {
        digest: error.digest,
      },
    })

    console.error(error)
  }, [error, locale])

  return (
    <Section tone="warm" size="hero">
      <Container>
        <div className="ds-stack" data-gap="loose">
          <Kicker>{copy.errorEyebrow}</Kicker>
          <Heading>{copy.errorTitle}</Heading>
          <p className="ds-copy">{copy.errorBody}</p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Button onClick={reset} variant="accent">
              {copy.errorRetryCta}
            </Button>
            <Button href="/">{copy.errorHomeCta}</Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
