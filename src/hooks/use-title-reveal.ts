"use client"

import { useEffect } from "react"

/** Separating space, unless the fragment already ends in one. */
function appendSpace(fragment: DocumentFragment) {
  const last = fragment.lastChild
  if (!last) return
  if (last.nodeType === Node.TEXT_NODE && /\s$/.test(last.textContent ?? "")) return
  fragment.appendChild(document.createTextNode(" "))
}

function splitTitleWords(element: HTMLElement) {
  if (element.querySelectorAll(":scope > span").length > 0) {
    return
  }

  const fragment = document.createDocumentFragment()

  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent ?? ""

      // Whitespace-only node — preserve a single separating space
      if (text.trim() === "") {
        appendSpace(fragment)
        return
      }

      // Punctuation that runs straight out of the previous word — an accent
      // word's trailing comma, a tagline's final period — belongs to that word.
      // Each word is an inline-block, so leaving the comma to become its own
      // span lets a line break land between the word and its punctuation.
      const previous = fragment.lastChild
      if (!/^\s/.test(text) && previous instanceof HTMLElement && previous.tagName === "SPAN") {
        const [lead] = /^\S+/.exec(text) ?? []
        if (lead) {
          previous.appendChild(document.createTextNode(lead))
          text = text.slice(lead.length)
          if (text === "") return
        }
      }

      // Preserve whitespace separating this text from a previous segment
      if (/^\s/.test(text)) {
        appendSpace(fragment)
      }

      const words = text.split(/\s+/).filter(Boolean)
      words.forEach((word, index) => {
        const span = document.createElement("span")
        span.textContent = word
        fragment.appendChild(span)

        if (index < words.length - 1) {
          fragment.appendChild(document.createTextNode(" "))
        }
      })

      // Preserve whitespace separating this text from the next segment
      if (/\s$/.test(text)) {
        fragment.appendChild(document.createTextNode(" "))
      }

      return
    }

    if (!(node instanceof HTMLElement)) {
      return
    }

    if (node.tagName === "BR") {
      fragment.appendChild(node.cloneNode())
      return
    }

    appendSpace(fragment)

    // Clone rather than rebuild, so the accent element keeps its own tag and
    // class and any punctuation absorbed above stays outside it.
    const wrapper = document.createElement("span")
    wrapper.appendChild(node.cloneNode(true))
    fragment.appendChild(wrapper)
  })

  element.textContent = ""
  element.appendChild(fragment)
}

export function useTitleReveal() {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-title-reveal="words"]'),
    )
    if (!targets.length) return

    targets.forEach(splitTitleWords)

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const reveal = (target: Element) => {
      if (target instanceof HTMLElement) {
        target.dataset.revealState = "visible"
      }
    }

    if (!reduceMotion) {
      targets.forEach((target) => {
        target.dataset.revealState = "idle"
      })
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(reveal)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          reveal(entry.target)
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: "0% 0% -15% 0%", threshold: 0.01 },
    )

    targets.forEach((target) => observer.observe(target))

    return () => observer.disconnect()
  }, [])
}
