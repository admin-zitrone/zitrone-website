import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'
// Isolated: a production build loads the client's live GTM container, so no
// request may leave 127.0.0.1 during the scan.
import { expect, test } from './fixtures/isolated'

/* Automated accessibility gate.
 *
 * Scope: WCAG 2.2 A + AA. Axe verifies roughly a third of the success
 * criteria mechanically; the rest (focus order, meaningful alt text, error
 * recovery) is covered by the behavioural tests below and by the manual pass
 * documented in docs/accessibility.md. A green run here is a floor, not a
 * certificate. */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

/** One representative page per template, in both locales where copy differs. */
const ROUTES = [
  { name: 'home (en)', path: '/en' },
  { name: 'home (es)', path: '/es' },
  { name: 'services index', path: '/en/services' },
  { name: 'service detail', path: '/en/services/corporate-dining' },
  { name: 'blog index', path: '/en/blog' },
  { name: 'blog article', path: '/en/blog/workplace-food-program-that-works' },
  { name: 'privacy notice', path: '/es/privacy-notice' },
] as const

/** Renders a violation list as something a human can act on from CI logs. */
function formatViolations(violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']) {
  return violations
    .map((violation) => {
      const nodes = violation.nodes
        .slice(0, 5)
        .map(
          (node) =>
            `      - ${node.target.join(' ')}\n        ${node.failureSummary?.replace(/\n/g, '\n        ')}`,
        )
        .join('\n')
      return `  [${violation.impact}] ${violation.id}: ${violation.help}\n    ${violation.helpUrl}\n${nodes}`
    })
    .join('\n\n')
}

/* Documented contrast exception (docs/accessibility.md, 2026-09-23): the
 * serif-italic accent word inside headings is one brand green, lime-500, on
 * every surface. On light sections it measures 2.1-2.25:1, below the 3:1
 * large-text minimum, by brand decision. Only `color-contrast` findings on
 * these elements are dropped; every other rule still runs on them, and
 * contrast is still checked everywhere else. */
const ACCENT_CONTRAST_EXCEPTION = [
  '.ds-heading-accent',
  '.ds-heading em',
  '.ds-heading strong',
  '.ds-operating-intro-title-accent',
  '.ds-service-spotlight-title em',
].join(', ')

async function scan(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()

  for (const violation of results.violations) {
    if (violation.id !== 'color-contrast') continue
    const kept = []
    for (const node of violation.nodes) {
      const isAccent = await page
        .locator(node.target.join(' '))
        .first()
        .evaluate((el, selector) => el.matches(selector), ACCENT_CONTRAST_EXCEPTION)
        .catch(() => false)
      if (!isAccent) kept.push(node)
    }
    violation.nodes = kept
  }
  results.violations = results.violations.filter((violation) => violation.nodes.length > 0)
  return results
}

/* The consent banner is a focus-trapping modal on first visit: while it is up
 * it is legitimately the only thing reachable, so it would hide every issue on
 * the page behind it and make the tab-order tests meaningless.
 *
 * It is dismissed by seeding the cookie the banner itself writes, before the
 * page loads, rather than by clicking through the UI. Clicking is a race — the
 * banner mounts on the client, so a check that runs first sees nothing, skips,
 * and the banner then appears mid-test. The banner has its own coverage in
 * consent.spec.ts. */
/* Scroll reveals fade content in from opacity 0. Axe samples whatever the
 * compositor shows at that instant, so scanning a page mid-reveal reports
 * "1.03:1" for text that is simply not finished appearing — a real flake, not
 * a real defect.
 *
 * Emulating reduced motion collapses every reveal to its end state
 * immediately (see the global rule in globals.css), which makes the scan
 * deterministic and audits exactly the colours a settled page shows. */
async function settleMotion(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
}

async function seedConsent(page: Page) {
  const value = encodeURIComponent(
    JSON.stringify({ analytics: 'granted', marketing: 'granted', v: 1 }),
  )
  await page.context().addCookies([
    {
      name: 'zitrone_consent',
      value,
      domain: '127.0.0.1',
      path: '/',
    },
  ])
}

test.describe('axe: WCAG 2.2 AA', () => {
  for (const route of ROUTES) {
    test(`${route.name} has no automatically detectable violations`, async ({ page }) => {
      await seedConsent(page)
      await settleMotion(page)
      await page.goto(route.path)
      const results = await scan(page)

      expect(
        results.violations,
        `\n${results.violations.length} violation(s) on ${route.path}:\n\n${formatViolations(results.violations)}\n`,
      ).toEqual([])
    })
  }

  test('home stays clean at 320px, the WCAG reflow width', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 })
    await seedConsent(page)
    await settleMotion(page)
    await page.goto('/en')
    const results = await scan(page)

    expect(
      results.violations,
      `\n${results.violations.length} violation(s) at 320px:\n\n${formatViolations(results.violations)}\n`,
    ).toEqual([])
  })

  test('mobile navigation panel is clean while open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await seedConsent(page)
    await settleMotion(page)
    await page.goto('/en')

    const toggle = page.getByRole('button', { name: /menu|menú/i }).first()
    await toggle.click()

    // The panel fades in over 180ms. Scanning before it settles samples
    // mid-transition colours and reports contrast failures that do not exist
    // in any state the user actually sees.
    const panel = page.locator('#site-nav-menu-panel')
    await expect(panel).toHaveCSS('opacity', '1')

    const results = await scan(page)
    expect(
      results.violations,
      `\n${results.violations.length} violation(s) with the menu open:\n\n${formatViolations(results.violations)}\n`,
    ).toEqual([])
  })
})

test.describe('structure', () => {
  for (const route of ROUTES) {
    test(`${route.name} exposes one main landmark and one h1`, async ({ page }) => {
      await page.goto(route.path)
      await expect(page.getByRole('main')).toHaveCount(1)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    })
  }

  test('every page declares its language', async ({ page }) => {
    await page.goto('/es')
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await page.goto('/en')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })
})

test.describe('keyboard', () => {
  test('a skip link is the first stop and jumps to main content', async ({ page }) => {
    await seedConsent(page)
    await settleMotion(page)
    await page.goto('/en')

    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: /skip to (main )?content/i })
    await expect(skip).toBeFocused()
    // Visible on focus: a skip link nobody can see is a skip link nobody uses.
    await expect(skip).toBeVisible()

    await page.keyboard.press('Enter')
    await expect(page.locator('#main-content')).toBeFocused()
  })

  test('the services menu opens, closes on Escape and returns focus', async ({ page }) => {
    await seedConsent(page)
    await settleMotion(page)
    await page.goto('/en')

    // Both the desktop nav and the mobile accordion expose a "Services"
    // button; this test is about the desktop dropdown.
    const trigger = page.locator('.ds-nav-caladan__dropdown-trigger').first()

    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()
  })

  test('every control reachable by keyboard shows a visible focus ring', async ({ page }) => {
    await seedConsent(page)
    await settleMotion(page)
    await page.goto('/en')

    /* Tab through the document rather than calling .focus() on each control:
     * `:focus-visible` is a heuristic, and Chromium does not necessarily apply
     * it to an element focused from script. Only real keyboard traversal
     * exercises the state a keyboard user actually sees.
     *
     * This also means only genuinely reachable controls are checked — the
     * closed nav panels are `inert`, so their contents are correctly skipped. */
    const offenders: string[] = []
    const seen = new Set<string>()

    for (let step = 0; step < 25; step += 1) {
      await page.keyboard.press('Tab')

      const result = await page.evaluate(() => {
        const node = document.activeElement as HTMLElement | null
        if (!node || node === document.body) return null

        const style = getComputedStyle(node)
        const outlineWidth = Number.parseFloat(style.outlineWidth)
        return {
          id: `${node.tagName.toLowerCase()}.${node.className || '(no class)'}`,
          focusVisible: node.matches(':focus-visible'),
          hasRing:
            (style.outlineStyle !== 'none' && outlineWidth > 0) ||
            (style.boxShadow !== 'none' && style.boxShadow !== ''),
        }
      })

      if (!result || seen.has(result.id)) continue
      seen.add(result.id)
      if (result.focusVisible && !result.hasRing) offenders.push(result.id)
    }

    expect(seen.size, 'no controls were reachable by keyboard').toBeGreaterThan(3)
    expect(offenders, `no visible focus indicator: ${offenders.join(', ')}`).toEqual([])
  })
})

test.describe('motion', () => {
  test('no element animates when the user asks for reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await seedConsent(page)
    await settleMotion(page)
    await page.goto('/en')

    const animated = await page.evaluate(() => {
      const offenders: string[] = []
      for (const node of Array.from(document.querySelectorAll<HTMLElement>('body *'))) {
        const style = getComputedStyle(node)
        const duration = (value: string) => value.split(',').some((part) => parseFloat(part) > 0.08)
        const infinite = style.animationIterationCount
          .split(',')
          .some((part) => part.trim() === 'infinite')
        if (infinite || (style.animationName !== 'none' && duration(style.animationDuration))) {
          offenders.push(
            `${node.tagName.toLowerCase()}.${node.className?.toString().split(' ')[0] ?? ''} (${style.animationName})`,
          )
        }
      }
      return Array.from(new Set(offenders)).slice(0, 20)
    })

    expect(animated, `animating under prefers-reduced-motion: ${animated.join(', ')}`).toEqual([])
  })
})
