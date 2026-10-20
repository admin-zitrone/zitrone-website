/**
 * Adds the admin that home-cache.test.ts logs in with. The home content itself
 * is seeded from the code files by scripts/payload/seed.ts (scope home).
 */
import { assertIsolatedDatabase } from "../api/harness"

assertIsolatedDatabase()
const { getPayload } = await import("payload")
const config = (await import("../../src/payload/payload.config")).default
const payload = await getPayload({ config })

await payload.create({
  collection: "users",
  data: { email: "home.cache.admin@example.invalid", password: "Home-Synthetic-Pass-1!", role: "admin" },
})
process.exit(0)
