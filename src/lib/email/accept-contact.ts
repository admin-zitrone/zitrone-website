import type { ContactRequest } from "@/app/lib/contact"
import { prepareContactEmails, deliverContactEmails, type ContactEmailDelivery, type EmailSender } from "./contact-delivery"

type Dependencies = {
  persist: (data: ContactRequest, requestId: string, emails: ContactEmailDelivery) => Promise<string | number>
  saveEmails: (id: string | number, emails: ContactEmailDelivery) => Promise<void>
  report: (code: string) => void
  send?: EmailSender
}

/** Only persistence failure rejects the inquiry. Email failures never ask the
 * visitor to submit the same saved lead again. */
export async function acceptContactRequest(data: ContactRequest, requestId: string, deps: Dependencies) {
  const emails = prepareContactEmails(data, requestId)
  const id = await deps.persist(data, requestId, emails)
  try {
    const outcome = await deliverContactEmails(emails, value => deps.saveEmails(id, value), deps.send)
    if (outcome.items.some(item => item.status !== "accepted")) deps.report("CONTACT_EMAIL_PENDING")
  } catch {
    deps.report("CONTACT_EMAIL_STATUS_SAVE_FAILED")
  }
  return { ok: true as const, requestId }
}
