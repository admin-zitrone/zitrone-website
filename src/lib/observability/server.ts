import { track } from "@vercel/analytics/server"

import type { ObservabilityEventName, ObservabilityPayload } from "./events"

function cleanPayload(payload: ObservabilityPayload = {}) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  )
}

export async function trackServerEvent(
  name: ObservabilityEventName,
  payload: ObservabilityPayload = {},
) {
  try {
    await track(name, cleanPayload(payload))
  } catch {
    // Observability must not block the request path.
  }
}
