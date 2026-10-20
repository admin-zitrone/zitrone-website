import type { Metadata } from "next"

import { preloadBrandFonts } from "../fonts"
import "../fonts.css"

import "./brand-book.css"

export const metadata: Metadata = {
  title: "Zitrone Design System",
  description:
    "The living brand book: tokens, typography, color, and components — generated from the design-system source.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function DesignSystemLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  preloadBrandFonts()

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
