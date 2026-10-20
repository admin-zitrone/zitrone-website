import { expect, test } from "./fixtures/isolated"
import { leadConversions, PII_SAMPLES, CLICK_ONLY_KEYS, mergedAtConversions } from "./fixtures/conversions"
import { getHomeContent } from "../../src/app/_components/home/home-data"
import { getLocationContent } from "../../src/app/lib/inquiry-locations"

for (const locale of ["es", "en"] as const) {
  test(`${locale}: home submits complete brief and retains it after failure`, async ({ page }) => {
    const bodies: Record<string, string>[] = []
    await page.route("**/api/contact-request", async route => {
      bodies.push(route.request().postDataJSON())
      await route.fulfill({ status: bodies.length === 1 ? 502 : 201,
        json: bodies.length === 1 ? { ok: false } : { ok: true, requestId: "ZC-HOME-TEST" } })
    })
    await page.context().addCookies([{
      name: "zitrone_consent", value: encodeURIComponent(JSON.stringify({ analytics: "denied", marketing: "denied", v: 1 })),
      domain: "127.0.0.1", path: "/",
    }])
    const labels = getHomeContent(locale).componentLabels.profiler
    const location = getLocationContent(locale)
    await page.goto(`/${locale}#profiler`)
    const scope = page.locator("#profiler")
    const next = scope.getByRole("button", { name: labels.continueLabel, exact: true })
    await scope.getByRole("button", { name: labels.startLabel, exact: true }).click()
    await next.click()
    await scope.getByRole("combobox", { name: location.region, exact: true }).selectOption("cdmx")
    await scope.getByRole("combobox", { name: location.borough, exact: true }).selectOption("Miguel Hidalgo")
    await next.click()
    await next.click()
    await scope.getByRole("button", { name: labels.shifts[0].label, exact: true }).click()
    await next.click()
    await scope.getByRole("group", { name: labels.food.tierAria, exact: true }).getByRole("button").first().click()
    await expect(scope.getByRole("group", { name: labels.food.extrasLabel, exact: true })).toBeVisible()
    await next.click()
    await scope.getByRole("group", { name: labels.space.facilityAria, exact: true }).getByRole("button").last().click()
    await scope.getByRole("checkbox", { name: labels.terms.budgetOptOut, exact: true }).check()
    await next.click()
    await scope.getByRole("group", { name: labels.terms.subsidizedAria, exact: true })
      .getByRole("button", { name: labels.subsidizedOptions.find(item => item.id === "no")!.label, exact: true }).click()
    await scope.getByRole("textbox", { name: labels.start.nameLabel, exact: true }).fill("Local QA")
    await scope.getByRole("textbox", { name: labels.start.emailLabel, exact: true }).fill("qa@example.invalid")
    await next.click()
    await scope.getByRole("textbox", { name: labels.start.notesLabel, exact: true }).fill("Mocked home email integration test")
    const submit = scope.getByRole("button", { name: labels.start.submit, exact: true })
    await submit.click()
    await expect(scope.getByRole("alert")).toHaveText(labels.start.sendError)
    await submit.click()
    await expect(scope.locator(".semantic-profiler-result")).toBeVisible()
    expect(bodies).toHaveLength(2)
    expect(bodies[0]).toEqual(bodies[1])
    expect(bodies[1].sourcePath).toBe(`/${locale}`)
    expect(bodies[1].message).toContain("Mocked home email integration test")
    expect(bodies[1].message).toContain("Miguel Hidalgo")
    expect(bodies[1].email).toBe("qa@example.invalid")

    // Same funnel as /contact so GTM measures both forms with one trigger.
    const events = await page.evaluate(() =>
      (window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer
        ?.filter((entry) => typeof entry.event === "string" && String(entry.event).startsWith("contact_"))
        .map((entry) => [entry.event, entry.form, entry.code ?? null]) ?? [],
    )
    expect(events).toEqual([
      ["contact_form_viewed", "profiler", null],
      ["contact_form_submit_attempt", "profiler", null],
      ["contact_request_delivery_error", "profiler", "HTTP_502"],
      ["contact_form_submit_attempt", "profiler", null],
      ["contact_request_accepted", "profiler", null],
    ])

    const conversions = await leadConversions(page)
    expect(conversions).toHaveLength(1)
    expect(conversions[0]).toMatchObject({ form_id: "profiler", lead_id: "ZC-HOME-TEST", language: locale })
    for (const sample of PII_SAMPLES) expect(JSON.stringify(conversions[0])).not.toContain(sample)

    // What GTM's GA4 tag would read at that moment: nothing left over from the
    // clicks that led here.
    const [state] = await mergedAtConversions(page)
    for (const key of CLICK_ONLY_KEYS) expect(state[key], key).toBe("(undefined)")
  })
}
