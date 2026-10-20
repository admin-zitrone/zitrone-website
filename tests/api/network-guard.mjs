/**
 * Loopback-only network for the isolated API suites and the backup drill.
 *
 * Loaded into every Node process those runners start (NODE_OPTIONS=--import),
 * including Payload's migrate CLI and child processes. Any fetch, TCP or TLS
 * connection to a host other than this machine is refused with an error and
 * recorded on globalThis.__zitroneBlockedRequests, so a hook that would call a
 * provider (OpenAI embeddings, Resend, Blob, Sentry…) fails closed even if a
 * credential leaked into the environment. Unix sockets are allowed.
 */
import net from "node:net"
import tls from "node:tls"

const LOCAL = new Set(["127.0.0.1", "localhost", "::1", "[::1]", "0.0.0.0"])
const blocked = (globalThis.__zitroneBlockedRequests ??= [])

function refuse(destination) {
  blocked.push(destination)
  const error = new Error(`network-guard: blocked non-local destination ${destination}`)
  error.code = "ZITRONE_NETWORK_BLOCKED"
  return error
}

function hostOf(input) {
  try {
    const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url)
    return { host: url.hostname, label: `${url.protocol}//${url.host}${url.pathname}` }
  } catch {
    return { host: "", label: String(input) }
  }
}

const realFetch = globalThis.fetch
globalThis.fetch = async function guardedFetch(input, init) {
  const { host, label } = hostOf(input)
  if (!LOCAL.has(host)) throw refuse(label)
  return realFetch(input, init)
}

function connectTarget(args) {
  const [first, second] = args
  if (typeof first === "object" && first !== null) {
    if (first.path) return null
    return first.host ?? first.hostname ?? "localhost"
  }
  if (typeof first === "string" && Number.isNaN(Number(first))) return null // unix socket path
  return typeof second === "string" ? second : "localhost"
}

const realSocketConnect = net.Socket.prototype.connect
net.Socket.prototype.connect = function guardedConnect(...args) {
  const target = connectTarget(Array.isArray(args[0]) ? args[0] : args)
  if (target !== null && !LOCAL.has(target)) {
    const error = refuse(`tcp://${target}`)
    process.nextTick(() => this.destroy(error))
    return this
  }
  return realSocketConnect.apply(this, args)
}

const realTlsConnect = tls.connect
tls.connect = function guardedTlsConnect(...args) {
  const target = connectTarget(args)
  if (target !== null && !LOCAL.has(target)) throw refuse(`tls://${target}`)
  return realTlsConnect.apply(this, args)
}
