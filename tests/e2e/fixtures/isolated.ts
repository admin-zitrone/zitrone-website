import { test as base, expect } from "@playwright/test"

// These journeys verify local UI/dataLayer behavior. No external tags, real
// submissions or telemetry may escape a test, even when consent is granted.
export const test = base.extend<{ isolateNetwork: void }>({
  isolateNetwork: [async ({ context }, use) => {
    await context.route("**/*", async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      if (url.hostname !== "127.0.0.1" ||
          url.pathname.startsWith("/_vercel/") ||
          !["GET", "HEAD"].includes(request.method())) {
        await route.abort()
        return
      }
      await route.continue()
    })
    // Page-scoped mocks in each form test take priority over this fallback.
    await use()
  }, { auto: true }],
})

export { expect }
