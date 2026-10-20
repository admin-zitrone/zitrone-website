#!/usr/bin/env tsx
/** Explicit opt-in smoke test: two marked inquiry records, four emails, all to
 * the already-confirmed sales inbox. Default only describes the test. */
import { createContactRequestId } from "../src/app/lib/contact"
import { getSalesInbox, SALES_EMAIL } from "../src/emails/contact-request-email"

const inbox = getSalesInbox()
const mode = inbox === SALES_EMAIL ? "PRODUCTION sales inbox" : "staging inbox (CONTACT_SALES_EMAIL override)"

const args = process.argv.slice(2)
if (args.some(arg => arg !== "--send")) throw new Error("Usage: npm run email:test -- [--send]")
const cases = [
  { locale: "es", sourcePath: "/es/contact", name: "PRUEBA TÉCNICA · Contacto" },
  { locale: "en", sourcePath: "/en", name: "TECHNICAL TEST · Home profiler" },
]
console.log(`Two marked test inquiries; four emails to ${inbox} [${mode}]. No other recipients.`)
if (!args.includes("--send")) {
  console.log("Preview only. After approval, run with --send against the local server on port 3000.")
} else {
  for (const item of cases) {
    const marker = createContactRequestId()
    const response = await fetch("http://127.0.0.1:3000/api/contact-request", {
      method: "POST", headers: { "Content-Type": "application/json", Origin: "http://127.0.0.1:3000" },
      body: JSON.stringify({
        ...item, company: "Zitrone — prueba técnica, no es un prospecto", email: inbox,
        phone: "", interest: "multiple", headcount: "150", website: "",
        source: "email-acceptance-test",
        message: `PRUEBA TÉCNICA / TECHNICAL TEST — ${marker}\nNo requiere seguimiento comercial.\nServicios / Services: Comedor, Pantry\nDesayuno / Breakfast: 20\nComida / Lunch: 80\nCena / Dinner: 40\nPrueba de recepción y encabezado Reply-To.`,
      }),
      signal: AbortSignal.timeout(60000),
    })
    const result = await response.json() as { ok?: boolean; requestId?: string; code?: string }
    console.log(JSON.stringify({ surface: item.sourcePath, status: response.status, ok: result.ok, requestId: result.requestId, code: result.code }))
    if (!response.ok || !result.ok) { process.exitCode = 1; break }
  }
  console.log("201 confirms persistence. Check email:retry status, Resend, and the inbox to confirm delivery.")
}
