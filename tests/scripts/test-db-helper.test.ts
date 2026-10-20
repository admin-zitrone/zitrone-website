/**
 * scripts/lib/test-db.sh refuses any Postgres that is not plain loopback
 * before an admin command exists (Codex review R5, 2026-10-11).
 *
 * Every case sources the real helper in zsh with `set -euo pipefail`, as the
 * runners do. Node processes preload a recorder that logs each connection
 * attempt; `docker` is a stub that logs each call. A rejected URL must exit
 * non-zero with zero connection attempts and zero docker calls. Only synthetic
 * URLs are used; no remote host is contacted.
 */
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import fs from "node:fs"
import net from "node:net"
import os from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { after, before, describe, test } from "node:test"

const ROOT = path.resolve(import.meta.dirname, "../..")
const RECORDER = pathToFileURL(path.join(import.meta.dirname, "fixtures/connect-recorder.mjs")).href

let dir: string
let freePort: number

before(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "zitrone-test-db-"))
  fs.mkdirSync(path.join(dir, "bin"))
  // Stub docker: logs the call; answers like a running container when
  // DOCKER_STUB=running, like a missing one otherwise.
  fs.writeFileSync(path.join(dir, "bin/docker"), `#!/bin/sh
echo "docker $*" >> "$DOCKER_LOG"
[ "$DOCKER_STUB" = running ] || exit 1
case "$1" in
  inspect) printf 'POSTGRES_USER=stub\\nPOSTGRES_PASSWORD=p@ss/word\\n' ;;
  port) echo "0.0.0.0:55432" ;;
esac
`, { mode: 0o755 })
  freePort = await new Promise<number>((resolve) => {
    const server = net.createServer().listen(0, "127.0.0.1", () => {
      const { port } = server.address() as net.AddressInfo
      server.close(() => resolve(port))
    })
  })
})

after(() => fs.rmSync(dir, { recursive: true, force: true }))

function run(env: Record<string, string>) {
  const connectLog = path.join(dir, `connect-${Math.random().toString(36).slice(2)}.log`)
  const dockerLog = path.join(dir, `docker-${Math.random().toString(36).slice(2)}.log`)
  const script = `set -euo pipefail
source scripts/lib/test-db.sh
print "REACHED host=$PG_HOST port=$PG_PORT userinfo=$PG_USERINFO"
psql_admin "SELECT 1" && print ADMIN_OK || print ADMIN_FAILED`
  const result = spawnSync("zsh", ["-c", script], {
    cwd: ROOT,
    encoding: "utf8",
    timeout: 30_000,
    env: {
      NODE_ENV: "test",
      PATH: `${path.join(dir, "bin")}:${process.env.PATH}`,
      HOME: process.env.HOME ?? dir,
      CONNECT_LOG: connectLog,
      DOCKER_LOG: dockerLog,
      NODE_OPTIONS: `--import=${RECORDER}`,
      TEST_DB_NODE_OPTIONS: `--import=${RECORDER}`,
      ...env,
    },
  })
  const read = (file: string) => (fs.existsSync(file) ? fs.readFileSync(file, "utf8").trim().split("\n").filter(Boolean) : [])
  return { ...result, connections: read(connectLog), dockerCalls: read(dockerLog) }
}

const REJECTED: Record<string, string> = {
  "remote hostname": "postgres://fake:fake@example.invalid/postgres",
  "malformed URL": "not a url",
  "?host= override of a loopback URL": "postgres://fake:fake@127.0.0.1:5432/postgres?host=example.invalid",
  "?hostaddr= override": "postgres://fake:fake@127.0.0.1:5432/postgres?hostaddr=192.0.2.1",
  "other query options": "postgres://fake:fake@127.0.0.1:5432/postgres?sslmode=require",
  "non-postgres scheme": "mysql://fake:fake@127.0.0.1:3306/postgres",
  "loopback-looking remote host": "postgres://fake:fake@127.0.0.1.example.invalid/postgres",
  "missing user": "postgres://127.0.0.1:5432/postgres",
  "nested path": "postgres://fake:fake@127.0.0.1:5432/a/b",
}

describe("test-db.sh: TEST_PG_URL is loopback only", () => {
  for (const [name, url] of Object.entries(REJECTED)) {
    test(`rejects ${name} before any connection or SQL`, () => {
      const r = run({ TEST_PG_URL: url })
      assert.notEqual(r.status, 0, `expected a non-zero exit, got ${r.status}\n${r.stdout}${r.stderr}`)
      assert.match(r.stderr, /TEST_PG_URL rejected/)
      assert.doesNotMatch(r.stdout, /REACHED|ADMIN_/)
      assert.deepEqual(r.connections, [])
      assert.deepEqual(r.dockerCalls, [])
    })
  }

  test("accepts a local URL and connects only to the normalized loopback address", () => {
    const r = run({ TEST_PG_URL: `postgres://user%40x:p%40ss@localhost:${freePort}/postgres` })
    assert.equal(r.status, 0, r.stderr)
    assert.match(r.stdout, new RegExp(`REACHED host=127\\.0\\.0\\.1 port=${freePort} userinfo=user%40x:p%40ss`))
    // Nothing listens on the port: the admin command fails, after one attempt
    // at 127.0.0.1 and nowhere else.
    assert.match(r.stdout, /ADMIN_FAILED/)
    assert.ok(r.connections.length > 0)
    for (const c of r.connections) assert.equal(c, `tcp 127.0.0.1:${freePort}`)
    assert.deepEqual(r.dockerCalls, [])
  })
})

describe("test-db.sh: Docker mode", () => {
  test("uses the container's credentials and published port, admin through docker exec", () => {
    const r = run({ DOCKER_STUB: "running" })
    assert.equal(r.status, 0, r.stderr)
    assert.match(r.stdout, /REACHED host=127\.0\.0\.1 port=55432 userinfo=stub:p%40ss%2Fword/)
    assert.match(r.stdout, /ADMIN_OK/)
    assert.ok(r.dockerCalls.some((c) => c.startsWith("docker exec zitrone-staging-pg psql")))
    assert.deepEqual(r.connections, [])
  })

  test("stops when the container cannot be resolved", () => {
    const r = run({ DOCKER_STUB: "missing" })
    assert.notEqual(r.status, 0)
    assert.doesNotMatch(r.stdout, /REACHED|ADMIN_/)
    assert.ok(!r.dockerCalls.some((c) => c.startsWith("docker exec")))
    assert.deepEqual(r.connections, [])
  })
})
