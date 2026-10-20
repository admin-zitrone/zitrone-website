/**
 * Sample payloads for every email template.
 *
 * These drive `npm run email:preview`, so they are the working reference for
 * how each message looks. Keep them realistic — long company names, accents,
 * a free-text note — because those are what break email layouts.
 */

import type { ProfilerBriefEmailData } from './profiler-brief-email'
import type { ProfilerLeadEmailData } from './profiler-lead-email'

export const profilerBriefSampleEs: Omit<ProfilerBriefEmailData, 'baseUrl'> = {
  locale: 'es',
  name: 'Sebastián',
  company: 'Grupo Herradura',
  rows: [
    { label: 'Personas', value: '300' },
    { label: 'Ubicación', value: 'Ramos Arizpe, Coahuila' },
    { label: 'Días', value: 'L a V' },
    { label: 'Comidas', value: 'Desayuno · 150 / Comida · 300' },
    { label: 'Menú', value: 'Corporativo' },
    { label: 'Instalaciones', value: 'Cocina completa' },
    { label: 'Condiciones', value: '80% · $95 MXN por comida' },
  ],
  recommendations: [
    {
      title: 'Comedor corporativo',
      reason:
        'Comida completa cada día, con cocina en sitio y operación completa por Zitrone.',
    },
    {
      title: 'Máquinas de café y dispensadores de agua',
      reason: 'Café recién molido y agua filtrada, sin inversión inicial.',
    },
  ],
  notes: 'Tenemos turno de fin de semana ocasional y necesitamos opciones sin gluten.',
}

export const profilerBriefSampleEn: Omit<ProfilerBriefEmailData, 'baseUrl'> = {
  locale: 'en',
  name: 'Sebastián',
  company: 'Grupo Herradura',
  rows: [
    { label: 'People', value: '300' },
    { label: 'Location', value: 'Ramos Arizpe, Coahuila' },
    { label: 'Days', value: 'Mon–Fri' },
    { label: 'Shifts', value: 'Breakfast · 150 / Lunch · 300' },
    { label: 'Menu', value: 'Corporate' },
    { label: 'Facilities', value: 'Full kitchen' },
    { label: 'Terms', value: '80% · $95 MXN per meal' },
  ],
  recommendations: [
    {
      title: 'Corporate dining',
      reason:
        'A full meal every day, with an on-site kitchen and the whole operation run by Zitrone.',
    },
    {
      title: 'Coffee machines & water dispensers',
      reason: 'Freshly ground coffee and filtered water, with no upfront investment.',
    },
  ],
  notes: 'We run an occasional weekend shift and need gluten-free options.',
}

/** The same submission as `profilerBriefSampleEs`, seen by sales. */
export const profilerLeadSampleEs: Omit<ProfilerLeadEmailData, 'baseUrl'> = {
  locale: 'es',
  contact: {
    name: 'Sebastián Ortega',
    company: 'Grupo Herradura',
    email: 'sebastian.ortega@grupoherradura.mx',
    phone: '+52 844 118 2290',
  },
  summary: {
    headcount: 300,
    headcountUnsure: false,
    location: 'Ramos Arizpe, Coahuila',
  },
  rows: profilerBriefSampleEs.rows,
  recommendations: profilerBriefSampleEs.recommendations,
  notes: profilerBriefSampleEs.notes,
  receivedAt: '4 de agosto de 2026, 18:42',
}

/** A small submission, so the template is reviewed against thin data too. */
export const profilerLeadSampleWeakEs: Omit<ProfilerLeadEmailData, 'baseUrl'> = {
  locale: 'es',
  contact: {
    name: 'Ana Ruiz',
    email: 'ana@estudio-ruiz.mx',
  },
  summary: {
    headcount: 30,
    headcountUnsure: false,
    location: '',
  },
  rows: [
    { label: 'Personas', value: '30' },
    { label: 'Días', value: 'L a V' },
    { label: 'Comidas', value: 'Comida · 30' },
    { label: 'Menú', value: 'Corporativo premium' },
    { label: 'Instalaciones', value: 'Nada todavía' },
    { label: 'Condiciones', value: '10% · $60 MXN por comida' },
  ],
  recommendations: [
    {
      title: 'Catering corporativo',
      reason:
        'Box lunch y comidas de trabajo por pedido: resuelven la comida del día sin el costo fijo de un comedor.',
    },
  ],
  receivedAt: '4 de agosto de 2026, 19:03',
}
