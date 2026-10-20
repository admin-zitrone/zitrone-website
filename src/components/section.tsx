import { type VariantProps, cva } from 'class-variance-authority'
import { type ComponentPropsWithRef, forwardRef } from 'react'
import { cn } from '@/lib/utils'

/* ─────────────────────────────────────────────────────────────
   Section — wraps ds-section / ds-band / ds-section-surface
   ───────────────────────────────────────────────────────────── */

export const sectionVariants = cva('ds-section', {
  variants: {
    tone: {
      default: '',
      warm: '',
      soft: '',
      brand: '',
      inverse: '',
    },
    size: {
      small: '',
      medium: '',
      large: '',
      hero: '',
    },
    pattern: {
      hero: '',
      services: '',
      proof: '',
      stats: '',
      story: '',
      cta: '',
      footer: '',
      'system-tabs': '',
      'service-system': '',
    },
    break: {
      'rounded-bottom': '',
      'rounded-top': '',
    },
    surface: {
      frame: '',
    },
  },
})

type SectionProps = ComponentPropsWithRef<'section'> & VariantProps<typeof sectionVariants>

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { className, tone, size, pattern, surface, break: sectionBreak, children, ...props },
  ref,
) {
  return (
    <section
      ref={ref}
      className={cn('ds-section', className)}
      data-tone={tone ?? undefined}
      data-size={size ?? undefined}
      data-pattern={pattern ?? undefined}
      data-surface={surface ?? undefined}
      data-break={sectionBreak ?? undefined}
      {...props}
    >
      {children}
    </section>
  )
})

/* ─────────────────────────────────────────────────────────────
   Band — groups multiple sections sharing a background
   ───────────────────────────────────────────────────────────── */

type BandProps = ComponentPropsWithRef<'div'> & {
  tone?: 'default' | 'warm' | 'soft' | 'brand' | 'inverse'
  break?: 'rounded-bottom' | 'rounded-top'
}

export const Band = forwardRef<HTMLDivElement, BandProps>(function Band(
  { className, tone, break: bandBreak, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('ds-band', className)}
      data-tone={tone ?? undefined}
      data-break={bandBreak ?? undefined}
      {...props}
    >
      {children}
    </div>
  )
})

/* ─────────────────────────────────────────────────────────────
   SectionSurface — framed rounded surface inside a section
   ───────────────────────────────────────────────────────────── */

type SectionSurfaceProps = ComponentPropsWithRef<'div'> & {
  tone?: 'default' | 'warm' | 'soft' | 'brand' | 'inverse'
}

export const SectionSurface = forwardRef<HTMLDivElement, SectionSurfaceProps>(
  function SectionSurface({ className, tone, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn('ds-section-surface', className)}
        data-tone={tone ?? undefined}
        {...props}
      >
        {children}
      </div>
    )
  },
)
