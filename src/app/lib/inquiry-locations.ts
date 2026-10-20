/** Existing commercial inquiry zones, reorganized without adding coverage.
 * Source: the former profilerPlaces list in home/content/shared.ts.
 * These are inherited choices, not a national geographic catalog or proof of
 * service availability. Client approval of each zone/service is still pending.
 */
export const inquiryRegions = [
  { id: "cdmx", name: "Ciudad de México", districts: [
    "Álvaro Obregón", "Azcapotzalco", "Benito Juárez", "Coyoacán", "Cuajimalpa",
    "Cuauhtémoc", "Gustavo A. Madero", "Iztapalapa", "Miguel Hidalgo", "Tlalpan",
  ] },
  { id: "edomex", name: "Estado de México", districts: [
    "Naucalpan", "Tlalnepantla", "Ecatepec", "Toluca", "Lerma",
    "Cuautitlán Izcalli", "Tepotzotlán", "Huixquilucan",
  ] },
  { id: "nuevo-leon", name: "Nuevo León", districts: [
    "Monterrey", "San Pedro Garza García", "San Nicolás de los Garza", "Apodaca",
    "Santa Catarina", "Guadalupe", "Escobedo",
  ] },
  { id: "jalisco", name: "Jalisco", districts: [
    "Guadalajara", "Zapopan", "Tlaquepaque", "Tlajomulco", "El Salto", "Puerto Vallarta",
  ] },
  { id: "queretaro", name: "Querétaro", districts: [
    "Querétaro", "El Marqués", "San Juan del Río", "Colón",
  ] },
  { id: "hidalgo", name: "Hidalgo", districts: ["Pachuca", "Tula", "Tepeji del Río"] },
] as const

export type InquiryLocation = { region: string; district: string }
export const LOCATION_UNSURE = "__unsure__"

export function getLocationContent(locale: string) {
  return locale === "en" ? {
    region: "State / federal entity",
    chooseRegion: "Select a state or entity",
    municipality: "Municipality",
    borough: "Borough",
    chooseDistrict: "Select a location",
    unsure: "Not defined yet",
    availability: "Availability is confirmed for your specific location and service, not for the entire state.",
  } : {
    region: "Estado / entidad federativa",
    chooseRegion: "Selecciona un estado o entidad",
    municipality: "Municipio",
    borough: "Alcaldía",
    chooseDistrict: "Selecciona una ubicación",
    unsure: "Aún por definir",
    availability: "La disponibilidad se confirma para tu ubicación y servicio, no para todo el estado.",
  }
}

/** Changing the parent always clears the child; reject unknown region ids. */
export function changeLocationRegion(region: string): InquiryLocation {
  return { region: inquiryRegions.some((item) => item.id === region) ? region : "", district: "" }
}

/** An unmatched or stale municipality must never look like a valid location. */
export function formatInquiryLocation(value: InquiryLocation, locale: string): string {
  const region = inquiryRegions.find((item) => item.id === value.region)
  if (!region) return ""
  const labels = getLocationContent(locale)
  const districtLabel = region.id === "cdmx" ? labels.borough : labels.municipality
  if (value.district === LOCATION_UNSURE) return `${region.name} — ${districtLabel}: ${labels.unsure}`
  if (!(region.districts as readonly string[]).includes(value.district)) return ""
  return `${region.name} — ${districtLabel}: ${value.district}`
}
