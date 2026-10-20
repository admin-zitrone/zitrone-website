"use client"

import { useEffect } from "react"

import {
  classifyTarget,
  ctaIdOf,
  labelOf,
  LEAD_FORMS,
  pageTypeFor,
  sectionOf,
  type LeadForm,
} from "@/lib/analytics/cta"
import { dataLayerEvents, pushDataLayer } from "@/lib/analytics/data-layer"
import { recordCtaTouch } from "@/lib/attribution"

const CONTACT_METHODS = new Set(["email", "phone", "whatsapp"])

/**
 * One delegated listener that describes every click on the site.
 *
 * Covering "every button" by hand means every new button is a gap until
 * someone remembers it. Listening at the document instead means a link is
 * tracked the moment it exists, with its page type, its section and its id
 * worked out from the DOM (see lib/analytics/cta.ts).
 *
 * What counts: every `a[href]`, plus any element carrying `data-cta`. Plain
 * UI buttons — tabs, carousel dots, accordions — are interaction, not intent,
 * and stay out unless someone marks them.
 *
 * Capture phase, so the event is recorded before a handler can stop it or a
 * client-side navigation can unmount the link.
 */
export function CtaTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button > 1) return
      const origin = event.target instanceof Element ? event.target : null
      const el = origin?.closest("a[href], [data-cta]")
      if (!el || el.closest("[data-cta-ignore]")) return

      const href = el.getAttribute("href") ?? ""
      const base = window.location.href
      const target = href ? classifyTarget(href, base) : "internal"
      const pageType = pageTypeFor(window.location.pathname)
      const section = sectionOf(el)
      const id = ctaIdOf(el, href, base)
      const text = labelOf(el)

      let linkUrl = href
      try {
        linkUrl = href ? new URL(href, base).href : ""
      } catch {
        /* keep the raw href */
      }

      pushDataLayer(dataLayerEvents.ctaClick, {
        cta_id: id,
        cta_section: section,
        cta_text: text,
        cta_target: target,
        page_type: pageType,
        link_url: linkUrl,
        outbound: target === "external" || target === "social",
      })

      if (CONTACT_METHODS.has(target)) {
        pushDataLayer(dataLayerEvents.contactClick, {
          contact_method: target,
          cta_id: id,
          cta_section: section,
          page_type: pageType,
        })
      }

      if (LEAD_FORMS.includes(target as LeadForm)) {
        recordCtaTouch({
          id,
          section,
          text,
          pageType,
          path: window.location.pathname,
          target,
          at: Date.now(),
        })
      }
    }

    document.addEventListener("click", onClick, true)
    // Middle-click opens a new tab without firing `click`.
    document.addEventListener("auxclick", onClick, true)
    return () => {
      document.removeEventListener("click", onClick, true)
      document.removeEventListener("auxclick", onClick, true)
    }
  }, [])

  return null
}
