/**
 * Shared setup for the isolated API suites (`npm run test:api`).
 *
 * They boot the real Payload config against a throwaway Postgres database and
 * drive Payload's own REST handlers (the ones `src/app/(payload)/api` mounts)
 * plus the site's route handlers. Nothing here may touch real data, so the
 * harness refuses any database that is not on this machine or whose name
 * does not end in `_api_test`. `scripts/test-api-isolated.sh` creates, migrates
 * and drops that database around a run.
 */
import type { Payload } from "payload"

export function assertIsolatedDatabase() {
  const raw = process.env.DATABASE_URL ?? ""
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new Error("API tests need DATABASE_URL pointing at the throwaway test database.")
  }
  const local = ["127.0.0.1", "localhost", "::1"].includes(url.hostname)
  if (!local || !url.pathname.endsWith("_api_test")) {
    throw new Error(
      `Refusing to run API tests against ${url.hostname}${url.pathname}: only a local *_api_test database is allowed.`,
    )
  }
}

let payloadPromise: Promise<Payload> | undefined

export async function getTestPayload(): Promise<Payload> {
  assertIsolatedDatabase()
  payloadPromise ??= (async () => {
    const { getPayloadClient } = await import("../../src/payload/loaders/client")
    return getPayloadClient()
  })()
  return payloadPromise
}

type RestMethod = "GET" | "POST" | "PATCH" | "DELETE"

/** Calls Payload's REST API in-process, exactly as `/api/[...slug]` does. */
export async function rest(
  method: RestMethod,
  path: string,
  options: { cookie?: string; body?: unknown } = {},
) {
  const config = (await import("@payload-config")).default
  const routes = await import("@payloadcms/next/routes")
  const handler = {
    GET: routes.REST_GET,
    POST: routes.REST_POST,
    PATCH: routes.REST_PATCH,
    DELETE: routes.REST_DELETE,
  }[method](config)

  const url = new URL(`http://localhost:3000/api/${path}`)
  const headers = new Headers()
  if (options.cookie) setSessionHeaders(headers, options.cookie)
  if (options.body !== undefined) headers.set("content-type", "application/json")
  const request = new Request(url, {
    method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })
  const slug = url.pathname.replace(/^\/api\//, "").split("/")
  const response = await handler(request, { params: Promise.resolve({ slug }) })
  const text = await response.text()
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    json = undefined
  }
  return { status: response.status, json: json as Record<string, unknown> | undefined, headers: response.headers }
}

/** What a browser on the admin sends with its session: the cookie, and the
 * same-origin fetch metadata Payload's CSRF check requires for it. */
export function setSessionHeaders(headers: Headers, cookie: string) {
  headers.set("cookie", cookie)
  headers.set("sec-fetch-site", "same-origin")
}

/** Closes the database pool so the test process can exit. */
export async function closeTestPayload() {
  if (!payloadPromise) return
  const payload = await payloadPromise
  await payload.destroy()
  payloadPromise = undefined
}

/** Signs in through the REST endpoint and returns the session cookie. */
export async function login(email: string, password: string) {
  const response = await rest("POST", "users/login", { body: { email, password } })
  const cookie = response.headers.get("set-cookie")?.split(";")[0]
  if (response.status !== 200 || !cookie) {
    throw new Error(`Login failed for ${email}: ${response.status}`)
  }
  return cookie
}
