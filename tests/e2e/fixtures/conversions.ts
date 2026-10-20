import type { Page } from "@playwright/test"

/** The `generate_lead` pushes on the page: the one event GTM counts as a
 * conversion (docs/analytics-tracking.md). */
export async function leadConversions(page: Page) {
  return page.evaluate(() =>
    ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? [])
      .filter((entry) => entry.event === "generate_lead"),
  )
}

/** Values a conversion must never carry to analytics. */
export const PII_SAMPLES = ["Local QA", "example.invalid", "Mocked home email integration test"]

/** Click-only keys a conversion must clear rather than inherit. GTM merges
 * every push into one model and the GA4 tag sends the full key set, so a key
 * missing from the push would report the previous click's value. */
export const CLICK_ONLY_KEYS = ["cta_text", "cta_target", "page_type", "link_url", "outbound", "contact_method"]

/** GTM's merged data model at the moment of each `generate_lead`. */
export async function mergedAtConversions(page: Page) {
  return page.evaluate(() => {
    let model: Record<string, unknown> = {}
    const states: Record<string, unknown>[] = []
    const layer = (window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []
    for (const push of layer) {
      // gtag() calls are Arguments objects, not data model pushes.
      if (Object.prototype.toString.call(push) === "[object Arguments]") continue
      model = { ...model, ...push }
      if (push.event === "generate_lead") {
        states.push(Object.fromEntries(Object.entries(model).map(([k, v]) => [k, v === undefined ? "(undefined)" : v])))
      }
    }
    return states
  })
}
