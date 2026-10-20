import type { ContactRequest } from "@/app/lib/contact"
import { channelOf } from "@/lib/attribution"

/**
 * Copies each lead to a Google Sheet as a *complement* to the CMS record,
 * never a replacement: the CMS row is written first and is the source of
 * truth; the sheet is a convenience for the sales team.
 *
 * Transport: one POST to a Google Apps Script web app (LEADS_SHEET_WEBHOOK_URL)
 * carrying a shared secret. The script appends a row and ignores folios it has
 * already seen, so re-pushing (npm run leads:sheet) is safe.
 */
export type LeadSheetRow = Record<string, string>

export const LEAD_SHEET_COLUMNS = [
  "Fecha", "Folio", "Idioma", "Nombre", "Empresa", "Correo", "Teléfono", "Personas",
  "Servicios", "Resumen", "Origen", "CTA", "Página", "Landing", "Referrer",
  "utm_source", "utm_medium", "utm_campaign",
  // Appended, never inserted: the Apps Script maps by header, but humans
  // reading the sheet rely on the original columns staying put.
  "Sección CTA", "Texto CTA", "Canal", "utm_term", "utm_content", "Click ID",
  "Primera visita", "GA client id",
] as const

export function toLeadSheetRow(data: ContactRequest, requestId: string, createdAt: Date): LeadSheetRow {
  return {
    Fecha: createdAt.toISOString(),
    Folio: requestId,
    Idioma: data.locale,
    Nombre: data.name,
    Empresa: data.company,
    Correo: data.email,
    Teléfono: data.phone,
    Personas: data.headcount,
    Servicios: data.interest,
    Resumen: data.message,
    Origen: data.sourcePath,
    CTA: data.source,
    Página: data.fromPath,
    Landing: data.landingPath,
    Referrer: data.referrer,
    utm_source: data.utmSource,
    utm_medium: data.utmMedium,
    utm_campaign: data.utmCampaign,
    "Sección CTA": data.ctaSection,
    "Texto CTA": data.ctaText,
    Canal: channelOf(data),
    utm_term: data.utmTerm,
    utm_content: data.utmContent,
    "Click ID": data.clickId,
    "Primera visita": data.firstTouch,
    "GA client id": data.gaClientId,
  }
}

export type SheetMirrorResult = "mirrored" | "duplicate" | "not_configured" | "failed"

export function isSheetMirrorConfigured(env: Record<string, string | undefined> = process.env) {
  return Boolean(env.LEADS_SHEET_WEBHOOK_URL && env.LEADS_SHEET_WEBHOOK_SECRET)
}

/** Never throws: a sheet outage must not affect the visitor or the CMS record. */
export async function mirrorLeadToSheet(
  row: LeadSheetRow,
  env: Record<string, string | undefined> = process.env,
  fetcher: typeof fetch = fetch,
): Promise<SheetMirrorResult> {
  const url = env.LEADS_SHEET_WEBHOOK_URL
  const secret = env.LEADS_SHEET_WEBHOOK_SECRET
  if (!url || !secret) return "not_configured"
  try {
    // Apps Script web apps answer POSTs with a 302 to a googleusercontent URL; follow it.
    const response = await fetcher(url, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, columns: LEAD_SHEET_COLUMNS, row }),
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return "failed"
    const body = (await response.json().catch(() => ({}))) as { ok?: boolean; duplicate?: boolean }
    if (!body.ok) return "failed"
    return body.duplicate ? "duplicate" : "mirrored"
  } catch {
    return "failed"
  }
}
