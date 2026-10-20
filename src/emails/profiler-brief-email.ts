/**
 * Confirmation email sent to the person who completes the home profiler.
 *
 * Structure and every resolved design value live in `layout.ts`; this file
 * only decides which blocks the message needs and what they say.
 *
 * SENDING REQUIREMENT — the closing line tells the reader to reply to this
 * message, so whatever sends it MUST set a reply-to header:
 *
 *   from:     Zitrone <hola@send.zitrone.mx>   (verified sending domain)
 *   reply_to: opina@zitrone.com.mx             (the mailbox people read)
 *
 * Resend accepts any address as reply_to, verified or not. Without it the
 * instruction is a lie: replies land on the sending subdomain, where no
 * one is listening.
 */

import { customerFooterBase } from './company'
import {
  emailList,
  emailHeading,
  emailKicker,
  emailLede,
  emailNote,
  emailQuote,
  emailRows,
  emailSectionLabel,
  renderEmailDocument,
  type EmailFooter,
} from './layout'

export type ProfilerBriefRow = {
  label: string
  value: string
}

export type ProfilerBriefRecommendation = {
  title: string
  reason: string
}

export type ProfilerBriefEmailData = {
  locale: 'es' | 'en'
  /** First name is enough; the greeting stays short. */
  name: string
  company?: string
  /** The answers, already formatted for reading. */
  rows: ProfilerBriefRow[]
  /** Ordered; the first is where we would start and carries the accent. */
  recommendations: ProfilerBriefRecommendation[]
  /** Free-text request the person typed, if any. */
  notes?: string
  baseUrl: string
  /** Present only once the preference centre exists. */
  unsubscribeHref?: string
  preferencesHref?: string
}

const COPY = {
  es: {
    preheader: 'Confirmamos la recepción de tu solicitud.',
    kicker: 'Solicitud recibida',
    greeting: (name: string) => `Hola ${name},`,
    lead: 'Gracias por compartir la información de tu sitio. Tu solicitud quedó registrada y nuestro equipo la está revisando para responderte con una propuesta.',
    startTitle: 'Punto de partida sugerido',
    startNote: 'Esta recomendación se basa en tus respuestas y no constituye una cotización.',
    answersTitle: 'Resumen de tu solicitud',
    notesTitle: 'Comentarios que nos compartiste',
    footerLead: 'Si necesitas corregir o agregar algo, responde este mismo correo.',
    legal: '© 2026 Zitrone. Todos los derechos reservados.',
    privacyLabel: 'Aviso de privacidad',
    unsubscribeLabel: 'Cancelar suscripción',
    preferencesLabel: 'Preferencias',
    heroAlt: 'Comedor corporativo operado por Zitrone',
    logoAlt: 'Zitrone',
    subject: (company?: string) =>
      company ? `Confirmamos tu solicitud · ${company}` : 'Confirmamos tu solicitud',
  },
  en: {
    preheader: 'Confirming that we received your request.',
    kicker: 'Request received',
    greeting: (name: string) => `Hi ${name},`,
    lead: 'Thank you for sharing the details of your site. Your request has been logged and our team is reviewing it to come back with a proposal.',
    startTitle: 'Suggested starting point',
    startNote: 'This recommendation is based on your answers and is not a quote.',
    answersTitle: 'Summary of your request',
    notesTitle: 'Notes you shared',
    footerLead: 'If you need to correct or add anything, simply reply to this email.',
    legal: '© 2026 Zitrone. All rights reserved.',
    privacyLabel: 'Privacy notice',
    unsubscribeLabel: 'Unsubscribe',
    preferencesLabel: 'Preferences',
    heroAlt: 'Corporate dining operated by Zitrone',
    logoAlt: 'Zitrone',
    subject: (company?: string) =>
      company ? `We received your request · ${company}` : 'We received your request',
  },
} as const


export function renderProfilerBriefEmail(data: ProfilerBriefEmailData): {
  subject: string
  html: string
  text: string
} {
  const copy = COPY[data.locale]

  const footer: EmailFooter = {
    legal: copy.legal,
    privacyLabel: copy.privacyLabel,
    unsubscribeLabel: copy.unsubscribeLabel,
    preferencesLabel: copy.preferencesLabel,
    privacyHref: `${data.baseUrl}/${data.locale}/privacy-notice`,
    /* Wired only when the endpoint exists; a dead unsubscribe link costs
       more in deliverability and trust than a missing one. */
    unsubscribeHref: data.unsubscribeHref,
    preferencesHref: data.preferencesHref,
    ...customerFooterBase(data.locale),
  }

  /* Services are parallel objects competing for the reader's attention, so
     they earn cards. The answers below stay typographic rows. */
  const body = [
    emailKicker(copy.kicker),
    emailHeading(copy.greeting(data.name)),
    emailLede(copy.lead),
    emailSectionLabel(copy.startTitle),
    emailList(
      data.recommendations.map((item, index) => ({
        title: item.title,
        body: item.reason,
        lead: index === 0,
      })),
    ),
    emailNote(copy.startNote),
    emailSectionLabel(copy.answersTitle),
    emailRows(data.rows),
    ...(data.notes ? [emailSectionLabel(copy.notesTitle), emailQuote(data.notes)] : []),
    emailNote(copy.footerLead),
  ].join('\n')

  const html = renderEmailDocument({
    locale: data.locale,
    title: copy.subject(data.company),
    preheader: copy.preheader,
    body,
    hero: {
      src: `${data.baseUrl}/img/site/hero-dining-hall-email.jpg`,
      alt: copy.heroAlt,
    },
    footer,
    baseUrl: data.baseUrl,
    logoAlt: copy.logoAlt,
  })

  /* Plain text alternative: some clients show it, and spam filters read it. */
  const text = [
    copy.greeting(data.name),
    '',
    copy.lead,
    '',
    `${copy.startTitle}:`,
    ...data.recommendations.map((item) => `- ${item.title}: ${item.reason}`),
    '',
    `${copy.answersTitle}:`,
    ...data.rows.map((row) => `- ${row.label}: ${row.value}`),
    ...(data.notes ? ['', `${copy.notesTitle}: ${data.notes}`] : []),
    '',
    copy.footerLead,
    `${copy.legal} · ${footer.contactEmail}`,
  ].join('\n')

  return { subject: copy.subject(data.company), html, text }
}
