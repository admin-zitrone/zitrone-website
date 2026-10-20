import { type ComponentPropsWithRef, forwardRef } from "react"
import { Slot } from "@radix-ui/react-slot"
import { SiteLink } from "@/components/site-link"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────────
   Button — ds-button with variant system
   ───────────────────────────────────────────────────────────── */

type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?:
    | "primary"
    | "secondary"
    | "inverse-primary"
    | "inverse-secondary"
    | "accent"
  asChild?: boolean
  href?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant, asChild, disabled, children, href, ...props },
    ref,
  ) {
    if (href && !disabled) {
      const sharedProps = {
        className: cn("ds-button", className),
        "data-variant": variant && variant !== "primary" ? variant : undefined,
      }

      return (
        <SiteLink {...sharedProps} href={href}>
          {children}
        </SiteLink>
      )
    }

    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn("ds-button", className)}
        data-variant={variant && variant !== "primary" ? variant : undefined}
        aria-disabled={disabled || undefined}
        {...props}
      >
        {children}
      </Comp>
    )
  },
)

/* ─────────────────────────────────────────────────────────────
   Pill — ds-pill, label/tag element
   ───────────────────────────────────────────────────────────── */

type PillProps = ComponentPropsWithRef<"span"> & {
  tone?: "default" | "inverse"
}

export const Pill = forwardRef<HTMLSpanElement, PillProps>(function Pill(
  { className, tone, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn("ds-pill", className)}
      data-tone={tone && tone !== "default" ? tone : undefined}
      {...props}
    >
      {children}
    </span>
  )
})

/* ─────────────────────────────────────────────────────────────
   LogoChip — ds-logo-chip
   ───────────────────────────────────────────────────────────── */

type LogoChipProps = ComponentPropsWithRef<"span">

export const LogoChip = forwardRef<HTMLSpanElement, LogoChipProps>(
  function LogoChip({ className, children, ...props }, ref) {
    return (
      <span ref={ref} className={cn("ds-logo-chip", className)} {...props}>
        {children}
      </span>
    )
  },
)
