"use client"

/**
 * Profiler controls.
 *
 * Every control here exists so an answer costs one gesture instead of one
 * form field: a slider instead of a number, a row of pills instead of a
 * multi-select, a stepper instead of a text input. They are deliberately
 * plain building blocks — all copy arrives as props from the locale files.
 */

import { useEffect, useId, useMemo, useRef, useState } from "react"

import type { ProfilerChoice } from "./content/types"

/* ── Field shell ───────────────────────────────────────────────── */

export function ProfilerField({
  label,
  hint,
  children,
  wide,
}: {
  label: string
  hint?: string
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <div className="semantic-profiler-field" data-wide={wide ? "" : undefined}>
      <p className="semantic-profiler-field-label">
        {label}
        {hint ? <span className="semantic-profiler-field-hint">{hint}</span> : null}
      </p>
      {children}
    </div>
  )
}

/* ── Chip row: single or multiple selection ────────────────────── */

export function ProfilerChips({
  options,
  value,
  onSelect,
  ariaLabel,
}: {
  options: ProfilerChoice[]
  /** A single id for single choice, or the set of selected ids for many. */
  value: string | ReadonlySet<string>
  onSelect: (id: string) => void
  ariaLabel: string
}) {
  const isOn = (id: string) =>
    typeof value === "string" ? value === id : value.has(id)

  return (
    <div className="semantic-profiler-chips" role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          type="button"
          key={option.id}
          className="semantic-profiler-chip"
          data-selected={isOn(option.id) ? "" : undefined}
          aria-pressed={isOn(option.id)}
          onClick={() => onSelect(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

/* ── Option cards: a chip row that carries one line of reasoning ─ */

export function ProfilerCards({
  options,
  value,
  onSelect,
  ariaLabel,
}: {
  options: ProfilerChoice[]
  value: string | ReadonlySet<string>
  onSelect: (id: string) => void
  ariaLabel: string
}) {
  const isOn = (id: string) =>
    typeof value === "string" ? value === id : value.has(id)

  return (
    <div
      className="semantic-profiler-cards"
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <button
          type="button"
          key={option.id}
          className="semantic-profiler-card"
          data-selected={isOn(option.id) ? "" : undefined}
          aria-pressed={isOn(option.id)}
          onClick={() => onSelect(option.id)}
        >
          <strong>{option.label}</strong>
          {option.note ? <span>{option.note}</span> : null}
        </button>
      ))}
    </div>
  )
}

/* ── Slider ────────────────────────────────────────────────────── */

export function ProfilerSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  ariaLabel,
  readout,
  caption,
  disabled,
}: {
  min: number
  max: number
  step?: number
  value: number
  onChange: (value: number) => void
  ariaLabel: string
  /** The large live value shown above the track. */
  readout: string
  caption?: string
  disabled?: boolean
}) {
  const filled = max === min ? 0 : ((value - min) / (max - min)) * 100

  return (
    <div className="semantic-profiler-slider" data-disabled={disabled ? "" : undefined}>
      <p className="semantic-profiler-slider-readout">
        <strong>{readout}</strong>
        {caption ? <span>{caption}</span> : null}
      </p>
      <input
        type="range"
        className="semantic-profiler-range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ "--profiler-range-filled": `${filled}%` } as React.CSSProperties}
      />
    </div>
  )
}

/* ── Stepper ───────────────────────────────────────────────────── */

export function ProfilerStepper({
  value,
  onChange,
  ariaLabel,
  unit,
  stops,
  min = 0,
  max = 5000,
}: {
  value: number
  onChange: (value: number) => void
  ariaLabel: string
  /** Rendered beside the number so it reads as meals, not as a bare count. */
  unit?: string
  /**
   * Ascending values the − / + buttons jump between. Stepping by a fixed
   * amount makes the top of the range unreachable by clicking; the scale
   * keeps every size a few taps away. Typing an exact number still works.
   */
  stops: readonly number[]
  min?: number
  max?: number
}) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next))

  const previousStop = () => {
    const lower = stops.filter((stop) => stop < value)
    return lower.length ? lower[lower.length - 1] : stops[0]
  }

  const nextStop = () => stops.find((stop) => stop > value) ?? stops[stops.length - 1]

  const atFirst = value <= stops[0]
  const atLast = value >= stops[stops.length - 1]

  return (
    <span className="semantic-profiler-stepper" role="group" aria-label={ariaLabel}>
      <button
        type="button"
        aria-label="−"
        disabled={atFirst}
        onClick={() => onChange(clamp(previousStop()))}
      >
        −
      </button>
      <span className="semantic-profiler-stepper-value">
        <input
          type="text"
          inputMode="numeric"
          value={value.toLocaleString("es-MX")}
          aria-label={ariaLabel}
          size={Math.max(3, String(value).length)}
          onChange={(event) => {
            const parsed = Number(event.target.value.replace(/[^\d]/g, ""))
            onChange(clamp(Number.isFinite(parsed) ? parsed : min))
          }}
        />
        {unit ? <span>{unit}</span> : null}
      </span>
      <button
        type="button"
        aria-label="+"
        disabled={atLast}
        onClick={() => onChange(clamp(nextStop()))}
      >
        +
      </button>
    </span>
  )
}

/** Shared meal selection and per-meal counts: home and contact stay identical. */
export function ProfilerMealShifts({
  options, value, onToggle, peopleFor, onPeopleChange, ariaLabel, peopleAria, unit, stops,
}: {
  options: ProfilerChoice[]
  value: ReadonlySet<string>
  onToggle: (id: string) => void
  peopleFor: (id: string) => number
  onPeopleChange: (id: string, value: number) => void
  ariaLabel: string
  peopleAria: string
  unit: string
  stops: readonly number[]
}) {
  return (
    <div className="semantic-profiler-shifts" role="group" aria-label={ariaLabel}>
      {options.map((shift) => {
        const selected = value.has(shift.id)
        return (
          <div className="semantic-profiler-shift" key={shift.id} data-selected={selected ? "" : undefined}>
            <button type="button" className="semantic-profiler-shift-toggle"
              aria-pressed={selected} onClick={() => onToggle(shift.id)}>
              {shift.label}
            </button>
            {selected ? (
              <ProfilerStepper
                value={peopleFor(shift.id)}
                onChange={(next) => onPeopleChange(shift.id, next)}
                ariaLabel={`${shift.label} · ${peopleAria}`}
                unit={unit}
                stops={stops}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

/* ── Day pills ─────────────────────────────────────────────────── */

export function ProfilerDayPills({
  dayNames,
  dayNamesLong,
  value,
  onToggle,
  ariaLabel,
}: {
  dayNames: string[]
  dayNamesLong: string[]
  value: ReadonlySet<number>
  onToggle: (index: number) => void
  ariaLabel: string
}) {
  return (
    <div className="semantic-profiler-days" role="group" aria-label={ariaLabel}>
      {dayNames.map((day, index) => (
        <button
          type="button"
          key={`${day}-${index}`}
          className="semantic-profiler-day"
          data-selected={value.has(index) ? "" : undefined}
          aria-pressed={value.has(index)}
          aria-label={dayNamesLong[index] ?? day}
          onClick={() => onToggle(index)}
        >
          <span aria-hidden="true">{day}</span>
        </button>
      ))}
    </div>
  )
}

/* ── State combobox ────────────────────────────────────────────── */

const normalise = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

export function ProfilerCombobox({
  options,
  value,
  onChange,
  label,
  placeholder,
  allowCustomValue = false,
}: {
  options: string[]
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  /** Let an inquiry name a city outside our suggestions, without implying coverage. */
  allowCustomValue?: boolean
}) {
  const listId = useId()
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [open])

  const matches = useMemo(() => {
    const needle = normalise(query.trim())
    if (!needle || (!allowCustomValue && needle === normalise(value))) return options.slice(0, 6)
    return options.filter((option) => normalise(option).includes(needle)).slice(0, 6)
  }, [options, query, value, allowCustomValue])

  return (
    <div className="semantic-profiler-combobox" ref={rootRef}>
      <input
        type="text"
        role="combobox"
        aria-expanded={open && matches.length > 0}
        aria-controls={open && matches.length > 0 ? listId : undefined}
        aria-autocomplete="list"
        aria-label={label}
        placeholder={placeholder}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value)
          if (allowCustomValue) onChange(event.target.value)
          setOpen(true)
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false)
          if (event.key === "Enter" && matches[0]) {
            event.preventDefault()
            onChange(matches[0])
            setOpen(false)
          }
        }}
      />
      {open && matches.length > 0 ? (
        <ul className="semantic-profiler-combobox-list" id={listId} role="listbox">
          {matches.map((option) => (
            <li key={option} role="option" aria-selected={option === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(option)
                  setOpen(false)
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

/* ── Toggle ────────────────────────────────────────────────────── */

export function ProfilerToggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="semantic-profiler-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  )
}
