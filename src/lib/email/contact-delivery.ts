import type { ContactRequest } from "@/app/lib/contact"
import { renderContactRequestEmail, getSalesInbox, type ContactEmailKind } from "@/emails/contact-request-email"

export type EmailMessage = {
  from: string
  to: string[]
  reply_to: string
  subject: string
  html: string
  text: string
}
export type DeliveryItem = {
  kind: ContactEmailKind
  key: string
  message: EmailMessage
  status: "pending" | "accepted" | "failed" | "review"
  providerId?: string
  error?: string
}
export type ContactEmailDelivery = {
  version: 1
  createdAt: string
  items: DeliveryItem[]
}
export type EmailSender = (message: EmailMessage, key: string) => Promise<string>

export function prepareContactEmails(data: ContactRequest, requestId: string, now = new Date()): ContactEmailDelivery {
  const address = process.env.RESEND_FROM_ADDRESS || "hola@send.zitrone.mx"
  const name = process.env.RESEND_FROM_NAME || "Zitrone"
  if (/[\r\n<>]/.test(name) || !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(address)) {
    throw new Error("INVALID_EMAIL_SENDER")
  }
  const salesInbox = getSalesInbox()
  return {
    version: 1, createdAt: now.toISOString(),
    items: (["sales", "confirmation"] as const).map(kind => ({
      kind, key: `contact/${requestId}/${kind}/v1`, status: "pending",
      message: {
        from: `${name} <${address}>`,
        to: [kind === "sales" ? salesInbox : data.email],
        reply_to: kind === "sales" ? data.email : salesInbox,
        ...renderContactRequestEmail(data, requestId, kind),
      },
    })),
  }
}

/** Errors contain codes only: never log provider response bodies or credentials. */
export class EmailDeliveryError extends Error {
  constructor(public code: string) { super(code) }
}

export function createResendSender(
  apiKey = process.env.RESEND_API_KEY,
  fetcher: typeof fetch = fetch,
  pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
): EmailSender {
  return async (message, key) => {
    if (!apiKey) throw new EmailDeliveryError("EMAIL_NOT_CONFIGURED")
    for (let attempt = 0; attempt < 3; attempt++) {
      let response: Response
      try {
        response = await fetcher("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": key },
          body: JSON.stringify(message), signal: AbortSignal.timeout(5000),
        })
      } catch {
        if (attempt < 2) { await pause(500 * 2 ** attempt); continue }
        throw new EmailDeliveryError("EMAIL_NETWORK_ERROR")
      }
      if (response.ok) {
        const result = await response.json().catch(() => null) as { id?: unknown } | null
        if (typeof result?.id !== "string" || !result.id) throw new EmailDeliveryError("EMAIL_INVALID_RESPONSE")
        return result.id
      }
      if ((response.status === 429 || response.status >= 500) && attempt < 2) {
        const retryAfter = Number(response.headers.get("retry-after"))
        await pause(Math.min(3000, Math.max(500 * 2 ** attempt, retryAfter * 1000 || 0)))
        continue
      }
      throw new EmailDeliveryError(`EMAIL_HTTP_${response.status}`)
    }
    throw new EmailDeliveryError("EMAIL_RETRY_EXHAUSTED")
  }
}

/** The snapshot must already be durable before calling this function. Save each
 * outcome separately; retries reuse the exact body and key, including after a
 * crash between provider acceptance and the database update. No async fire-and-forget. */
export async function deliverContactEmails(
  original: ContactEmailDelivery,
  save: (delivery: ContactEmailDelivery) => Promise<void>,
  send: EmailSender = createResendSender(),
  now = new Date(),
) {
  const delivery = structuredClone(original)
  for (const item of delivery.items) {
    if (item.status === "accepted" || item.status === "review") continue
    // Resend retains idempotency for 24h. Stop conservatively before expiry;
    // an operator must reconcile older ambiguous sends with the dashboard.
    const age = now.getTime() - Date.parse(delivery.createdAt)
    if (!Number.isFinite(age) || age < 0 || age >= 23 * 60 * 60 * 1000) {
      item.status = "review"
      item.error = "EMAIL_RETRY_WINDOW_EXPIRED"
    } else {
      try {
        item.providerId = await send(item.message, item.key)
        item.status = "accepted"
        delete item.error
      } catch (error) {
        item.status = "failed"
        item.error = error instanceof EmailDeliveryError ? error.code : "EMAIL_SEND_FAILED"
      }
    }
    // A save failure stops this run, leaving the durable snapshot recoverable.
    await save(structuredClone(delivery))
  }
  return delivery
}
