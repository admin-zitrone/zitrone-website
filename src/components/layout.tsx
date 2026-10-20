import { type ComponentPropsWithRef, forwardRef } from 'react'
import { cn } from '@/lib/utils'

/* ─────────────────────────────────────────────────────────────
   Container — centered width wrapper (ds-container)
   ───────────────────────────────────────────────────────────── */

type ContainerProps = ComponentPropsWithRef<'div'> & {
  width?: 'main' | 'narrow' | 'readable'
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { className, width, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('ds-container', className)}
      data-width={width ?? undefined}
      {...props}
    >
      {children}
    </div>
  )
})

/* ─────────────────────────────────────────────────────────────
   Stack — vertical flow with gap (ds-stack)
   ───────────────────────────────────────────────────────────── */

type StackProps = ComponentPropsWithRef<'div'> & {
  gap?: 'tight' | 'default' | 'loose'
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { className, gap, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('ds-stack', className)}
      data-gap={gap && gap !== 'default' ? gap : undefined}
      {...props}
    >
      {children}
    </div>
  )
})

/* ─────────────────────────────────────────────────────────────
   Grid — auto-fit or explicit column grid (ds-grid)
   ───────────────────────────────────────────────────────────── */

type GridProps = ComponentPropsWithRef<'div'> & {
  columns?: '2-col' | '3-col' | '4-col' | 'editorial'
  columnsMedium?: '2-col' | '3-col' | '4-col'
  grid?: 'stats'
  gutter?: 'tight' | 'loose'
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { className, columns, columnsMedium, grid, gutter, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('ds-grid', className)}
      data-columns={columns ?? undefined}
      data-columns-medium={columnsMedium ?? undefined}
      data-grid={grid ?? undefined}
      data-gutter={gutter ?? undefined}
      {...props}
    >
      {children}
    </div>
  )
})

/* ─────────────────────────────────────────────────────────────
   CardRail — mobile rail that promotes to a named desktop grid
   ───────────────────────────────────────────────────────────── */

type CardRailProps = ComponentPropsWithRef<'div'> & {
  columns?: '2-col' | '3-col' | '4-col'
  gridFrom?: 'tablet' | 'desktop'
  gutter?: 'tight' | 'loose'
}

export const CardRail = forwardRef<HTMLDivElement, CardRailProps>(function CardRail(
  { className, columns, gridFrom, gutter, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('ds-card-rail', className)}
      data-columns={columns ?? undefined}
      data-grid-from={gridFrom ?? undefined}
      data-gutter={gutter ?? undefined}
      {...props}
    >
      {children}
    </div>
  )
})

/* ─────────────────────────────────────────────────────────────
   Split — two-column layout with ratio control (ds-split)
   ───────────────────────────────────────────────────────────── */

type SplitProps = ComponentPropsWithRef<'div'> & {
  layout?: 'even' | 'feature' | 'story'
  columns?: '6/6' | '5/7' | '4/8'
  columnsMedium?: '6/6' | '5/7' | '4/8'
  collapse?: 'tablet' | 'desktop'
  gutter?: 'tight' | 'loose'
}

export const Split = forwardRef<HTMLDivElement, SplitProps>(function Split(
  { className, layout, columns, columnsMedium, collapse, gutter, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('ds-split', className)}
      data-layout={layout ?? undefined}
      data-columns={columns ?? undefined}
      data-columns-medium={columnsMedium ?? undefined}
      data-collapse={collapse ?? undefined}
      data-gutter={gutter ?? undefined}
      {...props}
    >
      {children}
    </div>
  )
})

/* ─────────────────────────────────────────────────────────────
   Cluster — inline flex wrap (ds-cluster)
   ───────────────────────────────────────────────────────────── */

type ClusterProps = ComponentPropsWithRef<'div'> & {
  wrap?: 'stack-compact' | 'center-stack-compact'
}

export const Cluster = forwardRef<HTMLDivElement, ClusterProps>(function Cluster(
  { className, wrap, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn('ds-cluster', className)} data-wrap={wrap ?? undefined} {...props}>
      {children}
    </div>
  )
})

/* ─────────────────────────────────────────────────────────────
   SectionHead — centered kicker + heading + copy layout
   ───────────────────────────────────────────────────────────── */

type SectionHeadProps = ComponentPropsWithRef<'div'>

export const SectionHead = forwardRef<HTMLDivElement, SectionHeadProps>(function SectionHead(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('ds-section-head ds-stack', className)}
      data-gap="loose"
      {...props}
    >
      {children}
    </div>
  )
})
