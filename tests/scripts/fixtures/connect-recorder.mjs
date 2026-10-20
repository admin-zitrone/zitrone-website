/**
 * Preload for tests/scripts: appends every TCP/TLS connection target and
 * fetch URL to $CONNECT_LOG, then lets it proceed. Used to prove that a
 * rejected TEST_PG_URL produces zero connection attempts.
 */
import fs from "node:fs"
import net from "node:net"
import tls from "node:tls"

const log = (entry) => fs.appendFileSync(process.env.CONNECT_LOG, entry + "\n")

const target = (args) => {
  const [a, b] = Array.isArray(args[0]) ? args[0] : args
  if (typeof a === "object" && a !== null) return a.path ? `unix:${a.path}` : `${a.host ?? "localhost"}:${a.port}`
  return typeof a === "string" && Number.isNaN(Number(a)) ? `unix:${a}` : `${b ?? "localhost"}:${a}`
}

const realConnect = net.Socket.prototype.connect
net.Socket.prototype.connect = function (...args) {
  log(`tcp ${target(args)}`)
  return realConnect.apply(this, args)
}
const realTls = tls.connect
tls.connect = function (...args) {
  log(`tls ${target(args)}`)
  return realTls.apply(this, args)
}
const realFetch = globalThis.fetch
globalThis.fetch = (input, init) => {
  log(`fetch ${typeof input === "string" ? input : input.url ?? String(input)}`)
  return realFetch(input, init)
}
