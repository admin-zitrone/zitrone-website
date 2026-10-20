import { defineConfig } from "@playwright/test"

import base from "./playwright.config"

/**
 * Visual baselines run on their own config.
 *
 * They are deliberately kept out of the default `test:e2e` run (see
 * `testIgnore` in the base config) because their reference images are
 * per-platform: a baseline recorded on macOS does not exist on a Linux CI
 * runner, and the run would fail for a reason that has nothing to do with the
 * change under test. Recording Linux baselines in Docker is what makes these
 * safe to add to CI; until then this is a local-only gate.
 */
export default defineConfig({
  ...base,
  testMatch: "**/visual.spec.ts",
  testIgnore: undefined,
})
