/**
 * A CMS that cannot be reached is an error, not "nothing is published"
 * (audit A-04). Each loader runs in a fresh child process whose DATABASE_URL
 * points at a closed local port (Payload caches a failed init per process),
 * so no database is touched.
 */
import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import { test } from "node:test"
import { promisify } from "node:util"

const run = promisify(execFile)

const UNREACHABLE = "postgres://nobody:nothing@127.0.0.1:9/unreachable_api_test"

async function loadDuringOutage(loader: string, ...args: string[]) {
  const { stdout } = await run("npx", ["tsx", "tests/api/fixtures/load-blog.ts", loader, ...args], {
    env: { ...process.env, DATABASE_URL: UNREACHABLE, BLOG_CONTENT_SOURCE: "" },
    timeout: 90_000,
  })
  // Payload's logger can flush a multi-line error after the marker, so pick
  // the fixture's own line rather than the last one.
  return stdout
    .split("\n")
    .filter((line) => /^(REJECTED|RESOLVED:|SOURCE:)/.test(line))
    .at(-1)
}

for (const [loader, ...args] of [
  ["getResolvedBlogPosts", "es"],
  ["getResolvedBlogPost", "es", "comida-en-la-oficina-y-retencion-de-talento"],
  ["getAllResolvedBlogSlugs", "es"],
]) {
  test(`CMS down: ${loader} throws instead of serving the static files`, async () => {
    assert.equal(await loadDuringOutage(loader, ...args), "REJECTED")
  })
}

test("without a CMS configured the committed articles are the blog (local development)", async () => {
  const previous = process.env.BLOG_CONTENT_SOURCE
  process.env.BLOG_CONTENT_SOURCE = "static"
  try {
    const loaders = await import("../../src/payload/loaders/blog")
    const { getBlogContent } = await import("../../src/app/[locale]/blog/articles")
    assert.equal(loaders.getBlogContentSource(), "static")
    const posts = await loaders.getResolvedBlogPosts("es")
    assert.deepEqual(posts.map((post) => post.slug), getBlogContent("es").posts.map((post) => post.slug))
  } finally {
    process.env.BLOG_CONTENT_SOURCE = previous
  }
})
