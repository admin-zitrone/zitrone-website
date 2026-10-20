import { homeContentEn } from "../../src/app/_components/home/content/en"

export function expectedHomeReleaseSignals() {
  return {
    expectedPresent: [
      homeContentEn.sections.services.titleAriaLabel,
      homeContentEn.sections.featuredMedia.label,
      homeContentEn.sections.stories.cta.label,
      homeContentEn.sections.operatingSystem.titleAriaLabel,
      homeContentEn.sections.proof.headingAriaLabel,
      "\"@type\":\"FAQPage\"",
      "\"@type\":\"LocalBusiness\"",
      "\"@type\":\"OfferCatalog\"",
      "\"@type\":\"Service\"",
      "\"contactPoint\"",
      "salesforce-lockup",
    ],
    expectedAbsent: [
      "Selected brands",
      "Request references",
      "A workplace food partner built around care, quality, and real teams built around care, quality, and real teams",
      "Salesforce white.svg",
    ],
  }
}

export function verifyHomeReleaseHtml(html: string) {
  const { expectedPresent, expectedAbsent } = expectedHomeReleaseSignals()
  return {
    missing: expectedPresent.filter((text) => !html.includes(text)),
    unexpected: expectedAbsent.filter((text) => html.includes(text)),
  }
}
