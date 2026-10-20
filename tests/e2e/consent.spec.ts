import { expect, test } from "./fixtures/isolated"

/**
 * Consent Mode v2 behaviour.
 *
 * These assert the two things that actually matter legally and are invisible
 * to the eye: that the defaults land before the container is told to start,
 * and that a rejection reaches Google as a real `consent update` rather than
 * just hiding the banner.
 */

type ConsentCall = [string, string, Record<string, unknown>]

/** Pulls the consent-related dataLayer entries back out of the page. */
async function consentCalls(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const layer = (window as unknown as { dataLayer?: IArguments[] }).dataLayer ?? []
    return layer
      .map((entry) => Array.from(entry as unknown as ArrayLike<unknown>))
      .filter((args) => args[0] === "consent") as ConsentCall[]
  })
}

test.describe("consent", () => {
  test("declares denied defaults for the EEA before anything starts", async ({ page }) => {
    await page.goto("/en")

    const calls = await consentCalls(page)
    const defaults = calls.filter((c) => c[1] === "default")

    expect(defaults.length, "both a regional and a global default must be set").toBe(2)

    const regional = defaults.find((c) => Array.isArray(c[2].region))
    expect(regional, "no region-scoped default was emitted").toBeTruthy()
    expect(regional![2].region).toContain("DE")
    expect(regional![2].region).toContain("GB")
    expect(regional![2].ad_storage).toBe("denied")
    expect(regional![2].analytics_storage).toBe("denied")
    expect(regional![2].ad_user_data).toBe("denied")
    expect(regional![2].security_storage).toBe("granted")

    const global = defaults.find((c) => !Array.isArray(c[2].region))
    expect(global![2].analytics_storage).toBe("granted")

    // The whole mechanism depends on this ordering: a default that lands
    // after the container has started gates nothing. Compare positions in the
    // dataLayer itself rather than in a serialisation of it — `gtm.start` is
    // pushed as a plain object, not as a gtag argument list.
    const order = await page.evaluate(() => {
      const layer = (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []
      const isConsent = (entry: unknown) =>
        typeof entry === "object" &&
        entry !== null &&
        "0" in (entry as Record<string, unknown>) &&
        (entry as Record<string, unknown>)["0"] === "consent"
      const isStart = (entry: unknown) =>
        typeof entry === "object" &&
        entry !== null &&
        "gtm.start" in (entry as Record<string, unknown>)

      return {
        firstConsent: layer.findIndex(isConsent),
        start: layer.findIndex(isStart),
      }
    })

    expect(order.firstConsent, "no consent call reached the dataLayer").toBeGreaterThan(-1)
    expect(order.start, "gtm.start was never pushed").toBeGreaterThan(-1)
    expect(
      order.firstConsent,
      "consent defaults must precede gtm.start, or the tags fire ungated",
    ).toBeLessThan(order.start)
  })

  test("shows the banner to a first-time visitor and records a rejection", async ({ page }) => {
    await page.goto("/en")

    const banner = page.getByRole("dialog", { name: /cookie preferences/i })
    await expect(banner).toBeVisible()

    // Reject must be present and no harder to reach than accept.
    const reject = banner.getByRole("button", { name: "Reject all" })
    const accept = banner.getByRole("button", { name: "Accept all" })
    await expect(reject).toBeVisible()
    await expect(accept).toBeVisible()

    await reject.click()
    await expect(banner).toBeHidden()

    const updates = (await consentCalls(page)).filter((c) => c[1] === "update")
    expect(updates.length, "rejecting must send a consent update, not just hide the UI").toBe(1)
    expect(updates[0][2].ad_storage).toBe("denied")
    expect(updates[0][2].ad_user_data).toBe("denied")
    expect(updates[0][2].analytics_storage).toBe("denied")
    expect(updates[0][2].security_storage).toBe("granted")

    const cookie = (await page.context().cookies()).find((c) => c.name === "zitrone_consent")
    expect(cookie, "the decision must persist").toBeTruthy()
    expect(decodeURIComponent(cookie!.value)).toContain('"marketing":"denied"')
  })

  test("does not ask again on the next visit, and replays the stored choice", async ({ page }) => {
    await page.goto("/en")
    await page.getByRole("button", { name: "Accept all" }).click()
    await expect(page.getByRole("dialog", { name: /cookie preferences/i })).toBeHidden()

    await page.goto("/en")
    await expect(page.getByRole("dialog", { name: /cookie preferences/i })).toBeHidden()

    // The bootstrap should replay the stored choice as an update on load.
    const updates = (await consentCalls(page)).filter((c) => c[1] === "update")
    expect(updates.length).toBe(1)
    expect(updates[0][2].analytics_storage).toBe("granted")
  })

  test("category choices are honoured independently", async ({ page }) => {
    await page.goto("/en")

    const banner = page.getByRole("dialog", { name: /cookie preferences/i })
    await banner.getByRole("button", { name: "Choose by category" }).click()

    // Turn advertising off, leave measurement on.
    await banner.getByRole("switch").nth(1).click()
    await banner.getByRole("button", { name: "Save", exact: true }).click()

    const updates = (await consentCalls(page)).filter((c) => c[1] === "update")
    const last = updates[updates.length - 1]
    expect(last[2].analytics_storage).toBe("granted")
    expect(last[2].ad_storage).toBe("denied")
    expect(last[2].ad_user_data, "Enhanced Conversions must follow marketing consent").toBe("denied")
  })

  test("the footer link reopens preferences after a decision", async ({ page }) => {
    await page.goto("/en")
    await page.getByRole("button", { name: "Accept all" }).click()

    const banner = page.getByRole("dialog", { name: /cookie preferences/i })
    await expect(banner).toBeHidden()

    // The footer is sticky behind the page shell and only uncovered at the end
    // of the page. Its links already measure as in the viewport, so Playwright
    // does not scroll to them and a click from the top lands on the content
    // above. Scroll to the end first, as a visitor has to.
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await page.getByRole("button", { name: "Cookie preferences" }).click()
    await expect(banner).toBeVisible()
    await expect(banner.getByRole("switch").first()).toBeVisible()
  })

  test("keyboard focus in the footer is never hidden behind the page", async ({ page }) => {
    await page.goto("/en")
    await page.getByRole("button", { name: "Accept all" }).click()

    const reopen = page.getByRole("button", { name: "Cookie preferences" })
    // Tab from the top of the page to the last footer control, checking every
    // footer stop on the way (WCAG 2.4.11, focus not obscured).
    for (let presses = 0; presses < 400; presses++) {
      await page.keyboard.press("Tab")
      const stop = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        if (!el?.closest("footer")) return null
        const r = el.getBoundingClientRect()
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
        return { label: el.textContent?.trim() ?? "", visible: !!hit && (hit === el || el.contains(hit)) }
      })
      if (!stop) continue
      expect(stop.visible, `footer control "${stop.label}" is covered while focused`).toBe(true)
      if (await reopen.evaluate((el) => el === document.activeElement)) break
    }
    await expect(reopen).toBeFocused()

    await page.keyboard.press("Enter")
    await expect(page.getByRole("dialog", { name: /cookie preferences/i })).toBeVisible()
  })

  test("the Spanish banner is translated, not falling back to English", async ({ page }) => {
    await page.goto("/es")

    const banner = page.getByRole("dialog", { name: /preferencias de cookies/i })
    await expect(banner).toBeVisible()
    await expect(banner.getByRole("button", { name: "Rechazar todo" })).toBeVisible()
    await expect(banner.getByRole("button", { name: "Aceptar todo" })).toBeVisible()
  })
})
