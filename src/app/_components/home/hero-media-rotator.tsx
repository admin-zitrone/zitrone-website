"use client"

import Image from "next/image"
import { type SyntheticEvent, memo, useCallback, useEffect, useRef, useState } from "react"

const CROSSFADE_DURATION = 1700

export type HeroRotatorImage = {
  src: string
  alt?: string
}

type HeroMediaRotatorProps = {
  images: HeroRotatorImage[]
  sizes?: string
  /** Milliseconds each frame holds before the soft crossfade to the next. */
  interval?: number
  /** Notified when the active frame changes, so hero copy can follow the photo. */
  onFrameChange?: (frame: number) => void
}

type FrameStatus = "ready" | "failed"

/**
 * Full-bleed crossfade for the home hero. Stacks the frames as
 * `.ds-hero-media-image` layers (so every existing hero style still applies)
 * and softly fades between them. Respects prefers-reduced-motion.
 *
 * Only the first frame (the LCP image) is mounted at load. The rest are
 * stacked full-bleed at inset:0, so `loading="lazy"` can never defer them —
 * mounting them upfront makes every frame download alongside the LCP image
 * and starve it. Instead the second frame joins the DOM once the page has
 * finished loading, and each later frame one interval before its turn (they
 * stay at opacity 0 until then, so this is invisible). Mounting all of them at
 * load cost ~870 KB on desktop for frames many visitors never reach.
 *
 * A frame only becomes active once it has loaded and decoded. If it is still
 * on its way when its turn comes (slow network, cold cache), the current photo
 * and its copy hold and the crossfade starts the moment the next one is ready;
 * the clock then restarts from that change. A frame that fails to load is
 * skipped for the rest of the visit, and if every other frame fails the hero
 * simply stays on the first photo. Under prefers-reduced-motion the rotation
 * never runs, so the extra frames are never mounted or downloaded at all.
 */
export function HeroMediaRotator({
  images,
  sizes = "100vw",
  interval = 6000,
  onFrameChange,
}: HeroMediaRotatorProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  // How many frames are in the DOM: 1 at load, then always one ahead of the
  // active frame so the next photo has a full interval to download.
  const [mountedCount, setMountedCount] = useState(1)

  // Load state per frame, read by the rotation clock. Refs, not state: the
  // clock lives in one long-running effect and must see updates immediately.
  const statusRef = useRef<(FrameStatus | undefined)[]>([])
  const activeRef = useRef(0)
  // The frame whose turn has come but which is not ready yet.
  const waitingForRef = useRef<number | null>(null)
  const onStatusRef = useRef<((index: number) => void) | null>(null)

  const setStatus = useCallback((index: number, status: FrameStatus) => {
    if (statusRef.current[index]) return
    statusRef.current[index] = status
    onStatusRef.current?.(index)
  }, [])

  const markLoaded = useCallback(
    (index: number, img: HTMLImageElement) => {
      if (statusRef.current[index]) return
      // `load` can fire before the bitmap is decoded; decoding first keeps
      // the crossfade from starting on a frame that would paint late.
      img
        .decode()
        .catch(() => {})
        .finally(() => setStatus(index, "ready"))
    },
    [setStatus],
  )

  useEffect(() => {
    const count = images.length
    if (count <= 1) return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    if (prefersReducedMotion) return

    const mountUpTo = (index: number) =>
      setMountedCount((mounted) => Math.max(mounted, Math.min(count, index + 1)))
    const mountRest = () => mountUpTo(1)
    let mountFallback: number | undefined

    if (document.readyState === "complete") {
      mountRest()
    } else {
      window.addEventListener("load", mountRest, { once: true })
      // Prewarm the second frame before the first transition even when a
      // straggling resource prevents the window load event from firing.
      mountFallback = window.setTimeout(
        mountRest,
        Math.max(0, interval - CROSSFADE_DURATION),
      )
    }

    // The next frame after `from` that has not failed, or null if none is left.
    const nextCandidate = (from: number) => {
      for (let step = 1; step < count; step += 1) {
        const index = (from + step) % count
        if (statusRef.current[index] !== "failed") return index
      }
      return null
    }

    let timer: number | undefined
    const schedule = () => {
      timer = window.setTimeout(tick, interval)
    }

    const advance = (next: number) => {
      waitingForRef.current = null
      activeRef.current = next
      setActiveIndex(next)
      // Stage the frame after `next` now, a full interval ahead of its turn.
      const after = nextCandidate(next)
      if (after !== null) mountUpTo(after)
      schedule()
    }

    function tick() {
      const next = nextCandidate(activeRef.current)
      if (next === null) return // every other frame failed: stay put
      mountUpTo(next)
      if (statusRef.current[next] === "ready") advance(next)
      else waitingForRef.current = next // resumed by onStatusRef below
    }

    onStatusRef.current = (index) => {
      if (waitingForRef.current !== index) return
      if (statusRef.current[index] === "ready") advance(index)
      else tick() // it failed while we waited: move on to the next candidate
    }

    // Keep the rotation clock anchored to initial hydration. Previously the
    // clock started only after deferred frames mounted, delaying the first
    // photo and word change by as much as a second full interval.
    schedule()

    return () => {
      window.removeEventListener("load", mountRest)
      if (mountFallback !== undefined) window.clearTimeout(mountFallback)
      if (timer !== undefined) window.clearTimeout(timer)
      onStatusRef.current = null
      waitingForRef.current = null
    }
  }, [images.length, interval])

  useEffect(() => {
    onFrameChange?.(activeIndex)
  }, [activeIndex, onFrameChange])

  const frames = images.slice(0, mountedCount)

  return (
    <>
      {frames.map((image, index) => (
        <HeroFrame
          key={image.src}
          index={index}
          src={image.src}
          sizes={sizes}
          active={index === activeIndex}
          onLoaded={markLoaded}
          onFailed={setStatus}
        />
      ))}
    </>
  )
}

type HeroFrameProps = {
  index: number
  src: string
  sizes: string
  active: boolean
  onLoaded: (index: number, img: HTMLImageElement) => void
  onFailed: (index: number, status: "failed") => void
}

/**
 * One rotator frame with stable load/error handling.
 *
 * Errors are caught with a native listener, not next/image's `onError`: when
 * `onError` is set, next/image re-assigns `img.src` from its ref to replay
 * pre-hydration errors, which blanks `currentSrc` on the visible LCP frame at
 * hydration (and, with inline handlers, re-requested every frame on each
 * rotation). The ref below covers pre-hydration failures itself; next/image's
 * own ref reports frames that finished loading before hydration via onLoad.
 */
const HeroFrame = memo(function HeroFrame({ index, src, sizes, active, onLoaded, onFailed }: HeroFrameProps) {
  const handleLoad = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => onLoaded(index, event.currentTarget),
    [index, onLoaded],
  )
  const errorRef = useCallback(
    (img: HTMLImageElement | null) => {
      if (!img) return undefined
      const fail = () => onFailed(index, "failed")
      // Failed before hydration: `complete` with nothing decoded.
      if (img.complete && img.currentSrc && img.naturalWidth === 0) fail()
      img.addEventListener("error", fail)
      return () => img.removeEventListener("error", fail)
    },
    [index, onFailed],
  )

  return (
    <Image
      className="ds-hero-media-image"
      data-rotator="true"
      data-active={active ? "true" : "false"}
      src={src}
      alt=""
      fill
      sizes={sizes}
      priority={index === 0}
      fetchPriority={index === 0 ? "high" : "low"}
      loading={index === 0 ? undefined : "lazy"}
      ref={errorRef}
      onLoad={handleLoad}
    />
  )
})
