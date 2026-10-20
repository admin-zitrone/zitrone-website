import { expect, test, type Page } from "@playwright/test"

import { routing } from "@/i18n/routing"
import { getServiceTargets } from "@/app/[locale]/services/service-targets"
import {
  getBlogAuthorPath,
  getBlogCategoryPath,
  getBlogContent,
  getBlogReviewerPath,
} from "@/app/[locale]/blog/articles"
import { CONSENT_COOKIE, CONSENT_VERSION } from "@/lib/consent/config"

/**
 * Visual baselines.
 *
 * These exist to make CSS deletion safe. `marketing.css` is ~15k lines with
 * hundreds of selectors defined in more than one file, so reading a rule tells
 * you very little about whether anything still depends on it. The only reliable
 * check is to photograph every page type, change the CSS, and re-photograph.
 *
 * A failure here is not automatically a bug: it means the page moved. Review
 * the diff Playwright writes to `test-results/`, and if the change was the
 * point, re-record with `npm run test:visual:update`.
 *
 * Routes are derived from the same content sources the pages render from, so a
 * new service or article joins the baseline set on its own rather than
 * silently going uncovered.
 */

type Route = { name: string; path: string }

/** Every page type, per locale, named so the snapshot files stay readable. */
function routesFor(locale: string): Route[] {
  const { posts, categories } = getBlogContent(locale)
  const post = posts[0]
  // categories[0] is the "all" pseudo-category the index uses as its default.
  const category = categories[1]
  // Posts carry an author only when Payload resolves one; the pages fall back
  // to the locale's default byline, so derive the same way the routes do.
  const { article } = getBlogContent(locale)
  const author = posts.find((item) => item.authorName)?.authorName ?? article.authorName
  const reviewer =
    posts.find((item) => item.reviewedByName)?.reviewedByName ?? article.reviewedByName

  const routes: Route[] = [
    { name: "home", path: `/${locale}` },
    { name: "services-index", path: `/${locale}/services` },
    { name: "blog-index", path: `/${locale}/blog` },
    { name: "contact", path: `/${locale}/contact` },
    { name: "privacy-notice", path: `/${locale}/privacy-notice` },
  ]

  for (const service of getServiceTargets(locale)) {
    routes.push({ name: `service-${service.slug}`, path: `/${locale}/services/${service.slug}` })
  }

  if (post) routes.push({ name: "blog-article", path: `/${locale}${post.href}` })
  if (category) {
    routes.push({ name: "blog-category", path: `/${locale}${getBlogCategoryPath(category)}` })
  }
  if (author) routes.push({ name: "blog-author", path: `/${locale}${getBlogAuthorPath(author)}` })
  if (reviewer) {
    routes.push({ name: "blog-reviewer", path: `/${locale}${getBlogReviewerPath(reviewer)}` })
  }

  return routes
}

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const

/**
 * Pre-answers the consent banner. Without this every screenshot is dominated by
 * the same overlay, and the pages underneath never get compared.
 */
async function acceptConsent(page: Page) {
  await page.context().addCookies([
    {
      name: CONSENT_COOKIE,
      value: encodeURIComponent(
        JSON.stringify({ analytics: "granted", marketing: "granted", v: CONSENT_VERSION }),
      ),
      url: "http://127.0.0.1:3100",
    },
  ])
}

/**
 * Walks the page to the bottom and back.
 *
 * A full-page screenshot does not scroll, so anything waiting on an
 * IntersectionObserver — lazy images, reveal animations — would be captured in
 * its unloaded state. Scrolling first forces that work to happen.
 */
async function settle(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 40)))
    }
    window.scrollTo(0, 0)
  })

  // Reveal-on-scroll leaves elements at opacity 0 until observed. Pin them all
  // to their resting state so a baseline never depends on observer timing.
  await page.evaluate(() => {
    for (const element of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      element.dataset.revealState = "visible"
    }
  })

  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        caret-color: transparent !important;
      }
      [data-reveal] { opacity: 1 !important; transform: none !important; filter: none !important; }
    `,
  })

  await page.evaluate(() => document.fonts.ready)
  await page.waitForLoadState("networkidle")

  // Long mobile pages keep growing for a moment after networkidle as late
  // images take their final height. A full-page screenshot taken mid-growth
  // never matches the next one, so hold until the document stops moving.
  await page.waitForFunction(
    () => {
      const w = window as unknown as { __lastHeight?: number; __stableFor?: number }
      const height = document.documentElement.scrollHeight
      if (height === w.__lastHeight) {
        w.__stableFor = (w.__stableFor ?? 0) + 1
      } else {
        w.__lastHeight = height
        w.__stableFor = 0
      }
      return (w.__stableFor ?? 0) >= 5
    },
    null,
    { polling: 100, timeout: 15_000 },
  )
}

for (const viewport of VIEWPORTS) {
  test.describe(`visual — ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    for (const locale of routing.locales) {
      for (const route of routesFor(locale)) {
        test(`${locale} ${route.name}`, async ({ page }) => {
          // Every autoplaying element on the site (hero rotator, outcomes
          // carousel, service showcase, system/stories tabs) checks this query
          // and stands still when it is set. Without it the home page never
          // holds a frame long enough to photograph twice identically.
          await page.emulateMedia({ reducedMotion: "reduce" })
          await acceptConsent(page)
          await page.goto(route.path)
          await settle(page)

          await expect(page).toHaveScreenshot(`${locale}-${route.name}-${viewport.name}.png`, {
            fullPage: true,
            animations: "disabled",
            // Sub-pixel text rendering and image resampling differ by a hair
            // between runs; this is tight enough to catch a shifted element and
            // loose enough not to cry about a rounding difference.
            maxDiffPixelRatio: 0.002,
            timeout: 20_000,
          })
        })
      }
    }
  })
}
