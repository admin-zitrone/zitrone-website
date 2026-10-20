"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type UseResponsiveMenuPanelOptions = {
  breakpoint: string
}

export function useResponsiveMenuPanel({
  breakpoint,
}: UseResponsiveMenuPanelOptions) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isCompact, setIsCompact] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint})`)

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      const compact = "matches" in event ? event.matches : false
      setIsCompact(compact)
      if (!compact) {
        setMenuOpen(false)
      }
    }

    handleChange(mediaQuery)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [breakpoint])

  useEffect(() => {
    if (!menuOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen || !isCompact) return

    function handleClick(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Node)) return
      if (panelRef.current?.contains(target)) return
      if (toggleRef.current?.contains(target)) return
      setMenuOpen(false)
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [isCompact, menuOpen])

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), [])

  return {
    closeMenu,
    isCompact,
    menuOpen,
    panelRef,
    toggleMenu,
    toggleRef,
  }
}
