import * as Sentry from "@sentry/nextjs"
import { NextResponse } from "next/server"

import {
  createContactRequestId,
  normalizeContactRequest,
  validateContactRequest,
} from "@/app/lib/contact"
import { acceptContactRequest } from "@/lib/email/accept-contact"
import { mirrorLeadToSheet, toLeadSheetRow } from "@/lib/leads/sheet-mirror"
import { observabilityEvents } from "@/lib/observability/events"
import { trackServerEvent } from "@/lib/observability/server"
import { checkRateLimit } from "@/lib/rate-limit"
import { exceedsContentLength, getRateLimitKey, hasTrustedOrigin, readJsonWithLimit } from "@/lib/security"
import { getPayloadClient } from "@/payload/loaders/client"

// Allow bounded provider retries while preserving the saved inquiry on failures.
export const maxDuration = 60

const MAX_BODY_BYTES = 16_384

export async function POST(request: Request) {
  if (exceedsContentLength(request, MAX_BODY_BYTES)) {
    return NextResponse.json(
      { ok: false, code: "PAYLOAD_TOO_LARGE", message: "The message is too large." },
      { status: 413 },
    )
  }

  const rateLimit = checkRateLimit(getRateLimitKey(request, "contact-request"), {
    windowMs: 10 * 60 * 1000,
    max: 5,
  })

  if (!rateLimit.allowed) {
    await trackServerEvent(observabilityEvents.securityRateLimitTriggered, {
      route: "contact-request",
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    })

    return NextResponse.json(
      { ok: false, code: "RATE_LIMITED", message: "Too many messages. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    )
  }

  if (!hasTrustedOrigin(request)) {
    await trackServerEvent(observabilityEvents.securityForbiddenOrigin, {
      route: "contact-request",
    })

    return NextResponse.json(
      { ok: false, code: "FORBIDDEN_ORIGIN", message: "The request origin is not allowed." },
      { status: 403 },
    )
  }

  // Content-Length was checked above; this also caps bodies that omit or
  // understate it.
  const parsed = await readJsonWithLimit(request, MAX_BODY_BYTES)
  if (!parsed.ok && parsed.reason === "too_large") {
    return NextResponse.json(
      { ok: false, code: "PAYLOAD_TOO_LARGE", message: "The message is too large." },
      { status: 413 },
    )
  }
  if (!parsed.ok && parsed.reason === "read_failed") {
    return NextResponse.json(
      { ok: false, code: "INVALID_BODY", message: "The request body could not be read." },
      { status: 400 },
    )
  }
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, code: "INVALID_JSON", message: "The payload could not be parsed." },
      { status: 400 },
    )
  }
  const rawBody = parsed.value

  const body = (rawBody ?? {}) as Record<string, unknown>

  /* Honeypot: a field no human sees and every naive bot fills. Answered with
     a plain success so the sender learns nothing about why it went nowhere. */
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true, requestId: createContactRequestId() }, { status: 202 })
  }

  const data = normalizeContactRequest(body)
  const errors = validateContactRequest(data)

  if (Object.keys(errors).length > 0) {
    await trackServerEvent(observabilityEvents.contactRequestValidationError, {
      locale: data.locale,
      errorCount: Object.keys(errors).length,
    })

    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message:
          data.locale === "es"
            ? "Revisa los datos antes de enviar."
            : "Please review the details before sending.",
        errors,
      },
      { status: 422 },
    )
  }

  const requestId = createContactRequestId()

  try {
    const payload = await getPayloadClient()

    await acceptContactRequest(data, requestId, {
      persist: async (contact, id, emails) => {
        const record = await payload.create({
          collection: "contactRequests",
          overrideAccess: true,
          data: { ...contact, status: "new", requestId: id, emailDelivery: emails },
        })
        return record.id
      },
      saveEmails: async (id, emails) => {
        await payload.update({
          collection: "contactRequests", id, overrideAccess: true,
          data: { emailDelivery: emails },
        })
      },
      report: (code) => {
        Sentry.captureMessage(code, {
          level: "error", tags: { route: "contact-request", requestId },
        })
      },
    })

    // Complementary copy for the sales team's sheet. The CMS row above is the
    // record; a sheet failure is reported and re-pushed later, never surfaced.
    const mirrored = await mirrorLeadToSheet(toLeadSheetRow(data, requestId, new Date()))
    if (mirrored === "failed") {
      Sentry.captureMessage("CONTACT_SHEET_MIRROR_FAILED", { level: "warning", tags: { route: "contact-request", requestId } })
    }

    await trackServerEvent(observabilityEvents.contactRequestAccepted, {
      locale: data.locale,
      interest: data.interest || "unspecified",
      source: data.source || "direct",
      requestId,
    }).catch(() => undefined)

    return NextResponse.json({ ok: true, requestId }, { status: 201 })
  } catch (error) {
    Sentry.captureException(error, { tags: { route: "contact-request" } })

    await trackServerEvent(observabilityEvents.contactRequestDeliveryError, {
      locale: data.locale,
      requestId,
    })

    return NextResponse.json(
      {
        ok: false,
        code: "DELIVERY_ERROR",
        message:
          data.locale === "es"
            ? "No pudimos guardar tu mensaje. Inténtalo de nuevo o escríbenos directo."
            : "We could not save your message. Try again or email us directly.",
      },
      { status: 502 },
    )
  }
}
