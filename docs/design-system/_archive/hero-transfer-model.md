# Hero Transfer Model

Status: in progress.

This document defines how we bring an already-designed hero into our design system without copying its implementation blindly and without losing the thing that makes it feel like itself.

The rule is simple: preserve the component's essence through governed tokens and pattern grammar, not through project-local CSS leftovers.

## Why This Exists

We already have components from other work that may be worth reusing structurally. The design-system question is not "can we paste this hero into the repo?" The real question is:

1. what is the reusable pattern,
2. what is only brand styling,
3. what is only page content,
4. and what system rules must exist so the pattern can be rebuilt cleanly here.

This first transfer model uses the Zitrone hero as a reference input only. It does not change or depend on the Zitrone project.

## Source Diagnosis

The reference hero is not a Tailwind-first utility pile. Tailwind is installed in the project, but the hero itself is a custom React component plus global CSS and theme tokens.

Useful source traits:

- full-viewport image hero inside a rounded bento frame with margin on all four sides
- masthead navigation sitting directly on the media
- strong dark overlay for legibility
- compact left-aligned copy block on desktop
- mobile menu that becomes a full overlay sheet
- bottom trust ribbon with looping client marquee
- brand-forward CTA treatment

This means the hero already has pattern logic. It is not just "a pretty section."

## Reusable Hero Anatomy

### 1. Hero Frame

Purpose:
Define the page-opening shell that owns the viewport height, four-side inset, radius, and clipping behavior.

Belongs to:
- layout and media semantics
- hero-specific frame tokens

Should not belong to:
- page content
- brand copy

### 2. Hero Media Layer

Purpose:
Carry the immersive image/video background plus the legibility overlay.

Belongs to:
- media semantics
- surface and overlay tokens
- focal-point and crop rules

Should not belong to:
- individual hero copy styles

### 3. Hero Masthead

Purpose:
Place brand, primary navigation, and optional utility action on top of the hero surface.

Belongs to:
- nav/header grammar
- hero-specific inverse nav behavior
- responsive interaction rules

Should not belong to:
- one-off hero CSS that only exists because the page happened to need a nav there once

### 4. Hero Copy Block

Purpose:
Define the content order, measure, and action hierarchy inside the hero.

Belongs to:
- typography roles
- hero composition grammar
- button grammar
- spacing/rhythm tokens

Current canonical order:
- contextual pill or kicker
- hero heading
- support copy
- primary action
- secondary action when justified

### 5. Hero Menu Sheet

Purpose:
Handle compact-screen navigation without collapsing the hero into broken overlap.

Belongs to:
- interaction grammar
- nav/header grammar
- inverse surface tokens
- motion and reduced-motion rules

Should not belong to:
- hero-only JavaScript unless the behavior is truly unique to the hero

### 6. Hero Trust Ribbon

Purpose:
Add credibility or proof without changing the primary reading order of the hero.

Belongs to:
- hero subfamily grammar
- logo-row / chip grammar
- motion semantics when animated

Should not belong to:
- arbitrary decorative strips with no defined information role

## System Mapping

The design-system translation for an imported hero should look like this.

### Foundation Tokens

Use token families for:

- hero frame radius, four-side inset, and max-height/min-height behavior
- hero shell width and copy measure
- hero overlay gradient and dim/blur states
- inverse nav text, border, and utility-action states
- hero ribbon background, border, and chip styling
- hero menu-sheet surface, spacing, and motion

### Grammar

The hero pattern should resolve into governed subfamilies:

1. `HeroFrame`
2. `HeroMasthead`
3. `HeroCopyBlock`
4. `HeroMenuSheet`
5. `HeroProofRibbon`

Not every hero needs all five. Maven-style editorial heroes may use `HeroFrame + HeroCopyBlock` only. Operational or trust-heavy heroes may use all five.

### Content

Content remains project-specific:

- headline
- support copy
- CTA labels and destinations
- chosen image/video
- client names or proof items

## What We Preserve Versus What We Normalize

Preserve:

- emotional tone
- media-led composition
- bento frame behavior when the source hero uses a contained shell
- reading order
- trust/proof behavior
- mobile menu intent
- brand energy through token overrides

Normalize:

- spacing decisions
- type roles
- button hierarchy
- nav interaction states
- overlay logic
- ribbon/chip treatment
- responsive breakpoints

## Gaps In Our Current Design System

Our current system already covers the broad hero composition, but this transfer exercise shows five missing or under-defined areas.

### 1. Hero Frame Is Still Too Generic

We have hero composition rules, but not yet a clearly documented frame subfamily that governs viewport height, rounded shell behavior, and four-side bento inset.

### 2. Hero Masthead Needs To Be Formalized

Our header system exists, but we do not yet define the "masthead on top of hero media" variant as a first-class pattern.

### 3. Hero Menu Sheet Is Not Yet A Governed Subfamily

The current system does not explicitly model the compact-screen overlay menu as part of hero/navigation grammar.

### 4. Hero Proof Ribbon Is Only Partly Covered

We have tabs and logo rows, but not yet a dedicated bottom-of-hero trust ribbon pattern with optional marquee behavior.

### 5. External Hero Transfer Needs A Repeatable Method

We need a documented translation step for outside components:

- inventory the anatomy
- map each part to system layers
- identify missing token families
- preserve only pattern essence

Without this method, every imported hero risks reintroducing one-off styles.

## Recommended Pattern Decision

For this design system, hero should no longer be governed as one broad block only. It should be treated as:

- `Hero Composition` as the parent family
- `Hero Masthead` as a governed subfamily
- `Hero Menu Sheet` as a governed subfamily
- `Hero Proof Ribbon` as a governed subfamily

That lets us absorb external references like Zitrone while keeping the system coherent and still aligned to Maven-like page quality.

## Practical Rule

When we borrow from an older component, we do not ask:

"How do we recreate this exact code?"

We ask:

"Which design-system parts must exist so this component can be rebuilt cleanly, with the same character, under governed rules?"

That is the transfer standard we should use for all future imported sections.
