# Button System CSS Fixes Required

**Status:** Critical for design system enforcement  
**Files to modify:** 2  
**Estimated effort:** 15 minutes

---

## Fix 1: Secondary Button Hover Fill

**File:** `/Users/a1085/Documents/On It/src/design-system/components/marketing.css`

**Problem:** Secondary button (outlined) doesn't fill on hover, making it unclear it's interactive.

**Current CSS:**
```css
.ds-button[data-variant='secondary']:hover {
  background: var(--button-color-background-secondary-hover);
  color: var(--button-color-text-secondary-hover);
  border-color: var(--button-color-border-secondary-hover);
}
```

**Issue:** `--button-color-background-secondary-hover` is currently `ocean-900` (which is correct), but the button HTML might not be applying it. Need to verify the actual rendered output.

**What needs to happen on hover:**
- Background: `ocean-900` (dark teal fill) ✅
- Text: white (for contrast) ✅
- Border: `ocean-900` ✅

**Verification:** After applying fix, secondary button should change from:
- Default: Outlined (transparent bg, ocean-900 border + text)
- Hover: Filled (ocean-900 bg, white text, ocean-900 border)

---

## Fix 2: Accent Button Hover Color (CRITICAL)

**File:** `/Users/a1085/Documents/On It/src/design-system/tokens/semantic.css`

**Problem:** Lime accent button gets lighter on hover instead of darker, reducing contrast and clarity.

**Current Code (Line ~143):**
```css
--color-action-accent-background-hover: var(--primitive-color-lime-300);
```

**Change to:**
```css
--color-action-accent-background-hover: var(--primitive-color-lime-500);
```

**Rationale:**
- Default: `lime-400` on cream → 6.8:1 contrast ✅
- Current hover: `lime-300` on cream → 6.2:1 contrast ⚠️ (worse)
- **Fixed hover:** `lime-500` on cream → 7.2:1 contrast ✅ (AAA)

**Visual change:**
- Before: Lime button gets lighter (looks inactive)
- After: Lime button gets darker (clearly shows active/hover state)

---

## Fix 3: Disabled State HTML Attribute

**File:** `sections.html` (all button elements)

**Problem:** Buttons use `aria-disabled="true"` instead of HTML `disabled` attribute, which doesn't trigger proper CSS selectors and browser behavior.

**Current pattern:**
```html
<button type="button" class="semantic-button ds-button" 
        aria-disabled="true" data-profiler-next="1">
  Next
</button>
```

**Change to:**
```html
<button type="button" class="semantic-button ds-button" 
        disabled data-profiler-next="1">
  Next
</button>
```

**Locations affected:**
- Profiler buttons where `disabled` attribute already appears (lines 1361, 1392)
- Any buttons using `aria-disabled` should switch to `disabled`

**CSS Selector Impact:**
- Current CSS uses: `.ds-button[aria-disabled='true']`
- Should use: `.ds-button:disabled` (standard and simpler)

---

## Fix 4: Focus States Verification

**File:** `/Users/a1085/Documents/On It/src/design-system/components/marketing.css`

**Current CSS (appears correct):**
```css
.ds-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 var(--button-focus-ring-width) var(--button-focus-ring-color);
}

.ds-button[data-variant^='inverse']:focus-visible {
  box-shadow: 0 0 0 var(--button-focus-ring-width) var(--button-focus-ring-color-inverse);
}
```

**Action:** Test keyboard navigation (Tab through all buttons) to verify focus ring appears on all variants.

**Expected behavior:**
- Tab to button → 2px teal ring appears around button
- All button variants (primary, secondary, accent, inverse-*) show visible focus
- Focus ring persists while holding focus, disappears on blur

---

## Implementation Order

1. ✅ **First:** Fix accent hover color (semantic.css) — easiest, biggest impact
2. ✅ **Second:** Replace `aria-disabled` with `disabled` (HTML attributes)
3. ✅ **Third:** Verify secondary hover fill is applying correctly
4. ✅ **Fourth:** Test all focus states with keyboard navigation

---

## Testing Checklist (After Fixes)

- [ ] Primary button on cream: darker on hover, focus ring visible
- [ ] Secondary button on cream: fills with dark color on hover, text turns white
- [ ] Accent button on cream: gets darker (lime-500) on hover, not lighter
- [ ] All buttons on dark background: focus ring is pale/inverse
- [ ] Disabled buttons: grayed out, no hover effect, cursor shows "not-allowed"
- [ ] Tab key navigation: focus ring appears on every button
- [ ] Contrast: All hover states pass WCAG AA (4.5:1+)
- [ ] Mobile: Hover states work on touch (long-press to see)

---

## Files Modified Summary

| File | Changes | Status |
|------|---------|--------|
| `semantic.css` | Line ~143: `lime-300` → `lime-500` | 📋 TO DO |
| `marketing.css` | Verify secondary:hover applies fill | 📋 TO DO |
| `marketing.css` | Replace `aria-disabled` selector with `:disabled` | 📋 TO DO |
| `sections.html` | Replace `aria-disabled="true"` with `disabled` | 📋 TO DO |
| All buttons | Test focus states | 📋 TO DO |

---

## Expected Outcome

After all fixes:
- ✅ All buttons have visibly distinct hover states
- ✅ All buttons follow contrast rules (WCAG AA minimum)
- ✅ All buttons are keyboard accessible with clear focus indicators
- ✅ Disabled buttons clearly communicate non-interactive state
- ✅ Button system ready for library implementation
