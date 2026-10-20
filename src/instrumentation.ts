import * as Sentry from "@sentry/nextjs"

import { getServerSentryOptions } from "@/lib/observability/sentry-server"

export async function register() {
  Sentry.init(getServerSentryOptions())
}

export const onRequestError = Sentry.captureRequestError
