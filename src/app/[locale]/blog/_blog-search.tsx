"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"

type BlogSearchProps = {
  /** Active category to preserve in the query, or null when "all". */
  activeCategory: string | null
  initialQuery: string
  placeholder: string
  ariaLabel: string
  submitAriaLabel: string
}

export function BlogSearch({
  activeCategory,
  initialQuery,
  placeholder,
  ariaLabel,
  submitAriaLabel,
}: BlogSearchProps) {
  const router = useRouter()
  const [value, setValue] = useState(initialQuery)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (activeCategory) params.set("category", activeCategory)
    const trimmed = value.trim()
    if (trimmed) params.set("q", trimmed)
    const qs = params.toString()
    router.push(qs ? `/blog?${qs}` : "/blog")
  }

  return (
    <form className="ds-blog-search" role="search" onSubmit={handleSubmit}>
      <input
        className="ds-blog-search-input"
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
      <button type="submit" className="ds-blog-search-submit" aria-label={submitAriaLabel}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle
            cx="9.77"
            cy="9.24"
            r="4.79"
            transform="rotate(-45 9.77 9.24)"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M13.15 12.62L19.53 19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </form>
  )
}
