/**
 * Validates TEST_PG_URL for the isolated test runners (scripts/lib/test-db.sh)
 * and prints normalized shell assignments: PG_HOST, PG_PORT, PG_USER, PG_PASS
 * and PG_USERINFO (user:password percent-encoded, for building URLs).
 *
 * Only a plain loopback URL is accepted, because the original string is never
 * handed to a client: everything downstream connects with these values.
 * Rejected, with a non-zero exit and nothing on stdout:
 * - a scheme other than postgres:/postgresql:
 * - a host other than 127.0.0.1 or localhost (both mean 127.0.0.1)
 * - any query string or fragment (`?host=`, `?sslmode=`, `?options=`… can
 *   change where or how `pg` connects)
 * - a path other than empty or one database name (the admin database is
 *   always `postgres`)
 * - a missing user or an invalid port
 */
const LOOPBACK = { "127.0.0.1": "127.0.0.1", localhost: "127.0.0.1" }

function fail(reason) {
  console.error(`TEST_PG_URL rejected: ${reason}`)
  process.exit(1)
}

const raw = process.env.TEST_PG_URL ?? ""
let url
try {
  url = new URL(raw)
} catch {
  fail("not a valid URL")
}
if (!["postgres:", "postgresql:"].includes(url.protocol)) fail(`scheme ${url.protocol} is not postgres`)
const host = LOOPBACK[url.hostname]
if (!host) fail("host must be 127.0.0.1 or localhost")
if (url.search || raw.includes("?")) fail("query parameters are not allowed")
if (url.hash || raw.includes("#")) fail("fragments are not allowed")
if (!/^(\/[A-Za-z0-9_]*)?$/.test(url.pathname)) fail("path must be empty or a single database name")
const port = url.port || "5432"
if (!/^[0-9]{1,5}$/.test(port) || Number(port) < 1 || Number(port) > 65535) fail("invalid port")

let user
let password
try {
  user = decodeURIComponent(url.username)
  password = decodeURIComponent(url.password)
} catch {
  fail("user or password is not valid percent-encoding")
}
if (!user) fail("a user is required")

const q = (s) => "'" + s.replace(/'/g, "'\\''") + "'"
const userinfo = `${encodeURIComponent(user)}:${encodeURIComponent(password)}`
console.log(`PG_HOST=${q(host)}; PG_PORT=${q(port)}; PG_USER=${q(user)}; PG_PASS=${q(password)}; PG_USERINFO=${q(userinfo)}`)
