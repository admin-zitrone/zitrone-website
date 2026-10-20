import type { AppLocale } from "@/i18n/routing"
import { publicEnv } from "@/env/public"
import { serverEnv } from "@/env/server"
import { routing } from "@/i18n/routing"

function normalizeOrigin(value: string) {
  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

export function sanitizeInternalPath(input: string | null | undefined, fallback = "/") {
  if (!input) {
    return fallback
  }

  const value = input.trim()

  if (!value.startsWith("/") || value.startsWith("//")) {
    return fallback
  }

  try {
    const url = new URL(value, "https://zitrone.internal")

    if (url.origin !== "https://zitrone.internal") {
      return fallback
    }

    return `${url.pathname}${url.search}${url.hash}` || fallback
  } catch {
    return fallback
  }
}

export function sanitizeLocaleCandidate(input: string | null | undefined): AppLocale | null {
  if (!input) {
    return null
  }

  const value = input.trim().toLowerCase()
  return routing.locales.includes(value as AppLocale) ? (value as AppLocale) : null
}

export function sanitizeTagPart(
  input: string | null | undefined,
  options: {
    allowSlash?: boolean
    maxLength?: number
  } = {},
) {
  if (!input) {
    return null
  }

  const { allowSlash = false, maxLength = 160 } = options
  const value = input.trim()

  if (!value || value.length > maxLength) {
    return null
  }

  const pattern = allowSlash ? /^[A-Za-z0-9:_/-]+$/ : /^[A-Za-z0-9:_-]+$/
  return pattern.test(value) ? value : null
}

function getConfiguredOrigins() {
  const origins = new Set<string>()

  for (const value of [publicEnv.siteUrl]) {
    const origin = normalizeOrigin(value)
    if (origin) {
      origins.add(origin)
    }
  }

  for (const origin of serverEnv.appAllowedOrigins) {
    origins.add(origin)
  }

  return origins
}

export function hasTrustedOrigin(request: Request) {
  const requestOrigin = request.headers.get("origin")

  if (!requestOrigin) {
    return true
  }

  const normalizedRequestOrigin = normalizeOrigin(requestOrigin)
  if (!normalizedRequestOrigin) {
    return false
  }

  const allowedOrigins = getConfiguredOrigins()
  allowedOrigins.add(new URL(request.url).origin)

  const forwardedHost = request.headers.get("x-forwarded-host")
  const forwardedProto = request.headers.get("x-forwarded-proto")
  const host = forwardedHost || request.headers.get("host")
  const protocol =
    forwardedProto || new URL(request.url).protocol.replace(/:$/, "")

  if (host && protocol) {
    const forwardedOrigin = normalizeOrigin(`${protocol}://${host}`)
    if (forwardedOrigin) {
      allowedOrigins.add(forwardedOrigin)
    }
  }

  return allowedOrigins.has(normalizedRequestOrigin)
}

export function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim()
    if (first) return first
  }

  const realIp = request.headers.get("x-real-ip")?.trim()
  if (realIp) return realIp

  return "unknown"
}

export function getRateLimitKey(request: Request, routeKey: string) {
  return `${routeKey}:${getRequestIp(request)}`
}

export function parseContentLength(request: Request) {
  const raw = request.headers.get("content-length")
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

export function exceedsContentLength(request: Request, maxBytes: number) {
  const contentLength = parseContentLength(request)
  return contentLength !== null && contentLength > maxBytes
}

export type BoundedJsonResult =
  | { ok: true; value: unknown }
  | { ok: false; reason: "too_large" | "invalid_json" | "read_failed" }

/**
 * Reads a JSON body without trusting Content-Length: the declared length is
 * checked first (cheap rejection), then the stream is counted as it arrives
 * and abandoned once it passes `maxBytes`, so a chunked or mislabelled body
 * cannot make the route buffer more than the limit. A body that fails while
 * streaming is reported as `read_failed`, never thrown. The host applies its
 * own platform request-size limit on top of this.
 */
export async function readJsonWithLimit(request: Request, maxBytes: number): Promise<BoundedJsonResult> {
  if (exceedsContentLength(request, maxBytes)) return { ok: false, reason: "too_large" }
  if (!request.body) return { ok: false, reason: "invalid_json" }

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let received = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      received += value.byteLength
      if (received > maxBytes) {
        await reader.cancel().catch(() => undefined)
        return { ok: false, reason: "too_large" }
      }
      chunks.push(value)
    }
  } catch {
    // The client aborted or the body stream errored mid-read.
    await reader.cancel().catch(() => undefined)
    return { ok: false, reason: "read_failed" }
  } finally {
    reader.releaseLock()
  }

  const bytes = new Uint8Array(received)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  try {
    return { ok: true, value: JSON.parse(new TextDecoder().decode(bytes)) }
  } catch {
    return { ok: false, reason: "invalid_json" }
  }
}
