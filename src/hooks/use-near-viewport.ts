import { type RefObject, useEffect, useState } from "react"

/**
 * True once `ref` comes within `rootMargin` of the viewport, and stays true.
 *
 * For decorative image sets far below the fold. Native `loading="lazy"` starts
 * fetching up to ~3000px early, which on a phone is four screens: the home
 * strip and cover were still ~1.4 MB of the first load. Gate the `<Image>`s on
 * this instead, so they mount about one screen ahead of the visitor. Only use
 * it inside a box whose size does not depend on the image, so nothing shifts.
 */
export function useNearViewport(ref: RefObject<Element | null>, rootMargin = "100% 0px") {
  const [near, setNear] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || near) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true)
      },
      { rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin, near])

  return near
}
