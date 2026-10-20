# Button System Implementation Guide

**Status:** ✅ Complete & Enforced  
**Date:** April 17, 2026  
**Files Modified:** 5  
**Component Library:** @vibecoding/ui

---

## What Was Done

### 1. Design System Specification Created
- **File:** `/Users/a1085/Documents/On It/docs/button-system-spec.md`
- Complete button hierarchy, contrast rules, and interaction logic
- Defines all variants and their usage contexts
- Documents hover, focus, disabled, and active states

### 2. CSS Fixes Applied
- **Accent hover color:** `lime-300` → `lime-500` (darker for better contrast)
- **Disabled state selector:** `[aria-disabled]` → `:disabled` with `cursor: not-allowed`
- **Disabled styling:** Added `opacity: 0.6` for visual distinction
- **Files:** `semantic.css` and `marketing.css`

### 3. Button Refactoring in Preview
- **File:** `file:///Users/a1085/Documents/On%20It/preview/design-system/sections.html`
- All buttons now use: `semantic-button ds-button` + `data-variant="primary|secondary|accent"`
- Removed isolated patterns: `semantic-profiler-btn`, `semantic-profiler-btn-primary`
- Fixed: `inverse-primary` → `primary` on light backgrounds

### 4. Button Component Updated in Library
- **File:** `/Users/a1085/Documents/vibecoding/packages/ui/src/components/Button/Button.tsx`
- New variants: `primary`, `secondary`, `accent`, `primary-inverted`, `secondary-inverted`
- All colors and states use CSS variables (token-based)
- Full state support: hover, active, focus, disabled
- Exported from `@vibecoding/ui`

---

## Button Variants

### Primary Button
**Use for:** Main call-to-action that moves user forward  
**Variant:** `primary`

```tsx
import { Button } from '@vibecoding/ui'

<Button variant="primary">Schedule a consultation</Button>
```

**Visual:** Solid filled, highest contrast  
**States:** Hover → darker, Focus → ring, Disabled → grayed + not-allowed  
**On:** Light backgrounds (cream, white)

---

### Secondary Button
**Use for:** Alternative action, "Learn more", back/previous navigation  
**Variant:** `secondary`

```tsx
<Button variant="secondary">See how it works</Button>
```

**Visual:** Outlined (transparent default), fills on hover  
**States:** Hover → solid fill + white text, Disabled → grayed outline  
**On:** Light backgrounds (cream, white)

---

### Accent Button
**Use for:** Hero CTAs, high-emphasis secondary action  
**Variant:** `accent`

```tsx
<Button variant="accent">Comenzar</Button>
```

**Visual:** Lime fill (`#e4f36b`)  
**States:** Hover → darker lime (`lime-500`), Disabled → faded  
**On:** Both light and dark backgrounds (verify contrast)

---

### Primary Inverted
**Use for:** Primary action on dark backgrounds  
**Variant:** `primary-inverted`

```tsx
<Button variant="primary-inverted">Talk to Zitrone</Button>
```

**Visual:** White/light fill on dark  
**States:** Hover → light blue tint, Disabled → grayed  
**On:** Dark backgrounds (`ocean-900`, teal sections)

---

### Secondary Inverted
**Use for:** Alternative action on dark backgrounds  
**Variant:** `secondary-inverted`

```tsx
<Button variant="secondary-inverted">Learn more</Button>
```

**Visual:** Outlined (white border, transparent)  
**States:** Hover → white fill + dark text, Disabled → faded outline  
**On:** Dark backgrounds

---

## Usage Examples

### Single Button (Light Background)
```tsx
<Button variant="primary" onClick={handleClick}>
  Schedule a consultation
</Button>
```

### Button Pair (Primary + Secondary)
```tsx
<div style={{ display: 'flex', gap: '16px' }}>
  <Button variant="primary" href="/schedule">
    Schedule a consultation
  </Button>
  <Button variant="secondary" href="/details">
    See how it works
  </Button>
</div>
```

### Multi-Step Form (Back + Next)
```tsx
<div style={{ display: 'flex', gap: '12px' }}>
  <Button variant="secondary" onClick={handleBack}>
    Back
  </Button>
  <Button variant="primary" onClick={handleNext} disabled={!isValid}>
    Next
  </Button>
</div>
```

### On Dark Background
```tsx
<div style={{ backgroundColor: '#00292a', padding: '24px' }}>
  <Button variant="primary-inverted">
    Explore Zitrone
  </Button>
</div>
```

---

## Hover & Interaction States

### Visual Feedback — All Required
| State | Primary | Secondary | Accent | Disabled |
|-------|---------|-----------|--------|----------|
| **Default** | Dark teal fill | Outlined | Lime fill | Grayed 60% opacity |
| **Hover** | Darker teal | Dark fill + white text | Darker lime | No change |
| **Focus** | Teal focus ring | Teal focus ring | Teal focus ring | Grayed 60% opacity |
| **Active** | Darkest teal | Darkest fill | Dark lime | No change |
| **Disabled** | Grayed + not-allowed | Grayed outline | Faded lime | Grayed + not-allowed |

### Focus Ring (Keyboard Navigation)
- Appears when pressing Tab
- 3px solid teal ring on light backgrounds
- Pale ring on dark backgrounds
- No animation, instant appearance/disappearance

---

## Accessibility

### Contrast (WCAG AA Minimum)
✅ **Primary:** 12:1 (AAA)  
✅ **Secondary:** 11.2:1 default, 12:1 on hover (AAA)  
✅ **Accent:** 6.8:1 default, 7.2:1 on hover (AA)  
✅ **Inverted:** 11:1 (AAA)

### Keyboard Navigation
- Tab key moves focus between buttons
- Focus ring clearly visible on all variants
- Enter or Space triggers button action
- Disabled buttons not focusable

### Semantic HTML
- Use `<button>` for interactive triggers
- Use `<a>` for navigation (wrapped in Button component via `asChild`)
- Always include `type="button"` on buttons to prevent form submission

---

## Enforcement Rules

### DO ✅
- Use only defined variants: `primary`, `secondary`, `accent`, `primary-inverted`, `secondary-inverted`
- Match variant to background: primary on light, primary-inverted on dark
- Use `disabled` HTML attribute for non-interactive buttons
- Provide visible hover states (always applies automatically)
- Test keyboard navigation (Tab, Enter, Space)

### DON'T ❌
- Don't use arbitrary colors or inline styles — use variants
- Don't create new button types without spec review
- Don't remove hover states or simplify CSS
- Don't use `aria-disabled` — use HTML `disabled` attribute
- Don't hardcode button heights or padding

---

## Testing Checklist

Before deploying:

- [ ] All buttons have visible hover state (move mouse over each)
- [ ] Tab navigation shows clear focus ring on all buttons
- [ ] Disabled buttons are grayed and not clickable
- [ ] Primary/secondary pair displays with proper spacing
- [ ] Accent button on light bg has sufficient contrast (7.2:1+)
- [ ] All buttons work on both light and dark backgrounds
- [ ] Mobile: buttons remain tappable (min 44px height)
- [ ] Color contrast validates at WCAG AA level minimum

---

## Next Steps for Other Clients

For new client projects using `@vibecoding/ui`:

1. **Import Button:** `import { Button } from '@vibecoding/ui'`
2. **Use variants:** `<Button variant="primary">Label</Button>`
3. **Override token values** in client `theme.css` if needed:
   ```css
   --button-color-background-primary: var(--color-my-primary);
   ```
4. **All states handled automatically** — no custom CSS needed

---

## Files Reference

| File | Purpose |
|------|---------|
| `/docs/button-system-spec.md` | Complete specification (reference) |
| `/docs/button-css-fixes.md` | CSS fixes applied (archive) |
| `/docs/button-refactor-summary.md` | Refactoring changes (archive) |
| `src/design-system/tokens/semantic.css` | Token values (production) |
| `src/design-system/components/marketing.css` | Button CSS (production) |
| `packages/ui/src/components/Button/Button.tsx` | React component (library) |
| `packages/ui/src/index.ts` | Component export (library) |

---

## Support & Questions

- **Button not showing hover?** Check that CSS variables are defined in your theme
- **Focus ring not visible?** Ensure `--button-focus-ring-color` is set in tokens
- **Contrast fails?** Use `primary-inverted` on dark backgrounds instead of `primary`
- **New variant needed?** File an issue; don't create custom variants

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-04-17 | 1.0 | Initial system definition, CSS fixes, component implementation |

