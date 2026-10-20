"use client"

import { track } from "@vercel/analytics"

import type { ObservabilityEventName, ObservabilityPayload } from "./events"

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

function cleanPayload(payload: ObservabilityPayload = {}) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  )
}

export function trackClientEvent(
  name: ObservabilityEventName,
  payload: ObservabilityPayload = {},
) {
  const data = cleanPayload(payload)

  try {
    track(name, data)
  } catch {
    // Never break the UI because analytics failed.
  }

  try {
    window.dataLayer?.push({
      event: name,
      ...data,
    })
  } catch {
    // Keep dataLayer optional.
  }
}
