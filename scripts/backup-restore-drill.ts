/**
 * Seeds or counts synthetic CMS data for scripts/backup-restore-drill.sh.
 *   tsx scripts/backup-restore-drill.ts seed|count
 * Only runs against a local *_api_test database (same guard as tests/api).
 */
import { assertIsolatedDatabase } from "../tests/api/harness"

assertIsolatedDatabase()
const { getPayload } = await import("payload")
const config = (await import("../src/payload/payload.config")).default
const payload = await getPayload({ config })

if (process.argv[2] === "seed") {
  await payload.create({ collection: "users", data: { email: "drill.admin@example.invalid", password: "Drill-Synthetic-Pass-1!", role: "admin" } })
  await payload.create({
    collection: "contactRequests",
    overrideAccess: true,
    data: { name: "Lead Sintético", email: "drill.lead@example.invalid", requestId: "ZC-DRILL-0001", status: "new", locale: "es" },
  })
  await payload.create({
    collection: "blogPosts",
    locale: "es",
    data: { title: "Artículo de simulacro", slug: "articulo-de-simulacro", excerpt: "Datos sintéticos.", _status: "published" },
  })
}

const counts = {
  users: (await payload.count({ collection: "users" })).totalDocs,
  contactRequests: (await payload.count({ collection: "contactRequests" })).totalDocs,
  blogPosts: (await payload.count({ collection: "blogPosts" })).totalDocs,
  lead: (await payload.find({ collection: "contactRequests", where: { requestId: { equals: "ZC-DRILL-0001" } } })).docs[0]?.email ?? null,
}
console.log(`COUNTS ${JSON.stringify(counts)}`)
process.exit(0)
