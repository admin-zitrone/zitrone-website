import { expect, test } from "./fixtures/isolated"

import { homeContentEn } from "@/app/_components/home/content/en"

const primaryNavLabel = /Primary|Principal/i

/** Escapes a content string so it can be matched literally by a RegExp. */
function literal(value: string) {
  return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
}

// Derived from the content source rather than pinned to a copy string: the
// hero headline is rewritten often, and a hardcoded copy of it silently rots
// into a red build that says nothing about the shell actually being broken.
const heroTitleEn = literal(homeContentEn.sections.hero.title)

test.describe("localized marketing shell", () => {
  test("renders the English home page", async ({ page }) => {
    await page.goto("/en")

    await expect(page).toHaveTitle(/Zitrone/i)
    await expect(
      page.getByRole("heading", { level: 1, name: heroTitleEn }),
    ).toBeVisible()
    await expect(
      page.getByRole("navigation", { name: primaryNavLabel }).getByRole("button", { name: /^Services$/i }),
    ).toBeVisible()
    await expect(
      page.getByRole("navigation", { name: primaryNavLabel }).getByRole("link", { name: /^How we work$/i }),
    ).toBeVisible()
  })

  test("contact navigation resolves back to the localized home", async ({ page }) => {
    await page.goto("/en/contact")

    const systemLink = page
      .getByRole("navigation", { name: primaryNavLabel })
      .getByRole("link", { name: /^How we work$/i })
      .first()
    await expect(systemLink).toHaveAttribute("href", "/en#outcomes")
    await systemLink.click()
    await expect(page).toHaveURL(/\/en#outcomes$/)
  })

  test("privacy navigation resolves back to the localized home", async ({ page }) => {
    await page.goto("/es/privacy-notice")

    const systemLink = page
      .getByRole("navigation", { name: primaryNavLabel })
      .getByRole("link", { name: /^Cómo trabajamos$/i })
      .first()
    await expect(systemLink).toHaveAttribute("href", "/es#outcomes")
    await systemLink.click()
    await expect(page).toHaveURL(/\/es#outcomes$/)
  })
})

test.describe("blog smoke", () => {
  test("blog index renders and keeps localized shell links", async ({ page }) => {
    await page.goto("/en/blog")

    await expect(page).toHaveTitle(/Journal|Blog|Zitrone/i)
    await expect(page.getByRole("link", { name: /Journal|Blog/i }).first()).toBeVisible()

    const systemLink = page
      .getByRole("navigation", { name: primaryNavLabel })
      .getByRole("link", { name: /^How we work$/i })
    await expect(systemLink).toHaveAttribute("href", "/en#outcomes")
    await systemLink.click()
    await expect(page).toHaveURL(/\/en#outcomes$/)
  })

  test("blog article renders recommended content", async ({ page }) => {
    await page.goto("/en/blog/workplace-food-program-that-works")

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Workplace Food Program|Food Program/i,
      }),
    ).toBeVisible()
    await expect(page.getByText(/Recommended articles/i)).toBeVisible()
  })
})
