import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: ["domain-migration.spec.ts", "contact.spec.ts", "profiler-submission.spec.ts", "consent.spec.ts"],
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3102",
    ...devices["Desktop Chrome"],
    contextOptions: { reducedMotion: "reduce" },
    screenshot: "only-on-failure",
  },
  webServer: {
    env: { NEXT_PUBLIC_SITE_URL: "https://www.zitrone.mx" },
    command: "npm run dev -- --hostname 127.0.0.1 --port 3102",
    url: "http://127.0.0.1:3102/en/contact",
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
