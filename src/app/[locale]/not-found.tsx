import { getLocale } from "next-intl/server"

import { Container } from "@/components/layout"
import { Section } from "@/components/section"
import { Button } from "@/components/button"
import { Heading, Kicker } from "@/components/typography"
import { getBoundaryCopy } from "@/app/lib/error-content"

export default async function NotFound() {
  const locale = await getLocale()
  const copy = getBoundaryCopy(locale)

  return (
    <Section tone="warm" size="hero">
      <Container>
        <div className="ds-stack" data-gap="loose">
          <Kicker>{copy.notFoundEyebrow}</Kicker>
          <Heading>{copy.notFoundTitle}</Heading>
          <p className="ds-copy">{copy.notFoundBody}</p>
          <div>
            <Button href="/" variant="accent">
              {copy.notFoundHomeCta}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
