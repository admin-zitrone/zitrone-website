import type { ContactRequest } from "@/app/lib/contact"
import { channelOf } from "@/lib/attribution"
import { COMPANY_EMAIL, EMAIL_BASE_URL, customerFooterBase, internalFooterBase } from "./company"
import { emailButton, emailHeading, emailKicker, emailLede, emailNote, emailQuote, emailRows, emailSectionLabel, renderEmailDocument } from "./layout"

export const SALES_EMAIL = COMPANY_EMAIL
/** Where sales notifications are routed. Production = opina; staging can point
 * CONTACT_SALES_EMAIL at a controlled test inbox so real sends never reach sales. */
export function getSalesInbox() {
  const override = process.env.CONTACT_SALES_EMAIL?.trim()
  return override && /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(override) ? override : SALES_EMAIL
}
export type ContactEmailKind = "sales" | "confirmation"

/** Both inquiry entry points submit the same complete, human-readable brief. */
export function renderContactRequestEmail(data: ContactRequest, requestId: string, kind: ContactEmailKind) {
  const es = data.locale === "es"
  const sales = kind === "sales"
  const title = sales
    ? (es ? "Nueva solicitud" : "New inquiry")
    : (es ? "Recibimos tu solicitud" : "We received your request")
  const subject = `${title} · ${requestId}`
  const intro = sales
    ? (es ? "Solicitud registrada en el sitio web. Responde este correo para contactar al prospecto." : "Inquiry recorded on the website. Reply to this email to contact the prospect.")
    : (es ? "Gracias por contactarnos. Tu solicitud quedó registrada. Si necesitas corregir o agregar algo, responde este correo." : "Thank you for contacting us. Your request has been recorded. Reply to this email to correct or add anything.")
  const rows = [
    { label: es ? "Folio" : "Reference", value: requestId },
    { label: es ? "Nombre" : "Name", value: data.name },
    { label: es ? "Empresa" : "Company", value: data.company },
    { label: es ? "Correo" : "Email", value: data.email },
    { label: es ? "Teléfono" : "Phone", value: data.phone },
    { label: es ? "Personas" : "People", value: data.headcount },
    ...(sales ? [{ label: es ? "Origen" : "Source", value: data.sourcePath }] : []),
  ].filter(row => row.value)
  // Sales-only: where the lead came from, in the words the team uses.
  const attributionRows = sales ? leadAttributionRows(data, es) : []
  const summary = es ? "Resumen de la solicitud" : "Request summary"
  // "Label: value" lines become compact rows; anything else stays as prose.
  const messageLines = data.message.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
  const summaryRows = messageLines.flatMap(line => {
    const match = /^([^:]{1,40}):\s+(.+)$/.exec(line)
    return match ? [{ label: match[1], value: match[2] }] : []
  })
  const summaryLines = messageLines.filter(line => !/^[^:]{1,40}:\s+.+$/.test(line))
  const legal = sales
    ? (es ? "Correo interno de Zitrone." : "Internal Zitrone email.")
    : "© 2026 Zitrone."
  return {
    subject,
    html: renderEmailDocument({
      locale: data.locale, title: subject, preheader: intro,
      baseUrl: EMAIL_BASE_URL, logoAlt: "Zitrone",
      // Visitor confirmation carries the brand photo like the profiler brief; the internal notice stays plain.
      hero: sales ? undefined : { src: `${EMAIL_BASE_URL}/img/site/hero-dining-hall-email.jpg`, alt: es ? "Comedor corporativo operado por Zitrone" : "Corporate dining operated by Zitrone" },
      body: [emailKicker(title), emailHeading(data.name), emailLede(intro), emailRows(rows),
        emailSectionLabel(summary), emailRows(summaryRows), ...summaryLines.map(emailQuote),
        ...(attributionRows.length ? [emailSectionLabel(es ? "De dónde llegó" : "Where it came from"), emailRows(attributionRows)] : []),
        // One clear action per audience: sales replies to the prospect; the visitor can keep exploring.
        sales
          ? emailButton(es ? "Responder al prospecto" : "Reply to the prospect", `mailto:${data.email}?subject=${encodeURIComponent(`Re: ${subject}`)}`)
          : emailButton(es ? "Escríbenos si tienes dudas" : "Write to us with any questions", `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(`Re: ${subject}`)}`),
        ...(sales ? [emailNote(es ? "Al responder, el correo llega directamente al prospecto." : "Replying sends your message straight to the prospect.")] : []),
      ].join("\n"),
      footer: {
        ...(sales ? internalFooterBase(data.locale) : customerFooterBase(data.locale)),
        legal,
        privacyHref: `${EMAIL_BASE_URL}/${data.locale}/privacy-notice`,
        privacyLabel: es ? "Aviso de privacidad" : "Privacy notice",
        unsubscribeLabel: "", preferencesLabel: "",
      },
    }),
    text: [subject, "", intro, "", ...rows.map(row => `${row.label}: ${row.value}`), "", summary, data.message, "", legal].join("\n"),
  }
}

/** "Home › nav-mobile › “Hablemos”" — the CTA, the channel and the first visit. */
export function leadAttributionRows(data: ContactRequest, es: boolean) {
  const cta = data.source
    ? [data.fromPath || "", data.ctaSection, data.ctaText ? `“${data.ctaText}”` : data.source]
        .filter(Boolean)
        .join(" › ")
    : (es ? "Llegó al formulario sin pasar por un botón" : "Reached the form without a button")
  return [
    { label: "CTA", value: cta },
    { label: es ? "Canal" : "Channel", value: channelOf(data) },
    { label: es ? "Campaña" : "Campaign", value: data.utmCampaign },
    { label: es ? "Entró por" : "Landed on", value: data.landingPath },
    { label: es ? "Primera visita" : "First visit", value: data.firstTouch },
  ].filter(row => row.value)
}
