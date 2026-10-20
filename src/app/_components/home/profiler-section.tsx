'use client'

import { useLocale } from 'next-intl'
import { Fragment, useMemo, useState } from 'react'

import { contactFunnelFailureEvent, pickContactInterest, submitContactRequest } from '@/app/lib/contact'
import { trackLeadFormStart, trackLeadFormStep, trackLeadGenerated } from '@/lib/analytics/lead-events'
import { trackClientEvent } from '@/lib/observability/client'
import { observabilityEvents } from '@/lib/observability/events'
import { Link } from '@/i18n/navigation'

import { InquiryLocationFields } from '@/app/_components/inquiry-location-fields'
import { formatInquiryLocation, type InquiryLocation } from '@/app/lib/inquiry-locations'
import { useHomeContent } from './home-content-context'
import {
  ProfilerCards,
  ProfilerChips,
  ProfilerDayPills,
  ProfilerField,
  ProfilerSlider,
  ProfilerMealShifts,
  ProfilerToggle,
} from './profiler-controls'
import {
  HEADCOUNT_DEFAULT_INDEX,
  HEADCOUNT_STOPS,
  computeProfilerOutcome,
  momentsFromAnswers,
  sizeFromHeadcount,
  type ProfilerMomentId,
  type ProfilerServiceId,
  type ProfilerShiftId,
  type ProfilerStyle,
} from './profiler-logic'

/* Stroke icons in the same 24px / 1.5-stroke language as the system tab icons. */
const profilerIconPaths: Record<ProfilerServiceId, string> = {
  comedor:
    'M20.25 12a8.25 8.25 0 1 1-16.5 0 8.25 8.25 0 0 1 16.5 0Z M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  cafeteria:
    'M4.75 9.75h10.5v4a4.75 4.75 0 0 1-4.75 4.75h-1a4.75 4.75 0 0 1-4.75-4.75v-4Z M15.25 10.5h1a2.5 2.5 0 1 1 0 5h-1.4 M8.5 6.5V4.75 M11.5 6.5V4.75',
  pantry:
    'M8.75 9V7.25a3.25 3.25 0 0 1 6.5 0V9 M5.9 9h12.2l-.75 10a1.75 1.75 0 0 1-1.74 1.62H8.39A1.75 1.75 0 0 1 6.65 19L5.9 9Z',
  maquinas:
    'M6.75 3.75h10.5v16.5H6.75Z M6.75 8.25h10.5 M12 8.25v2.25 M10.4 13.5h3.2v1.9a1.6 1.6 0 0 1-3.2 0Z',
  carritos:
    'M3.75 5.25h1.6l1.9 9.5h10.3l1.7-6.75H6.1 M9.4 18.4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z M17.4 18.4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z',
  catering:
    'M4.75 15.75a7.25 7.25 0 0 1 14.5 0 M3.25 15.75h17.5 M12 8.5V7.25 M13 6.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z',
}

function ProfilerServiceIcon({ service }: { service: ProfilerServiceId }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={profilerIconPaths[service]} />
    </svg>
  )
}

/**
 * One question per step. Secondary fields never appear next to the primary
 * control: they unfold underneath it once the primary question is answered,
 * so a step is always one decision wide.
 */
/* Every question the form can ask; `steps` below picks the ones that
   apply to the answers given so far. */
export const ALL_STEPS = [
  'size',
  'location',
  'days',
  'shifts',
  'menu',
  'extras',
  'style',
  'space',
  'budget',
  'subsidized',
  'subsidy',
  'contact',
  'notes',
] as const
type StepId = (typeof ALL_STEPS)[number]

/** Steps whose answer is a single choice: picking it moves the form on. */
const AUTO_ADVANCE: ReadonlySet<StepId> = new Set<StepId>([
  'menu',
  'style',
  'space',
  'subsidized',
])

const ADVANCE_DELAY_MS = 220

const SHIFT_IDS: ProfilerShiftId[] = ['breakfast', 'lunch', 'dinner', 'night']

/** Moments that are not a meal shift; they ride alongside the schedule. */
const EXTRA_MOMENTS: ProfilerMomentId[] = ['coffee', 'snacks', 'water', 'events']

const BUDGET_MIN = 40
const BUDGET_MAX = 350
const BUDGET_STEP = 5

const toggleInSet = <T,>(set: Set<T>, value: T) => {
  const next = new Set(set)
  if (next.has(value)) {
    next.delete(value)
  } else {
    next.add(value)
  }
  return next
}

const formatNumber = (value: number) => value.toLocaleString('es-MX')

const FAILURE_EVENTS = {
  validation: observabilityEvents.contactRequestValidationError,
  delivery: observabilityEvents.contactRequestDeliveryError,
  client: observabilityEvents.contactRequestClientError,
} as const

export function ProfilerSection() {
  const locale = useLocale()
  const { profilerMoments, profilerStyles, profilerServices, componentLabels } = useHomeContent()
  const labels = componentLabels.profiler

  /* ── Scene 1: site ─────────────────────────────────────────── */
  const [headcountIndex, setHeadcountIndex] = useState(HEADCOUNT_DEFAULT_INDEX)
  const [headcountUnsure, setHeadcountUnsure] = useState(false)
  const [location, setLocation] = useState<InquiryLocation>({ region: '', district: '' })
  const stateName = formatInquiryLocation(location, locale)

  /* ── Scene 2: schedule ─────────────────────────────────────── */
  const [days, setDays] = useState<Set<number>>(() => new Set([0, 1, 2, 3, 4]))
  const [shifts, setShifts] = useState<Set<ProfilerShiftId>>(() => new Set())
  const [shiftPeople, setShiftPeople] = useState<Partial<Record<ProfilerShiftId, number>>>({})

  /* ── Scene 3: food ─────────────────────────────────────────── */
  const [menuTier, setMenuTier] = useState('')
  const [extras, setExtras] = useState<Set<ProfilerMomentId>>(() => new Set())
  const [style, setStyle] = useState<ProfilerStyle | ''>('')

  /* ── Scene 4: space ────────────────────────────────────────── */
  const [facility, setFacility] = useState('')

  /* ── Scene 5: terms ────────────────────────────────────────── */
  const [subsidized, setSubsidized] = useState('')
  const [subsidy, setSubsidy] = useState(100)
  const [subsidyTouched, setSubsidyTouched] = useState(false)
  const [budget, setBudget] = useState(80)
  const [budgetTouched, setBudgetTouched] = useState(false)
  const [budgetUndisclosed, setBudgetUndisclosed] = useState(false)
  /* ── Contact ───────────────────────────────────────────────── */
  const [notes, setNotes] = useState('')
  const [contactName, setContactName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  /* The form waits behind an entry screen: landing straight on question one
     reads as a form that started without being asked to. */
  const [started, setStarted] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  /* Which way the next question should come in from. */
  const [direction, setDirection] = useState<'next' | 'back'>('next')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(false)
  /* Trampa para bots, igual que en /contact. */
  const [website, setWebsite] = useState('')
  const [source, setSource] = useState('')

  const headcount = HEADCOUNT_STOPS[headcountIndex]
  const atMaxHeadcount = headcountIndex === HEADCOUNT_STOPS.length - 1

  const serviceById = useMemo(
    () => new Map(profilerServices.map((service) => [service.id, service])),
    [profilerServices],
  )

  /* Each shift defaults to the site headcount, so the steppers arrive
     pre-answered and the user confirms instead of filling. */
  const peopleFor = (shift: ProfilerShiftId) => shiftPeople[shift] ?? headcount

  const mealsPerDay = useMemo(
    () =>
      SHIFT_IDS.filter((shift) => shifts.has(shift)).reduce(
        (total, shift) => total + peopleFor(shift),
        0,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shifts, shiftPeople, headcount],
  )

  const size = headcountUnsure ? 'unsure' : sizeFromHeadcount(headcount)
  const moments = useMemo(() => momentsFromAnswers(shifts, extras), [shifts, extras])
  const outcome = useMemo(
    () => computeProfilerOutcome(size, moments, style),
    [size, moments, style],
  )

  const picks = outcome.picks
    .map((pick) => ({ ...pick, info: serviceById.get(pick.service) }))
    .filter((pick) => Boolean(pick.info))
  const extraTitles = outcome.extras
    .map((serviceId) => serviceById.get(serviceId)?.title)
    .filter((title): title is string => Boolean(title))

  const verdictCopy =
    outcome.verdict === 'lean'
      ? labels.verdictLean
      : outcome.verdict === 'custom'
        ? labels.verdictCustom
        : labels.verdictStrong

  const styleNeeded = extras.has('coffee') || extras.has('snacks')

  /* Follow-up questions only exist when the answer before them calls for
     one, so the count is honest about what is actually left. */
  const steps = useMemo(() => {
    const list: StepId[] = ['size', 'location', 'days', 'shifts', 'menu', 'extras']
    if (styleNeeded) list.push('style')
    list.push('space', 'budget', 'subsidized')
    /* The percentage only makes sense once we know the company pays part of it. */
    if (subsidized === 'yes') list.push('subsidy')
    list.push('contact', 'notes')
    return list
  }, [styleNeeded, subsidized])

  const step: StepId = steps[Math.min(stepIndex, steps.length - 1)]

  /* ── The running brief ─────────────────────────────────────── */

  const daysSummary = useMemo(() => {
    if (days.size === 0) return ''
    const sorted = [...days].sort((a, b) => a - b)
    if (sorted.length === 7) return labels.schedule.allDaysSummary
    if (sorted.join() === '0,1,2,3,4') return labels.schedule.weekdaysSummary
    return sorted.map((index) => labels.schedule.dayNames[index]).join(' ')
  }, [days, labels.schedule])

  const shiftsSummary = useMemo(
    () =>
      labels.shifts
        .filter((shift) => shifts.has(shift.id as ProfilerShiftId))
        .map((shift) => `${shift.label} · ${formatNumber(peopleFor(shift.id as ProfilerShiftId))}`)
        .join(' / '),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [labels.shifts, shifts, shiftPeople, headcount],
  )

  /* The subsidy and budget sliders need a starting position, but an untouched
     slider is not an answer: the brief stays empty until the user moves one,
     so it never reports a number nobody gave us. */
  const termsSummary = useMemo(() => {
    const parts: string[] = []
    if (budgetUndisclosed) {
      parts.push(labels.terms.budgetOptOut)
    } else if (budgetTouched) {
      parts.push(labels.terms.budgetTemplate.replace('{amount}', String(budget)))
    }
    const subsidizedLabel = labels.subsidizedOptions.find(
      (option) => option.id === subsidized,
    )?.label
    if (subsidizedLabel) parts.push(subsidizedLabel)
    if (subsidized === 'yes' && subsidyTouched) parts.push(`${subsidy}%`)
    return parts.join(' · ')
  }, [
    subsidized,
    subsidy,
    subsidyTouched,
    budget,
    budgetTouched,
    budgetUndisclosed,
    labels.terms,
    labels.subsidizedOptions,
  ])

  const briefRows = useMemo(
    () => [
      {
        id: 'site',
        label: labels.brief.people,
        value: headcountUnsure
          ? labels.site.unsureLabel
          : `${formatNumber(headcount)}${atMaxHeadcount ? '+' : ''}`,
        stepIndex: steps.indexOf('size'),
      },
      {
        id: 'location',
        label: labels.brief.location,
        value: stateName,
        stepIndex: steps.indexOf('location'),
      },
      { id: 'days', label: labels.brief.days, value: daysSummary, stepIndex: steps.indexOf('days') },
      {
        id: 'shifts',
        label: labels.brief.shifts,
        value: shiftsSummary,
        stepIndex: steps.indexOf('shifts'),
      },
      {
        id: 'menu',
        label: labels.brief.menu,
        value: labels.menuTiers.find((tier) => tier.id === menuTier)?.label ?? '',
        stepIndex: steps.indexOf('menu'),
      },
      {
        id: 'space',
        label: labels.brief.space,
        value: labels.facilities.find((item) => item.id === facility)?.label ?? '',
        stepIndex: steps.indexOf('space'),
      },
      {
        id: 'terms',
        label: labels.brief.terms,
        value: termsSummary,
        stepIndex: steps.indexOf('budget'),
      },
    ],
    [
      labels,
      steps,
      headcountUnsure,
      headcount,
      atMaxHeadcount,
      stateName,
      daysSummary,
      shiftsSummary,
      menuTier,
      facility,
      termsSummary,
    ],
  )

  /* ── Submission ────────────────────────────────────────────── */


  const briefBody = useMemo(() => {
    const lines = briefRows.filter((row) => row.value).map((row) => `${row.label}: ${row.value}`)
    if (mealsPerDay > 0) {
      lines.push(labels.site.mealsTemplate.replace('{meals}', formatNumber(mealsPerDay)))
    }
    if (notes) lines.push(`${labels.start.notesLabel} ${notes}`)
    if (contactName) lines.push(`${labels.start.nameLabel}: ${contactName}`)
    if (company) lines.push(`${labels.start.companyLabel}: ${company}`)
    if (email) lines.push(`${labels.start.emailLabel}: ${email}`)
    if (phone) lines.push(`${labels.start.phoneLabel}: ${phone}`)
    if (picks.length) {
      lines.push(`${labels.brief.leaning}: ${picks.map((pick) => pick.info!.title).join(', ')}`)
    }
    return lines.join('\n')
  }, [
    briefRows,
    mealsPerDay,
    notes,
    contactName,
    company,
    email,
    phone,
    picks,
    labels,
  ])

  const canSubmit = Boolean(contactName && email)

  /* El brief del home y el de /contact son la MISMA solicitud tomada en
     dos sitios: mismo endpoint, mismo payload, mismo folio. Antes esto
     abría un mailto, así que el lead dependía de que el cliente de
     correo del visitante existiera y nunca quedaba registrado. */
  const handleSubmit = async () => {
    if (!canSubmit || sending) return
    setSending(true)
    setSendError(false)
    const interest = pickContactInterest(picks[0]?.service, menuTier, style || undefined, facility)
    trackClientEvent(observabilityEvents.contactFormSubmitAttempt, {
      locale,
      form: 'profiler',
      interest,
    })
    try {
      const result = await submitContactRequest({
        locale,
        name: contactName,
        company,
        email,
        phone,
        interest,
        headcount: headcountUnsure ? '' : String(headcount),
        message: briefBody,
        sourcePath: `/${locale}`,
        website,
      }, 'profiler')
      if (!result.ok) {
        trackClientEvent(FAILURE_EVENTS[contactFunnelFailureEvent(result)], {
          locale,
          form: 'profiler',
          code: result.code,
        })
        setSendError(true)
        return
      }
      if (result.persisted) {
        trackClientEvent(observabilityEvents.contactRequestAccepted, {
          locale,
          form: 'profiler',
          interest,
          requestId: result.requestId,
        })
        trackLeadGenerated('profiler', {
          requestId: result.requestId,
          interest,
          headcount: headcountUnsure ? '' : String(headcount),
          locale,
        })
      }
      setSubmitted(true)
    } catch {
      trackClientEvent(observabilityEvents.contactRequestClientError, { locale, form: 'profiler' })
      setSendError(true)
    } finally {
      setSending(false)
    }
  }

  const handleReset = () => {
    setStarted(false)
    setStepIndex(0)
    setSubmitted(false)
    setSource('')
  }

  /* ── Steps ─────────────────────────────────────────────────── */

  /** The question for the current step. Most are the field question itself,
      already written in the locale files. */
  const stepTitle: Record<StepId, string> = {
    size: labels.scenes.site.title,
    location: labels.scenes.location.title,
    days: labels.scenes.schedule.title,
    shifts: labels.schedule.shiftsLabel,
    menu: labels.scenes.food.title,
    extras: labels.food.extrasLabel,
    style: labels.food.styleLabel,
    space: labels.scenes.space.title,
    budget: labels.terms.budgetLabel,
    subsidized: labels.terms.subsidizedLabel,
    subsidy: labels.terms.subsidyLabel,
    contact: labels.start.contactLabel,
    notes: labels.start.notesLabel,
  }

  /**
   * Whether the current step has an answer. Optional steps report true so
   * they never block; the rest gate Continue, because a step that can be
   * walked past silently produces a brief nobody can quote from.
   */
  const answered: Record<StepId, boolean> = {
    size: true,
    location: Boolean(stateName),
    days: days.size > 0,
    shifts: shifts.size > 0,
    menu: Boolean(menuTier),
    extras: true,
    style: Boolean(style),
    space: Boolean(facility),
    budget: budgetTouched || budgetUndisclosed,
    subsidized: Boolean(subsidized),
    subsidy: subsidyTouched,
    contact: Boolean(contactName.trim() && email.trim()),
    notes: true,
  }

  const canContinue = answered[step]

  const goTo = (index: number) => {
    setDirection(index >= stepIndex ? 'next' : 'back')
    if (index !== stepIndex && steps[index]) trackLeadFormStep('profiler', index, steps[index])
    setStepIndex(index)
  }

  const goNext = () => goTo(Math.min(steps.length - 1, stepIndex + 1))
  const goBack = () => goTo(Math.max(0, stepIndex - 1))

  /** Single-choice steps advance themselves, with a beat so the selection
      is visible before the step changes. */
  const answerAndAdvance = (apply: () => void) => {
    apply()
    if (AUTO_ADVANCE.has(step)) {
      window.setTimeout(goNext, ADVANCE_DELAY_MS)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 'size':
        return (
          <>
            <ProfilerSlider
              min={0}
              max={HEADCOUNT_STOPS.length - 1}
              value={headcountIndex}
              onChange={(next) => {
                setHeadcountIndex(next)
                setHeadcountUnsure(false)
              }}
              ariaLabel={labels.site.headcountAria}
              readout={
                headcountUnsure
                  ? labels.site.unsureLabel
                  : atMaxHeadcount
                    ? labels.site.headcountMax
                    : formatNumber(headcount)
              }
              caption={
                headcountUnsure
                  ? undefined
                  : labels.site.mealsTemplate.replace('{meals}', formatNumber(headcount))
              }
              disabled={headcountUnsure}
            />
            <ProfilerToggle
              label={labels.site.unsureLabel}
              checked={headcountUnsure}
              onChange={setHeadcountUnsure}
            />
          </>
        )

      case 'location':
        return (
          <InquiryLocationFields locale={locale} value={location} onChange={setLocation} />
        )

      case 'days':
        return (
          <ProfilerDayPills
            dayNames={labels.schedule.dayNames}
            dayNamesLong={labels.schedule.dayNamesLong}
            value={days}
            onToggle={(index) => setDays((prev) => toggleInSet(prev, index))}
            ariaLabel={labels.schedule.daysAria}
          />
        )

      case 'shifts':
        return (
          <ProfilerMealShifts
            options={labels.shifts}
            value={shifts}
            ariaLabel={labels.schedule.shiftsAria}
            onToggle={(id) => setShifts((prev) => toggleInSet(prev, id as ProfilerShiftId))}
            peopleFor={(id) => peopleFor(id as ProfilerShiftId)}
            onPeopleChange={(id, next) => setShiftPeople((prev) => ({ ...prev, [id]: next }))}
            peopleAria={labels.schedule.peopleAria}
            unit={labels.schedule.mealsUnit}
            stops={HEADCOUNT_STOPS}
          />
        )

      case 'menu':
        return (
          <ProfilerCards
            options={labels.menuTiers}
            value={menuTier}
            onSelect={(id) => answerAndAdvance(() => setMenuTier(id))}
            ariaLabel={labels.food.tierAria}
          />
        )

      case 'extras':
        return (
          <ProfilerChips
            options={profilerMoments
              .filter((moment) => EXTRA_MOMENTS.includes(moment.id as ProfilerMomentId))
              .map((moment) => ({ id: moment.id, label: moment.title }))}
            value={extras}
            onSelect={(id) => setExtras((prev) => toggleInSet(prev, id as ProfilerMomentId))}
            ariaLabel={labels.food.extrasLabel}
          />
        )

      case 'style':
        return (
          <ProfilerChips
            options={profilerStyles.map((item) => ({ id: item.id, label: item.title }))}
            value={style}
            onSelect={(id) => answerAndAdvance(() => setStyle(id as ProfilerStyle))}
            ariaLabel={labels.food.styleAria}
          />
        )

      case 'space':
        return (
          <ProfilerCards
            options={labels.facilities}
            value={facility}
            onSelect={(id) => answerAndAdvance(() => setFacility(id))}
            ariaLabel={labels.space.facilityAria}
          />
        )

      case 'subsidized':
        return (
          <ProfilerChips
            options={labels.subsidizedOptions}
            value={subsidized}
            onSelect={(id) => answerAndAdvance(() => setSubsidized(id))}
            ariaLabel={labels.terms.subsidizedAria}
          />
        )

      case 'subsidy':
        return (
          <ProfilerSlider
            min={0}
            max={100}
            step={5}
            value={subsidy}
            onChange={(next) => {
              setSubsidy(next)
              setSubsidyTouched(true)
            }}
            ariaLabel={labels.terms.subsidyAria}
            readout={`${subsidy}%`}
            caption={labels.terms.subsidyTemplate
              .replace('{company}', String(subsidy))
              .replace('{employee}', String(100 - subsidy))}
          />
        )

      case 'budget':
        return (
          <>
            <ProfilerSlider
              min={BUDGET_MIN}
              max={BUDGET_MAX}
              step={BUDGET_STEP}
              value={budget}
              onChange={(next) => {
                setBudget(next)
                setBudgetTouched(true)
                setBudgetUndisclosed(false)
              }}
              ariaLabel={labels.terms.budgetAria}
              readout={
                budgetUndisclosed
                  ? labels.terms.budgetOptOut
                  : budget >= BUDGET_MAX
                    ? labels.terms.budgetMax
                    : labels.terms.budgetTemplate.replace('{amount}', String(budget))
              }
              disabled={budgetUndisclosed}
            />
            <ProfilerToggle
              label={labels.terms.budgetOptOut}
              checked={budgetUndisclosed}
              onChange={(checked) => {
                setBudgetUndisclosed(checked)
                if (checked) setBudgetTouched(true)
              }}
            />
          </>
        )

      case 'contact':
        return (
          <div className="semantic-profiler-contact">
            <label>
              <span>{labels.start.nameLabel}</span>
              <input
                type="text"
                autoComplete="name"
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
              />
            </label>
            <label>
              <span>{labels.start.emailLabel}</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label>
              <span>{labels.start.companyLabel}</span>
              <input
                type="text"
                autoComplete="organization"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
              />
            </label>
            <label>
              <span>
                {labels.start.phoneLabel} <em>{labels.start.phoneOptional}</em>
              </span>
              <input
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </label>
          </div>
        )

      case 'notes':
        return (
          <textarea
            className="semantic-profiler-textarea"
            rows={3}
            value={notes}
            aria-label={labels.start.notesLabel}
            placeholder={labels.start.notesPlaceholder}
            onChange={(event) => setNotes(event.target.value)}
          />
        )
    }
  }

  /* ── Result ────────────────────────────────────────────────── */

  const renderResult = () => (
    <div className="semantic-profiler-result">
      {picks.length > 0 ? (
        <ul className="semantic-profiler-picks">
          {picks.map((pick) => (
            <li
              className="semantic-profiler-pick"
              data-accent={pick.info!.accent}
              key={pick.service}
            >
              <span className="semantic-profiler-pick-icon">
                <ProfilerServiceIcon service={pick.service} />
              </span>
              <span className="semantic-profiler-pick-body">
                <span className="semantic-profiler-pick-title">
                  {pick.info!.title}
                  {pick.anchor && picks.length > 1 ? (
                    <span className="semantic-profiler-pick-tag">{labels.startHere}</span>
                  ) : null}
                </span>
                <span className="semantic-profiler-pick-why">
                  {labels.reasons[pick.reason] ?? ''}
                </span>
                <Link className="semantic-profiler-pick-link" href={pick.info!.href}>
                  <span>{labels.learnMore}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {extraTitles.length > 0 ? (
        <p className="semantic-profiler-note">
          {labels.alsoLabel}: {extraTitles.join(', ')}.
        </p>
      ) : null}
      {outcome.hasUncovered ? (
        <p className="semantic-profiler-note">{labels.uncoveredNote}</p>
      ) : null}
      <ProfilerField label={labels.start.sourceLabel}>
        <ProfilerChips
          options={labels.sourceOptions}
          value={source}
          onSelect={setSource}
          ariaLabel={labels.start.sourceLabel}
        />
      </ProfilerField>
      <ProfilerField label={labels.brief.reviewTitle}>
        <ul className="semantic-profiler-review">
          {briefRows
            .filter((row) => row.value)
            .map((row) => (
              <li key={row.id}>
                <span>{row.label}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    goTo(row.stepIndex)
                  }}
                  aria-label={`${labels.editLabel}: ${row.label}`}
                >
                  {row.value}
                </button>
              </li>
            ))}
        </ul>
      </ProfilerField>
    </div>
  )

  return (
    <section
      id="profiler"
      className="ds-section semantic-profiler-section semantic-service-theme-surface"
      data-size="large"
      aria-labelledby="profiler-heading"
      data-pattern="proof"
    >
      <div className="ds-container">
        <div
          className="semantic-profiler-shell"
          data-profiler=""
          data-state={started ? undefined : 'intro'}
        >
          {/* ── Rail ────────────────────────────────────────────
              The question itself is the section heading, the way this
              section always worked: copy on the left, controls on the
              right. Nothing echoes the answers back here. */}
          <aside className="semantic-profiler-rail">
            <p className="semantic-kicker ds-kicker">{labels.kicker}</p>
            {/* Same word-by-word reveal as the other home h2s. The words are
                React-owned spans, not left to the reveal hook to split, because
                this heading's text changes with every step. */}
            <h2
              className="ds-heading ds-title-reveal semantic-profiler-heading"
              data-title-reveal="words"
              id="profiler-heading"
              aria-live="polite"
            >
              {headingWords(
                !started
                  ? labels.sectionHeading
                  : submitted
                    ? verdictCopy.heading
                    : stepTitle[step],
                !started ? labels.sectionHeadingEmphasis : undefined,
              ).map((word, index) => (
                <Fragment key={`${index}-${word.text}`}>
                  {index > 0 ? ' ' : null}
                  <span>
                    {word.accent ? <em className="ds-heading-accent">{word.text}</em> : word.text}
                  </span>
                </Fragment>
              ))}
            </h2>
            {/* The question carries itself; the intro and the verdict need a lede. */}
            {!started ? (
              <p className="ds-copy semantic-profiler-body">{labels.introCopy}</p>
            ) : submitted ? (
              <p className="ds-copy semantic-profiler-body">{verdictCopy.body}</p>
            ) : null}

            {started ? (
              <p
                className="semantic-profiler-count"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={steps.length}
                aria-valuenow={submitted ? steps.length : stepIndex + 1}
                aria-label={`${labels.stepWord} ${stepIndex + 1} ${labels.ofWord} ${steps.length}`}
              >
                <strong>{String(stepIndex + 1).padStart(2, '0')}</strong>
                <span>/ {String(steps.length).padStart(2, '0')}</span>
              </p>
            ) : null}

            {!started ? (
              <div className="semantic-profiler-intro">
                <button
                  type="button"
                  className="semantic-button ds-button"
                  onClick={() => {
                    setDirection('next')
                    setStarted(true)
                    /* "Viewed" for the profiler means opened: the home is
                       not a form page, so a pageview would overcount. */
                    trackClientEvent(observabilityEvents.contactFormViewed, { locale, form: 'profiler' })
                    trackLeadFormStart('profiler')
                  }}
                >
                  {labels.startLabel}
                </button>
              </div>
            ) : null}
          </aside>

          {/* ── Panel: one question at a time ──────────────────── */}
          <div className="semantic-profiler-panel" hidden={!started}>
            <div
              className="semantic-profiler-panel-body"
              data-direction={direction}
              key={!started ? 'intro' : submitted ? 'result' : step}
            >
              {submitted ? (
                renderResult()
              ) : (
                <div className="semantic-profiler-step-fields">{renderStep()}</div>
              )}
            </div>

            {sendError ? (
              <p className="semantic-profiler-send-error" role="alert">
                {labels.start.sendError}
              </p>
            ) : null}

            {/* Fuera de pantalla, no display:none: un bot la encuentra en el
                DOM y una persona nunca llega a ella. */}
            <label className="semantic-profiler-honeypot" aria-hidden="true">
              <span>No llenar</span>
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </label>

            <div className="semantic-profiler-actions" hidden={!started}>
              {submitted ? (
                <button
                  type="button"
                  className="semantic-button ds-button"
                  data-variant="secondary"
                  onClick={handleReset}
                >
                  {labels.startOver}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="semantic-button ds-button"
                    data-variant="secondary"
                    disabled={stepIndex === 0}
                    onClick={goBack}
                  >
                    {labels.back}
                  </button>
                  {step === 'notes' ? (
                    <button
                      type="button"
                      className="semantic-button ds-button"
                      data-variant="primary"
                      disabled={!canSubmit || sending}
                      onClick={handleSubmit}
                    >
                      {sending ? labels.start.sending : labels.start.submit}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="semantic-button ds-button"
                      data-variant="primary"
                      disabled={!canContinue}
                      onClick={goNext}
                    >
                      {labels.continueLabel}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Splits a heading into reveal words, keeping an accent phrase ("le conviene")
    together as one word so it animates and wraps as a unit. */
function headingWords(text: string, accent?: string) {
  const index = accent ? text.indexOf(accent) : -1
  const words = (part: string) =>
    part
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ text: word, accent: false }))
  if (!accent || index === -1) return words(text)
  return [
    ...words(text.slice(0, index)),
    { text: accent, accent: true },
    ...words(text.slice(index + accent.length)),
  ]
}
