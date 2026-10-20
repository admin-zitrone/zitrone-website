import type { Page } from "@playwright/test"

import { expect, test } from "./fixtures/isolated"

/**
 * What GA4 would see on this site, without Google receiving anything.
 *
 * The isolated fixture aborts every request off 127.0.0.1, so these tests read
 * the page itself: whether the container loader exists at all, and what the
 * browser history does on each kind of navigation. GA4's automatic page views
 * for a client-rendered site come from those history changes (Enhanced
 * Measurement → "page changes based on browser history events"), so one URL
 * change per navigation, with the right URL and title, is the precondition
 * for one page_view per navigation. Real receipt still needs DebugView.
 */

test.describe("measurement isolation", () => {
  test("a non-production build never asks for the container, but keeps the dataLayer", async ({ page }) => {
    const google: string[] = []
    page.on("request", (request) => {
      if (/googletagmanager|google-analytics|doubleclick|googleadservices/.test(request.url())) {
        google.push(request.url())
      }
    })

    await page.goto("/en")
    await page.waitForLoadState("load")
    // next/script runs `lazyOnload` scripts on idle after load; give it a beat.
    await page.waitForTimeout(1500)

    expect(google, "the test server is not production and must not request Google").toEqual([])
    expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0)
    expect(await page.locator("script#gtm-container").count()).toBe(0)
    expect(await page.evaluate(() => (window as unknown as { __zitroneGtm?: string }).__zitroneGtm)).toBeUndefined()

    const layer = await page.evaluate(() => (window as unknown as { dataLayer?: unknown[] }).dataLayer?.length ?? 0)
    expect(layer, "the dataLayer and consent defaults stay available for tests").toBeGreaterThan(2)
  })
})

/* ── Consent: changing a decision ────────────────────────────── */

type ConsentCall = [string, string, Record<string, unknown>]

async function consentUpdates(page: Page) {
  return page.evaluate(() => {
    const layer = (window as unknown as { dataLayer?: IArguments[] }).dataLayer ?? []
    return layer
      .map((entry) => Array.from(entry as unknown as ArrayLike<unknown>))
      .filter((args) => args[0] === "consent" && args[1] === "update") as ConsentCall[]
  })
}

async function storedConsent(page: Page) {
  const cookie = (await page.context().cookies()).find((c) => c.name === "zitrone_consent")
  return cookie ? JSON.parse(decodeURIComponent(cookie.value)) : null
}

/** Reopens the panel from the footer link, as a visitor at the end of the page would. */
async function reopenPreferences(page: Page) {
  const link = page.getByRole("button", { name: /Cookie preferences|Preferencias de cookies/ })
  await link.scrollIntoViewIfNeeded()
  // The footer sits behind the page shell until the end of the page (see
  // consent.spec.ts); activate the control by keyboard, which needs no hit test.
  await link.focus()
  await page.keyboard.press("Enter")
  const banner = page.getByRole("dialog", { name: /cookie/i })
  await expect(banner).toBeVisible()
  return banner
}

test.describe("consent decisions can be changed", () => {
  test("accept, then withdraw everything: Google is told and the change persists", async ({ page }) => {
    await page.goto("/en")
    await page.getByRole("button", { name: "Accept all" }).click()
    expect(await storedConsent(page)).toMatchObject({ analytics: "granted", marketing: "granted" })

    const banner = await reopenPreferences(page)
    // The reopened panel shows the stored decision, not a default.
    const switches = banner.getByRole("switch")
    await expect(switches.nth(0)).toHaveAttribute("aria-checked", "true")
    await expect(switches.nth(1)).toHaveAttribute("aria-checked", "true")

    await banner.getByRole("button", { name: "Reject all" }).click()
    await expect(banner).toBeHidden()

    const updates = await consentUpdates(page)
    const last = updates[updates.length - 1][2]
    expect(last.analytics_storage).toBe("denied")
    expect(last.ad_storage).toBe("denied")
    expect(last.ad_user_data).toBe("denied")
    expect(await storedConsent(page)).toMatchObject({ analytics: "denied", marketing: "denied" })

    // Next page load: no banner, and the bootstrap replays the new decision.
    await page.goto("/es")
    await expect(page.getByRole("dialog", { name: /cookie/i })).toBeHidden()
    const replay = await consentUpdates(page)
    expect(replay).toHaveLength(1)
    expect(replay[0][2].analytics_storage).toBe("denied")
    expect(replay[0][2].ad_storage).toBe("denied")
  })

  test("reject, then grant measurement only: advertising stays denied", async ({ page }) => {
    await page.goto("/es")
    await page.getByRole("button", { name: "Rechazar todo" }).click()

    const banner = await reopenPreferences(page)
    const switches = banner.getByRole("switch")
    await expect(switches.nth(0)).toHaveAttribute("aria-checked", "false")
    await expect(switches.nth(1)).toHaveAttribute("aria-checked", "false")

    await switches.nth(0).click()
    await banner.getByRole("button", { name: "Guardar", exact: true }).click()
    await expect(banner).toBeHidden()

    const last = (await consentUpdates(page)).at(-1)![2]
    expect(last.analytics_storage).toBe("granted")
    expect(last.ad_storage).toBe("denied")
    expect(last.ad_user_data).toBe("denied")
    expect(last.ad_personalization).toBe("denied")
    expect(await storedConsent(page)).toMatchObject({ analytics: "granted", marketing: "denied" })

    await page.reload()
    const replay = await consentUpdates(page)
    expect(replay).toHaveLength(1)
    expect(replay[0][2]).toMatchObject({ analytics_storage: "granted", ad_storage: "denied" })
  })

  test("closing a reopened panel without saving keeps the earlier decision", async ({ page }) => {
    await page.goto("/en")
    await page.getByRole("button", { name: "Reject all" }).click()
    const before = (await consentUpdates(page)).length

    const banner = await reopenPreferences(page)
    await banner.getByRole("switch").nth(0).click()
    await page.keyboard.press("Escape")
    await expect(banner).toBeHidden()

    expect(await consentUpdates(page), "dismissing is not a new decision").toHaveLength(before)
    expect(await storedConsent(page)).toMatchObject({ analytics: "denied", marketing: "denied" })
  })
})

/* ── Navigation and page views ───────────────────────────────── */

type HistoryEntry = { kind: string; url: string; title: string }

/** Records every history change with the URL and title at that instant. */
async function recordHistory(page: Page) {
  await page.addInitScript(() => {
    const log: Array<{ kind: string; url: string; title: string }> = []
    ;(window as unknown as { __history: typeof log }).__history = log
    let last = location.href
    const note = (kind: string) => {
      if (location.href === last) return // same URL: GA4 sends no page view
      last = location.href
      log.push({ kind, url: location.pathname + location.search, title: document.title })
    }
    for (const method of ["pushState", "replaceState"] as const) {
      const original = history[method].bind(history)
      history[method] = (...args: Parameters<History["pushState"]>) => {
        original(...args)
        note(method)
      }
    }
    window.addEventListener("popstate", () => note("popstate"))
  })
}

const historyLog = (page: Page) =>
  page.evaluate(() => (window as unknown as { __history: HistoryEntry[] }).__history.slice())

/** Clicks an in-page link and waits until the URL and the new title have settled. */
async function navigate(page: Page, selector: string, path: RegExp) {
  await page.locator(selector).first().evaluate((el) => (el as HTMLElement).click())
  await page.waitForURL(path)
  await page.waitForFunction(() => document.readyState === "complete")
}

test("each navigation is one URL change; the title is recorded for DebugView comparison", async ({ page }, testInfo) => {
  await recordHistory(page)

  await page.goto("/en")
  const homeTitle = await page.title()
  expect(await historyLog(page), "direct entry is a page load, not a history change").toEqual([])

  const service = 'a[href="/en/services/corporate-dining"]'
  await navigate(page, service, /\/en\/services\/corporate-dining$/)
  await expect.poll(() => page.title()).not.toBe(homeTitle)
  const serviceTitle = await page.title()

  await page.goBack()
  await page.waitForURL(/\/en$/)
  await expect.poll(() => page.title()).toBe(homeTitle)

  await page.goForward()
  await page.waitForURL(/\/en\/services\/corporate-dining$/)
  await expect.poll(() => page.title()).toBe(serviceTitle)

  // Language switch from the footer menu: a client-side navigation to the
  // localized slug, not a reload.
  await navigate(page, 'a[role="menuitem"][hreflang="es"]', /\/es\/services\/[^/]+$/)
  await expect.poll(() => page.title()).not.toBe(serviceTitle)
  const esPath = new URL(page.url()).pathname
  const esTitle = await page.title()

  // A CTA link with its internal ?src= slug.
  await navigate(page, 'a[href="/es/contact?src=nav"]', /\/es\/contact\?src=nav$/)
  await expect.poll(() => page.title()).not.toBe(esTitle)
  const contactTitle = await page.title()

  const log = await historyLog(page)
  await testInfo.attach("history.json", {
    body: JSON.stringify({ homeTitle, serviceTitle, esTitle, contactTitle, log }, null, 2),
    contentType: "application/json",
  })

  expect(log.map((entry) => [entry.kind, entry.url])).toEqual([
    ["pushState", "/en/services/corporate-dining"],
    ["popstate", "/en"],
    ["popstate", "/en/services/corporate-dining"],
    ["pushState", esPath],
    ["pushState", "/es/contact?src=nav"],
  ])
})
