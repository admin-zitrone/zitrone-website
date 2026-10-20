/**
 * Shaping and checking a contact submission.
 *
 * Kept apart from the route so the same rules can be read by tests and by
 * the form without either importing server-only code.
 */

import type { LeadForm } from "@/lib/analytics/cta"
import { readAttribution } from "@/lib/attribution"

export const CONTACT_INTERESTS = [
  "comedor",
  "cafeteria",
  "pantry",
  "maquinas",
  "carritos",
  "catering",
  "otro",
] as const

export type ContactInterest = (typeof CONTACT_INTERESTS)[number]

export type ContactRequest = {
  locale: "es" | "en"
  name: string
  company: string
  email: string
  phone: string
  interest: string
  headcount: string
  message: string
  sourcePath: string
  /* Where the lead came from. See lib/attribution.ts for why the CTA slug and
     the utm_* are collected by two different mechanisms. */
  source: string
  ctaSection: string
  ctaText: string
  fromPath: string
  landingPath: string
  referrer: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmTerm: string
  utmContent: string
  clickId: string
  firstTouch: string
  gaClientId: string
  gaSessionId: string
}

const MAX = {
  name: 120,
  company: 160,
  email: 254,
  phone: 40,
  headcount: 40,
  message: 4000,
  sourcePath: 512,
  source: 64,
  ctaSection: 64,
  ctaText: 100,
  fromPath: 512,
  landingPath: 512,
  referrer: 300,
  utm: 120,
  clickId: 200,
  firstTouch: 300,
  gaId: 64,
} as const

const readString = (value: unknown, limit: number) =>
  typeof value === "string" ? value.trim().slice(0, limit) : ""

export function normalizeContactRequest(raw: Record<string, unknown>): ContactRequest {
  const locale: "es" | "en" = raw.locale === "en" ? "en" : "es"

  return {
    locale,
    name: readString(raw.name, MAX.name),
    company: readString(raw.company, MAX.company),
    email: readString(raw.email, MAX.email).toLowerCase(),
    phone: readString(raw.phone, MAX.phone),
    interest: readString(raw.interest, 40),
    headcount: readString(raw.headcount, MAX.headcount),
    message: readString(raw.message, MAX.message),
    sourcePath: readString(raw.sourcePath, MAX.sourcePath),
    source: readString(raw.source, MAX.source),
    ctaSection: readString(raw.ctaSection, MAX.ctaSection),
    ctaText: readString(raw.ctaText, MAX.ctaText),
    fromPath: readString(raw.fromPath, MAX.fromPath),
    landingPath: readString(raw.landingPath, MAX.landingPath),
    referrer: readString(raw.referrer, MAX.referrer),
    utmSource: readString(raw.utmSource, MAX.utm),
    utmMedium: readString(raw.utmMedium, MAX.utm),
    utmCampaign: readString(raw.utmCampaign, MAX.utm),
    utmTerm: readString(raw.utmTerm, MAX.utm),
    utmContent: readString(raw.utmContent, MAX.utm),
    clickId: readString(raw.clickId, MAX.clickId),
    firstTouch: readString(raw.firstTouch, MAX.firstTouch),
    gaClientId: readString(raw.gaClientId, MAX.gaId),
    gaSessionId: readString(raw.gaSessionId, MAX.gaId),
  }
}

/* Deliberately permissive: one @, something either side, a dot in the domain.
   A stricter pattern rejects real addresses, and the cost of a bad address is
   a bounced reply, while the cost of a false reject is a lost lead. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactRequest(data: ContactRequest): Record<string, string> {
  const errors: Record<string, string> = {}
  const es = data.locale === "es"

  if (data.name.length < 2) {
    errors.name = es ? "Necesitamos tu nombre." : "We need your name."
  }

  if (!EMAIL_PATTERN.test(data.email)) {
    errors.email = es
      ? "Revisa el correo: no podemos responder sin uno válido."
      : "Check the email: we cannot reply without a valid one."
  }

  if (data.message.length < 10) {
    errors.message = es
      ? "Cuéntanos un poco más para poder responderte con algo concreto."
      : "Tell us a little more so we can come back with something concrete."
  }

  return errors
}

/* ── El envío, uno solo ───────────────────────────────────────
   El perfilador del home y la página de contacto son la MISMA
   solicitud tomada en dos sitios: mismo endpoint, mismo payload y
   mismo folio. Antes el home abría un mailto, así que esos leads no
   quedaban en la base y no se podían medir ni contestar desde el
   mismo sitio que los de /contact. La única diferencia entre ambos
   es `sourcePath`, que es justamente lo que dice de dónde vino. */

export type ContactSubmission = {
  locale: string
  name: string
  company: string
  email: string
  phone: string
  /** Lo que quiere resolver: el servicio recomendado o el tipo de menú. */
  interest: string
  headcount: string
  /** El brief completo, ya armado en líneas "Etiqueta: valor". */
  message: string
  sourcePath: string
  /** Trampa para bots. Va vacío para una persona. */
  website?: string
}

export type ContactSubmitResult =
  | { ok: true; requestId: string; persisted: boolean }
  | { ok: false; code?: string; message?: string; errors?: Record<string, string> }

/** Arma el cuerpo del brief a partir de pares etiqueta/valor. */
export function buildContactMessage(rows: { label: string; value: string }[]) {
  return rows
    .filter((row) => row.value)
    .map((row) => `${row.label}: ${row.value}`)
    .join("\n")
}

/** El primer valor con contenido: el interés declarado del envío. */
export function pickContactInterest(...candidates: (string | undefined)[]) {
  return candidates.find((value) => value && value.trim() !== "")?.trim().slice(0, 40) ?? ""
}

export async function submitContactRequest(
  input: ContactSubmission,
  form: LeadForm,
): Promise<ContactSubmitResult> {
  /* Attribution is attached here rather than by each caller: every form that
     posts a lead should carry where it came from, and a caller that forgets
     is a lead nobody can trace. `form` scopes the CTA to this form. */
  const response = await fetch("/api/contact-request", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...input, ...readAttribution(form) }),
  })

  const result = (await response.json().catch(() => null)) as
    | {
        ok?: boolean
        requestId?: string
        code?: string
        message?: string
        errors?: Record<string, string>
      }
    | null

  if (response.ok && result?.ok && result.requestId) {
    // 202 is the honeypot acknowledgement, not a persisted lead.
    return { ok: true, requestId: result.requestId, persisted: response.status === 201 }
  }

  return {
    ok: false,
    code: result?.code ?? (response.ok ? undefined : `HTTP_${response.status}`),
    message: result?.message,
    errors: result?.errors,
  }
}

/* Every lead form reports the same funnel (`contact_*` events, for Vercel
   Analytics and the dataLayer) regardless of where the form lives; `form`
   tells the two apart. The conversion GTM counts is `generate_lead`, pushed
   once per persisted lead (lib/analytics/lead-events.ts); never build a
   second conversion tag on `contact_request_accepted`. */
export type ContactFunnelForm = LeadForm

export function contactFunnelFailureEvent(result: Extract<ContactSubmitResult, { ok: false }>) {
  if (result.code === "VALIDATION_ERROR" || result.errors) return "validation" as const
  if (result.code === undefined) return "client" as const
  return "delivery" as const
}

/** Short, sortable, and safe to quote back to the sender. */
export function createContactRequestId() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `ZC-${stamp}-${suffix}`
}
