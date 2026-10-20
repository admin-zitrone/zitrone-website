import { type ComponentPropsWithRef, forwardRef } from "react"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────────
   MediaFrame — ds-media-frame with ratio/treatment/focal/overlay
   ───────────────────────────────────────────────────────────── */

type MediaFrameProps = ComponentPropsWithRef<"figure"> & {
  ratio?: "landscape" | "wide" | "square" | "portrait"
  treatment?: "contained" | "bleed"
  focal?: "default" | "feature" | "portrait"
  overlay?: "scrim" | "surface"
}

export const MediaFrame = forwardRef<HTMLElement, MediaFrameProps>(
  function MediaFrame(
    { className, ratio, treatment, focal, overlay, children, ...props },
    ref,
  ) {
    return (
      <figure
        ref={ref}
        className={cn("ds-media-frame", className)}
        data-ratio={ratio ?? undefined}
        data-treatment={treatment ?? undefined}
        data-focal={focal && focal !== "default" ? focal : undefined}
        data-overlay={overlay ?? undefined}
        {...props}
      >
        {children}
      </figure>
    )
  },
)
