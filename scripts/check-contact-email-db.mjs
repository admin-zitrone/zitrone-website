#!/usr/bin/env node
// Read-only readiness check. Never print connection settings or lead contents.
import pg from "pg"
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10000 })
try {
  await client.connect()
  await client.query("BEGIN READ ONLY")
  const columns = await client.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contact_requests' AND column_name IN ('id', 'request_id', 'email_delivery') ORDER BY column_name")
  const migrations = await client.query("SELECT name FROM payload_migrations ORDER BY id")
  console.log(JSON.stringify({ contactColumns: columns.rows.map(row => row.column_name), migrations: migrations.rows.map(row => row.name) }))
  await client.query("ROLLBACK")
} catch {
  console.error("Database readiness check failed; connection details suppressed.")
  process.exitCode = 1
} finally { await client.end() }
