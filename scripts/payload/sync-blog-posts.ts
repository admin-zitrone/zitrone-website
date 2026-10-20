/**
 * Copies the blog articles from the code files into Payload, per locale.
 *
 *   npm run payload:sync:blog        (.env.local)
 *   npm run payload:sync:blog:prod   (.env.production-cms)
 *   add `-- --dry-run` to print what would change without saving.
 *
 * Only text is synced (title, excerpt, SEO, intro, takeaways, sections with
 * checklists and inline links, FAQs, CTA). Images, author, category and dates
 * stay as they are in Payload.
 *
 * Arrays (intro, sections, paragraphs…) share their rows across languages in
 * Payload; only the text inside a row is per language. So each existing row is
 * reused by position (keeping its id, images and the other language's text),
 * and a list a language doesn't have (EN has no checklists) is left untouched
 * rather than cleared, which would delete the other language's text too.
 */
import { getPayload } from "payload"

import config from "../../src/payload/payload.config"
import { blogContentEn } from "../../src/app/[locale]/blog/content/en"
import { blogContentEs } from "../../src/app/[locale]/blog/content/es"
import type { BlogPost } from "../../src/app/[locale]/blog/content/types"

type Row = Record<string, unknown> & { id?: string | number | null }

const args = process.argv.slice(2)
const unknown = args.filter((arg) => arg !== "--dry-run")
if (unknown.length > 0) {
  // A typo like "--dry-run:" must never fall through to a real write.
  console.error(`Unknown argument(s): ${unknown.join(" ")}. Only --dry-run is supported.`)
  process.exit(1)
}
const dryRun = args.includes("--dry-run")

/** New values by position, on top of the existing row at that position. */
function mergeRows(existing: Row[] | null | undefined, next: Row[]): Row[] {
  return next.map((row, index) => {
    const current = existing?.[index]
    return current ? { ...current, ...row, id: current.id } : row
  })
}

function sectionRows(existing: Row[] | null | undefined, sections: BlogPost["sections"]): Row[] {
  return sections.map((section) => {
    const current = existing?.find((row) => row.id === section.id)
    return {
      ...(current ?? {}),
      id: section.id,
      title: section.title,
      body: mergeRows(current?.body as Row[], section.body.map((paragraph) => ({ paragraph }))),
      // Absent in this language: keep the rows (and the other language's text).
      checklist: section.checklist
        ? mergeRows(current?.checklist as Row[], section.checklist.map((item) => ({ item })))
        : (current?.checklist ?? []),
      links: section.links
        ? mergeRows(
            current?.links as Row[],
            section.links.map((link) => ({ before: link.before, label: link.label, href: link.href, after: link.after ?? null })),
          )
        : (current?.links ?? []),
    }
  })
}

async function main() {
  const payload = await getPayload({ config })
  let failures = 0

  // ES first creates any rows only ES has (checklists, links); EN then reuses them.
  for (const [locale, content] of [["es", blogContentEs], ["en", blogContentEn]] as const) {
    for (const post of content.posts) {
      const found = await payload.find({
        collection: "blogPosts",
        locale,
        fallbackLocale: false,
        where: { slug: { equals: post.slug } },
        depth: 0,
        limit: 1,
      })
      const doc = found.docs[0] as unknown as Row | undefined
      if (!doc) {
        console.error(`✗ ${locale} ${post.slug}: not found in Payload (run the migrations first?)`)
        failures++
        continue
      }

      const data = {
        title: post.title,
        excerpt: post.excerpt,
        seo: { ...((doc.seo as Row) ?? {}), title: post.seo?.title ?? null, description: post.seo?.description ?? null },
        intro: mergeRows(doc.intro as Row[], post.intro.map((paragraph) => ({ paragraph }))),
        takeaways: mergeRows(doc.takeaways as Row[], post.takeaways.map((item) => ({ item }))),
        sections: sectionRows(doc.sections as Row[], post.sections),
        faqs: mergeRows(doc.faqs as Row[], post.faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))),
        cta: {
          heading: post.cta?.heading ?? null,
          label: post.cta?.label ?? null,
          href: post.cta?.href ?? null,
        },
        _status: "published" as const,
      }

      if (dryRun) {
        console.log(`• ${locale} ${post.slug}: would update (id ${doc.id}), ${post.sections.length} sections`)
        continue
      }

      await payload.update({
        collection: "blogPosts",
        id: doc.id as number,
        locale,
        data: data as never,
        depth: 0,
      })
      console.log(`✓ ${locale} ${post.slug}`)
    }
  }

  process.exit(failures > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
