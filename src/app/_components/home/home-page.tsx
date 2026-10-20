"use client"

import {
  Fragment,
  type CSSProperties,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import Image from "next/image"

import { Button } from "@/components/button"
import { Container } from "@/components/layout"
import { SiteFooter } from "@/components/site-footer"
import { Section } from "@/components/section"

import {
  HomeContentProvider,
  useHomeContent,
} from "./home-content-context"
import { type ChipIconName, type HomeContent, type SystemTabWidget } from "./home-data"
import { ChipIcon } from "./feature-icons"
import { HeroSection } from "./hero-section"
import { HomeInteractions } from "./home-interactions"
import { OutcomesCarousel } from "./outcomes-carousel"
import { ProfilerSection } from "./profiler-section"
import { ServiceShowcase } from "./service-showcase"
import { StoriesAndFaqSection as SharedStoriesAndFaqSection } from "./stories-and-faq-section"

/* HeroSection is now a "use client" component in ./hero-section.tsx */

const OPERATING_STEP_DURATION = 10000
const STEP_FADE_DURATION = 700

function getBalancedTitleBreak(words: string[]) {
  if (words.length < 2) return words.length

  const minimumWordsPerLine = words.length >= 4 ? 2 : 1
  let bestBreak = minimumWordsPerLine
  let bestDifference = Number.POSITIVE_INFINITY

  for (let index = minimumWordsPerLine; index <= words.length - minimumWordsPerLine; index += 1) {
    const firstLineLength = words.slice(0, index).join(" ").length
    const secondLineLength = words.slice(index).join(" ").length
    const difference = Math.abs(firstLineLength - secondLineLength)

    if (difference < bestDifference) {
      bestBreak = index
      bestDifference = difference
    }
  }

  return bestBreak
}

const widgetIcons: Record<Exclude<SystemTabWidget["kind"], "profile" | "service">, ChipIconName> = {
  menu: "utensils",
  score: "chart",
}

/* Slack's own mark, drawn to its published geometry: the diner posts are real
   messages from a client's Slack, so the card shows where they came from. */
function SlackMark() {
  return (
    <svg className="ds-operating-slack-mark" viewBox="0 0 54 54" aria-hidden focusable="false">
      <path
        fill="#36C5F0"
        d="M19.712.133a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386h5.376V5.52A5.381 5.381 0 0 0 19.712.133m0 14.365H5.376A5.381 5.381 0 0 0 0 19.884a5.381 5.381 0 0 0 5.376 5.387h14.336a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386"
      />
      <path
        fill="#2EB67D"
        d="M53.76 19.884a5.381 5.381 0 0 0-5.376-5.386 5.381 5.381 0 0 0-5.376 5.386v5.387h5.376a5.381 5.381 0 0 0 5.376-5.387m-14.336 0V5.52A5.381 5.381 0 0 0 34.048.133a5.381 5.381 0 0 0-5.376 5.387v14.364a5.381 5.381 0 0 0 5.376 5.387 5.381 5.381 0 0 0 5.376-5.387"
      />
      <path
        fill="#ECB22E"
        d="M34.048 54a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386h-5.376v5.386A5.381 5.381 0 0 0 34.048 54m0-14.365h14.336a5.381 5.381 0 0 0 5.376-5.386 5.381 5.381 0 0 0-5.376-5.387H34.048a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386"
      />
      <path
        fill="#E01E5A"
        d="M0 34.249a5.381 5.381 0 0 0 5.376 5.386 5.381 5.381 0 0 0 5.376-5.386v-5.387H5.376A5.381 5.381 0 0 0 0 34.25m14.336-.001v14.364A5.381 5.381 0 0 0 19.712 54a5.381 5.381 0 0 0 5.376-5.387V34.25a5.381 5.381 0 0 0-5.376-5.387 5.381 5.381 0 0 0-5.376 5.387"
      />
    </svg>
  )
}

function WidgetHead({
  widget,
  meta,
}: {
  widget: Exclude<SystemTabWidget, { kind: "profile" | "service" }>
  meta?: string
}) {
  return (
    <div className="ds-operating-widget-head">
      <span className="ds-operating-widget-icon">
        <ChipIcon name={widgetIcons[widget.kind]} />
      </span>
      <span className="ds-operating-widget-title">{widget.title}</span>
      {meta ? (
        <span className="ds-operating-widget-meta">
          {meta}
        </span>
      ) : null}
    </div>
  )
}

const PROFILE_DAY_DURATION = 1800
const CLOCK_DURATION = 900

function formatClock(minutes: number) {
  const hours = Math.floor(minutes / 60)
  return `${String(hours).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`
}

/* A clock that runs forward from its last time to the new one, minute by
   minute, so the service day reads as passing rather than jumping. From the
   last checkpoint back to the first it resets instead of running backwards. */
function ClockTo({ minutes }: { minutes: number }) {
  const [shown, setShown] = useState(minutes)
  const from = useRef(minutes)

  useEffect(() => {
    const start = from.current
    if (start === minutes) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const duration = reduced || minutes < start ? 0 : CLOCK_DURATION

    const began = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = duration ? Math.min((now - began) / duration, 1) : 1
      const eased = 1 - (1 - progress) ** 3
      setShown(Math.round(start + (minutes - start) * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
      else from.current = minutes
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      from.current = minutes
    }
  }, [minutes])

  return <>{formatClock(shown)}</>
}
const COUNT_DURATION = 600
/* The week starts walking only once the bars have finished rising in: last
   bar's delay (200 + 4 × 90 ms) plus the 1100 ms rise, rounded up. Before
   that, the name would change while the chart is still drawing. */
const PROFILE_ENTRANCE_DURATION = 1700

/* Counts up from the previous value to the new one, so each day's meal
   count visibly changes instead of snapping. */
function CountUp({
  value,
  duration: runFor = COUNT_DURATION,
  decimals,
  from: startAt,
}: {
  value: number
  duration?: number
  /** Set to format with thousands separators and this many decimals. */
  decimals?: number
  /** Counts in from this value on mount instead of showing `value` at once. */
  from?: number
}) {
  const [shown, setShown] = useState(startAt ?? value)
  /* Where the count actually is. An interrupted count (a new value, or the
     effect re-run on mount in development) resumes from here instead of
     treating the old target as reached. */
  const from = useRef(startAt ?? value)

  useEffect(() => {
    const start = from.current
    if (start === value) return
    // Reduced motion: jump straight to the end frame on the first tick.
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : runFor

    const began = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = duration ? Math.min((now - began) / duration, 1) : 1
      const eased = 1 - (1 - progress) ** 3
      from.current = progress < 1 ? start + (value - start) * eased : value
      setShown(from.current)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [value, runFor])

  if (decimals === undefined) return <>{Math.round(shown)}</>
  return (
    <>
      {shown.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </>
  )
}

const SERVICE_METRIC_DURATION = 2600

const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeReduceMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCE_MOTION_QUERY)
  mq.addEventListener("change", callback)
  return () => mq.removeEventListener("change", callback)
}

function getReduceMotionSnapshot() {
  return window.matchMedia(REDUCE_MOTION_QUERY).matches
}

/* The server renders the still frame; the client starts the rotation once it
   knows motion is allowed. */
function getReduceMotionServerSnapshot() {
  return true
}

/* Step 3's service levels: a compact glass card that steps through a real
   client's numbers like stories. Each view is a label, the value counting in
   and one small chart (monthly columns, a check per month for a zero, a
   track for a rate). Holds on the first metric under reduced motion. */
function OperatingServiceWidget({
  widget,
}: {
  widget: Extract<SystemTabWidget, { kind: "service" }>
}) {
  const [current, setCurrent] = useState(0)
  const reduceMotion = useSyncExternalStore(
    subscribeReduceMotion,
    getReduceMotionSnapshot,
    getReduceMotionServerSnapshot,
  )
  const animated = !reduceMotion && widget.metrics.length > 1

  useEffect(() => {
    if (!animated) return

    const interval = window.setInterval(() => {
      setCurrent((index) => (index + 1) % widget.metrics.length)
    }, SERVICE_METRIC_DURATION)

    return () => window.clearInterval(interval)
  }, [animated, widget.metrics.length])

  const metric = widget.metrics[current] ?? widget.metrics[0]
  if (!metric) return null
  const { chart } = metric

  return (
    <div
      className="ds-operating-widget ds-operating-glass"
      data-kind="service"
      data-animated={animated}
      style={{ "--sla-step": `${SERVICE_METRIC_DURATION}ms` } as CSSProperties}
      aria-hidden
    >
      <span className="ds-operating-sla-segments">
        {widget.metrics.map((entry, index) => (
          <span
            data-state={index < current ? "done" : index === current ? "active" : "next"}
            // Re-keyed per pass so the active segment restarts its fill.
            key={index === current ? `${entry.label}-active` : entry.label}
          />
        ))}
      </span>

      <span className="ds-operating-xfade ds-operating-sla-label">
        {widget.metrics.map((entry, index) => (
          <span data-active={index === current} key={entry.label}>
            {entry.label}
          </span>
        ))}
      </span>

      <strong className="ds-operating-sla-value">
        {metric.prefix}
        {/* Re-keyed per metric: each counts in from zero, never from the
            previous metric's value (a stock-out count must not read 67). */}
        <CountUp key={current} value={metric.value} decimals={metric.decimals ?? 0} from={0} />
        {metric.suffix}
      </strong>

      {/* Re-keyed per metric so each chart draws itself in. */}
      <span className="ds-operating-sla-chart" data-chart={chart.kind} key={current}>
        {chart.kind === "meter" ? (
          <span
            className="ds-operating-sla-meter"
            style={{ "--level": String(chart.fill) } as CSSProperties}
          />
        ) : (
          widget.months.map((month, index) => {
            const values = chart.kind === "months" ? chart.values : null
            return (
              <span
                data-last={index === widget.months.length - 1}
                key={month}
                style={
                  {
                    "--index": String(index),
                    "--level": values ? String((values[index] ?? 0) / Math.max(...values, 1)) : "1",
                  } as CSSProperties
                }
              >
                {values ? (
                  <span className="ds-operating-sla-column" />
                ) : (
                  <span className="ds-operating-sla-check">
                    <ChipIcon name="check" />
                  </span>
                )}
                <small>{month}</small>
              </span>
            )
          })
        )}
      </span>
    </div>
  )
}

/* The client's week as a light glass calendar: the active day walks Mon→Fri
   and its meal count changes (Friday is home office), so the plan reads as
   built around each day. Two service windows sit in their own card below. */
function OperatingProfileWidget({
  widget,
}: {
  widget: Extract<SystemTabWidget, { kind: "profile" }>
}) {
  const [dayIndex, setDayIndex] = useState(0)
  const [walking, setWalking] = useState(false)
  const day = widget.days[dayIndex] ?? widget.days[0]

  useEffect(() => {
    if (widget.days.length < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const advance = () => setDayIndex((current) => (current + 1) % widget.days.length)

    let interval = 0
    const start = window.setTimeout(() => {
      /* The first step lands with the walk itself, so Monday (lit during the
         entrance) is not dropped and regrown. */
      setWalking(true)
      advance()
      interval = window.setInterval(advance, PROFILE_DAY_DURATION)
    }, PROFILE_ENTRANCE_DURATION)

    return () => {
      window.clearTimeout(start)
      window.clearInterval(interval)
    }
  }, [widget.days.length])

  const dayMax = Math.max(...widget.days.map((entry) => entry.value ?? 0), 1)
  const slotIndex = dayIndex % widget.schedule.length
  const slot = widget.schedule[slotIndex]

  if (!day) return null

  return (
    <div className="ds-operating-widget" data-kind="profile" aria-hidden>
      <div className="ds-operating-profile-card">
        <span className="ds-operating-profile-day">
          <span className="ds-operating-profile-day-head">
            <span className="ds-operating-widget-icon">
              <ChipIcon name="calendar" />
            </span>
            {/* All names stacked in one cell and crossfaded, so the swap never
                shows an empty frame. */}
            <span className="ds-operating-xfade">
              {widget.days.map((entry, index) => (
                <strong
                  className="ds-operating-profile-day-name"
                  data-active={index === dayIndex}
                  key={`${entry.name}-${index}`}
                >
                  {entry.name}
                </strong>
              ))}
            </span>
          </span>
          <span className="ds-operating-profile-day-meals">
            {day.value === null ? (
              widget.offLabel
            ) : (
              <>
                <CountUp value={day.value} /> {widget.mealsUnit}
              </>
            )}
          </span>
        </span>
        <span className="ds-operating-profile-chart" data-walking={walking || undefined}>
          {widget.days.map((entry, index) => (
            <span
              className="ds-operating-profile-col"
              data-active={index === dayIndex}
              data-off={entry.value === null}
              key={`${entry.label}-${index}`}
              style={
                {
                  "--bar-level": String((entry.value ?? 0) / dayMax),
                  "--bar-index": String(index),
                } as CSSProperties
              }
            >
              <span className="ds-operating-profile-col-bar">
                <span className="ds-operating-profile-col-fill" />
              </span>
              <small>{entry.label}</small>
            </span>
          ))}
        </span>
      </div>

      <div className="ds-operating-hours-card ds-operating-glass">
        <span className="ds-operating-widget-icon">
          <ChipIcon name="clock" />
        </span>
        {/* The clock runs forward to each checkpoint of the service day and
            the service open at that hour crossfades in beside it. */}
        <span className="ds-operating-hours-clock">
          <ClockTo minutes={slot?.minutes ?? 0} />
        </span>
        <span className="ds-operating-xfade ds-operating-hours-service">
          {widget.schedule.map((entry, index) => (
            <span data-active={index === slotIndex} key={entry.label}>
              {entry.label}
            </span>
          ))}
        </span>
      </div>
    </div>
  )
}

const MENU_DISH_DURATION = 3400

/* One dish at a time, food-app style: name, kcal and allergens, a line of
   description and its photo. The meal switch above follows the dish. Holds
   on the first dish under reduced motion. */
function OperatingMenuWidget({
  widget,
}: {
  widget: Extract<SystemTabWidget, { kind: "menu" }>
}) {
  const [dishIndex, setDishIndex] = useState(0)
  const dish = widget.dishes[dishIndex] ?? widget.dishes[0]

  useEffect(() => {
    if (widget.dishes.length < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const interval = window.setInterval(() => {
      setDishIndex((current) => (current + 1) % widget.dishes.length)
    }, MENU_DISH_DURATION)

    return () => window.clearInterval(interval)
  }, [widget.dishes.length])

  if (!dish) return null

  return (
    <div className="ds-operating-widget" data-kind="menu" aria-hidden>
      <div className="ds-operating-menu-card">
        <WidgetHead widget={widget} meta={widget.meta} />
        <div
          className="ds-operating-widget-meals"
          style={
            {
              "--meal-count": String(widget.meals.length),
              "--meal-index": String(dish.meal),
            } as CSSProperties
          }
        >
          {widget.meals.map((label, index) => (
            <span data-active={index === dish.meal} key={label}>
              {label}
            </span>
          ))}
        </div>
      </div>
      {/* Push swipe: every dish stacked in one cell; the incoming one slides
          in from the right as the outgoing one is pushed off to the left. */}
      <div className="ds-operating-menu-list ds-operating-dish-track">
        {widget.dishes.map((entry, index) => (
          <div
            className="ds-operating-dish"
            data-state={
              index === dishIndex
                ? "active"
                : index === (dishIndex - 1 + widget.dishes.length) % widget.dishes.length
                  ? "leaving"
                  : "waiting"
            }
            key={entry.name}
          >
            <Image
              alt=""
              className="ds-operating-dish-photo"
              height={176}
              sizes="7rem"
              src={entry.image}
              width={176}
            />
            <span className="ds-operating-dish-text">
              <strong className="ds-operating-dish-name">{entry.name}</strong>
              <span className="ds-operating-dish-meta">
                {[`${entry.kcal} kcal`, ...entry.tags].join(" · ")}
              </span>
              <span className="ds-operating-dish-description">{entry.description}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const SCORE_METRIC_DURATION = 3400
const SCORE_SLIDE_DURATION = 700
const LINE_W = 160
const LINE_H = 56

/* Catmull-Rom through the points, as cubic Béziers: a smooth dashboard curve
   that still passes through every real monthly value. */
function smoothPath(points: (readonly [number, number])[]) {
  if (points.length < 2) return ""
  let d = `M${points[0][0]},${points[0][1]}`
  for (let i = 0; i < points.length - 1; i += 1) {
    const [x0, y0] = points[i - 1] ?? points[i]
    const [x1, y1] = points[i]
    const [x2, y2] = points[i + 1]
    const [x3, y3] = points[i + 2] ?? points[i + 1]
    const c1x = x1 + (x2 - x0) / 6
    const c1y = y1 + (y2 - y0) / 6
    const c2x = x2 - (x3 - x1) / 6
    const c2y = y2 - (y3 - y1) / 6
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`
  }
  return d
}

/* Three measures, three chart forms (ring for the share, line for the trend,
   bars for the drop) in a carousel that always slides left. The track holds
   the first slide again at the end; after sliding onto it the track jumps
   back without a transition, so the loop never visibly rewinds. All from one
   client review, anonymised. */
function OperatingScorePanel({
  widget,
}: {
  widget: Extract<SystemTabWidget, { kind: "score" }>
}) {
  const [offset, setOffset] = useState(0)
  const [instant, setInstant] = useState(false)
  const { trend, bars } = widget

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const interval = window.setInterval(() => {
      setInstant(false)
      setOffset((current) => current + 1)
    }, SCORE_METRIC_DURATION)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (offset < 3) return
    const timeout = window.setTimeout(() => {
      setInstant(true)
      setOffset(0)
    }, SCORE_SLIDE_DURATION)
    return () => window.clearTimeout(timeout)
  }, [offset])

  const range = trend.max - trend.min || 1
  const pad = 6
  const coords = trend.points.map((point, index) => {
    const x = (index / Math.max(trend.points.length - 1, 1)) * LINE_W
    const y = pad + (1 - (point - trend.min) / range) * (LINE_H - pad * 2)
    return [x, y] as const
  })
  const line = smoothPath(coords)
  const area = `${line} L${LINE_W},${LINE_H} L0,${LINE_H} Z`
  const barMax = Math.max(...bars.values, 1)
  const barAverage = bars.values.reduce((sum, value) => sum + value, 0) / Math.max(bars.values.length, 1)

  const slides = (slot: number) => [
    <div className="ds-operating-widget-metric" data-metric="ring" key={`ring-${slot}`}>
      <span className="ds-operating-widget-metric-label">{widget.title}</span>
      <div
        className="ds-operating-widget-ring"
        style={{ "--score": String(widget.value) } as CSSProperties}
      >
        <span className="ds-operating-widget-ring-value">{widget.valueLabel}</span>
      </div>
      <span className="ds-operating-widget-ring-delta">{widget.delta}</span>
    </div>,
    <div className="ds-operating-widget-metric" data-metric="line" key={`line-${slot}`}>
      <span className="ds-operating-widget-metric-label">{trend.label}</span>
      <strong className="ds-operating-widget-metric-value">{trend.valueLabel}</strong>
      <svg
        className="ds-operating-widget-line-chart"
        viewBox={`0 0 ${LINE_W} ${LINE_H}`}
        aria-hidden
        focusable="false"
      >
        <defs>
          <linearGradient id={`score-fill-${slot}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primitive-color-lime-400)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--primitive-color-lime-400)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="ds-operating-widget-line-area" d={area} fill={`url(#score-fill-${slot})`} />
        <path className="ds-operating-widget-line" d={line} pathLength={1} />
        {/* The dot rides the same path as the stroke, so it stays on the
            line's tip while drawing and rests on the last month. */}
        <g className="ds-operating-widget-line-tip" style={{ offsetPath: `path("${line}")` }}>
          <circle className="ds-operating-widget-line-halo" r={7} />
          <circle className="ds-operating-widget-line-dot" r={3.5} />
        </g>
      </svg>
      <span className="ds-operating-widget-metric-caption">{trend.caption}</span>
    </div>,
    <div className="ds-operating-widget-metric" data-metric="bars" key={`bars-${slot}`}>
      <span className="ds-operating-widget-metric-label">{bars.label}</span>
      <strong className="ds-operating-widget-metric-value">{bars.valueLabel}</strong>
      <span
        className="ds-operating-widget-minibars"
        style={
          {
            "--bar-count": String(bars.values.length),
            "--avg-level": String(barAverage / barMax),
          } as CSSProperties
        }
      >
        {/* The average the headline states, drawn across the months. */}
        <i className="ds-operating-widget-minibars-average" aria-hidden />
        {bars.values.map((value, index) => (
          <span
            key={`${value}-${index}`}
            style={
              {
                "--bar-level": String(value / barMax),
                "--bar-index": String(index),
              } as CSSProperties
            }
          />
        ))}
      </span>
      <span className="ds-operating-widget-metric-caption">{bars.caption}</span>
    </div>,
  ]

  const all = slides(0)
  const track = [...all, slides(1)[0]]

  return (
    <div className="ds-operating-widget-dial">
      <div className="ds-operating-widget-carousel">
        <div
          className="ds-operating-widget-carousel-track"
          data-instant={instant}
          style={{ "--slide": String(offset) } as CSSProperties}
        >
          {track.map((slide, index) => (
            <div
              className="ds-operating-widget-slide"
              /* The closing clone shares slide one's state, so the jump back
                 lands on an already-drawn chart instead of redrawing it. */
              data-active={index % 3 === offset % 3}
              key={slide.key}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const SLACK_STEP_DURATION = 2800

/* Real diner posts, one in view: each new post rises in from below. Keyed on
   the index so every swap replays the entrance; the card takes the height of
   the post it shows. */
function OperatingSlackFeed({
  channel,
  messages,
}: {
  channel: string
  messages: { author: string; text: string }[]
}) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (messages.length < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length)
    }, SLACK_STEP_DURATION)

    return () => window.clearInterval(interval)
  }, [messages.length])

  return (
    <div className="ds-operating-widget-message">
      <span className="ds-operating-widget-channel">
        <SlackMark />
        <span># {channel}</span>
      </span>
      {/* Posts stacked in one cell and crossfaded: the card keeps the height
          of the longest post and never flashes empty. */}
      <div className="ds-operating-xfade">
        {messages.map((entry, entryIndex) => (
          <div
            className="ds-operating-widget-post"
            data-active={entryIndex === index}
            key={entry.author}
          >
            <span className="ds-operating-widget-avatar" data-tone={entryIndex % 3}>
              {entry.author.charAt(0)}
            </span>
            <div className="ds-operating-widget-post-body">
              <strong className="ds-operating-widget-post-author">{entry.author}</strong>
              <p>{entry.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* The step drawn as a small piece of the service itself. Each kind has its own
   shape and anchor (glass panel, tall card, stacked notices, round dial), so
   the four steps never repeat one composition. Decorative: the step copy
   beside it already carries the meaning. */
function OperatingVisualWidget({ widget }: { widget: SystemTabWidget }) {
  if (widget.kind === "profile") {
    return <OperatingProfileWidget widget={widget} />
  }

  if (widget.kind === "menu") {
    return <OperatingMenuWidget widget={widget} />
  }

  if (widget.kind === "service") {
    return <OperatingServiceWidget widget={widget} />
  }

  return (
    <div className="ds-operating-widget" data-kind="score" aria-hidden>
      <OperatingScorePanel widget={widget} />
      <OperatingSlackFeed channel={widget.channel} messages={widget.messages} />
    </div>
  )
}

function OperatingSystemSection() {
  const { sections, systemTabs } = useHomeContent()
  const s = sections.operatingSystem
  const titleBreak = getBalancedTitleBreak(s.titleWords.map((word) => word.text))
  const titleLines = [s.titleWords.slice(0, titleBreak), s.titleWords.slice(titleBreak)]
  const [activeStep, setActiveStep] = useState(0)
  /* The step being left stays mounted for one fade so its overlays ease out
     while the new ones ease in, instead of cutting. */
  const [leavingStep, setLeavingStep] = useState<number | null>(null)

  const goToStep = (next: number) => {
    if (next === activeStep) return
    setLeavingStep(activeStep)
    setActiveStep(next)
  }

  useEffect(() => {
    if (leavingStep === null) return
    const timeout = window.setTimeout(() => setLeavingStep(null), STEP_FADE_DURATION)
    return () => window.clearTimeout(timeout)
  }, [leavingStep])

  /* A step that rotates through views of its own stays up until each has
     been seen once. */
  const activeWidget = systemTabs[activeStep]?.visualWidget
  const stepDuration =
    activeWidget?.kind === "service"
      ? Math.max(OPERATING_STEP_DURATION, activeWidget.metrics.length * SERVICE_METRIC_DURATION)
      : OPERATING_STEP_DURATION

  useEffect(() => {
    if (systemTabs.length < 2) return

    const compactQuery = window.matchMedia("(max-width: 47.99rem)")
    let interval: number | undefined

    const scheduleRotation = () => {
      if (interval) window.clearInterval(interval)
      interval = undefined

      if (!compactQuery.matches) {
        interval = window.setInterval(() => {
          setLeavingStep(activeStep)
          setActiveStep((activeStep + 1) % systemTabs.length)
        }, stepDuration)
      }
    }

    scheduleRotation()
    compactQuery.addEventListener("change", scheduleRotation)

    return () => {
      if (interval) window.clearInterval(interval)
      compactQuery.removeEventListener("change", scheduleRotation)
    }
  }, [activeStep, stepDuration, systemTabs.length])

  return (
    <Section
      id="outcomes"
      aria-labelledby="outcomes-heading"
      className="ds-system-tabs-section"
      size="large"
      pattern="system-tabs"
    >
      <Container>
        <div className="ds-system-showcase">
          <div className="ds-operating-intro">
            {s.kicker ? <p className="semantic-kicker ds-kicker">{s.kicker}</p> : null}
            <h2
              id="outcomes-heading"
              className="ds-heading ds-title-reveal ds-service-system-header ds-operating-intro-title"
              data-title-reveal="words"
              aria-label={s.titleAriaLabel}
            >
              {titleLines[0].map((word, index) => (
                <Fragment key={`${word.text}-${index}`}>
                  {index > 0 ? " " : null}
                  <span className={word.accent ? "ds-operating-intro-title-accent" : undefined}>
                    {word.text}
                  </span>
                </Fragment>
              ))}
              <br className="ds-operating-intro-title-break" />{" "}
              {titleLines[1].map((word, index) => (
                <Fragment key={`${word.text}-${titleBreak + index}`}>
                  {index > 0 ? " " : null}
                  <span className={word.accent ? "ds-operating-intro-title-accent" : undefined}>
                    {word.text}
                  </span>
                </Fragment>
              ))}
            </h2>
            <div className="ds-operating-steps">
              {systemTabs.map((tab, index) => {
                const isActive = index === activeStep

                return (
                  <div className="ds-operating-step" data-active={isActive} key={tab.key}>
                    <button
                      className="ds-operating-step-trigger"
                      type="button"
                      aria-expanded={isActive}
                      aria-controls={`operating-step-description-${tab.key}`}
                      onClick={() => goToStep(index)}
                    >
                      <span className="ds-operating-step-number">{String(index + 1).padStart(2, "0")}</span>
                      <span className="ds-operating-step-title">
                        {tab.stage ?? tab.title.split(" ")[0]}
                      </span>
                    </button>
                    <div
                      className="ds-operating-step-description"
                      id={`operating-step-description-${tab.key}`}
                      aria-hidden={!isActive}
                    >
                      <div className="ds-operating-step-description-inner">
                        {isActive ? (
                          <div className="ds-operating-step-mobile-visual">
                            <Image
                              src={tab.image}
                              alt={tab.title}
                              fill
                              sizes="(max-width: 47.99rem) calc(100vw - 2rem), 1px"
                            />
                          </div>
                        ) : null}
                        <p>
                          {tab.stageCopy ? (
                            <>
                              {tab.stageCopy.before}
                              {tab.stageCopy.highlight}
                              {tab.stageCopy.after}
                            </>
                          ) : (
                            tab.copy
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="ds-operating-intro-actions">
              {s.ctaSecondary ? (
                <Button variant="secondary" href={s.ctaSecondary.href}>
                  <span>{s.ctaSecondary.label}</span>
                </Button>
              ) : null}
              <Button
                className={s.ctaSecondary ? "ds-operating-intro-cta-tertiary" : undefined}
                variant={s.ctaSecondary ? "secondary" : "primary"}
                href={s.ctaPrimary.href}
              >
                <span>{s.ctaPrimary.label}</span>
              </Button>
            </div>
          </div>
          {systemTabs.length ? (
            <div className="ds-operating-showcase-visual">
              {/* Every photo stays stacked so a step change is a crossfade. */}
              <div className="ds-operating-showcase-visual-frame">
                {systemTabs.map((tab, index) => (
                  <Image
                    key={tab.key}
                    src={tab.image}
                    alt={index === activeStep ? tab.title : ""}
                    fill
                    data-active={index === activeStep}
                    sizes="(max-width: 64rem) 100vw, 48vw"
                  />
                ))}
              </div>
              {systemTabs.map((tab, index) => {
                const state =
                  index === activeStep ? "active" : index === leavingStep ? "leaving" : null
                if (!state) return null

                return (
                  <div
                    className="ds-operating-layer"
                    data-kind={tab.visualWidget?.kind}
                    data-state={state}
                    key={tab.key}
                  >
                    {tab.visualWidget ? <OperatingVisualWidget widget={tab.visualWidget} /> : null}
                    {tab.visualBadge ? (
                      <div className="ds-operating-badge" aria-hidden>
                        <span className="ds-operating-badge-icon">
                          <ChipIcon name={tab.visualBadge.icon} />
                        </span>
                        <span>{tab.visualBadge.label}</span>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  )
}

/* Each of the two marquee tracks must be at least as wide as the ribbon
   itself, or a blank gap scrolls through before the loop wraps. With only a
   handful of press logos that isn't guaranteed, so the set is repeated until a
   track carries enough marks to overflow even a wide viewport. Repeating the
   marks (rather than one wide copy) keeps the two tracks identical, which is
   what makes the -50% - gap/2 keyframe wrap seamlessly. */
const MIN_MARQUEE_MARKS_PER_TRACK = 12

function FeaturedMediaSection() {
  const { sections } = useHomeContent()
  const media = sections.featuredMedia
  const repeat = Math.max(
    2,
    Math.ceil(MIN_MARQUEE_MARKS_PER_TRACK / Math.max(media.logos.length, 1)),
  )
  const trackLogos = Array.from({ length: repeat }, () => media.logos).flat()
  return (
    <Section
      className="semantic-service-theme-surface"
      size="small"
      aria-label={media.ariaLabel}
    >
      <Container>
        <div className="ds-media-ribbon">
          <p className="ds-kicker">{media.label}</p>
          <div className="ds-media-ribbon-marquee">
            <div className="ds-media-ribbon-marquee-inner">
              {[false, true].map((isDuplicate) => (
                <div
                  className="ds-media-ribbon-track"
                  aria-hidden={isDuplicate ? "true" : undefined}
                  key={String(isDuplicate)}
                >
                  {trackLogos.map((logo, index) => (
                    <span
                      className="ds-logo-chip ds-logo-chip--image"
                      data-logo-context="ribbon"
                      data-logo-fit={logo.fit ?? "balanced"}
                      style={
                        logo.scale
                          ? ({ "--logo-scale": String(logo.scale) } as CSSProperties)
                          : undefined
                      }
                      key={`${logo.id}-${index}-${isDuplicate}`}
                    >
                      <Image
                        src={logo.src}
                        alt={isDuplicate ? "" : logo.alt}
                        width={120}
                        height={28}
                        loading="eager"
                        decoding="async"
                        unoptimized
                      />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

/* ServiceShowcase is now a "use client" component in ./service-showcase.tsx */

/* ProfilerSection is now a "use client" component in ./profiler-section.tsx */

function StoriesAndFaqSection() {
  const { faqs, sections } = useHomeContent()
  return <SharedStoriesAndFaqSection faqs={faqs} stories={sections.stories} faq={sections.faq} />
}

function FooterSection() {
  const { footerColumns, sections } = useHomeContent()
  return <SiteFooter footerColumns={footerColumns} footer={sections.footer} />
}

function HomePageContent() {
  return (
    <div className="semantic-shell">
      <main id="main-content" tabIndex={-1}>
        <div className="ds-page-shell">
          <div className="semantic-service-theme-band">
            <HeroSection />
            <ServiceShowcase />
            <OutcomesCarousel />
            <FeaturedMediaSection />
            <OperatingSystemSection />
            <ProfilerSection />
          </div>
          <StoriesAndFaqSection />
        </div>
        <FooterSection />
      </main>
      <HomeInteractions />
    </div>
  )
}

export function HomePage({ content }: { content: HomeContent }) {
  return (
    <HomeContentProvider content={content}>
      <HomePageContent />
    </HomeContentProvider>
  )
}
