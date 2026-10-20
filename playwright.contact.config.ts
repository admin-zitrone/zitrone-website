import { defineConfig, devices } from "@playwright/test"

// Optional attachment to a user-owned local preview without stopping/restarting
// it. Never allow the isolated tests to target a public deployment.
const previewURL = process.env.PLAYWRIGHT_CONTACT_BASE_URL
if (previewURL && !/^http:\/\/127\.0\.0\.1:\d+$/.test(previewURL)) {
  throw new Error("PLAYWRIGHT_CONTACT_BASE_URL must be an explicit loopback URL with a port")
}

// Isolated local-development gate: every contact POST is intercepted by the
// tests. This intentionally excludes billing and any real delivery workflow.
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: ["contact.spec.ts", "inquiry-location.spec.ts", "profiler-submission.spec.ts"],
  workers: 1,
  reporter: "list",
  use: {
    baseURL: previewURL ?? "http://127.0.0.1:3102",
    ...devices["Desktop Chrome"],
    contextOptions: { reducedMotion: "reduce" },
    screenshot: "only-on-failure",
  },
  webServer: previewURL ? undefined : {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3102",
    url: "http://127.0.0.1:3102/en/contact",
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
