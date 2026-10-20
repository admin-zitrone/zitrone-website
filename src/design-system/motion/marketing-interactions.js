(function () {
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

  const readCssNumber = (target, propertyName, fallback) => {
    const rawValue = window.getComputedStyle(target).getPropertyValue(propertyName).trim()

    if (!rawValue) {
      return fallback
    }

    if (rawValue.endsWith("rem")) {
      const rootFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize)
      return parseFloat(rawValue) * rootFontSize
    }

    if (rawValue.endsWith("px")) {
      return parseFloat(rawValue)
    }

    const parsed = Number(rawValue)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  const initStickyNav = () => {
    const nav = document.querySelector(".ds-nav")

    if (!nav) {
      return
    }

    const threshold = readCssNumber(document.documentElement, "--motion-nav-scroll-threshold", 12)

    const update = () => {
      nav.dataset.navState = window.scrollY > threshold ? "scrolled" : "top"
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
  }

  const initHeroParallax = () => {
    const heroes = Array.from(document.querySelectorAll(".ds-hero-stage"))

    if (!heroes.length || reduceMotion) {
      return
    }

    const maxOffset = readCssNumber(document.documentElement, "--hero-media-parallax-distance", 16)
    let ticking = false

    const update = () => {
      heroes.forEach((hero) => {
        const media = hero.querySelector(".ds-hero-media")

        if (!media) {
          return
        }

        const rect = hero.getBoundingClientRect()
        const range = window.innerHeight + rect.height
        const progress = clamp((window.innerHeight - rect.top) / range, 0, 1)
        const offset = progress * maxOffset * -1

        media.style.setProperty("--hero-media-parallax-offset", `${offset.toFixed(2)}px`)
      })

      ticking = false
    }

    const requestUpdate = () => {
      if (ticking) {
        return
      }

      ticking = true
      window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)
  }

  const initHeroMenus = () => {
    const heroes = Array.from(document.querySelectorAll("[data-hero-menu]"))

    if (!heroes.length) {
      return
    }

    heroes.forEach((hero, index) => {
      const toggle = hero.querySelector("[data-hero-menu-toggle]")
      const close = hero.querySelector("[data-hero-menu-close]")
      const panel = hero.querySelector("[data-hero-menu-panel]")
      const links = Array.from(hero.querySelectorAll("[data-hero-menu-panel] a"))

      if (!toggle || !close || !panel) {
        return
      }

      const breakpoint =
        window.getComputedStyle(document.documentElement).getPropertyValue("--hero-menu-breakpoint").trim() ||
        "68.75rem"
      const mq = window.matchMedia(`(max-width: ${breakpoint})`)
      const toggleOpenLabel = toggle.getAttribute("aria-label") || "Abrir menu"
      const closeLabel = close.getAttribute("aria-label") || "Cerrar menu"
      const panelId = panel.id || `ds-hero-menu-panel-${index + 1}`

      panel.id = panelId
      toggle.setAttribute("aria-controls", panelId)

      const setOpen = (open) => {
        const isCompact = mq.matches
        const shouldShowPanel = isCompact

        hero.dataset.menuOpen = open && isCompact ? "true" : "false"
        toggle.setAttribute("aria-expanded", String(open && isCompact))
        toggle.setAttribute("aria-label", open && isCompact ? closeLabel : toggleOpenLabel)
        panel.hidden = !shouldShowPanel
        panel.setAttribute("aria-hidden", String(!(open && isCompact)))
      }

      const closeMenu = () => {
        setOpen(false)
      }

      const syncViewport = () => {
        if (!mq.matches) {
          closeMenu()
          panel.hidden = true
          return
        }

        panel.hidden = false
        panel.setAttribute("aria-hidden", hero.dataset.menuOpen === "true" ? "false" : "true")
      }

      toggle.addEventListener("click", (event) => {
        event.preventDefault()
        setOpen(hero.dataset.menuOpen !== "true")
      })

      close.addEventListener("click", (event) => {
        event.preventDefault()
        closeMenu()
      })

      links.forEach((link) => {
        link.addEventListener("click", () => {
          closeMenu()
        })
      })

      document.addEventListener("click", (event) => {
        if (hero.dataset.menuOpen !== "true" || !mq.matches) {
          return
        }

        const target = event.target

        if (!(target instanceof Node)) {
          return
        }

        if (panel.contains(target) || toggle.contains(target)) {
          return
        }

        closeMenu()
      })

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeMenu()
        }
      })

      if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", syncViewport)
      } else if (typeof mq.addListener === "function") {
        mq.addListener(syncViewport)
      }

      setOpen(false)
      syncViewport()
    })
  }

  const initFadeReveals = () => {
    const targets = Array.from(document.querySelectorAll('[data-reveal="fade-up"]'))

    if (!targets.length) {
      return
    }

    const reveal = (target) => {
      target.dataset.revealState = "visible"
    }

    targets.forEach((target) => {
      const siblings = Array.from(target.parentElement ? target.parentElement.children : []).filter(
        (element) => element.dataset.reveal === "fade-up",
      )
      const index = siblings.indexOf(target)

      target.style.setProperty("--reveal-index", String(Math.max(index, 0)))

      if (!reduceMotion) {
        target.dataset.revealState = "idle"
      }
    })

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(reveal)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          reveal(entry.target)
          observer.unobserve(entry.target)
        })
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.08,
      },
    )

    targets.forEach((target) => {
      observer.observe(target)
    })
  }

  const initCarousel = (carousel) => {
    const track = carousel.querySelector("[data-carousel-track]")
    const prevButton = carousel.querySelector("[data-carousel-prev]")
    const nextButton = carousel.querySelector("[data-carousel-next]")
    const progress = carousel.querySelector("[data-carousel-progress]")
    const controls = carousel.querySelector("[data-carousel-controls]")

    if (!track || !prevButton || !nextButton || !progress || !controls) {
      return
    }

    const items = Array.from(track.children)
    const label = carousel.getAttribute("data-carousel-label") || "Carousel"
    const trackId = track.id || `ds-carousel-track-${Math.random().toString(36).slice(2, 8)}`

    track.id = trackId
    carousel.setAttribute("role", "region")
    carousel.setAttribute("aria-label", label)
    progress.setAttribute("role", "progressbar")
    progress.setAttribute("aria-label", `${label} progress`)
    progress.setAttribute("aria-valuemin", "1")
    progress.setAttribute("aria-valuemax", String(items.length))
    prevButton.setAttribute("aria-controls", trackId)
    nextButton.setAttribute("aria-controls", trackId)

    if (!items.length) {
      controls.hidden = true
      return
    }

    let frame = 0

    const getBaseOffset = () => {
      const firstItem = items[0]
      return firstItem ? firstItem.offsetLeft : 0
    }

    const getItemOffset = (item) => item.offsetLeft - getBaseOffset()

    const getActiveIndex = () => {
      let closestIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      items.forEach((item, index) => {
        const distance = Math.abs(getItemOffset(item) - track.scrollLeft)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      return closestIndex
    }

    const sync = () => {
      const maxScrollLeft = Math.max(track.scrollWidth - track.clientWidth, 0)
      const scrollable = maxScrollLeft > 1
      const activeIndex = getActiveIndex()

      controls.hidden = !scrollable
      track.tabIndex = scrollable ? 0 : -1
      prevButton.disabled = !scrollable || activeIndex <= 0
      nextButton.disabled = !scrollable || activeIndex >= items.length - 1
      progress.setAttribute("aria-valuenow", String(activeIndex + 1))
      progress.setAttribute("aria-valuetext", `Slide ${activeIndex + 1} of ${items.length}`)
      progress.style.setProperty("--carousel-progress-ratio", String((activeIndex + 1) / items.length))

      items.forEach((item, index) => {
        item.dataset.carouselActive = index === activeIndex ? "true" : "false"
      })
    }

    const requestSync = () => {
      if (frame) {
        return
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0
        sync()
      })
    }

    const goToIndex = (index) => {
      const item = items[clamp(index, 0, items.length - 1)]

      track.scrollTo({
        left: getItemOffset(item),
        behavior: reduceMotion ? "auto" : "smooth",
      })
    }

    prevButton.addEventListener("click", () => {
      goToIndex(getActiveIndex() - 1)
    })

    nextButton.addEventListener("click", () => {
      goToIndex(getActiveIndex() + 1)
    })

    track.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        goToIndex(getActiveIndex() - 1)
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        goToIndex(getActiveIndex() + 1)
      } else if (event.key === "Home") {
        event.preventDefault()
        goToIndex(0)
      } else if (event.key === "End") {
        event.preventDefault()
        goToIndex(items.length - 1)
      }
    })

    track.addEventListener("scroll", requestSync, { passive: true })
    window.addEventListener("resize", requestSync)

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(requestSync)
      resizeObserver.observe(track)
    }

    sync()
  }

  const initCarousels = () => {
    const carousels = Array.from(document.querySelectorAll("[data-carousel]"))

    carousels.forEach(initCarousel)
  }

  const start = () => {
    initStickyNav()
    initHeroParallax()
    initHeroMenus()
    initFadeReveals()
    initCarousels()
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start).catch(start)
    return
  }

  start()
})()
