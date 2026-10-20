"use client"

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/button"
import { SiteLink } from "@/components/site-link"
import {
  CONSENT_ACCEPT_ALL,
  CONSENT_REJECT_ALL,
  CONSENT_REOPEN_EVENT,
  type ConsentChoice,
  type ConsentDecision,
} from "@/lib/consent/config"
import {
  getConsentServerSnapshot,
  getConsentSnapshot,
  saveConsentChoice,
  subscribeConsent,
} from "@/lib/consent/client"
import { observabilityEvents } from "@/lib/observability/events"
import { trackClientEvent } from "@/lib/observability/client"

/**
 * Consent capture for Google Consent Mode v2.
 *
 * This component records the decision; it does not enforce it. Enforcement
 * happens in the inline bootstrap (`lib/consent/bootstrap-script.ts`), which
 * declares denied-by-default for the EEA, the UK and Switzerland before GTM
 * loads. That split matters: gating in React would be too late, because the
 * container can load before hydration.
 *
 * Reject and Accept are deliberately the same size and weight. A reject path
 * that is harder to find than the accept path is not a valid consent choice
 * under the GDPR, and it is the most common way these banners fail review.
 */
export function ConsentBanner() {
  const t = useTranslations("Consent")

  // undefined until the browser store resolves, so nothing renders during
  // SSR or the hydrating render and returning visitors never see a flash.
  const stored = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  )

  const [expanded, setExpanded] = useState(false)
  const [reopened, setReopened] = useState(false)
  const [draft, setDraft] = useState<ConsentChoice>(CONSENT_ACCEPT_ALL)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const hasChoice = Boolean(stored)
  const visible = reopened || stored === null

  useEffect(() => {
    const reopen = () => {
      setDraft(getConsentSnapshot() ?? CONSENT_ACCEPT_ALL)
      setExpanded(true)
      setReopened(true)
    }

    window.addEventListener(CONSENT_REOPEN_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen)
  }, [])

  // Move focus to the panel when it opens so keyboard and screen-reader users
  // land on it rather than having to hunt for it at the end of the document.
  useEffect(() => {
    if (visible) headingRef.current?.focus()
  }, [visible])

  const commit = useCallback(
    (choice: ConsentChoice, source: string) => {
      saveConsentChoice(choice)
      setDraft(choice)
      setReopened(false)
      setExpanded(false)
      trackClientEvent(observabilityEvents.consentChoiceRecorded, {
        analytics: choice.analytics,
        marketing: choice.marketing,
        source,
      })
    },
    [],
  )

  const dismiss = useCallback(() => {
    // Only available once a decision exists — closing is never itself consent.
    if (!hasChoice) return
    setReopened(false)
    setExpanded(false)
  }, [hasChoice])

  useEffect(() => {
    if (!visible) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [visible, dismiss])

  if (!visible) return null

  const toggle = (key: keyof ConsentChoice) => {
    setDraft((previous) => {
      const next: ConsentDecision =
        previous[key] === "granted" ? "denied" : "granted"
      return { ...previous, [key]: next }
    })
  }

  return (
    <div
      className="ds-consent"
      role="dialog"
      aria-modal="false"
      aria-label={t("dialogLabel")}
    >
      <div className="ds-consent__panel" data-expanded={expanded ? "true" : undefined}>
        <div className="ds-consent__body">
          <h2 className="ds-consent__title" ref={headingRef} tabIndex={-1}>
            {t("title")}
          </h2>
          <p className="ds-consent__copy">{t("body")}</p>
        </div>

        {/* Expands in place rather than swapping the panel out. The 0fr→1fr
            grid row animates to the content's real height, which a max-height
            guess cannot do without either clipping long copy or easing
            through empty space. */}
        <div className="ds-consent__drawer" inert={!expanded}>
          <div className="ds-consent__drawer-inner">
            <ul className="ds-consent__categories">
              <li className="ds-consent__category">
                <div className="ds-consent__category-text">
                  <span className="ds-consent__category-title">
                    {t("necessaryTitle")}
                  </span>
                  <span className="ds-consent__category-copy">
                    {t("necessaryBody")}
                  </span>
                </div>
                <span className="ds-consent__locked">{t("necessaryState")}</span>
              </li>

              {(
                [
                  ["analytics", "analyticsTitle", "analyticsBody"],
                  ["marketing", "marketingTitle", "marketingBody"],
                ] as const
              ).map(([key, titleKey, bodyKey]) => (
                <li className="ds-consent__category" key={key}>
                  <div className="ds-consent__category-text">
                    <span className="ds-consent__category-title">
                      {t(titleKey)}
                    </span>
                    <span className="ds-consent__category-copy">
                      {t(bodyKey)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="ds-consent__switch"
                    role="switch"
                    aria-checked={draft[key] === "granted"}
                    onClick={() => toggle(key)}
                  >
                    <span className="ds-consent__switch-track" aria-hidden="true">
                      <span className="ds-consent__switch-thumb" />
                    </span>
                    <span className="ds-consent__switch-label">
                      {draft[key] === "granted" ? t("on") : t("off")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ds-consent__actions">
          {/* Two quiet text links on one row: the privacy notice and the
              category drawer are escape hatches, not the decision. */}
          <div className="ds-consent__meta">
            <SiteLink className="ds-consent__link" href="/privacy-notice">
              {t("privacyLink")}
            </SiteLink>
            <button
              type="button"
              className="ds-consent__tertiary"
              onClick={() => setExpanded((open) => !open)}
              aria-expanded={expanded}
            >
              {expanded ? t("back") : t("customize")}
            </button>
          </div>
          <div className="ds-consent__choices">
            <Button
              variant="secondary"
              className="ds-consent__btn ds-consent__btn--quiet"
              onClick={() => commit(CONSENT_REJECT_ALL, expanded ? "detail" : "summary")}
            >
              <span>{t("rejectAll")}</span>
            </Button>
            <Button
              variant="secondary"
              className="ds-consent__btn ds-consent__btn--primary"
              onClick={() =>
                expanded
                  ? commit(draft, "detail")
                  : commit(CONSENT_ACCEPT_ALL, "summary")
              }
            >
              <span>{expanded ? t("save") : t("acceptAll")}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
