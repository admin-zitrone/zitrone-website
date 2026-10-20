import { publicEnv } from "@/env/public"

function getEnvironment() {
  return publicEnv.nodeEnv
}

export function getClientSentryOptions() {
  const dsn = publicEnv.sentryClientDsn

  return {
    dsn,
    enabled: Boolean(dsn) && publicEnv.nodeEnv !== "test",
    environment: getEnvironment(),
    release: undefined,
    sendDefaultPii: false,
    debug: publicEnv.sentryClientDebug,
    tracesSampleRate: publicEnv.sentryClientTracesSampleRate,
  }
}
