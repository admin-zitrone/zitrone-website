import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import vm from "node:vm"

import {
  buildGtmLoader,
  GTM_SCRIPT_URL,
  measurementHosts,
  resolveMeasurement,
} from "../../src/lib/analytics/measurement"
import {
  DATA_LAYER_PARAMS,
  dataLayerEvents,
  pushDataLayer,
} from "../../src/lib/analytics/data-layer"

const SITE = "https://www.zitrone.mx"

/* ── Environment gate ────────────────────────────────────────── */

test("only a Vercel production build turns measurement on", () => {
  assert.deepEqual(resolveMeasurement({ VERCEL_ENV: "production", NEXT_PUBLIC_SITE_URL: SITE }), {
    enabled: true,
    hosts: ["www.zitrone.mx", "zitrone.mx"],
  })

  for (const VERCEL_ENV of ["preview", "development", undefined, "", "Production"]) {
    assert.deepEqual(
      resolveMeasurement({ VERCEL_ENV, NEXT_PUBLIC_SITE_URL: SITE }),
      { enabled: false, reason: "not-production" },
      `VERCEL_ENV=${String(VERCEL_ENV)} must not load the live container`,
    )
  }
})

test("GTM_MEASUREMENT=off switches a production build off", () => {
  for (const value of ["off", "OFF", " off "]) {
    assert.deepEqual(
      resolveMeasurement({ VERCEL_ENV: "production", GTM_MEASUREMENT: value, NEXT_PUBLIC_SITE_URL: SITE }),
      { enabled: false, reason: "switched-off" },
    )
  }
  // Anything else leaves the production default alone; there is no "force on".
  assert.equal(
    resolveMeasurement({ VERCEL_ENV: "preview", GTM_MEASUREMENT: "on", NEXT_PUBLIC_SITE_URL: SITE }).enabled,
    false,
  )
})

test("a production build without a real site URL stays off", () => {
  for (const NEXT_PUBLIC_SITE_URL of [undefined, "", "not a url", "http://localhost:3000", "http://127.0.0.1:3100"]) {
    assert.deepEqual(resolveMeasurement({ VERCEL_ENV: "production", NEXT_PUBLIC_SITE_URL }), {
      enabled: false,
      reason: "no-site-url",
    })
  }
})

test("the allowed hosts are the canonical host and its www/apex twin", () => {
  assert.deepEqual(measurementHosts("https://www.zitrone.mx"), ["www.zitrone.mx", "zitrone.mx"])
  assert.deepEqual(measurementHosts("https://zitrone.mx/"), ["zitrone.mx", "www.zitrone.mx"])
})

/** Runs the inline loader against a fake document served from `hostname`. */
function runLoader(hostname: string) {
  const appended: Array<{ src: string; async: boolean }> = []
  const window: Record<string, unknown> = {}
  const context = {
    window,
    location: { hostname },
    document: {
      createElement: () => ({ src: "", async: false }),
      head: { appendChild: (node: { src: string; async: boolean }) => appended.push(node) },
    },
  }
  vm.runInNewContext(buildGtmLoader(measurementHosts(SITE)), context)
  return { appended, state: window.__zitroneGtm }
}

test("the loader injects gtm.js on the canonical hosts", () => {
  for (const host of ["www.zitrone.mx", "zitrone.mx", "WWW.ZITRONE.MX"]) {
    const { appended, state } = runLoader(host)
    assert.equal(appended.length, 1, `${host} must load the container`)
    assert.equal(appended[0].src, GTM_SCRIPT_URL)
    assert.equal(appended[0].async, true)
    assert.equal(state, "loaded")
  }
})

test("the loader refuses any other host, including the deployment's own vercel.app URL", () => {
  for (const host of [
    "zitrone-website-git-main-acme.vercel.app",
    "zitrone-receptor.vercel.app",
    "localhost",
    "127.0.0.1",
    "zitrone.com.mx",
    "www.zitrone.mx.evil.example",
  ]) {
    const { appended, state } = runLoader(host)
    assert.equal(appended.length, 0, `${host} must not load the container`)
    assert.equal(state, "host-not-allowed")
  }
})

/* ── dataLayer ↔ GTM template ────────────────────────────────── */

type GtmParam = { key: string; value?: string; list?: Array<{ map: GtmParam[] }> }
const template = JSON.parse(
  readFileSync(new URL("../../docs/gtm/zitrone-lead-tracking.gtm.json", import.meta.url), "utf8"),
) as {
  containerVersion: {
    variable: Array<{ name: string; type: string; parameter: GtmParam[] }>
    trigger: Array<{ customEventFilter: Array<{ parameter: GtmParam[] }> }>
    tag: Array<{ type: string; parameter: GtmParam[] }>
  }
}
const { variable, trigger, tag } = template.containerVersion

test("the template reads exactly the keys the site pushes", () => {
  const dlvKeys = variable
    .filter((v) => v.type === "v")
    .map((v) => v.parameter.find((p) => p.key === "name")?.value)
  assert.deepEqual([...dlvKeys].sort(), [...DATA_LAYER_PARAMS].sort())

  for (const v of variable.filter((item) => item.type === "v")) {
    const key = v.parameter.find((p) => p.key === "name")?.value
    assert.equal(v.name, `DLV - ${key}`, "variable names are what the Ads recipe references")
  }
})

test("the GA4 tag forwards every contract key under its own name, and nothing else", () => {
  assert.equal(tag.length, 1)
  const table = tag[0].parameter.find((p) => p.key === "eventSettingsTable")?.list ?? []
  const rows = table.map((row) => ({
    name: row.map.find((p) => p.key === "parameter")?.value,
    value: row.map.find((p) => p.key === "parameterValue")?.value,
  }))
  assert.deepEqual(rows.map((r) => r.name).sort(), [...DATA_LAYER_PARAMS].sort())
  for (const row of rows) assert.equal(row.value, `{{DLV - ${row.name}}}`)
})

test("the trigger matches exactly the five contract events", () => {
  assert.equal(trigger.length, 1)
  const regex = trigger[0].customEventFilter[0].parameter.find((p) => p.key === "arg1")?.value
  const expected = Object.values(dataLayerEvents).sort()
  const listed = regex?.replace(/^\^\(|\)\$$/g, "").split("|").sort()
  assert.deepEqual(listed, expected)
  // Diagnostics must never reach a conversion or GA4 event through this tag.
  assert.ok(!regex?.includes("contact_request_accepted"))
})

/* ── No carry-over between events ────────────────────────────── */

function withWindow(run: (layer: Array<Record<string, unknown>>) => void) {
  const layer: Array<Record<string, unknown>> = []
  const g = globalThis as unknown as { window?: unknown }
  g.window = { dataLayer: layer }
  try {
    run(layer)
  } finally {
    delete g.window
  }
}

/** GTM's data model: each push is merged over the previous state. */
const merged = (layer: Array<Record<string, unknown>>) => {
  const states: Array<Record<string, unknown>> = []
  let model: Record<string, unknown> = {}
  for (const push of layer) {
    model = { ...model, ...push }
    states.push(model)
  }
  return states
}

test("every push carries the full key set, so GTM never reuses an earlier event's values", () => {
  withWindow((layer) => {
    pushDataLayer(dataLayerEvents.ctaClick, {
      cta_id: "nav",
      cta_section: "nav",
      cta_text: "Hablemos",
      cta_target: "contact",
      page_type: "home",
      link_url: "https://www.zitrone.mx/es/contact",
      outbound: false,
    })
    pushDataLayer(dataLayerEvents.generateLead, {
      form_id: "contact",
      cta_id: "nav",
      cta_section: "nav",
      cta_page: "/es",
      lead_channel: "direct",
      lead_id: "ZC-0001",
      lead_interest: "comedor",
      lead_headcount: "100-299",
      language: "es",
    })
    pushDataLayer(dataLayerEvents.ctaClick, { cta_id: "footer-blog", link_url: "https://www.zitrone.mx/es/blog" })

    for (const push of layer) {
      for (const key of DATA_LAYER_PARAMS) {
        assert.ok(key in push, `${String(push.event)} must push ${key}, even as undefined`)
      }
    }

    const [, lead, nextClick] = merged(layer)
    assert.equal(lead.link_url, undefined, "a lead must not report the last click's link")
    assert.equal(lead.cta_text, undefined)
    assert.equal(lead.outbound, undefined)
    assert.equal(nextClick.lead_id, undefined, "a later click must not report the previous lead's folio")
    assert.equal(nextClick.form_id, undefined)
    assert.equal(nextClick.cta_section, undefined)
  })
})

test("empty values clear the key and long strings are cut at GA4's 100 characters", () => {
  withWindow((layer) => {
    pushDataLayer(dataLayerEvents.ctaClick, { cta_id: "", cta_text: "x".repeat(140), outbound: false })
    assert.equal(layer[0].cta_id, undefined)
    assert.equal((layer[0].cta_text as string).length, 100)
    assert.equal(layer[0].outbound, false, "false is a value, not an empty one")
  })
})
