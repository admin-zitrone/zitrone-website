"use client"

import { channelOf, readAttribution } from "@/lib/attribution"

import type { LeadForm } from "./cta"
import { dataLayerEvents, pushDataLayer } from "./data-layer"

/**
 * The lead funnel, as GA4 sees it: start → steps → generate_lead.
 *
 * Every event carries the same attribution block, so any step of the funnel
 * can be broken down by the CTA that opened it. The block is always pushed
 * whole — see data-layer.ts for why a missing key is worse than an empty one.
 */
function attributionParams(form: LeadForm) {
  const a = readAttribution(form)
  return {
    form_id: form,
    cta_id: a.source || "(none)",
    cta_section: a.ctaSection || "(none)",
    cta_page: a.fromPath,
    lead_channel: channelOf(a),
  }
}

const started = new Set<LeadForm>()

/** First real interaction with the form. Once per page view per form. */
export function trackLeadFormStart(form: LeadForm) {
  if (started.has(form)) return
  started.add(form)
  pushDataLayer(dataLayerEvents.leadFormStart, attributionParams(form))
}

/** Reset on unmount so a revisit in the same tab counts as a new start. */
export function resetLeadFormStart(form: LeadForm) {
  started.delete(form)
}

/** Step N of the form, so GA4 funnel exploration shows where people drop. */
export function trackLeadFormStep(form: LeadForm, stepIndex: number, stepId: string) {
  pushDataLayer(dataLayerEvents.leadFormStep, {
    ...attributionParams(form),
    step_index: stepIndex + 1,
    step_id: stepId,
  })
}

/**
 * The conversion. `lead_id` is the folio, so a GA4 conversion can be matched
 * to the CMS row, and so GTM can dedupe a double fire on the same folio.
 */
export function trackLeadGenerated(
  form: LeadForm,
  lead: { requestId: string; interest: string; headcount: string; locale: string },
) {
  pushDataLayer(dataLayerEvents.generateLead, {
    ...attributionParams(form),
    lead_id: lead.requestId,
    lead_interest: lead.interest || "(not set)",
    lead_headcount: lead.headcount || "(not set)",
    language: lead.locale,
  })
}
