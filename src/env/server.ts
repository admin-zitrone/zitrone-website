import { assertPublicLaunchEnvironment, publicEnv } from "./public"
import {
  readBoolean,
  readNumberInRange,
  readOptionalString,
  readOptionalUrl,
  readOriginList,
  validateCompleteGroup,
} from "./shared"

validateCompleteGroup(
  process.env,
  ["SENTRY_AUTH_TOKEN", "SENTRY_ORG", "SENTRY_PROJECT"],
  "Sentry build credentials",
)

const sentryBuildAuthToken = readOptionalString(process.env, "SENTRY_AUTH_TOKEN")
const sentryBuildOrg = readOptionalString(process.env, "SENTRY_ORG")
const sentryBuildProject = readOptionalString(process.env, "SENTRY_PROJECT")

export const serverEnv = {
  nodeEnv: publicEnv.nodeEnv,
  vercelEnv: readOptionalString(process.env, "VERCEL_ENV") || publicEnv.nodeEnv,
  vercelGitCommitSha: readOptionalString(process.env, "VERCEL_GIT_COMMIT_SHA"),
  appAllowedOrigins: readOriginList(process.env, "APP_ALLOWED_ORIGINS"),
  sentryDsn: readOptionalUrl(process.env, "SENTRY_DSN") || publicEnv.sentryClientDsn,
  sentryEnvironment:
    readOptionalString(process.env, "SENTRY_ENVIRONMENT") ||
    readOptionalString(process.env, "VERCEL_ENV") ||
    publicEnv.nodeEnv,
  sentryRelease:
    readOptionalString(process.env, "SENTRY_RELEASE") ||
    readOptionalString(process.env, "VERCEL_GIT_COMMIT_SHA"),
  sentryDebug: readBoolean(process.env, "SENTRY_DEBUG", false),
  sentryTracesSampleRate: readNumberInRange(process.env, "SENTRY_TRACES_SAMPLE_RATE", {
    defaultValue: 0,
    min: 0,
    max: 1,
  }),
  sentryBuildAuthToken,
  sentryBuildOrg,
  sentryBuildProject,
  hasSentryClientDsn: Boolean(publicEnv.sentryClientDsn),
  hasSentryServerDsn: Boolean(
    readOptionalUrl(process.env, "SENTRY_DSN") || publicEnv.sentryClientDsn,
  ),
  hasSentryBuildCredentials: Boolean(
    sentryBuildAuthToken && sentryBuildOrg && sentryBuildProject,
  ),
}

export function assertLaunchEnvironment() {
  const errors: string[] = []

  try {
    assertPublicLaunchEnvironment()
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error))
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"))
  }
}
