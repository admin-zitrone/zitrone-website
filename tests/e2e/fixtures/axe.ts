import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]

/**
 * Runs axe on `selector` once its colours are final.
 *
 * axe samples the computed colour at the instant it runs; a form step that is
 * still fading or transitioning (the journeys run with normal motion on
 * purpose) reports a mid-transition colour as a contrast failure. This waits
 * for a real condition, not a timer: no finite CSS animation or transition is
 * running on the scanned element, inside it or on an ancestor (an ancestor's
 * opacity changes the rendered contrast too). Infinite decorative loops are
 * ignored because they never end. Times out, and fails the test, if motion
 * never settles.
 */
export async function scanSettled(page: Page, selector: string) {
  await page.waitForFunction(
    (sel) => {
      const root = document.querySelector(sel)
      if (!root) return false
      return document.getAnimations().every((animation) => {
        const effect = animation.effect as KeyframeEffect | null
        const target = effect?.target
        if (!target || !(root.contains(target) || target.contains(root))) return true
        if (effect.getTiming().iterations === Infinity) return true
        return animation.playState !== "running" && !animation.pending
      })
    },
    selector,
    { timeout: 10_000 },
  )
  return new AxeBuilder({ page }).include(selector).withTags(WCAG_TAGS).analyze()
}
