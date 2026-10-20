import { serverEnv } from "@/env/server"

export function getServerSentryOptions() {
  const dsn = serverEnv.sentryDsn

  return {
    dsn,
    enabled: Boolean(dsn) && serverEnv.nodeEnv !== "test",
    environment: serverEnv.sentryEnvironment,
    release: serverEnv.sentryRelease,
    sendDefaultPii: false,
    debug: serverEnv.sentryDebug,
    tracesSampleRate: serverEnv.sentryTracesSampleRate,
  }
}
