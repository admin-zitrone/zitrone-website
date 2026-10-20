import {
  readBoolean,
  readNumberInRange,
  readOptionalUrl,
  readUrl,
} from "./shared"

const PUBLIC_DEFAULT_SITE_URL = "http://localhost:3000"

export const publicEnv = {
  nodeEnv: process.env.NODE_ENV || "development",
  siteUrl: readUrl(process.env, "NEXT_PUBLIC_SITE_URL", {
    defaultValue: PUBLIC_DEFAULT_SITE_URL,
  }),
  sentryClientDsn: readOptionalUrl(process.env, "NEXT_PUBLIC_SENTRY_DSN"),
  sentryClientTracesSampleRate: readNumberInRange(
    process.env,
    "NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE",
    {
      defaultValue: 0,
      min: 0,
      max: 1,
    },
  ),
  sentryClientDebug: readBoolean(process.env, "NEXT_PUBLIC_SENTRY_DEBUG", false),
}

export function assertPublicLaunchEnvironment() {
  const errors: string[] = []

  if (publicEnv.siteUrl.includes("localhost") || publicEnv.siteUrl.includes("127.0.0.1")) {
    errors.push("NEXT_PUBLIC_SITE_URL must point to a real deploy URL before launch.")
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"))
  }
}
