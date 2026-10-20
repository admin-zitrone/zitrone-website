import { expect, test } from "./fixtures/isolated"
import { scanSettled } from "./fixtures/axe"
import { getHomeContent } from "../../src/app/_components/home/home-data"
import { getContactContent } from "../../src/app/lib/contact-content"
import { getLocationContent, inquiryRegions, LOCATION_UNSURE } from "../../src/app/lib/inquiry-locations"

for (const locale of ["es", "en"] as const) {
  for (const surface of ["home", "contact"] as const) {
    test(`${locale} ${surface}: location hierarchy, reset and keyboard`, async ({ page }, testInfo) => {
      // Fail closed: this test never needs a real API submission.
      await page.route("**/api/contact-request", (route) => route.abort())
      await page.context().addCookies([{
        name: "zitrone_consent",
        value: encodeURIComponent(JSON.stringify({ analytics: "denied", marketing: "denied", v: 1 })),
        domain: "127.0.0.1", path: "/",
      }])
      if (locale === "es") await page.setViewportSize({ width: 390, height: 844 })
      const home = getHomeContent(locale)
      const contact = getContactContent(locale)
      const labels = getLocationContent(locale)
      await page.goto(surface === "home" ? `/${locale}#profiler` : `/${locale}/contact`)
      const scope = page.locator(surface === "home" ? "#profiler" : "form.ds-contact-form")
      const next = scope.getByRole("button", { name: surface === "home" ? home.componentLabels.profiler.continueLabel : contact.next, exact: true })
      const back = scope.getByRole("button", { name: surface === "home" ? home.componentLabels.profiler.back : contact.back, exact: true })
      if (surface === "home") {
        await scope.getByRole("button", { name: home.componentLabels.profiler.startLabel, exact: true }).click()
      } else {
        await scope.getByRole("button", { name: home.profilerServices[0].title, exact: true }).click()
      }
      await next.click()
      const location = scope.locator("[data-inquiry-location]")
      const region = location.getByRole("combobox", { name: labels.region, exact: true })
      await expect(region).toBeVisible()
      await expect(location.getByRole("combobox")).toHaveCount(1)
      await expect(next).toBeDisabled()
      await expect(region.locator("option")).toHaveText([labels.chooseRegion, ...inquiryRegions.map((item) => item.name)])

      for (const area of inquiryRegions) {
        await region.selectOption(area.id)
        const district = location.getByRole("combobox", { name: area.id === "cdmx" ? labels.borough : labels.municipality, exact: true })
        await expect(district).toHaveValue("")
        await expect(next).toBeDisabled()
        await expect(district.locator("option")).toHaveText([labels.chooseDistrict, ...area.districts, labels.unsure])
        await district.selectOption(area.districts[0])
        await expect(next).toBeEnabled()
      }

      // Returning to CDMX must not carry Hidalgo's municipality forward.
      await region.selectOption("cdmx")
      const borough = location.getByRole("combobox", { name: labels.borough, exact: true })
      await expect(borough).toHaveValue("")
      await expect(next).toBeDisabled()
      await region.focus()
      await region.press("Tab")
      await expect(borough).toBeFocused()
      // Native type-ahead avoids relying on platform-specific popup opening
      // keys while still verifying a real keyboard selection.
      await borough.press("m")
      await expect(borough).toHaveValue("Miguel Hidalgo")
      await next.click()
      await back.click()
      await expect(region).toHaveValue("cdmx")
      await expect(borough).toHaveValue("Miguel Hidalgo")

      await borough.selectOption(LOCATION_UNSURE)
      await expect(next).toBeEnabled()
      await borough.selectOption("Miguel Hidalgo")
      const axe = await scanSettled(page, "[data-inquiry-location]")
      expect(axe.violations).toEqual([])
      await scope.screenshot({ path: testInfo.outputPath("location-hierarchy.png") })
      if (surface === "home") {
        await next.click() // days
        await next.click() // meals
        const profiler = home.componentLabels.profiler
        const firstMeal = profiler.shifts[0]
        const meals = scope.getByRole("group", { name: profiler.schedule.shiftsAria, exact: true })
        await meals.getByRole("button", { name: firstMeal.label, exact: true }).click()
        const counterName = `${firstMeal.label} · ${profiler.schedule.peopleAria}`
        const counter = meals.getByRole("group", { name: counterName, exact: true })
        const value = counter.getByRole("textbox", { name: counterName, exact: true })
        await expect(value).toHaveValue("150")
        await counter.getByRole("button", { name: "+", exact: true }).click()
        await expect(value).toHaveValue("200")
        await value.fill("75")
        await counter.getByRole("button", { name: "−", exact: true }).click()
        await expect(value).toHaveValue("50")
        await meals.screenshot({ path: testInfo.outputPath("home-meal-counter.png") })
      }
    })
  }
}
