"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type Options = {
  itemCount: number
}

type Result = {
  trackRef: (node: HTMLElement | null) => void
  activeIndex: number
  isScrollable: boolean
  atStart: boolean
  atEnd: boolean
  progressRatio: number
  scrollToIndex: (index: number) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function useScrollCarousel({ itemCount }: Options): Result {
  const trackElRef = useRef<HTMLElement | null>(null)
  const frameRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isScrollable, setIsScrollable] = useState(false)

  const getItems = useCallback(() => {
    const track = trackElRef.current
    if (!track) return [] as HTMLElement[]
    return Array.from(track.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    )
  }, [])

  const sync = useCallback(() => {
    const track = trackElRef.current
    if (!track) return

    const items = getItems()
    if (!items.length) {
      setIsScrollable(false)
      return
    }

    const maxScrollLeft = Math.max(track.scrollWidth - track.clientWidth, 0)
    const scrollable = maxScrollLeft > 1
    setIsScrollable(scrollable)

    const baseOffset = items[0].offsetLeft
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    items.forEach((item, index) => {
      const distance = Math.abs(item.offsetLeft - baseOffset - track.scrollLeft)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    setActiveIndex(closestIndex)
  }, [getItems])

  const requestSync = useCallback(() => {
    if (frameRef.current) return
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = 0
      sync()
    })
  }, [sync])

  const trackRef = useCallback(
    (node: HTMLElement | null) => {
      trackElRef.current = node
      if (node) {
        requestSync()
      }
    },
    [requestSync],
  )

  useEffect(() => {
    const track = trackElRef.current
    if (!track) return

    track.addEventListener("scroll", requestSync, { passive: true })
    window.addEventListener("resize", requestSync)

    let observer: ResizeObserver | undefined
    if ("ResizeObserver" in window) {
      observer = new ResizeObserver(requestSync)
      observer.observe(track)
    }

    return () => {
      track.removeEventListener("scroll", requestSync)
      window.removeEventListener("resize", requestSync)
      observer?.disconnect()
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = 0
      }
    }
  }, [requestSync])

  const scrollToIndex = useCallback((index: number) => {
    const track = trackElRef.current
    const items = getItems()
    if (!track || !items.length) return

    const target = items[clamp(index, 0, items.length - 1)]
    if (!target) return

    const baseOffset = items[0].offsetLeft
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    track.scrollTo({
      left: target.offsetLeft - baseOffset,
      behavior: prefersReduced ? "auto" : "smooth",
    })
  }, [getItems])

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault()
          scrollToIndex(activeIndex - 1)
          break
        case "ArrowRight":
          event.preventDefault()
          scrollToIndex(activeIndex + 1)
          break
        case "Home":
          event.preventDefault()
          scrollToIndex(0)
          break
        case "End":
          event.preventDefault()
          scrollToIndex(itemCount - 1)
          break
      }
    },
    [activeIndex, itemCount, scrollToIndex],
  )

  const atStart = activeIndex <= 0
  const atEnd = activeIndex >= itemCount - 1
  const progressRatio = itemCount > 0 ? (activeIndex + 1) / itemCount : 0

  return {
    trackRef,
    activeIndex,
    isScrollable,
    atStart,
    atEnd,
    progressRatio,
    scrollToIndex,
    onKeyDown,
  }
}
