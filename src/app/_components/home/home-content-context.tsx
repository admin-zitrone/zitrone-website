"use client"

import { createContext, useContext } from "react"

import type { HomeContent } from "./home-data"

const HomeContentContext = createContext<HomeContent | null>(null)

export function HomeContentProvider({
  children,
  content,
}: {
  children: React.ReactNode
  content: HomeContent
}) {
  return (
    <HomeContentContext.Provider value={content}>{children}</HomeContentContext.Provider>
  )
}

export function useHomeContent() {
  const context = useContext(HomeContentContext)

  if (!context) {
    throw new Error("useHomeContent must be used within a HomeContentProvider.")
  }

  return context
}
