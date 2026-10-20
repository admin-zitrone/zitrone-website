#!/usr/bin/env tsx
// Read-only by default. Explicit request ID and --send are required to send.
import { getPayloadClient } from "../src/payload/loaders/client"
import { deliverContactEmails, type ContactEmailDelivery } from "../src/lib/email/contact-delivery"

const args = process.argv.slice(2)
const requestId = args.find(arg => /^ZC-[A-Z0-9-]+$/.test(arg))
if (args.some(arg => arg !== requestId && arg !== "--send")) {
  throw new Error("Usage: npm run email:retry -- [ZC-reference] [--send]")
}
if (args.includes("--send") && !requestId) throw new Error("A single request reference is required to send")

const payload = await getPayloadClient()
try {
  const records = await payload.find({
    collection: "contactRequests", overrideAccess: true, limit: 100, sort: "-createdAt",
    where: requestId ? { requestId: { equals: requestId } } : { emailDelivery: { exists: true } },
  })
  if (requestId && records.docs.length !== 1) throw new Error("Expected exactly one saved request")
  for (const record of records.docs) {
    let delivery = record.emailDelivery as ContactEmailDelivery | null | undefined
    if (!delivery || delivery.version !== 1 || !Array.isArray(delivery.items)) {
      console.log(`${record.requestId}: no saved email snapshot; skipped`)
      continue
    }
    if (args.includes("--send")) {
      delivery = await deliverContactEmails(delivery, async emails => {
        await payload.update({ collection: "contactRequests", id: record.id, overrideAccess: true, data: { emailDelivery: emails } })
      })
    }
    console.log(JSON.stringify({ requestId: record.requestId, createdAt: delivery.createdAt,
      emails: delivery.items.map(({ kind, status, providerId, error }) => ({ kind, status, providerId, error })) }))
    if (args.includes("--send") && delivery.items.some(item => item.status !== "accepted")) process.exitCode = 1
  }
  if (records.hasNextPage && !requestId) console.log("Showing latest 100; use a request reference for older records.")
} finally {
  await payload.destroy()
}
// The Postgres pool keeps the event loop alive after destroy(); exit explicitly.
process.exit(process.exitCode ?? 0)
