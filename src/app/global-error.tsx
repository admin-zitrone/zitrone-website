"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: {
        boundary: "global",
      },
      extra: {
        digest: error.digest,
      },
    })

    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#fff8ee",
          color: "#1a1a1a",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <p style={{ margin: 0, opacity: 0.6, fontSize: "0.875rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Zitrone
          </p>
          <h1 style={{ margin: "0.5rem 0 1rem", fontSize: "2rem", fontWeight: 600 }}>
            Something went wrong.
          </h1>
          <p style={{ margin: "0 0 2rem", lineHeight: 1.5, opacity: 0.8 }}>
            We&apos;ve been notified. Please try again, or come back in a moment.
          </p>
          <button
            onClick={reset}
            type="button"
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "999px",
              background: "#1a1a1a",
              color: "#fff8ee",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
