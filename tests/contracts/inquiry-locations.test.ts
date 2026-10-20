import assert from "node:assert/strict"
import test from "node:test"
import { changeLocationRegion, formatInquiryLocation, inquiryRegions, LOCATION_UNSURE } from "@/app/lib/inquiry-locations"

test("inquiry geography preserves the inherited six regions and 38 specific zones", () => {
  assert.deepEqual(inquiryRegions.map((item) => item.id), ["cdmx", "edomex", "nuevo-leon", "jalisco", "queretaro", "hidalgo"])
  assert.deepEqual(inquiryRegions.map((item) => item.districts.length), [10, 8, 7, 6, 4, 3])
  for (const region of inquiryRegions) assert.equal(new Set(region.districts).size, region.districts.length)
  assert.deepEqual(inquiryRegions.find((region) => region.id === "hidalgo")!.districts, ["Pachuca", "Tula", "Tepeji del Río"])
})

test("changing region resets the district and rejects unknown parents", () => {
  assert.deepEqual(changeLocationRegion("hidalgo"), { region: "hidalgo", district: "" })
  assert.deepEqual(changeLocationRegion("unknown"), { region: "", district: "" })
})

test("serialization rejects missing, unknown and mismatched child locations", () => {
  for (const value of [
    { region: "", district: "" }, { region: "cdmx", district: "" },
    { region: "cdmx", district: "Pachuca" }, { region: "unknown", district: "Pachuca" },
  ]) assert.equal(formatInquiryLocation(value, "es"), "")
})

test("briefs distinguish entity, municipality and borough in both languages", () => {
  assert.equal(formatInquiryLocation({ region: "cdmx", district: "Miguel Hidalgo" }, "es"), "Ciudad de México — Alcaldía: Miguel Hidalgo")
  assert.equal(formatInquiryLocation({ region: "cdmx", district: "Miguel Hidalgo" }, "en"), "Ciudad de México — Borough: Miguel Hidalgo")
  assert.equal(formatInquiryLocation({ region: "hidalgo", district: "Pachuca" }, "es"), "Hidalgo — Municipio: Pachuca")
})

test("an undecided district stays explicit, not an assertion of statewide coverage", () => {
  assert.equal(formatInquiryLocation({ region: "edomex", district: LOCATION_UNSURE }, "es"), "Estado de México — Municipio: Aún por definir")
  assert.equal(formatInquiryLocation({ region: "cdmx", district: LOCATION_UNSURE }, "en"), "Ciudad de México — Borough: Not defined yet")
})
