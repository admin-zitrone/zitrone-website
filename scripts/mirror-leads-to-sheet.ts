#!/usr/bin/env tsx
// Re-push saved leads to the Google Sheet. Read-only listing by default.
//   npm run leads:sheet                 → lists the latest 100 leads (folio, date)
//   npm run leads:sheet -- ZC-ref       → pushes that lead (idempotent on the sheet)
//   npm run leads:sheet -- --all        → pushes the latest 100 (sheet skips duplicates)
import { getPayloadClient } from "../src/payload/loaders/client"
import { isSheetMirrorConfigured, mirrorLeadToSheet, toLeadSheetRow } from "../src/lib/leads/sheet-mirror"
import type { ContactRequest } from "../src/app/lib/contact"

const args = process.argv.slice(2)
const requestId = args.find(arg => /^ZC-[A-Z0-9-]+$/.test(arg))
const all = args.includes("--all")
if (args.some(arg => arg !== requestId && arg !== "--all")) throw new Error("Usage: npm run leads:sheet -- [ZC-reference | --all]")
if ((requestId || all) && !isSheetMirrorConfigured()) throw new Error("LEADS_SHEET_WEBHOOK_URL / LEADS_SHEET_WEBHOOK_SECRET not configured")

const payload = await getPayloadClient()
try {
  const records = await payload.find({
    collection: "contactRequests", overrideAccess: true, limit: 100, sort: "-createdAt",
    where: requestId ? { requestId: { equals: requestId } } : {},
  })
  if (requestId && records.docs.length !== 1) throw new Error("Expected exactly one saved request")
  for (const record of records.docs) {
    if (!requestId && !all) { console.log(`${record.requestId}  ${record.createdAt}`); continue }
    const row = toLeadSheetRow(record as unknown as ContactRequest, record.requestId ?? "", new Date(record.createdAt))
    const result = await mirrorLeadToSheet(row)
    console.log(JSON.stringify({ requestId: record.requestId, result }))
    if (result === "failed") process.exitCode = 1
  }
} finally {
  await payload.destroy()
}
process.exit(process.exitCode ?? 0)
