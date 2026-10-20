"use client"

import { useId } from "react"
import {
  changeLocationRegion, getLocationContent, inquiryRegions, LOCATION_UNSURE,
  type InquiryLocation,
} from "@/app/lib/inquiry-locations"

/** One dependent location selector shared by the homepage and contact inquiry. */
export function InquiryLocationFields({ locale, value, onChange }: {
  locale: string
  value: InquiryLocation
  onChange: (value: InquiryLocation) => void
}) {
  const hintId = useId()
  const labels = getLocationContent(locale)
  const region = inquiryRegions.find((item) => item.id === value.region)
  return (
    <div className="semantic-profiler-step-fields" data-inquiry-location="">
      <label className="ds-contact-field">
        <span>{labels.region}</span>
        <select value={value.region} aria-describedby={hintId}
          onChange={(event) => onChange(changeLocationRegion(event.target.value))}>
          <option value="" disabled>{labels.chooseRegion}</option>
          {inquiryRegions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
      {region ? (
        <label className="ds-contact-field">
          <span>{region.id === "cdmx" ? labels.borough : labels.municipality}</span>
          <select value={value.district} aria-describedby={hintId}
            onChange={(event) => onChange({ region: region.id, district: event.target.value })}>
            <option value="" disabled>{labels.chooseDistrict}</option>
            {region.districts.map((district) => <option key={district} value={district}>{district}</option>)}
            <option value={LOCATION_UNSURE}>{labels.unsure}</option>
          </select>
        </label>
      ) : null}
      <p id={hintId} className="semantic-profiler-note">{labels.availability}</p>
    </div>
  )
}
