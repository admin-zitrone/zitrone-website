"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { captureAttribution } from "@/lib/attribution"

/**
 * Records how the visit started and which CTA was last clicked. Renders
 * nothing; it exists so the record is taken on every page, not only on the
 * form, where the original source would already be lost.
 */
export function AttributionCapture() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    captureAttribution()
  }, [pathname, searchParams])

  return null
}
