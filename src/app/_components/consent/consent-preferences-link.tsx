"use client"

import { useTranslations } from "next-intl"

import { openConsentPreferences } from "@/lib/consent/client"
import { observabilityEvents } from "@/lib/observability/events"
import { trackClientEvent } from "@/lib/observability/client"

/**
 * Footer entry point back into the consent panel.
 *
 * Consent has to be as withdrawable as it was grantable, so this stays in the
 * footer legal group on every page rather than living only inside the privacy
 * notice.
 */
export function ConsentPreferencesLink({ className }: { className?: string }) {
  const t = useTranslations("Consent")

  return (
    <button
      type="button"
      className={className ? `ds-consent-reopen ${className}` : "ds-consent-reopen"}
      onClick={() => {
        trackClientEvent(observabilityEvents.consentPreferencesOpened)
        openConsentPreferences()
      }}
    >
      {t("footerLink")}
    </button>
  )
}
