"use client"

import Image from "next/image"
import { Fragment, useMemo, useState, type CSSProperties } from "react"

import { useHomeContent } from "./home-content-context"

type ServiceOrbitItem = {
  id: string
  title: string
  copy: string
  image: string
  accent: string
}

function ServiceOrbitTile({
  item,
  isActive,
  position,
  onSelect,
  onHoverStart,
}: {
  item: ServiceOrbitItem
  isActive: boolean
  position: "top" | "bottom"
  onSelect: () => void
  onHoverStart: () => void
}) {
  return (
    <div className="ds-service-orbit-slot" data-position={position}>
      <button
        className="ds-service-orbit-card"
        type="button"
        aria-pressed={isActive}
        aria-label={item.title}
        data-active={isActive ? "true" : "false"}
        data-accent={item.accent}
        onClick={onSelect}
        onFocus={onHoverStart}
        onMouseEnter={onHoverStart}
      >
        <span className="ds-service-orbit-card-inner">
          <Image
            className="ds-service-orbit-card-image"
            src={item.image}
            alt=""
            width={360}
            height={360}
            quality={90}
            sizes="(max-width: 47.99rem) 5.5rem, (max-width: 63.99rem) 7rem, 10.5rem"
            draggable={false}
          />
        </span>
      </button>
    </div>
  )
}

export function ServicesOrbit() {
  const { sections, servicesOrbitItems } = useHomeContent()
  const [activeIndex, setActiveIndex] = useState(0)
  const [highlightedTileIndex, setHighlightedTileIndex] = useState<number | null>(null)

  const orbitItems = useMemo(
    () =>
      servicesOrbitItems.map((item, index) => ({
        id: `${item.theme}-${index}`,
        title: item.title,
        copy: item.copy,
        image: item.image,
        accent: item.theme,
      })),
    [servicesOrbitItems],
  )

  const activeItem = orbitItems[activeIndex] ?? orbitItems[0]
  const armCount = Math.max(8, Math.ceil(orbitItems.length / 2))
  const armAngleStep = 180 / armCount
  const orbitTiles = useMemo(() => {
    if (orbitItems.length === 0) return []

    return Array.from({ length: armCount * 2 }, (_, index) => ({
      tileIndex: index,
      item: orbitItems[index % orbitItems.length],
      sourceIndex: index % orbitItems.length,
    }))
  }, [armCount, orbitItems])

  if (!activeItem) return null

  return (
    <div
      className="ds-service-orbit"
      role="region"
      aria-label={sections.services.titleAriaLabel}
    >
      <div
        className="ds-service-orbit-stage"
        style={{ "--service-orbit-count": orbitItems.length } as CSSProperties}
      >
        <div className="ds-service-orbit-circle" aria-label={sections.services.kicker}>
          {Array.from({ length: armCount }, (_, armIndex) => {
            const topTile = orbitTiles[armIndex * 2]
            const bottomTile = orbitTiles[armIndex * 2 + 1]
            const armAngle = armIndex * armAngleStep

            if (!topTile || !bottomTile) return null
            return (
              <div
                className="ds-service-orbit-arm"
                style={{ "--service-orbit-arm-angle": `${armAngle}deg` } as CSSProperties}
                key={armIndex}
              >
                <ServiceOrbitTile
                  item={topTile.item}
                  isActive={topTile.tileIndex === highlightedTileIndex}
                  position="top"
                  onSelect={() => {
                    setActiveIndex(topTile.sourceIndex)
                    setHighlightedTileIndex(topTile.tileIndex)
                  }}
                  onHoverStart={() => {
                    setActiveIndex(topTile.sourceIndex)
                    setHighlightedTileIndex(topTile.tileIndex)
                  }}
                />
                <ServiceOrbitTile
                  item={bottomTile.item}
                  isActive={bottomTile.tileIndex === highlightedTileIndex}
                  position="bottom"
                  onSelect={() => {
                    setActiveIndex(bottomTile.sourceIndex)
                    setHighlightedTileIndex(bottomTile.tileIndex)
                  }}
                  onHoverStart={() => {
                    setActiveIndex(bottomTile.sourceIndex)
                    setHighlightedTileIndex(bottomTile.tileIndex)
                  }}
                />
              </div>
            )
          })}
        </div>

        <article
          className="ds-service-orbit-panel"
          data-accent={activeItem.accent}
          aria-live="polite"
        >
          <div className="ds-service-orbit-panel-content" key={activeItem.id}>
            <h3
              className="ds-service-orbit-title"
              data-reveal-state="visible"
              aria-label={activeItem.title}
            >
              {activeItem.title.split(" ").map((word, index) => (
                <Fragment key={`${activeItem.id}-${word}-${index}`}>
                  {index > 0 ? " " : null}
                  <span>{word}</span>
                </Fragment>
              ))}
            </h3>
            <p className="ds-service-orbit-copy">{activeItem.copy}</p>
          </div>
        </article>
      </div>
    </div>
  )
}
