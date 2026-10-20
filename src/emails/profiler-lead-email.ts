/**
 * Internal notification sent to the sales team when someone completes the
 * home profiler. The twin of `profiler-brief-email.ts`, written for a
 * different reader.
 *
 * This one is read on a phone between meetings, so it is ordered by what a
 * salesperson decides with: who it is, how to reach them, what we would
 * propose, then the detail. No photograph and no marketing copy — the
 * reader already works here.
 *
 * There is deliberately no lead score. A grade built from invented weights
 * reads as authoritative and is not; if scoring returns it should be built
 * from closed-won data, not from guesses.
 *
 * SENDING REQUIREMENT — set reply-to to the lead's own address so replying
 * starts the conversation instead of writing to the sending domain:
 *
 *   to:       opina@zitrone.com.mx
 *   reply_to: <the address the person entered>
 *
 * Never send this outward. It contains a judgement about its subject.
 */

import { internalFooterBase } from './company'
import {
  emailButton,
  emailHeading,
  emailKicker,
  emailLinkRows,
  emailList,
  emailQuote,
  emailRows,
  emailSectionLabel,
  renderEmailDocument,
  type EmailFooter,
} from './layout'
import type { ProfilerBriefRecommendation, ProfilerBriefRow } from './profiler-brief-email'

export type ProfilerLeadEmailData = {
  locale: 'es' | 'en'
  /** What the person typed about themselves. */
  contact: {
    name: string
    company?: string
    email: string
    phone?: string
  }
  /** Only what the subject line needs beyond the formatted rows. */
  summary: {
    headcount: number
    headcountUnsure: boolean
    location: string
  }
  /** The same formatted answers the confirmation shows. */
  rows: ProfilerBriefRow[]
  recommendations: ProfilerBriefRecommendation[]
  notes?: string
  baseUrl: string
  /** When the submission arrived, already formatted for the locale. */
  receivedAt: string
}

const COPY = {
  es: {
    kicker: 'Nuevo lead del profiler',
    contactTitle: 'Contacto',
    nameLabel: 'Nombre',
    companyLabel: 'Empresa',
    emailLabel: 'Correo',
    phoneLabel: 'Teléfono',
    receivedLabel: 'Recibido',
    recommendationTitle: 'Servicios de interés',
    answersTitle: 'Respuestas completas',
    notesTitle: 'Comentarios del prospecto',
    replyLabel: 'Responder al prospecto',
    replySubject: 'Sobre tu solicitud a Zitrone',
    legal: 'Correo interno de Zitrone. No reenviar al prospecto.',
    privacyLabel: 'Aviso de privacidad',
    unsubscribeLabel: '',
    preferencesLabel: '',
    logoAlt: 'Zitrone',
    subject: (service: string, size: string, place: string) =>
      `${service} · ${size}${place ? ` · ${place}` : ''}`,
    preheader: (name: string, company?: string) =>
      company ? `${name} · ${company}` : name,
  },
  en: {
    kicker: 'New profiler lead',
    contactTitle: 'Contact',
    nameLabel: 'Name',
    companyLabel: 'Company',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    receivedLabel: 'Received',
    recommendationTitle: 'Services of interest',
    answersTitle: 'Full answers',
    notesTitle: 'Notes from the prospect',
    replyLabel: 'Reply to the prospect',
    replySubject: 'About your request to Zitrone',
    legal: 'Internal Zitrone email. Do not forward to the prospect.',
    privacyLabel: 'Privacy notice',
    unsubscribeLabel: '',
    preferencesLabel: '',
    logoAlt: 'Zitrone',
    subject: (service: string, size: string, place: string) =>
      `${service} · ${size}${place ? ` · ${place}` : ''}`,
    preheader: (name: string, company?: string) =>
      company ? `${name} · ${company}` : name,
  },
} as const


export function renderProfilerLeadEmail(data: ProfilerLeadEmailData): {
  subject: string
  html: string
  text: string
} {
  const copy = COPY[data.locale]

  const sizeLabel = data.summary.headcountUnsure
    ? data.locale === 'es'
      ? 'tamaño por definir'
      : 'size to be defined'
    : `${data.summary.headcount.toLocaleString(data.locale === 'es' ? 'es-MX' : 'en-US')} ${
        data.locale === 'es' ? 'personas' : 'people'
      }`

  const anchorService =
    data.recommendations[0]?.title ?? (data.locale === 'es' ? 'Sin match' : 'No match')

  const subject = copy.subject(anchorService, sizeLabel, data.summary.location)

  const footer: EmailFooter = {
    legal: copy.legal,
    privacyLabel: copy.privacyLabel,
    unsubscribeLabel: copy.unsubscribeLabel,
    preferencesLabel: copy.preferencesLabel,
    privacyHref: `${data.baseUrl}/${data.locale}/privacy-notice`,
    ...internalFooterBase(data.locale),
  }

  const body = [
    emailKicker(copy.kicker),
    emailHeading(data.contact.company || data.contact.name),
    emailSectionLabel(copy.contactTitle),
    emailLinkRows([
      { label: copy.nameLabel, value: data.contact.name },
      ...(data.contact.company
        ? [{ label: copy.companyLabel, value: data.contact.company }]
        : []),
      {
        label: copy.emailLabel,
        value: data.contact.email,
        href: `mailto:${data.contact.email}`,
      },
      ...(data.contact.phone
        ? [
            {
              label: copy.phoneLabel,
              value: data.contact.phone,
              href: `tel:${data.contact.phone.replace(/[^\d+]/g, '')}`,
            },
          ]
        : []),
      { label: copy.receivedLabel, value: data.receivedAt },
    ]),


    emailSectionLabel(copy.recommendationTitle),
    emailList(
      data.recommendations.map((item, index) => ({
        title: item.title,
        body: item.reason,
        lead: index === 0,
      })),
    ),

    emailSectionLabel(copy.answersTitle),
    emailRows(data.rows),

    ...(data.notes ? [emailSectionLabel(copy.notesTitle), emailQuote(data.notes)] : []),

    /* Opens a reply addressed to the prospect, not to whoever else is on
       this internal thread. */
    emailButton(
      copy.replyLabel,
      `mailto:${data.contact.email}?subject=${encodeURIComponent(copy.replySubject)}`,
    ),
  ].join('\n')

  const html = renderEmailDocument({
    locale: data.locale,
    title: subject,
    preheader: copy.preheader(data.contact.name, data.contact.company),
    body,
    footer,
    baseUrl: data.baseUrl,
    logoAlt: copy.logoAlt,
  })

  const text = [
    subject,
    '',
    `${copy.contactTitle}: ${data.contact.name}${data.contact.company ? ` · ${data.contact.company}` : ''}`,
    `${copy.emailLabel}: ${data.contact.email}`,
    ...(data.contact.phone ? [`${copy.phoneLabel}: ${data.contact.phone}`] : []),
    `${copy.receivedLabel}: ${data.receivedAt}`,
    '',
    `${copy.recommendationTitle}:`,
    ...data.recommendations.map((item) => `- ${item.title}: ${item.reason}`),
    '',
    `${copy.answersTitle}:`,
    ...data.rows.map((row) => `- ${row.label}: ${row.value}`),
    ...(data.notes ? ['', `${copy.notesTitle}: ${data.notes}`] : []),
  ].join('\n')

  return { subject, html, text }
}
