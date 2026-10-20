/**
 * Small Payload local-API tasks for the QA run, executed inside a checkout
 * (cwd) with its own config and the run's isolated environment.
 *
 *   tsx scripts/qa-release/payload-task.ts admin        -> creates qa-admin@example.invalid
 *                                                        (password read from QA_ADMIN_PASSWORD_FILE)
 *   tsx scripts/qa-release/payload-task.ts touch <faqs|blogPosts> -> re-saves the first
 *                                                        document (and locale) that validates,
 *                                                        with its own text, so its hooks
 *                                                        (embeddings, revalidation) run
 *   tsx scripts/qa-release/payload-task.ts lead <email> -> count of leads with that e-mail and
 *                                                        the first one's delivery codes
 *
 * Exit code 1 with the message on stderr when Payload refuses.
 */
import { readFileSync } from "node:fs"
import { pathToFileURL } from "node:url"
import { getPayload } from "payload"

const { default: config } = await import(pathToFileURL(`${process.cwd()}/src/payload/payload.config.ts`).href)
const payload = await getPayload({ config })
const [task, arg] = process.argv.slice(2)

try {
  if (task === "admin") {
    const file = process.env.QA_ADMIN_PASSWORD_FILE
    if (!file) throw new Error("QA_ADMIN_PASSWORD_FILE is not set")
    const password = readFileSync(file, "utf8").trim()
    await payload.create({ collection: "users", data: { email: "qa-admin@example.invalid", name: "QA", role: "admin", password } as never })
    console.log("QA_TASK admin created")
  } else if (task === "touch") {
    // One collection per process: embedText warns once per process. The
    // document's own text is re-sent, so the hook really calls embedText.
    const fields = { faqs: ["question"], blogPosts: ["title", "excerpt"] }[arg as "faqs" | "blogPosts"]
    if (!fields) throw new Error("touch needs faqs or blogPosts")
    // The first document and locale that validate: content written by older
    // seeds can miss a required field in one locale (QA_TASK invalid lines,
    // field paths only; criteria.mjs reports them as INFO).
    const found = await payload.find({ collection: arg as never, limit: 50, depth: 0, locale: "es" as never })
    if (!found.docs.length) throw new Error(`no ${arg} document`)
    let touched = false
    for (const { id } of found.docs as { id: number }[]) {
      for (const locale of ["es", "en"]) {
        const doc = (await payload.findByID({ collection: arg as never, id, depth: 0, locale: locale as never })) as Record<string, unknown>
        try {
          await payload.update({ collection: arg as never, id, locale: locale as never, data: Object.fromEntries(fields.map((f) => [f, doc[f]])) as never })
          console.log(`QA_TASK touch ${arg} #${id} ${locale}`)
          touched = true
          break
        } catch (error) {
          console.log(`QA_TASK invalid ${arg} #${id} ${locale}: ${(error as Error).message.replace(/\s+/g, " ")}`)
        }
      }
      if (touched) break
    }
    if (!touched) throw new Error(`no ${arg} document validates in es or en`)
  } else if (task === "lead") {
    const found = await payload.find({ collection: "contactRequests" as never, where: { email: { equals: arg } } as never, overrideAccess: true, depth: 0 })
    // Status and error codes only: the delivery record also holds addresses.
    const codes = JSON.stringify((found.docs[0] as { emailDelivery?: unknown } | undefined)?.emailDelivery ?? null)
      .match(/"(status|code|lastError|error)":"[^"]*"/g) ?? []
    console.log(`QA_TASK leads ${found.totalDocs}; delivery ${[...new Set(codes)].join(" ") || "none"}`)
  } else {
    throw new Error(`unknown task ${task}`)
  }
  process.exit(0)
} catch (error) {
  console.error(`QA_TASK failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
