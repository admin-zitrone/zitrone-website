#!/usr/bin/env tsx
/**
 * Renders every email template with its sample payload, for review.
 *
 * Images are inlined as data URIs so a preview opens anywhere — in a browser
 * tab, over AirDrop, attached to a message — without a server running behind
 * it. Real sends keep absolute URLs: data URIs are blocked by most clients.
 *
 * Run: npm run email:preview        (then open .email-previews/index.html)
 */

import { EMAIL_BASE_URL } from '../src/emails/company'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { normalizeContactRequest } from '../src/app/lib/contact'
import { renderContactRequestEmail } from '../src/emails/contact-request-email'
import { renderProfilerBriefEmail } from '../src/emails/profiler-brief-email'
import { renderProfilerLeadEmail } from '../src/emails/profiler-lead-email'
import {
  profilerBriefSampleEn,
  profilerBriefSampleEs,
  profilerLeadSampleEs,
  profilerLeadSampleWeakEs,
} from '../src/emails/samples'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(repoRoot, '.email-previews')

/** Must match the origin the templates emit so every image gets inlined. */
const BASE_URL = EMAIL_BASE_URL

/** Swaps every site image for a data URI so the file is self-contained. */
function inlineImages(html: string) {
  return html.replace(new RegExp(`${BASE_URL}(/img/[^"')\\s]+)`, 'g'), (_match, path: string) => {
    const buffer = readFileSync(join(repoRoot, 'public', path))
    const mime = path.endsWith('.png')
      ? 'image/png'
      : path.endsWith('.svg')
        ? 'image/svg+xml'
        : 'image/jpeg'
    return `data:${mime};base64,${buffer.toString('base64')}`
  })
}

const inquirySample = normalizeContactRequest({
  name: 'Equipo de prueba', company: 'Zitrone — prueba técnica', email: 'opina@zitrone.com.mx',
  phone: '', headcount: '150', sourcePath: '/es/contact',
  message: 'Servicios: Comedor, Pantry\nDesayuno: 20\nComida: 80\nCena: 40',
  source: 'nav', ctaSection: 'hero', ctaText: 'Hablemos', fromPath: '/es',
  landingPath: '/es/services/comedor-corporativo', utmSource: 'google', utmMedium: 'cpc',
  utmCampaign: 'comedores-cdmx', firstTouch: 'linkedin.com / referral · /es/blog/comedor-industrial · 2026-09-02',
})
const templates = [
  ...(['es', 'en'] as const).flatMap(locale =>
    (['sales', 'confirmation'] as const).map(kind => ({
      file: `contact-${kind}.${locale}.html`, label: `Solicitud · ${kind} · ${locale}`,
      render: () => renderContactRequestEmail({ ...inquirySample, locale }, 'ZC-PRUEBA-LOCAL', kind),
    })),
  ),
  {
    file: 'profiler-brief.es.html',
    label: 'Brief del profiler · ES',
    render: () => renderProfilerBriefEmail({ ...profilerBriefSampleEs, baseUrl: BASE_URL }),
  },
  {
    file: 'profiler-brief.en.html',
    label: 'Profiler brief · EN',
    render: () => renderProfilerBriefEmail({ ...profilerBriefSampleEn, baseUrl: BASE_URL }),
  },
  {
    file: 'profiler-lead.es.html',
    label: 'Aviso a ventas · sitio grande',
    render: () => renderProfilerLeadEmail({ ...profilerLeadSampleEs, baseUrl: BASE_URL }),
  },
  {
    file: 'profiler-lead-weak.es.html',
    label: 'Aviso a ventas · sitio chico',
    render: () => renderProfilerLeadEmail({ ...profilerLeadSampleWeakEs, baseUrl: BASE_URL }),
  },
]

mkdirSync(outDir, { recursive: true })

const index: string[] = []

for (const template of templates) {
  const { subject, html, text } = template.render()

  writeFileSync(join(outDir, template.file), inlineImages(html))
  writeFileSync(join(outDir, template.file.replace('.html', '.txt')), text)

  index.push(
    `<li><a href="${template.file}">${template.label}</a><br><code>${subject}</code> · <a href="${template.file.replace('.html', '.txt')}">texto plano</a></li>`,
  )

  console.log(`  ${template.file}  —  ${subject}`)
}

writeFileSync(
  join(outDir, 'index.html'),
  `<!doctype html>
<meta charset="utf-8">
<title>Previews de correo · Zitrone</title>
<style>
  body { font: 16px/1.6 system-ui, sans-serif; max-width: 42rem; margin: 4rem auto; padding: 0 1.5rem; color: #1A4352; }
  h1 { font-weight: 500; }
  li { margin-bottom: 1rem; }
  code { color: #5E747A; font-size: 0.85em; }
  p { color: #5E747A; }
</style>
<h1>Previews de correo</h1>
<p>Generados con <code>npm run email:preview</code>. Las imágenes van incrustadas, así que estos archivos se ven en cualquier parte. Un envío real usa URLs absolutas.</p>
<ul>${index.join('\n')}</ul>`,
)

console.log(`\nemail:preview OK — ${templates.length} plantillas en .email-previews/`)
