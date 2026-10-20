/**
 * Profiler recommendation engine.
 *
 * Encodes how Zitrone actually scopes a workplace: headcount decides which
 * formats make economic sense (a full comedor needs volume; machines and
 * pantry work at any size), the selected day moments map to real services,
 * and the service style splits self-serve formats from staffed ones.
 * All copy lives in the locale content files, keyed by the reason ids
 * emitted here.
 */

export type ProfilerSize = "xs" | "s" | "m" | "l" | "unsure"

/**
 * Headcount is captured as a slider over discrete stops rather than as five
 * buttons: the stops keep the values realistic (nobody scopes a site at 137
 * people) while the control still reads as continuous.
 */
export const HEADCOUNT_STOPS = [
  10, 20, 30, 40, 50, 75, 100, 150, 200, 300, 400, 500, 750, 1000, 1500, 2000,
] as const

export const HEADCOUNT_DEFAULT_INDEX = 7 // 150 people

/** The bucket the recommendation engine reasons with, derived from the slider. */
export function sizeFromHeadcount(headcount: number): Exclude<ProfilerSize, "unsure"> {
  if (headcount < 50) return "xs"
  if (headcount < 150) return "s"
  if (headcount < 500) return "m"
  return "l"
}

/** Day parts that carry a real meal, each with its own shift headcount. */
export type ProfilerShiftId = "breakfast" | "lunch" | "dinner" | "night"

/**
 * Shifts map onto the engine's moments: the engine only distinguishes
 * breakfast from the daily meal, so dinner and the night shift both read as
 * a daily meal service.
 */
const SHIFT_TO_MOMENT: Record<ProfilerShiftId, ProfilerMomentId> = {
  breakfast: "breakfast",
  lunch: "lunch",
  dinner: "lunch",
  night: "lunch",
}

export function momentsFromAnswers(
  shifts: ReadonlySet<ProfilerShiftId>,
  extras: ReadonlySet<ProfilerMomentId>,
): Set<ProfilerMomentId> {
  const moments = new Set<ProfilerMomentId>(extras)
  shifts.forEach((shift) => moments.add(SHIFT_TO_MOMENT[shift]))
  return moments
}

export type ProfilerMomentId =
  | "lunch"
  | "breakfast"
  | "coffee"
  | "snacks"
  | "water"
  | "events"

export type ProfilerStyle = "selfserve" | "staffed" | "recommend"

export type ProfilerServiceId =
  | "comedor"
  | "cafeteria"
  | "pantry"
  | "maquinas"
  | "carritos"
  | "catering"

export type ProfilerVerdict = "strong" | "lean" | "custom"

export type ProfilerPick = {
  service: ProfilerServiceId
  reason: string
  anchor: boolean
}

export type ProfilerOutcome = {
  verdict: ProfilerVerdict
  picks: ProfilerPick[]
  /** Matched services beyond the three shown as cards. */
  extras: ProfilerServiceId[]
  /** True when a selected moment has no honest service match at this scale. */
  hasUncovered: boolean
}

/** The style question only matters when a fuel moment needs a format decision. */
export function needsStyleStep(moments: ReadonlySet<string>): boolean {
  return moments.has("coffee") || moments.has("snacks") || moments.has("breakfast")
}

const PICK_PRIORITY: ProfilerServiceId[] = [
  "comedor",
  "cafeteria",
  "carritos",
  "maquinas",
  "pantry",
  "catering",
]

const MAX_PICKS = 3

export function computeProfilerOutcome(
  size: ProfilerSize | "",
  moments: ReadonlySet<ProfilerMomentId>,
  style: ProfilerStyle | "",
): ProfilerOutcome {
  if (!size || size === "unsure" || moments.size === 0) {
    return { verdict: "custom", picks: [], extras: [], hasUncovered: false }
  }

  const picked = new Map<ProfilerServiceId, string>()
  const covered = new Set<ProfilerMomentId>()
  const big = size === "m" || size === "l"
  const staffed = style === "staffed"
  const wantsBreakfast = moments.has("breakfast")

  let verdict: ProfilerVerdict = "strong"

  // Daily lunch: the anchor decision. Comedor economics need volume; below
  // ~50 people the honest answer is box lunch through catering.
  if (moments.has("lunch")) {
    if (size === "xs") {
      picked.set(
        "catering",
        moments.has("events") ? "catering-box-lunch-events" : "catering-box-lunch",
      )
      covered.add("lunch")
      if (moments.has("events")) covered.add("events")
      verdict = "lean"
    } else if (size === "s") {
      picked.set(
        "comedor",
        wantsBreakfast ? "comedor-comisariato-breakfast" : "comedor-comisariato",
      )
      covered.add("lunch")
      if (wantsBreakfast) covered.add("breakfast")
    } else {
      picked.set("comedor", wantsBreakfast ? "comedor-full-breakfast" : "comedor-full")
      covered.add("lunch")
      if (wantsBreakfast) covered.add("breakfast")
    }
  } else if (wantsBreakfast && big) {
    // Breakfast without lunch: only a staffed café covers a daily morning
    // service, and it needs the traffic of a larger site.
    picked.set("cafeteria", "cafeteria-morning")
    covered.add("breakfast")
  }

  // Coffee: staffed café bar for larger sites that want hospitality,
  // machines everywhere else.
  if (moments.has("coffee")) {
    if (big && staffed && !picked.has("cafeteria")) {
      picked.set("cafeteria", "cafeteria-hub")
      covered.add("coffee")
    } else if (picked.has("cafeteria")) {
      covered.add("coffee")
    } else {
      picked.set(
        "maquinas",
        moments.has("water") ? "maquinas-coffee-water" : "maquinas-coffee",
      )
      covered.add("coffee")
      if (moments.has("water")) covered.add("water")
    }
  }

  // Water: the machines program covers filtered water even when a café bar
  // handles the coffee moment.
  if (moments.has("water") && !covered.has("water")) {
    picked.set("maquinas", picked.get("maquinas") ?? "maquinas-water")
    covered.add("water")
  }

  // Snacks: a staffed cart tours the floors of larger sites; pantry with
  // per-person allocation is the default everywhere else.
  if (moments.has("snacks")) {
    if (picked.get("cafeteria") === "cafeteria-hub") {
      covered.add("snacks")
    } else if (big && staffed && !picked.has("cafeteria")) {
      picked.set("carritos", "carritos-floors")
      covered.add("snacks")
    } else {
      picked.set("pantry", "pantry-daily")
      covered.add("snacks")
    }
  }

  // Events: catering, unless box lunch already carries both moments.
  if (moments.has("events") && !covered.has("events")) {
    picked.set("catering", picked.get("catering") ?? "catering-events")
    covered.add("events")
  }

  const ordered = PICK_PRIORITY.filter((service) => picked.has(service))
  const picks = ordered.slice(0, MAX_PICKS).map((service, index) => ({
    service,
    reason: picked.get(service)!,
    anchor: index === 0,
  }))
  const extras = ordered.slice(MAX_PICKS)

  const hasUncovered = [...moments].some((moment) => !covered.has(moment))

  if (picks.length === 0) {
    return { verdict: "custom", picks: [], extras: [], hasUncovered: false }
  }

  return { verdict, picks, extras, hasUncovered }
}
