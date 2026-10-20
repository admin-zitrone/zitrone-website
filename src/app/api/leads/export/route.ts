import { NextResponse } from "next/server"
import { getPayloadClient } from "@/payload/loaders/client"
import { LEAD_SHEET_COLUMNS, toLeadSheetRow } from "@/lib/leads/sheet-mirror"
import type { ContactRequest } from "@/app/lib/contact"
import { canWorkLeads } from "@/payload/access/leads"

/** CSV of every lead for a CMS user allowed to work leads (admin today; see
 * `access/leads.ts`). Open /api/leads/export while signed in to /admin; Excel
 * and Sheets open it directly (UTF-8 BOM). The query runs as that user, so the
 * collection's own read access applies; this route is not a way around it. */
export async function GET(request: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: NO_STORE })
  if (!canWorkLeads(user)) return NextResponse.json({ error: "forbidden" }, { status: 403, headers: NO_STORE })

  const columns = [...LEAD_SHEET_COLUMNS, "Estado", "Notas internas"]
  const lines = [columns.map(csvCell).join(",")]
  let page = 1
  for (;;) {
    const result = await payload.find({ collection: "contactRequests", user, overrideAccess: false, limit: 500, page, sort: "-createdAt" })
    for (const record of result.docs) {
      const row = toLeadSheetRow(record as unknown as ContactRequest, record.requestId ?? "", new Date(record.createdAt))
      lines.push([...LEAD_SHEET_COLUMNS.map(column => row[column]), record.status ?? "", record.internalNotes ?? ""].map(csvCell).join(","))
    }
    if (!result.hasNextPage) break
    page++
  }
  const stamp = new Date().toISOString().slice(0, 10)
  return new NextResponse(`﻿${lines.join("\r\n")}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="zitrone-leads-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}

const NO_STORE = { "Cache-Control": "no-store" }

function csvCell(value: string | null | undefined) {
  const text = value ?? ""
  // Neutralise spreadsheet formula injection, then quote.
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
  return `"${safe.replace(/"/g, '""')}"`
}
