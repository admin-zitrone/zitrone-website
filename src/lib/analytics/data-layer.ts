"use client"

/**
 * The dataLayer contract GTM-TSTDVS4 reads.
 *
 * Event names follow GA4 conventions: `generate_lead` is Google's recommended
 * lead event, so GA4 and Google Ads recognise it without a custom mapping.
 * The rest are ours and stay snake_case under 40 characters, the GA4 limit.
 * The full contract, and the GTM/GA4 setup it needs, is in
 * docs/analytics-tracking.md — change both together.
 *
 * These go to the dataLayer only, not to Vercel Analytics: a click event on
 * every link would burn the Vercel custom-event quota for data GA4 already
 * holds. Conversions still go to both, through trackClientEvent.
 */

export const dataLayerEvents = {
  /** Any link, or a button marked with data-cta. */
  ctaClick: "cta_click",
  /** mailto:, tel: and WhatsApp links — leads that never touch a form. */
  contactClick: "contact_click",
  /** First interaction with a lead form. */
  leadFormStart: "lead_form_start",
  /** A lead form moved to another step. */
  leadFormStep: "lead_form_step",
  /** A lead was stored. GA4 recommended event: mark it as a key event. */
  generateLead: "generate_lead",
} as const

export type DataLayerEvent = (typeof dataLayerEvents)[keyof typeof dataLayerEvents]

/**
 * Every parameter any of the events above can carry. The GTM template
 * (docs/gtm/zitrone-lead-tracking.gtm.json) reads exactly these as Data Layer
 * Variables, and its single GA4 tag sends all of them on every event — so the
 * two lists must stay identical (guarded by tests/contracts).
 */
export const DATA_LAYER_PARAMS = [
  "cta_id",
  "cta_section",
  "cta_text",
  "cta_target",
  "page_type",
  "link_url",
  "outbound",
  "contact_method",
  "form_id",
  "cta_page",
  "lead_channel",
  "step_index",
  "step_id",
  "lead_id",
  "lead_interest",
  "lead_headcount",
  "language",
] as const

export type DataLayerParam = (typeof DATA_LAYER_PARAMS)[number]

type Value = string | number | boolean | null | undefined

/** Every contract key present and set to undefined. */
const BLANK = Object.fromEntries(DATA_LAYER_PARAMS.map((key) => [key, undefined]))

/**
 * Every push carries the whole contract key set, with anything the event does
 * not use pushed as `undefined`. GTM merges each push into one persistent
 * model and the GA4 tag sends all seventeen keys, so a key left out keeps the
 * value of an earlier event: a `generate_lead` would carry the last click's
 * `link_url`, and the next `cta_click` the previous lead's `lead_id`. Pushing
 * the key as undefined clears it. GA4 truncates values at 100 characters;
 * doing it here keeps the cut predictable.
 */
const clean = (params: Partial<Record<DataLayerParam, Value>>) => ({
  ...BLANK,
  ...Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      value === "" || value === null || value === undefined
        ? undefined
        : typeof value === "string"
          ? value.slice(0, 100)
          : value,
    ]),
  ),
})

export function pushDataLayer(
  event: DataLayerEvent,
  params: Partial<Record<DataLayerParam, Value>> = {},
) {
  if (typeof window === "undefined") return
  try {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event, ...clean(params) })
  } catch {
    // Analytics must never break the page.
  }
}
