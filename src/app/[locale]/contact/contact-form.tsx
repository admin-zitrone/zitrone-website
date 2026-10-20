"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"

import { InquiryLocationFields } from "@/app/_components/inquiry-location-fields"
import { formatInquiryLocation, type InquiryLocation } from "@/app/lib/inquiry-locations"
import {
  ProfilerCards,
  ProfilerChips,
  ProfilerDayPills,
  ProfilerField,
  ProfilerMealShifts,
  ProfilerSlider,
  ProfilerToggle,
} from "@/app/_components/home/profiler-controls"
import {
  HEADCOUNT_DEFAULT_INDEX,
  HEADCOUNT_STOPS,
} from "@/app/_components/home/profiler-logic"
import type { HomeContent } from "@/app/_components/home/home-data"
import type { ContactPageContent } from "@/app/lib/contact-content"
import { contactFunnelFailureEvent, submitContactRequest } from "@/app/lib/contact"
import {
  resetLeadFormStart,
  trackLeadFormStart,
  trackLeadFormStep,
  trackLeadGenerated,
} from "@/lib/analytics/lead-events"
import { trackClientEvent } from "@/lib/observability/client"
import { observabilityEvents } from "@/lib/observability/events"

type ContactFormProps = {
  locale: string
  content: ContactPageContent
  home: HomeContent
}

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "error"; message: string }
  | { state: "sent"; id: string }

type StageId = "service" | "site" | "schedule" | "food" | "space" | "terms" | "contact"
const DINING_STAGES = new Set(["schedule", "food", "space", "terms"])

/** The navbar floats over the page, so a step scrolled to the top has to stop
    short of it. */
const NAVBAR_CLEARANCE = 116

/**
 * The brief, one question at a time.
 *
 * Nobody is shown thirteen questions at once: each step asks one thing and
 * allows optional details to stay empty, and the stage bar says where in the
 * whole you are. The questions and their wording are the home brief's, read
 * from the same label objects the profiler renders from.
 */
const FAILURE_EVENTS = {
  validation: observabilityEvents.contactRequestValidationError,
  delivery: observabilityEvents.contactRequestDeliveryError,
  client: observabilityEvents.contactRequestClientError,
} as const

export function ContactForm({ locale, content, home }: ContactFormProps) {
  const labels = home.componentLabels.profiler
  const [status, setStatus] = useState<Status>({ state: "idle" })
  const [stepIndex, setStepIndex] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)
  const successHeadingRef = useRef<HTMLHeadingElement>(null)
  const focusStepRef = useRef(false)
  const submittingRef = useRef(false)
  const fieldId = useId()
  const [interests, setInterests] = useState<Set<string>>(() => new Set())
  const includeDiningDetails = interests.has("comedor")
  const serviceOptions = useMemo(() => [
    ...home.profilerServices.map((service) => ({ id: service.id, label: service.title })),
    { id: "otro", label: content.form.serviceUnsure },
  ], [home.profilerServices, content.form.serviceUnsure])
  const selectedServices = serviceOptions.filter((service) => interests.has(service.id))
  // The legacy interest field is capped at 40 characters. Keep a short category
  // there and preserve every selected service, by name, in the full brief.
  const interest = selectedServices.length > 1 ? "multiple" : selectedServices[0]?.id ?? ""
  const peopleLabel = interest === "catering" ? content.form.guests : content.form.headcount

  /* ── Sitio ── */
  const [headcountIndex, setHeadcountIndex] = useState(HEADCOUNT_DEFAULT_INDEX)
  const headcount = String(HEADCOUNT_STOPS[headcountIndex])
  const [location, setLocation] = useState<InquiryLocation>({ region: "", district: "" })
  const place = formatInquiryLocation(location, locale)
  const [placeUnsure, setPlaceUnsure] = useState(false)

  /* ── Horario ── */
  const [days, setDays] = useState<Set<number>>(() => new Set([0, 1, 2, 3, 4]))
  const [shifts, setShifts] = useState<Set<string>>(() => new Set())
  const [shiftPeople, setShiftPeople] = useState<Record<string, number>>({})
  const peopleFor = (id: string) => shiftPeople[id] ?? Number(headcount)

  /* ── Comida ── */
  const [menuTier, setMenuTier] = useState("")
  const [extras, setExtras] = useState<Set<string>>(() => new Set())
  const [style, setStyle] = useState("")

  /* ── Espacio ── */
  const [facility, setFacility] = useState("")

  /* ── Condiciones ── */
  const [budgetValue, setBudgetValue] = useState(180)
  const [budgetOptOut, setBudgetOptOut] = useState(false)
  const budget = budgetOptOut ? "" : String(budgetValue)
  const [subsidized, setSubsidized] = useState("")
  const [subsidyValue, setSubsidyValue] = useState(50)
  const subsidy = String(subsidyValue)

  /* ── Contacto ── */
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [notesNone, setNotesNone] = useState(false)
  const [source, setSource] = useState("")
  const [website, setWebsite] = useState("")

  const [errors, setErrors] = useState<Record<string, string>>({})

  const toggle = <T,>(set: Set<T>, value: T) => {
    const next = new Set(set)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    return next
  }

  /* The controls are the home brief's own components, not lookalikes, so the
     two forms behave and read identically. */

  const labelFor = (options: { id: string; label: string }[], id: string) =>
    options.find((option) => option.id === id)?.label ?? ""

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  /* ── The steps ──────────────────────────────────────────────
     One question per step, each with the stage it belongs to and the
     condition that lets the form move on. Additional services, notes and
     marketing-source details are optional, not barriers to an inquiry. */
  const steps = useMemo(
    () => [
      {
        id: "service",
        stage: "service" as StageId,
        title: content.form.steps.service.title,
        copy: content.form.steps.service.lede,
        answered: interests.size > 0,
        field: (
          <ProfilerCards
            options={serviceOptions}
            value={interests}
            ariaLabel={content.form.steps.service.title}
            onSelect={(id) => setInterests((previous) => {
              if (id === "otro") return previous.has(id) ? new Set() : new Set([id])
              const next = toggle(previous, id)
              next.delete("otro")
              return next
            })}
          />
        ),
      },
      {
        id: "site",
        stage: "site" as StageId,
        title: content.form.steps.site.title,
        copy: content.form.steps.site.lede,
        answered: placeUnsure || place.trim().length > 0,
        field: (
          <>
            <ProfilerField label={peopleLabel}>
              <ProfilerSlider
                min={0}
                max={HEADCOUNT_STOPS.length - 1}
                value={headcountIndex}
                ariaLabel={peopleLabel}
                readout={`${Number(headcount).toLocaleString("es-MX")}${
                  headcountIndex === HEADCOUNT_STOPS.length - 1 ? "+" : ""
                }`}
                caption={content.form.headcountHint}
                onChange={setHeadcountIndex}
              />
            </ProfilerField>

            {!placeUnsure ? <InquiryLocationFields locale={locale} value={location} onChange={setLocation} /> : null}
            <ProfilerToggle
              label={content.form.cityUnsure}
              checked={placeUnsure}
              onChange={setPlaceUnsure}
            />
          </>
        ),
      },
      {
        id: "schedule",
        stage: "schedule" as StageId,
        title: content.form.steps.schedule.title,
        copy: content.form.steps.schedule.lede,
        answered: days.size > 0 && shifts.size > 0 && [...shifts].every((id) => peopleFor(id) > 0),
        field: (
          <>
            <ProfilerField label={content.form.days}>
              {/* The three shapes almost everyone picks, one tap each. */}
              <div className="ds-contact-presets">
                {[
                  { id: "weekdays", label: content.form.daysWeekdays, value: [0, 1, 2, 3, 4] },
                  { id: "six", label: content.form.daysSix, value: [0, 1, 2, 3, 4, 5] },
                  { id: "all", label: content.form.daysAll, value: [0, 1, 2, 3, 4, 5, 6] },
                ].map((preset) => {
                  const active =
                    days.size === preset.value.length &&
                    preset.value.every((index) => days.has(index))
                  return (
                    <button
                      type="button"
                      key={preset.id}
                      className="ds-contact-preset"
                      data-active={active ? "" : undefined}
                      aria-pressed={active}
                      onClick={() => setDays(new Set(preset.value))}
                    >
                      {preset.label}
                    </button>
                  )
                })}
              </div>
              <ProfilerDayPills
                dayNames={labels.schedule.dayNames}
                dayNamesLong={labels.schedule.dayNamesLong}
                value={days}
                ariaLabel={content.form.days}
                onToggle={(index) => setDays(toggle(days, index))}
              />
            </ProfilerField>

            <ProfilerField label={content.form.meals}>
              <ProfilerMealShifts
                options={labels.shifts}
                value={shifts}
                ariaLabel={content.form.meals}
                onToggle={(id) => setShifts(toggle(shifts, id))}
                peopleFor={peopleFor}
                onPeopleChange={(id, value) => setShiftPeople((previous) => ({ ...previous, [id]: value }))}
                peopleAria={labels.schedule.peopleAria}
                unit={labels.schedule.mealsUnit}
                stops={HEADCOUNT_STOPS}
              />
            </ProfilerField>
          </>
        ),
      },
      {
        id: "food",
        stage: "food" as StageId,
        title: content.form.steps.food.title,
        copy: content.form.steps.food.lede,
        answered: menuTier !== "" && style !== "",
        field: (
          <>
            <ProfilerField label={content.form.menu}>
              <ProfilerCards
                options={labels.menuTiers}
                value={menuTier}
                ariaLabel={content.form.menu}
                onSelect={setMenuTier}
              />
            </ProfilerField>

            <ProfilerField label={content.form.extras}>
              <ProfilerChips
                options={home.profilerMoments.map((moment) => ({ id: moment.id, label: moment.title }))}
                value={extras}
                ariaLabel={content.form.extras}
                onSelect={(id) => setExtras(toggle(extras, id))}
              />
            </ProfilerField>

            <ProfilerField label={content.form.style}>
              <ProfilerCards
                options={home.profilerStyles.map((item) => ({ id: item.id, label: item.title, note: item.text }))}
                value={style}
                ariaLabel={content.form.style}
                onSelect={setStyle}
              />
            </ProfilerField>
          </>
        ),
      },
      {
        id: "space",
        stage: "space" as StageId,
        title: content.form.steps.space.title,
        copy: content.form.steps.space.lede,
        answered: facility !== "",
        field: (
          <>
            <ProfilerField label={content.form.facility}>
              <ProfilerCards
                options={labels.facilities}
                value={facility}
                ariaLabel={content.form.facility}
                onSelect={setFacility}
              />
            </ProfilerField>
          </>
        ),
      },
      {
        id: "terms",
        stage: "terms" as StageId,
        title: content.form.steps.terms.title,
        copy: content.form.steps.terms.lede,
        answered: subsidized !== "",
        field: (
          <>
            <ProfilerField label={content.form.budget}>
              <ProfilerSlider
                min={0}
                max={350}
                step={10}
                value={budgetValue}
                disabled={budgetOptOut}
                ariaLabel={content.form.budget}
                readout={`$${budgetValue}`}
                caption={content.form.budgetHint}
                onChange={setBudgetValue}
              />
            </ProfilerField>

            <ProfilerToggle
              label={content.form.budgetOptOut}
              checked={budgetOptOut}
              onChange={setBudgetOptOut}
            />

            <ProfilerField label={content.form.subsidized}>
              <ProfilerChips
                options={labels.subsidizedOptions}
                value={subsidized}
                ariaLabel={content.form.subsidized}
                onSelect={setSubsidized}
              />
            </ProfilerField>
                        {subsidized === "yes" ? (
                          <ProfilerField label={content.form.subsidy}>
                <ProfilerSlider
                  min={0}
                  max={100}
                  step={5}
                  value={subsidyValue}
                  ariaLabel={content.form.subsidy}
                  readout={`${subsidyValue}%`}
                  caption={content.form.subsidyHint}
                  onChange={setSubsidyValue}
                />
              </ProfilerField>
                        ) : null}
          </>
        ),
      },
      {
        id: "contact",
        stage: "contact" as StageId,
        title: content.form.steps.contact.title,
        copy: "",
        answered: name.trim().length >= 2 && emailValid,
        field: (
          <>
            <div className="ds-contact-row">
                          <label className="ds-contact-field">
                            <span>{content.form.name}</span>
                            <input
                              type="text"
                              id={`${fieldId}-name`}
                              required
                              maxLength={120}
                              autoComplete="name"
                              value={name}
                              aria-invalid={errors.name ? true : undefined}
                              aria-describedby={errors.name ? `${fieldId}-name-error` : undefined}
                              onChange={(event) => setName(event.target.value)}
                            />
                            {errors.name ? <em id={`${fieldId}-name-error`} className="ds-contact-error">{errors.name}</em> : null}
                          </label>
                          <label className="ds-contact-field">
                            <span>{content.form.company}</span>
                            <input
                              type="text"
                              autoComplete="organization"
                              value={company}
                              onChange={(event) => setCompany(event.target.value)}
                            />
                          </label>
                        </div>
                        <div className="ds-contact-row">
                          <label className="ds-contact-field">
                            <span>{content.form.email}</span>
                            <input
                              type="email"
                              id={`${fieldId}-email`}
                              required
                              maxLength={254}
                              autoComplete="email"
                              value={email}
                              aria-invalid={errors.email ? true : undefined}
                              aria-describedby={errors.email ? `${fieldId}-email-error` : undefined}
                              onChange={(event) => setEmail(event.target.value)}
                            />
                            {errors.email ? <em id={`${fieldId}-email-error`} className="ds-contact-error">{errors.email}</em> : null}
                          </label>
                          <label className="ds-contact-field">
                            <span>
                              {content.form.phone} <em>{content.form.phoneOptional}</em>
                            </span>
                            <input
                              type="tel"
                              autoComplete="tel"
                              value={phone}
                              onChange={(event) => setPhone(event.target.value)}
                            />
                          </label>
                        </div>

            <label className="ds-contact-field">
                          <span>{content.form.notes}</span>
                          <textarea
                            rows={4}
                            value={notes}
                            disabled={notesNone}
                            placeholder={interest === "catering"
                              ? content.form.cateringNotesPlaceholder
                              : interest === "maquinas"
                                ? content.form.equipmentNotesPlaceholder
                                : content.form.notesPlaceholder}
                            onChange={(event) => setNotes(event.target.value)}
                          />
                        </label>
                        <label className="ds-contact-check">
                          <input
                            type="checkbox"
                            checked={notesNone}
                            onChange={(event) => setNotesNone(event.target.checked)}
                          />
                          <span>{content.form.notesNone}</span>
                        </label>
                        <ProfilerField label={content.form.source}>
              <ProfilerChips
                options={labels.sourceOptions}
                value={source}
                ariaLabel={content.form.source}
                onSelect={setSource}
              />
            </ProfilerField>
          </>
        ),
      },
    ].filter((item) => includeDiningDetails || !DINING_STAGES.has(item.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      labels, home, content, errors, fieldId,
      interest, interests, serviceOptions, peopleLabel, includeDiningDetails, placeUnsure,
      headcountIndex, place, location, locale, days, shifts, shiftPeople,
      menuTier, extras, style, facility,
      budget, budgetOptOut, subsidized, subsidy,
      name, company, email, phone, notes, notesNone, source, emailValid,
    ],
  )

  const step = steps[stepIndex]
  const isLast = stepIndex === steps.length - 1
  const progress = steps.length > 1 ? (stepIndex / (steps.length - 1)) * 100 : 0

  const goTo = (next: number) => {
    if (submittingRef.current) return
    focusStepRef.current = true
    const target = Math.min(Math.max(next, 0), steps.length - 1)
    if (target !== stepIndex) trackLeadFormStep("contact", target, steps[target].id)
    setStepIndex(target)
  }

  /* Scrolling has to wait for the new step to be laid out: the steps differ in
     height, so measuring during the click lands the reader in the middle of
     the next question. Running it after paint, against a measured offset for
     the floating navbar, puts the question back at the top every time. */
  useEffect(() => {
    const form = formRef.current
    if (!form || !focusStepRef.current) return
    const frame = requestAnimationFrame(() => {
      stepHeadingRef.current?.focus({ preventScroll: true })
      focusStepRef.current = false
      const top = window.scrollY + form.getBoundingClientRect().top - NAVBAR_CLEARANCE
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      window.scrollTo({ top: Math.max(0, top), behavior: reduced ? "auto" : "smooth" })
    })
    return () => cancelAnimationFrame(frame)
  }, [stepIndex])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus()
    }
  }, [errors])

  useEffect(() => {
    if (status.state === "sent") successHeadingRef.current?.focus()
  }, [status.state])

  useEffect(() => {
    trackClientEvent(observabilityEvents.contactFormViewed, { locale, form: "contact" })
  }, [locale])

  useEffect(() => () => resetLeadFormStart("contact"), [])

  /* The brief the sales team reads, in the same shape the home brief mails. */
  const buildBrief = () => {
    const lines: string[] = []
    const push = (label: string, value: string) => {
      if (value) lines.push(`${label}: ${value}`)
    }

    push(content.form.steps.service.title, selectedServices.map((service) => service.label).join(", "))
    push(peopleLabel, headcount)
    push(labels.brief.location, placeUnsure ? content.form.cityUnsure : place)
    // Hidden qualification answers must never leak into a different service
    // or the short path after the visitor changes their choice.
    if (includeDiningDetails) {
    push(
      labels.brief.days,
      [...days]
        .sort((a, b) => a - b)
        .map((index) => labels.schedule.dayNamesLong[index])
        .join(", "),
    )
    push(
      labels.brief.shifts,
      labels.shifts
        .filter((shift) => shifts.has(shift.id))
        .map((shift) => `${shift.label}: ${peopleFor(shift.id)} ${labels.schedule.mealsUnit}`)
        .join(", "),
    )
    push(labels.brief.menu, labelFor(labels.menuTiers, menuTier))
    push(
      labels.food.extrasLabel,
      home.profilerMoments
        .filter((moment) => extras.has(moment.id))
        .map((moment) => moment.title)
        .join(", "),
    )
    push(
      labels.food.styleLabel,
      home.profilerStyles.find((item) => item.id === style)?.title ?? "",
    )
    push(labels.brief.space, labelFor(labels.facilities, facility))
    push(
      labels.terms.budgetLabel,
      budgetOptOut ? labels.terms.budgetOptOut : budget ? `$${budget} MXN` : "",
    )
    push(labels.terms.subsidizedLabel, labelFor(labels.subsidizedOptions, subsidized))
    push(labels.terms.subsidyLabel, subsidized === "yes" ? `${subsidy}%` : "")
    }
    push(labels.start.nameLabel, name)
    push(labels.start.companyLabel, company)
    push(labels.start.emailLabel, email)
    push(labels.start.phoneLabel, phone)
    push(labels.start.notesLabel, notesNone ? content.form.notesNone : notes)
    push(labels.start.sourceLabel, labelFor(labels.sourceOptions, source))

    return lines.join("\n")
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (website || submittingRef.current) return
    if (!isLast) return

    const nextErrors: Record<string, string> = {}
    if (name.trim().length < 2) nextErrors.name = content.nameError
    if (!emailValid) nextErrors.email = content.emailError
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      goTo(steps.findIndex((item) => item.id === "contact"))
      return
    }

    submittingRef.current = true
    setStatus({ state: "sending" })
    trackClientEvent(observabilityEvents.contactFormSubmitAttempt, {
      locale,
      form: "contact",
      interest,
    })
    /* Mismo envío que el perfilador del home: un endpoint, un payload,
       un folio. La única diferencia es el sourcePath. */
    try {
      const result = await submitContactRequest({
        locale,
        name,
        company,
        email,
        phone,
        interest,
        headcount,
        message: buildBrief(),
        sourcePath: `/${locale}/contact`,
        website,
      }, "contact")
      if (!result.ok) {
        trackClientEvent(FAILURE_EVENTS[contactFunnelFailureEvent(result)], {
          locale,
          form: "contact",
          code: result.code,
        })
        // Use our localized messages, not untrusted server text. Preserve all
        // answers so a failed request can be corrected and retried.
        const fieldErrors: Record<string, string> = {}
        if (result.errors?.name) fieldErrors.name = content.nameError
        if (result.errors?.email) fieldErrors.email = content.emailError
        setErrors(fieldErrors)
        setStatus({ state: "error", message: content.errorMessage })
        return
      }
      if (result.persisted) {
        trackClientEvent(observabilityEvents.contactRequestAccepted, {
          locale,
          form: "contact",
          interest,
          requestId: result.requestId,
        })
        trackLeadGenerated("contact", { requestId: result.requestId, interest, headcount, locale })
      }
      setStatus({ state: "sent", id: result.requestId })
    } catch {
      trackClientEvent(observabilityEvents.contactRequestClientError, { locale, form: "contact" })
      setStatus({ state: "error", message: content.errorMessage })
    } finally {
      submittingRef.current = false
    }
  }

  if (status.state === "sent") {
    return (
      <div className="ds-contact-sent" role="status">
        <h2 ref={successHeadingRef} tabIndex={-1} className="ds-contact-sent-title">{content.successTitle}</h2>
        <p className="ds-contact-sent-copy">{content.successBody}</p>
        {status.id ? (
          <p className="ds-contact-sent-meta">
            {content.successMeta} {status.id}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <form
      className="ds-contact-form"
      ref={formRef}
      aria-busy={status.state === "sending"}
      noValidate
      onSubmit={handleSubmit}
      /* Start = the first answer, not the first focus: the step heading is
         focused programmatically on every step change. */
      onChangeCapture={() => trackLeadFormStart("contact")}
      onClickCapture={() => trackLeadFormStart("contact")}
    >
      {/* ── Progress: how far in, how much left. No stage names: the
             question on screen already says what is being asked. ── */}
      <div
        className="ds-contact-progress"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={stepIndex + 1}
        aria-label={labels.stageAria}
      >
        <p className="ds-contact-progress-count">
          <strong>
            {labels.stepWord} {stepIndex + 1}
          </strong>
          <span>
            {labels.ofWord} {steps.length}
          </span>
        </p>
        <span className="ds-contact-progress-track" aria-hidden="true">
          <span className="ds-contact-progress-fill" style={{ width: `${progress}%` }} />
        </span>
      </div>

      {/* ── One question ── */}
      <div className="ds-contact-step" key={step.id}>
        <div className="ds-contact-step-head">
          <h2 ref={stepHeadingRef} tabIndex={-1} className="ds-contact-step-title">{step.title}</h2>
          {step.copy ? <p className="ds-contact-step-copy">{step.copy}</p> : null}
        </div>
        <div className="ds-contact-fields">{step.field}</div>
      </div>

      {/* Never shown, never announced: only a bot fills this. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="ds-contact-honeypot"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
      />

      {status.state === "error" ? (
        <p className="ds-contact-error" role="alert">
          {status.message}
        </p>
      ) : null}

      <div className="ds-contact-actions">
        <div className="ds-contact-actions-row">
          {stepIndex > 0 ? (
            <button
              type="button"
              className="semantic-button ds-button"
              data-variant="secondary"
              disabled={status.state === "sending"}
              onClick={() => goTo(stepIndex - 1)}
            >
              {content.back}
            </button>
          ) : null}

          {isLast ? (
            <button
              key="submit"
              type="submit"
              className="semantic-button ds-button"
              data-variant="primary"
              disabled={status.state === "sending"}
            >
              {status.state === "sending" ? content.submitting : content.form.submit}
            </button>
          ) : (
            <button
              key="next"
              type="button"
              className="semantic-button ds-button"
              data-variant="primary"
              disabled={!step.answered}
              onClick={() => goTo(stepIndex + 1)}
            >
              {content.next}
            </button>
          )}
        </div>
        {isLast ? <p className="ds-contact-caption">{content.formCaption}</p> : null}
      </div>
    </form>
  )
}
