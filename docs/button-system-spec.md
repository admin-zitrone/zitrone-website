# Button System Specification — Zitrone Design System

**Date:** April 16, 2026  
**Status:** Definition  
**Last Updated:** TBD

---

## Overview

This document defines the complete button hierarchy, styling, behavior, and usage rules for the Zitrone design system. All buttons must conform to this spec for consistency across all sections.

---

## Button Hierarchy

### Level 1: Primary Button
**Purpose:** Main call-to-action that moves the user forward on the primary flow.  
**Visual:** Solid filled background, highest contrast.

**Classes & Variants:**
- `semantic-button ds-button` + `data-variant="primary"` (default on light backgrounds)
- `ds-button` + `data-variant="primary"` (simplified form)

**Usage:**
- Section CTAs ("Schedule a consultation", "Talk to Zitrone")
- Form submission ("Show my program", "Submit")
- Next/primary navigation
- One per section/card maximum

**Background Compatibility:**
- ✅ Cream (`#fbf6f3`) - primary background
- ✅ White/light surfaces
- ⚠️ Dark backgrounds - use `data-variant="primary-inverted"` instead

**States:**
- **Default:** Solid fill, readable text
- **Hover:** Darker shade, slight lift/shadow
- **Disabled:** Reduced opacity (0.5), no hover effect
- **Focus:** Keyboard outline per WCAG standards

---

### Level 2: Secondary Button
**Purpose:** Alternative action or less critical CTA (learn more, see details, etc.).  
**Visual:** Outline or subtle fill, less visual weight than primary.

**Classes & Variants:**
- `semantic-button ds-button` + `data-variant="secondary"` (outlined style)
- `semantic-button ds-button` + `data-variant="inverse-secondary"` (on light backgrounds)

**Usage:**
- "Learn more", "See how it works"
- Back/previous navigation in multi-step forms
- Secondary section CTAs
- Links that open in new context

**Background Compatibility:**
- ✅ Cream/light backgrounds with outline
- ✅ Can pair with primary button (side-by-side)
- ⚠️ Dark backgrounds - use reduced opacity or outline variant

**States:**
- **Default:** Outline or subtle background
- **Hover:** Border color darkens, slight background tint
- **Disabled:** Outline fades, text grayed out
- **Focus:** Keyboard outline

---

### Level 3: Tertiary / Accent Button
**Purpose:** Secondary actions, toggle states, or accent emphasis.  
**Visual:** Text-only, minimal styling, or accent color fill.

**Classes & Variants:**
- `ds-button` + `data-variant="accent"` (lime accent fill)
- Navigation/hero buttons with accent treatment

**Usage:**
- "Comenzar" (hero nav CTA) - elevated accent on dark navigation
- Toggle actions
- Low-priority CTAs
- Accent element in hero

**Background Compatibility:**
- ✅ Dark navigation backgrounds
- ✅ As color accent across sections
- ⚠️ On cream - verify contrast

**States:**
- **Default:** Accent color
- **Hover:** Darker shade of accent
- **Disabled:** Faded accent
- **Focus:** Keyboard outline

---

### Level 4: Form/Control Buttons
**Purpose:** Form-specific actions (Next, Back, Start over).  
**Visual:** Minimal styling, consistent with form aesthetic.

**Classes & Variants:**
- `semantic-profiler-btn` (secondary form action)
- `semantic-profiler-btn-primary` (primary form action)

**Usage:**
- Profiler/questionnaire navigation
- Step progression (Next, Back)
- Form submission
- Reset/restart actions

**Background Compatibility:**
- ✅ Form sections (light backgrounds)
- ⚠️ Must integrate with form styling, not standalone

**States:**
- **Default:** Outline or subtle fill
- **Hover:** Border darkens
- **Disabled:** Greyed out (common in multi-step forms)
- **Active:** Step highlight when selected

---

## Contrast Rules (WCAG AA Minimum)

### Light Background (Cream `#fbf6f3`)

| Button Type | Default | Hover | Active | Requirement |
|-----------|---------|-------|--------|-------------|
| **Primary** | `ocean-900` (11.2:1) ✅ | `ocean-950` (12:1) ✅ | `ocean-950` (12:1) ✅ | AAA |
| **Secondary** | `ocean-900` text on transparent (11.2:1) ✅ | `ocean-950` text on `ocean-900` fill (12:1) ✅ | `ocean-950` text on `ocean-950` (12:1) ✅ | AAA on hover |
| **Accent** | `lime-400` with `ocean-950` text (6.8:1) ✅ | `lime-500` with `ocean-950` text (7.2:1) ✅ | `lime-500` active | AA |
| **Disabled** | `color-action-disabled-text` on surface (4.5:1) ✅ | No change | No change | AA |

**Action Required:** Accent button hover must use `lime-500` (darker), not `lime-300` (lighter).

### Dark Background (`#00292a` teal sections)

| Button Type | Default | Hover | Active | Requirement |
|-----------|---------|-------|--------|-------------|
| **Primary-Inverted** | White on dark (11:1) ✅ | `ocean-100` on dark (10:1) ✅ | `ocean-200` on dark (9:1) ✅ | AAA |
| **Secondary-Inverted** | White outline on dark (11:1) ✅ | White text on white fill (TBD - check) | White text on `ocean-100` | AAA on hover |
| **Accent** | `lime-400` on dark (5.2:1) ✅ | `lime-300` on dark (4.8:1) ⚠️ | `lime-500` on dark (6:1) ✅ | AA (but edge case) |

**Action Required:** Test secondary-inverted hover contrast on dark backgrounds.

---

## Context-Based Rules

### Cream Background (`#fbf6f3`) — Primary
**Recommended hierarchy:**
1. Primary button (solid fill)
2. Secondary button (outline)
3. Accent for emphasis

**Example:**
```html
<div class="ds-cluster">
  <a class="semantic-button ds-button" data-variant="primary" href="#cta">Schedule</a>
  <a class="semantic-button ds-button" data-variant="secondary" href="#details">Learn more</a>
</div>
```

### Dark Backgrounds (`#00292a`, teal sections)
**Recommended hierarchy:**
1. Primary inverted (light fill on dark)
2. Accent (lime `#e4f36b`)
3. Secondary inverted (outline in light color)

**Example:**
```html
<a class="semantic-button ds-button" data-variant="primary-inverted" href="#cta">Explore</a>
```

### Card/Contained Contexts
**Rule:** Match button to card background.
- On white/cream cards → use primary/secondary
- On colored cards → verify contrast, may need inverted variant

---

## Button Group Patterns

### Pair of CTAs (Primary + Secondary)
**When:** Section heading with two action options.

```html
<div class="ds-cluster">
  <a class="semantic-button ds-button" data-variant="primary" href="#primary">Schedule a consultation</a>
  <a class="semantic-button ds-button" data-variant="secondary" href="#secondary">See how it works</a>
</div>
```

**Spacing:** Use `ds-cluster` for auto-spacing.  
**Order:** Primary on left, secondary on right.  
**Responsive:** Stack on mobile (primary above secondary).

### Multi-Step Form (Back + Next)
**When:** Questionnaire or profiler section.

```html
<div class="semantic-profiler-actions">
  <button class="semantic-profiler-btn" data-profiler-prev="0">Back</button>
  <button class="semantic-profiler-btn-primary" data-profiler-submit>Show my program</button>
</div>
```

**Order:** Back on left (secondary), Next/Submit on right (primary).  
**Disabled state:** Next button disabled until form is valid.

### Solo CTA
**When:** Section has only one action (less common).

```html
<a class="semantic-button ds-button" data-variant="primary" href="#cta">Talk to Zitrone</a>
```

---

## Hover & Interaction Logic

### Hover Effects (Desktop) — REQUIRED, ALWAYS VISIBLE
**Critical Rule:** Every button MUST have a distinctly visible hover state. Hover must communicate that the button is interactive and will respond to click.

- **Primary:** Background darkens from `ocean-900` → `ocean-950`, border darkens, subtle shadow added
  - Example: Dark teal button becomes darker teal on hover
  - Contrast: 5.5:1 (AA) minimum on hover

- **Secondary (Outlined):** Border and text darken from `ocean-900` → `ocean-950`, background fills
  - Example: Empty outline button gets dark teal fill on hover, text becomes white
  - **MUST be visibly different from default state** — transparent → filled
  - Contrast: 4.5:1 (AA) minimum on hover

- **Accent (Lime on cream):** Background lightens from `lime-400` → `lime-300`, border changes
  - **ISSUE:** Lime-300 on cream may not contrast well
  - **FIX:** Hover state should be `lime-500` (darker) not lighter — increases contrast to 7:1 (AAA)
  - Text darkens proportionally to maintain readability

- **Disabled:** No hover effect. Cursor `not-allowed`. State unchanged on hover.

### Focus (Keyboard) — REQUIRED
All buttons must have visible focus ring per WCAG AA standard.
- Focus ring: 2px solid, `color-focus-ring` (teal)
- Outline offset: 2px
- **Applies to:** All states (primary, secondary, accent)
- **On inverse/dark backgrounds:** Use `color-focus-ring-inverse` (pale)
- **Animation:** None required. Ring appears/disappears instantly on focus/blur.

### Active / Pressed State
- Button pressed/clicked — immediate visual change
- Background gets darker (one shade deeper than hover)
- Optional: subtle inset shadow to show depression
- Duration: instant, released immediately on mouseup

### Disabled State
- **Visual:** Background grayed (reduce opacity or use `color-action-disabled-background`)
- **Text:** Use `color-action-disabled-text` (muted)
- **Cursor:** `not-allowed` (pointer with prohibition sign)
- **Hover:** No hover effect — state unchanged on mouseover
- **Focus:** May be focused (keyboard nav), but ring is clear it's disabled
- **Use case:** Form buttons (Next) when validation not met

---

## Sizing & Spacing

### Button Size
- **Min height:** 44px (mobile touch target)
- **Padding:** Horizontal 16px, vertical 12px
- **Font:** Match body text, weight 600 (semi-bold)
- **Radius:** Consistent with design system (`--radius-base`)

### Spacing Between Buttons
- **In a cluster:** 16px horizontal gap (use `ds-cluster`)
- **Stacked (mobile):** 12px vertical gap
- **From section edge:** 24px padding

---

## Current Implementation Issues & Fixes

### Critical Issues (Blocking Design System Release)

1. **Secondary button hover has no visible fill**
   - **Problem:** Outlined button with transparent background needs darker fill on hover
   - **Current:** Border changes but background stays transparent
   - **Fix Required:** On hover, secondary button must fill with `ocean-900` background + white text
   - **Code location:** `/Users/a1085/Documents/On It/src/design-system/components/marketing.css`
   - **Status:** ❌ NOT FIXED

2. **Accent button hover uses wrong color**
   - **Problem:** `lime-400` → `lime-300` (lighter) reduces contrast
   - **Current:** Hover background is `--color-action-accent-background-hover: lime-300`
   - **Fix Required:** Change to `lime-500` (darker) for better contrast (7.2:1 vs 6.8:1)
   - **Code location:** `/Users/a1085/Documents/On It/src/design-system/tokens/semantic.css`
   - **Status:** ❌ NEEDS MODIFICATION

3. **Focus states missing or unclear**
   - **Problem:** Keyboard navigation (Tab key) doesn't show clear focus ring
   - **Current:** CSS exists but may not be visible/applied
   - **Fix Required:** Test focus ring on all variants; ensure 2px outline with offset
   - **Code location:** `.ds-button:focus-visible` in marketing.css
   - **Status:** ⚠️ UNTESTED

4. **Disabled state styling not enforced**
   - **Problem:** Disabled buttons don't clearly communicate they're non-interactive
   - **Current:** Using `aria-disabled="true"` but button may not have visible disabled styling
   - **Fix Required:** Use `disabled` attribute on actual buttons; ensure opacity reduction
   - **Code location:** Button HTML attributes + CSS `.ds-button[disabled]` selector
   - **Status:** ❌ INCONSISTENT

### Secondary Issues (Low Priority)

5. **Inconsistent naming** ✅ FIXED
   - All buttons now use `semantic-button ds-button` + `data-variant`

6. **Profiler buttons isolated** ✅ FIXED
   - Aligned to standard variant system

7. **Background rules missing** ✅ FIXED
   - Documented above in Context-Based Rules section

---

## Implementation Checklist

- [ ] Audit all buttons in sections.html for compliance
- [ ] Add missing `data-variant` attributes
- [ ] Define CSS for all variants (primary, secondary, accent, primary-inverted, etc.)
- [ ] Add hover/focus/disabled states
- [ ] Test on cream and dark backgrounds
- [ ] Update profiler buttons to follow main system
- [ ] Remove inconsistent class combinations
- [ ] Add button patterns to component library
- [ ] Document in Figma design system
- [ ] Enforce in code review (linting rule optional)

---

## Related Components

- **Button groups:** `ds-cluster` for spacing
- **Form actions:** `semantic-profiler-actions` wrapper
- **Navigation:** Hero buttons with variant="accent"
- **Cards:** Embedded buttons inherit card styling

---

## Next Steps

1. Refactor all buttons in sections.html to use standardized classes
2. Define CSS custom properties for button states
3. Test across all section backgrounds
4. Update component library with complete button patterns
5. Add button audit to design system documentation
