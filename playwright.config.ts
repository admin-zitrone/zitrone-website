import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  // Visual baselines are platform-specific and run from
  // playwright.visual.config.ts instead. See that file for why.
  testIgnore: "**/visual.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run build && npm run start -- --hostname 127.0.0.1 --port 3100",
    // The canonical origin the suites assert; set here so a personal
    // .env.local (often localhost) cannot change it. Same as CI and production.
    env: { NEXT_PUBLIC_SITE_URL: "https://www.zitrone.mx" },
    url: "http://127.0.0.1:3100/en",
    reuseExistingServer: false,
    stdout: "pipe",
    stderr: "pipe",
    timeout: 120_000,
  },
})
