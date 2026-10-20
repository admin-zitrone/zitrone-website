;(function initSystemTabs() {
  "use strict"

  const roots = Array.from(document.querySelectorAll("[data-system-tabs]"))

  if (!roots.length) {
    return
  }

  roots.forEach((root) => {
    const tabs = Array.from(root.querySelectorAll("[data-system-tab]"))
    const panels = Array.from(root.querySelectorAll("[data-system-panel]"))

    if (!tabs.length || tabs.length !== panels.length) {
      return
    }

    let activationId = 0
    let autoplayTimer = 0
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const duration = Number(root.dataset.systemDuration) || 8000
    const shouldAutoplay = root.dataset.systemAutoplay === "true" && !prefersReducedMotion

    const clearAutoplay = () => {
      if (!autoplayTimer) {
        return
      }

      window.clearTimeout(autoplayTimer)
      autoplayTimer = 0
    }

    const resetProgress = (tab) => {
      const progress = tab.querySelector("[data-system-progress]")

      if (!progress) {
        return
      }

      progress.style.transition = "none"
      progress.style.width = "0%"
    }

    const startProgress = (tab, token) => {
      const progress = tab.querySelector("[data-system-progress]")

      if (!progress) {
        return
      }

      if (prefersReducedMotion) {
        progress.style.transition = "none"
        progress.style.width = "100%"
        return
      }

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (token !== activationId || !tab.classList.contains("is-active")) {
            return
          }

          progress.style.transition = `width ${duration}ms linear`
          progress.style.width = "100%"
        })
      })
    }

    const scheduleAutoplay = (index, token) => {
      clearAutoplay()

      if (!shouldAutoplay) {
        return
      }

      autoplayTimer = window.setTimeout(() => {
        if (token !== activationId) {
          return
        }

        activate((index + 1) % tabs.length)
      }, duration)
    }

    const activate = (index, options = {}) => {
      const nextIndex = Math.min(Math.max(index, 0), tabs.length - 1)
      const token = ++activationId

      tabs.forEach((tab, tabIndex) => {
        const isActive = tabIndex === nextIndex

        tab.classList.toggle("is-active", isActive)
        tab.setAttribute("aria-selected", String(isActive))
        tab.tabIndex = isActive ? 0 : -1
        resetProgress(tab)
      })

      panels.forEach((panel, panelIndex) => {
        const isActive = panelIndex === nextIndex

        panel.classList.toggle("is-active", isActive)
        panel.hidden = !isActive
      })

      root.dataset.current = tabs[nextIndex].dataset.systemTab || String(nextIndex)
      startProgress(tabs[nextIndex], token)
      scheduleAutoplay(nextIndex, token)

      if (options.focus) {
        tabs[nextIndex].focus()
      }
    }

    const moveFrom = (index, event) => {
      const lastIndex = tabs.length - 1
      let nextIndex = index

      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
          nextIndex = index === lastIndex ? 0 : index + 1
          break
        case "ArrowUp":
        case "ArrowLeft":
          nextIndex = index === 0 ? lastIndex : index - 1
          break
        case "Home":
          nextIndex = 0
          break
        case "End":
          nextIndex = lastIndex
          break
        default:
          return
      }

      event.preventDefault()
      activate(nextIndex, { focus: true })
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(index))
      tab.addEventListener("keydown", (event) => moveFrom(index, event))
    })

    const initialIndex = Math.max(
      tabs.findIndex((tab) => tab.classList.contains("is-active") || tab.getAttribute("aria-selected") === "true"),
      0,
    )

    activate(initialIndex)
  })
})()
