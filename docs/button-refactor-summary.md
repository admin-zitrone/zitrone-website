# Button System Refactoring Summary

**Date:** April 16, 2026  
**File:** `file:///Users/a1085/Documents/On%20It/preview/design-system/sections.html`  
**Status:** Applied & Ready for Review

---

## Changes Made

### 1. Services Section (Lines 169-177)
**Before:**
```html
<a class="semantic-button ds-button" data-variant="inverse-primary" href="#cta">
  Schedule a consultation
</a>
<a class="semantic-button ds-button" data-variant="inverse-secondary" href="#platform">
  See how it works
</a>
```

**After:**
```html
<a class="semantic-button ds-button" data-variant="primary" href="#cta">
  Schedule a consultation
</a>
<a class="semantic-button ds-button" data-variant="secondary" href="#platform">
  See how it works
</a>
```

**Rationale:** Light background (cream) uses `primary`/`secondary`, not `inverse-*` variants.

---

### 2. Profiler Form Buttons (Lines 1361, 1389, 1392, 1435, 1438, 1461, 1467)
**Before:**
```html
<button type="button" class="semantic-profiler-btn" disabled data-profiler-next="1">
  Next
</button>
<button type="button" class="semantic-profiler-btn-primary" data-profiler-submit>
  Show my program
</button>
<a class="semantic-profiler-btn-primary" href="mailto:...">
  Talk to Zitrone
</a>
```

**After:**
```html
<button type="button" class="semantic-button ds-button" data-variant="secondary" disabled data-profiler-next="1">
  Next
</button>
<button type="button" class="semantic-button ds-button" data-variant="primary" data-profiler-submit>
  Show my program
</button>
<a class="semantic-button ds-button" data-variant="primary" href="mailto:...">
  Talk to Zitrone
</a>
```

**Rationale:** Unified naming: all buttons now use `semantic-button ds-button` + `data-variant="primary|secondary"`. Removed isolated `semantic-profiler-btn` pattern.

---

## Button Variant Coverage (Post-Refactor)

### Light Backgrounds (Cream `#fbf6f3`)
✅ **Primary:** `data-variant="primary"`  
   - "Schedule a consultation" (Services section)  
   - "Show my program" (Profiler step 2)  
   - "Talk to Zitrone" (Profiler results)

✅ **Secondary:** `data-variant="secondary"`  
   - "See how it works" (Services section)  
   - "See client stories" (How it works section)  
   - "Back" buttons (Profiler steps)  
   - "Next" buttons (Profiler steps)  
   - "Start over" (Profiler results)

### Hero/Navigation
✅ **Accent:** `data-variant="accent"`  
   - "Comenzar" (Hero nav CTA)  
   - "Comenzar" (Mobile menu CTA)  
   - CTA link in bento section

---

## Remaining Issues (For Design System Implementation)

1. **CSS States Not Yet Defined**
   - Hover effects not implemented
   - Focus states not implemented
   - Disabled state styling unclear
   - Needs CSS custom properties for colors

2. **No Dark Background Variants**
   - `data-variant="primary-inverted"` needed for dark sections
   - `data-variant="secondary-inverted"` needed for dark sections
   - Not yet used in preview, but spec calls for them

3. **Carousel Buttons Not Updated**
   - `ds-carousel-button` remains separate (acceptable—specific UI control)

---

## Next Steps: Design System Implementation

To enforce this system library-wide:

1. **Add to @vibecoding/ui component library:**
   - Create `Button` component with variants: `primary`, `secondary`, `accent`, `primary-inverted`, `secondary-inverted`
   - Define CSS for all variants and states
   - Export from `src/index.ts`

2. **Update theme.css:**
   - Define button color tokens
   - Define hover/focus/disabled states
   - Ensure contrast on all backgrounds

3. **Create linting/enforcement:**
   - Audit tool to flag old button patterns
   - Optional: ESLint rule to enforce `semantic-button ds-button` pattern

4. **Add to Figma design system:**
   - Create button component set
   - Document states and variants
   - Link to Code Connect

5. **Documentation:**
   - Add button patterns to design system guide
   - Show dos/don'ts for each context
   - Include accessibility notes

---

## Verification Checklist

- [x] All buttons use `semantic-button ds-button` + `data-variant` pattern
- [x] Light backgrounds use `primary`/`secondary` (not `inverse-*`)
- [x] Profiler buttons unified (no more `semantic-profiler-btn`)
- [x] Hero/nav buttons use `accent` variant
- [x] No inconsistent class combinations remain
- [ ] CSS hover/focus/disabled states defined
- [ ] Dark background variants created
- [ ] Component library updated
- [ ] Tested in browser on all sections
- [ ] Contrast verified for all variants

---

## File Locations

- **Preview with refactored buttons:**  
  `file:///Users/a1085/Documents/On%20It/preview/design-system/sections.html`

- **Button system specification:**  
  `/Users/a1085/Documents/On It/docs/button-system-spec.md`

- **Component library location (when ready):**  
  `packages/ui/src/components/Button/Button.tsx`
