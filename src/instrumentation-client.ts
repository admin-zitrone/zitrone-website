import * as Sentry from "@sentry/nextjs"

import { trackClientEvent } from "@/lib/observability/client"
import { observabilityEvents } from "@/lib/observability/events"
import { getClientSentryOptions } from "@/lib/observability/sentry-client"

Sentry.init(getClientSentryOptions())

performance.mark("zitrone-app-init")

try {
  window.addEventListener("error", (event) => {
    trackClientEvent(observabilityEvents.clientError, {
      message: event.message,
      source: event.filename || "unknown",
      line: event.lineno,
      column: event.colno,
    })
  })

  window.addEventListener("unhandledrejection", (event) => {
    const reason =
      typeof event.reason === "string"
        ? event.reason
        : event.reason instanceof Error
          ? event.reason.message
          : "unknown"

    trackClientEvent(observabilityEvents.clientUnhandledRejection, {
      reason,
    })
  })
} catch {
  // Instrumentation must stay non-blocking.
}

export function onRouterTransitionStart(
  url: string,
  navigationType: "push" | "replace" | "traverse",
) {
  try {
    Sentry.captureRouterTransitionStart(url, navigationType)
  } catch {
    // Keep router instrumentation non-blocking.
  }

  trackClientEvent(observabilityEvents.navigationStarted, {
    url,
    navigationType,
  })
}
