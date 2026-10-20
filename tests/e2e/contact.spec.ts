import type { Page } from "@playwright/test"
import { expect, test } from "./fixtures/isolated"
import { scanSettled } from "./fixtures/axe"
import { leadConversions, PII_SAMPLES, CLICK_ONLY_KEYS, mergedAtConversions } from "./fixtures/conversions"
import { getHomeContent } from "../../src/app/_components/home/home-data"
import { getContactContent } from "../../src/app/lib/contact-content"
import { getLocationContent } from "../../src/app/lib/inquiry-locations"

async function reachContact(page: Page, locale: "es" | "en", subsidy: "yes" | "no" | "tbd", options: {
  services?: string[]
  onSchedule?: () => Promise<void>
} = {}) {
  const content = getContactContent(locale)
  const labels = getHomeContent(locale).componentLabels.profiler
  await page.context().addCookies([{
    name: "zitrone_consent",
    value: encodeURIComponent(JSON.stringify({ analytics: "denied", marketing: "denied", v: 1 })),
    domain: "127.0.0.1",
    path: "/",
  }])
  await page.goto(`/${locale}/contact`)
  const form = page.locator("form.ds-contact-form")
  for (const id of options.services ?? ["comedor"]) {
    const service = getHomeContent(locale).profilerServices.find((item) => item.id === id)!
    await form.getByRole("button", { name: service.title, exact: true }).click()
  }
  await form.getByRole("button", { name: content.next, exact: true }).click()
  const locationLabels = getLocationContent(locale)
  await form.getByRole("combobox", { name: locationLabels.region, exact: true }).selectOption("cdmx")
  await form.getByRole("combobox", { name: locationLabels.borough, exact: true }).selectOption("Miguel Hidalgo")
  await form.getByRole("button", { name: content.next, exact: true }).click()
  await expect(form.getByRole("heading", { name: content.form.steps.schedule.title })).toBeFocused()
  await form.getByRole("button", { name: labels.shifts[0].label, exact: true }).click()
  await options.onSchedule?.()
  await form.getByRole("button", { name: content.next, exact: true }).click()
  await form.getByRole("group", { name: content.form.menu, exact: true }).getByRole("button").first().click()
  await form.getByRole("group", { name: content.form.style, exact: true }).getByRole("button").first().click()
  // No extra service selected: a dining inquiry must still be able to proceed.
  await expect(form.getByRole("group", { name: content.form.extras }).locator('[aria-pressed="true"]')).toHaveCount(0)
  await form.getByRole("button", { name: content.next, exact: true }).click()
  await form.getByRole("group", { name: content.form.facility, exact: true }).getByRole("button").last().click()
  await form.getByRole("button", { name: content.next, exact: true }).click()
  // Change a prior "yes" answer to prove that hidden slider state is excluded.
  const support = form.getByRole("group", { name: content.form.subsidized, exact: true })
  await support.getByRole("button", { name: labels.subsidizedOptions.find((item) => item.id === "yes")!.label, exact: true }).click()
  await form.getByRole("slider", { name: content.form.subsidy, exact: true }).fill("0")
  await support.getByRole("button", { name: labels.subsidizedOptions.find((item) => item.id === subsidy)!.label, exact: true }).click()
  await form.getByRole("button", { name: content.next, exact: true }).click()
  return { form, content, labels }
}

for (const locale of ["es", "en"] as const) {
  test(`${locale}: optional details, accessible validation, failure and retry`, async ({ page }) => {
    if (locale === "es") await page.setViewportSize({ width: 390, height: 844 })
    const submissions: Record<string, string>[] = []
    await page.route("**/api/contact-request", async (route) => {
      submissions.push(route.request().postDataJSON())
      const attempt = submissions.length
      await route.fulfill({
        status: attempt === 1 ? 502 : attempt === 2 ? 422 : 201,
        json: attempt === 1 ? { ok: false } : attempt === 2
          ? { ok: false, errors: { email: "server validation" } }
          : { ok: true, requestId: "ZC-TEST-ONLY" },
      })
    })
    const { form, content, labels } = await reachContact(page, locale, "no")
    const send = form.getByRole("button", { name: content.form.submit, exact: true })
    await send.click()
    const name = form.getByRole("textbox", { name: content.form.name, exact: false }).first()
    const email = form.getByRole("textbox", { name: content.form.email, exact: false }).first()
    await expect(name).toBeFocused()
    await expect(name).toHaveAttribute("aria-invalid", "true")
    await expect(name).toHaveAccessibleDescription(content.nameError)
    expect(submissions).toHaveLength(0)
    await name.fill("Local QA")
    await email.fill("invalid")
    await send.click()
    await expect(email).toBeFocused()
    await expect(email).toHaveAccessibleDescription(content.emailError)
    expect(submissions).toHaveLength(0)
    await email.fill("website-qa@example.invalid")
    await send.click()
    await expect(form.getByRole("alert")).toHaveText(content.errorMessage)
    await expect(name).toHaveValue("Local QA")
    await expect(email).toHaveValue("website-qa@example.invalid")
    expect(submissions).toHaveLength(1)
    expect(submissions[0].message).not.toContain(`${labels.terms.subsidyLabel}:`)
    expect(submissions[0].message).not.toContain(`${labels.food.extrasLabel}:`)
    await send.click()
    await expect(email).toBeFocused()
    await expect(email).toHaveAccessibleDescription(content.emailError)
    const axe = await scanSettled(page, "form.ds-contact-form")
    expect(axe.violations).toEqual([])
    await send.click()
    await expect(page.getByRole("heading", { name: content.successTitle, exact: true })).toBeFocused()
    await expect(page.getByRole("status")).toContainText("ZC-TEST-ONLY")
    expect(submissions).toHaveLength(3)

    // The lead funnel GTM hangs its conversion trigger on: one view, one
    // attempt per POST, each failure classified, and exactly one accepted.
    const events = await page.evaluate(() =>
      (window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer
        ?.filter((entry) => typeof entry.event === "string" && String(entry.event).startsWith("contact_"))
        .map((entry) => [entry.event, entry.form, entry.code ?? null]) ?? [],
    )
    expect(events).toEqual([
      ["contact_form_viewed", "contact", null],
      ["contact_form_submit_attempt", "contact", null],
      ["contact_request_delivery_error", "contact", "HTTP_502"],
      ["contact_form_submit_attempt", "contact", null],
      ["contact_request_validation_error", "contact", "HTTP_422"],
      ["contact_form_submit_attempt", "contact", null],
      ["contact_request_accepted", "contact", null],
    ])

    // The conversion: one generate_lead for the one persisted lead (the 502
    // and 422 attempts count nothing), keyed by folio and free of PII.
    const conversions = await leadConversions(page)
    expect(conversions).toHaveLength(1)
    expect(conversions[0]).toMatchObject({ form_id: "contact", lead_id: "ZC-TEST-ONLY", language: locale })
    for (const sample of PII_SAMPLES) expect(JSON.stringify(conversions[0])).not.toContain(sample)

    // What GTM's GA4 tag would read at that moment: nothing left over from the
    // clicks that led here.
    const [state] = await mergedAtConversions(page)
    for (const key of CLICK_ONLY_KEYS) expect(state[key], key).toBe("(undefined)")
  })
}

test("a 202 (honeypot / not persisted) shows success but counts no conversion", async ({ page }) => {
  await page.route("**/api/contact-request", (route) =>
    route.fulfill({ status: 202, json: { ok: true, requestId: "ZC-TEST-ONLY" } }))
  const { form, content } = await reachContact(page, "en", "no")
  await form.getByRole("textbox", { name: content.form.name, exact: true }).fill("Local QA")
  await form.getByRole("textbox", { name: content.form.email, exact: true }).fill("website-qa@example.invalid")
  await form.getByRole("button", { name: content.form.submit, exact: true }).click()
  await expect(page.getByRole("heading", { name: content.successTitle, exact: true })).toBeFocused()
  expect(await leadConversions(page)).toHaveLength(0)
})

test("an in-flight request cannot be submitted twice", async ({ page }) => {
  let requests = 0
  let releaseResponse!: () => void
  const responseReady = new Promise<void>((resolve) => { releaseResponse = resolve })
  await page.route("**/api/contact-request", async (route) => {
    requests += 1
    await responseReady
    await route.fulfill({ status: 201, json: { ok: true, requestId: "ZC-TEST-ONLY" } })
  })
  const { form, content } = await reachContact(page, "en", "no")
  await form.getByRole("textbox", { name: content.form.name, exact: true }).fill("Local QA")
  await form.getByRole("textbox", { name: content.form.email, exact: true }).fill("website-qa@example.invalid")
  // Two submit events before React can paint a disabled button: the synchronous
  // in-flight guard, not just the button styling, must prevent a second POST.
  await form.evaluate((element: HTMLFormElement) => {
    element.requestSubmit()
    element.requestSubmit()
  })
  await expect(form).toHaveAttribute("aria-busy", "true")
  await expect(form.getByRole("button", { name: content.submitting, exact: true })).toBeDisabled()
  await expect(form.getByRole("button", { name: content.back, exact: true })).toBeDisabled()
  await expect.poll(() => requests).toBe(1)
  releaseResponse()
  await expect(page.getByRole("heading", { name: content.successTitle, exact: true })).toBeFocused()
  expect(requests).toBe(1)
  expect(await leadConversions(page)).toHaveLength(1)
})

for (const subsidy of ["yes", "tbd"] as const) {
  test(`subsidy ${subsidy}: only serialize an applicable percentage`, async ({ page }) => {
    let brief = ""
    await page.route("**/api/contact-request", async (route) => {
      brief = route.request().postDataJSON().message
      await route.fulfill({ status: 201, json: { ok: true, requestId: "ZC-TEST-ONLY" } })
    })
    const { form, content, labels } = await reachContact(page, "en", subsidy)
    await form.getByRole("textbox", { name: content.form.name, exact: true }).fill("Local QA")
    await form.getByRole("textbox", { name: content.form.email, exact: true }).fill("website-qa@example.invalid")
    await form.getByRole("button", { name: content.form.submit, exact: true }).click()
    await expect(page.getByRole("heading", { name: content.successTitle, exact: true })).toBeFocused()
    if (subsidy === "yes") expect(brief).toContain(`${labels.terms.subsidyLabel}: 0%`)
    else expect(brief).not.toContain(`${labels.terms.subsidyLabel}:`)
  })
}

for (const locale of ["es", "en"] as const) {
  const home = getHomeContent(locale)
  const content = getContactContent(locale)
  const services = [
    // Dining now automatically asks its operating questions, as requested by
    // the user. Its full journey remains covered by reachContact tests.
    ...home.profilerServices.filter((service) => service.id !== "comedor").map((service) => ({ id: service.id, title: service.title })),
    { id: "otro", title: content.form.serviceUnsure },
  ]
  for (const service of services) {
    test(`${locale}: ${service.id} can use the three-step inquiry`, async ({ page }, testInfo) => {
      let submission: Record<string, string> | undefined
      await page.route("**/api/contact-request", async (route) => {
        submission = route.request().postDataJSON()
        await route.fulfill({ status: 201, json: { ok: true, requestId: "ZC-TEST-ONLY" } })
      })
      await page.context().addCookies([{
        name: "zitrone_consent",
        value: encodeURIComponent(JSON.stringify({ analytics: "denied", marketing: "denied", v: 1 })),
        domain: "127.0.0.1", path: "/",
      }])
      if (locale === "es") await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(`/${locale}/contact`)
      const form = page.locator("form.ds-contact-form")
      await expect(form.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "3")
      if (service.id === "catering") {
        const axe = await scanSettled(page, "form.ds-contact-form")
        expect(axe.violations).toEqual([])
        await page.screenshot({ path: testInfo.outputPath("service-step.png"), fullPage: true })
      }
      await form.getByRole("button", { name: service.title, exact: true }).click()
      await form.getByRole("button", { name: content.next, exact: true }).click()
      await expect(form.getByRole("heading", { name: content.form.steps.site.title })).toBeFocused()
      const peopleLabel = service.id === "catering" ? content.form.guests : content.form.headcount
      await expect(form.getByRole("slider", { name: peopleLabel, exact: true })).toBeEnabled()
      await form.getByRole("slider", { name: peopleLabel, exact: true }).fill("6")
      await expect(form.getByRole("checkbox", { name: /Todavía no sé|I do not know yet|detalles del comedor|dining operation details/ })).toHaveCount(0)
      if (service.id === "catering") {
        const locationLabels = getLocationContent(locale)
        await form.getByRole("combobox", { name: locationLabels.region, exact: true }).selectOption("queretaro")
        await form.getByRole("combobox", { name: locationLabels.municipality, exact: true }).selectOption("El Marqués")
        const axe = await scanSettled(page, "form.ds-contact-form")
        expect(axe.violations).toEqual([])
        await page.screenshot({ path: testInfo.outputPath("site-step.png"), fullPage: true })
      } else {
        await form.getByRole("checkbox", { name: content.form.cityUnsure, exact: true }).check()
      }
      await form.getByRole("button", { name: content.next, exact: true }).click()
      await expect(form.getByRole("heading", { name: content.form.steps.contact.title })).toBeFocused()
      if (service.id === "catering") await expect(form.locator("textarea")).toHaveAttribute("placeholder", content.form.cateringNotesPlaceholder)
      if (service.id === "maquinas") await expect(form.locator("textarea")).toHaveAttribute("placeholder", content.form.equipmentNotesPlaceholder)
      if (service.id === "catering") await page.screenshot({ path: testInfo.outputPath("contact-step.png"), fullPage: true })
      await form.getByRole("textbox", { name: content.form.name, exact: true }).fill("Local QA")
      await form.getByRole("textbox", { name: content.form.email, exact: true }).fill("website-qa@example.invalid")
      await form.getByRole("button", { name: content.form.submit, exact: true }).click()
      await expect(page.getByRole("heading", { name: content.successTitle, exact: true })).toBeFocused()
      expect(submission?.interest).toBe(service.id)
      expect(submission?.headcount).toBe("100")
      const brief = submission!.message
      expect(brief).toContain(service.title)
      expect(brief).toContain(service.id === "catering" ? "El Marqués" : content.form.cityUnsure)
      expect(brief).not.toContain(`${home.componentLabels.profiler.brief.menu}:`)
      expect(brief).not.toContain(`${home.componentLabels.profiler.terms.budgetLabel}:`)
      expect(brief).not.toContain(`${home.componentLabels.profiler.brief.days}:`)
    })
  }
}

test("switching from detailed dining to coffee excludes hidden dining answers", async ({ page }) => {
  let brief = ""
  await page.route("**/api/contact-request", async (route) => {
    brief = route.request().postDataJSON().message
    expect(route.request().postDataJSON().interest).toBe("maquinas")
    await route.fulfill({ status: 201, json: { ok: true, requestId: "ZC-TEST-ONLY" } })
  })
  const { form, content, labels } = await reachContact(page, "en", "yes")
  for (let index = 0; index < 6; index += 1) {
    await form.getByRole("button", { name: content.back, exact: true }).click()
  }
  const coffee = getHomeContent("en").profilerServices.find((service) => service.id === "maquinas")!
  const dining = getHomeContent("en").profilerServices.find((service) => service.id === "comedor")!
  await form.getByRole("button", { name: dining.title, exact: true }).click()
  await form.getByRole("button", { name: coffee.title, exact: true }).click()
  await form.getByRole("button", { name: content.next, exact: true }).click()
  await form.getByRole("button", { name: content.next, exact: true }).click()
  await form.getByRole("textbox", { name: content.form.name, exact: true }).fill("Local QA")
  await form.getByRole("textbox", { name: content.form.email, exact: true }).fill("website-qa@example.invalid")
  await form.getByRole("button", { name: content.form.submit, exact: true }).click()
  await expect(page.getByRole("heading", { name: content.successTitle, exact: true })).toBeFocused()
  expect(brief).not.toContain(`${labels.brief.menu}:`)
  expect(brief).not.toContain(`${labels.terms.budgetLabel}:`)
  expect(brief).not.toContain(`${labels.terms.subsidyLabel}:`)
})

for (const locale of ["es", "en"] as const) {
  test(`${locale}: multiple services and individual meal counts survive submission`, async ({ page }, testInfo) => {
    if (locale === "es") await page.setViewportSize({ width: 390, height: 844 })
    const home = getHomeContent(locale)
    const content = getContactContent(locale)
    const labels = home.componentLabels.profiler
    let submission: Record<string, string> | undefined
    await page.route("**/api/contact-request", async (route) => {
      submission = route.request().postDataJSON()
      await route.fulfill({ status: 201, json: { ok: true, requestId: "ZC-TEST-ONLY" } })
    })
    const { form } = await reachContact(page, locale, "no", {
      services: home.profilerServices.map((service) => service.id),
      onSchedule: async () => {
        const form = page.locator("form.ds-contact-form")
        const next = form.getByRole("button", { name: content.next, exact: true })
        const meal = (id: string) => labels.shifts.find((shift) => shift.id === id)!
        const count = (id: string) => form.getByRole("textbox", { name: `${meal(id).label} · ${labels.schedule.peopleAria}`, exact: true })
        await expect(count("breakfast")).toHaveValue("150")
        await count("breakfast").fill("0")
        await expect(next).toBeDisabled()
        await count("breakfast").fill("20")
        await form.getByRole("button", { name: meal("lunch").label, exact: true }).click()
        await count("lunch").fill("80")
        await form.getByRole("button", { name: meal("dinner").label, exact: true }).click()
        await count("dinner").fill("40")
        await form.getByRole("button", { name: meal("night").label, exact: true }).click()
        await count("night").fill("30")
        await form.getByRole("button", { name: meal("night").label, exact: true }).click()
        await expect(count("night")).toHaveCount(0)
        // The actual +/- control is shared with home, not just a matching style.
        const breakfast = form.getByRole("group", { name: `${meal("breakfast").label} · ${labels.schedule.peopleAria}`, exact: true })
        await breakfast.getByRole("button", { name: "+", exact: true }).click()
        await expect(count("breakfast")).toHaveValue("30")
        await breakfast.getByRole("button", { name: "−", exact: true }).click()
        await expect(count("breakfast")).toHaveValue("20")
        const formBox = (await form.boundingBox())!
        for (const day of await form.locator(".semantic-profiler-day").all()) {
          const box = (await day.boundingBox())!
          expect(box.x + box.width).toBeLessThanOrEqual(formBox.x + formBox.width + 1)
        }
        const mealRow = form.locator(".semantic-profiler-shift").first()
        const labelBox = (await mealRow.locator(".semantic-profiler-shift-toggle").boundingBox())!
        const counterBox = (await breakfast.boundingBox())!
        const separateRows = counterBox.y >= labelBox.y + labelBox.height
        expect(separateRows || labelBox.x + labelBox.width <= counterBox.x).toBe(true)
        const axe = await scanSettled(page, "form.ds-contact-form")
        expect(axe.violations).toEqual([])
        await form.screenshot({ path: testInfo.outputPath("meal-counters.png") })
      },
    })
    await form.getByRole("textbox", { name: content.form.name, exact: true }).fill("Local QA")
    await form.getByRole("textbox", { name: content.form.email, exact: true }).fill("website-qa@example.invalid")
    await form.getByRole("button", { name: content.form.submit, exact: true }).click()
    await expect(page.getByRole("heading", { name: content.successTitle, exact: true })).toBeFocused()
    expect(submission?.interest).toBe("multiple")
    expect(submission?.headcount).toBe("150")
    for (const service of home.profilerServices) expect(submission!.message).toContain(service.title)
    for (const [id, value] of [["breakfast", 20], ["lunch", 80], ["dinner", 40]] as const) {
      const shift = labels.shifts.find((shift) => shift.id === id)!
      expect(submission!.message).toContain(`${shift.label}: ${value} ${labels.schedule.mealsUnit}`)
    }
    expect(submission!.message).not.toContain(`${labels.shifts.find((shift) => shift.id === "night")!.label}:`)
  })
}
