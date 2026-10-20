# Accessibility

Target: **WCAG 2.2 Level AA**, both locales.

Before August 2026 this area was hand-built and had never been checked with a
tool. The first automated run found 6 distinct root causes across every page
template. This document is the process that keeps them from coming back.

## The gate

```bash
npm run test:a11y      # the accessibility suite alone
npm run test:e2e       # the full end-to-end suite, which includes it
```

`tests/e2e/accessibility.spec.ts` runs [axe-core](https://github.com/dequelabs/axe-core)
against one page per template in both locales, plus behavioural checks that axe
cannot make. It builds and serves the production bundle first, so it tests what
ships rather than what the dev server renders.

**Axe verifies roughly a third of the WCAG success criteria.** A green run is a
floor, not a certificate. The rest is the manual pass below.

### Contact-form development checks

`npm run test:contact` runs an isolated Chromium suite against `npm run dev`
on port 3102. Every inquiry POST is intercepted: it does not verify persistence
or send real emails. Coverage includes ES mobile (390px) and EN desktop error
states, axe scans scoped to service/site/final-error form states,
step/error/success focus, all service choices in the short inquiry, optional
dining-related questions, failed submission recovery, and duplicate in-flight guards.
These tests also run with the general E2E suite. They supplement, not replace,
the full accessibility gate and manual assistive-technology review.

The same gate includes `inquiry-location.spec.ts`: home/contact, ES/EN,
dependent region/municipality choices, reset on parent change, back-navigation
retention, native keyboard type-ahead and scoped axe checks. To attach to an
already-running local preview without restarting it:

```bash
PLAYWRIGHT_CONTACT_BASE_URL=http://127.0.0.1:3000 npm run test:contact
```

Only explicit loopback URLs are accepted. The suite also
checks shared home/contact meal steppers, multi-service submission briefs,
positive selected-meal quantities and narrow-contact-card overflow. Dining
questions now appear automatically when comedor is selected (Sep 10–11 user
revision); the previous optional dining-details switch has been removed.

### What the suite covers

| Check | Criterion |
|---|---|
| axe scan, 8 routes, both locales | 2.2 A + AA, mechanically testable subset |
| axe scan at 320px | 1.4.10 Reflow |
| axe scan with the mobile menu open | states axe never sees on a static load |
| One `<main>` and one `<h1>` per page | 1.3.1, 2.4.6 |
| `<html lang>` per locale | 3.1.1 |
| Skip link is the first tab stop and moves focus | 2.4.1 |
| Dropdown opens, closes on Escape, returns focus | 2.1.1, 2.1.2, 2.4.3 |
| Every keyboard-reachable control has a focus ring | 2.4.7 |
| Contact form errors: `aria-invalid`, `aria-describedby`, focus-to-error (in `contact.spec.ts`; the billing form was removed 2026-09-29) | 3.3.1, 3.3.3, 4.1.3 |
| Nothing animates under `prefers-reduced-motion` | 2.3.3 |

### Two things the suite does deliberately

**It seeds the consent cookie instead of clicking the banner.** The banner is a
focus-trapping modal; while it is up it is correctly the only reachable thing,
which would mask every issue behind it. Clicking it is also a race — it mounts
on the client, so a check that runs first sees nothing and the banner appears
mid-test. The banner's own behaviour is covered in `consent.spec.ts`.

**It scans with reduced motion emulated.** Scroll reveals fade content in from
`opacity: 0`, and axe samples whatever the compositor shows at that instant, so
scanning mid-reveal reports things like "1.03:1" for text that simply has not
finished appearing. Reduced motion collapses reveals to their end state, which
makes the scan deterministic and audits the colours a settled page shows.

## Rules that keep the site conformant

### Never fade text toward transparent

`color-mix(in srgb, <token> N%, transparent)` was the single largest source of
contrast debt: it was used throughout to make text "quieter", and on a light
surface it does that by destroying contrast. The blog card meta line was at
**2.35:1** on 10px type.

If text should be quieter, step down the ramp — `--color-text-secondary` — do
not dilute it. The same applies to `opacity` on a container that holds text:
the inactive service-spotlight cards were dimmed to 40%, which put their copy
at 3.0:1 while they remained visible and clickable.

### Accents resolve by surface, not by brand preference

The lime ramp is documented in `primitives.css` as unusable for text on
natural/warm surfaces, and components were using it there anyway (2.1:1).

- `--color-text-accent` — body-size accent text. It resolves to the
  light-surface accent (`ocean-500`) and is swapped to `ocean-300` on
  `[data-tone="brand"]` and `[data-tone="inverse"]` sections.
- `--color-text-accent-display` — the serif-italic accent word inside
  headings only. One brand green everywhere, the vivid `lime-500` (brand
  decision, 2026-09-23). **Known contrast exception:** 2.25:1 on white and
  2.1:1 on `natural-50`, below the 3:1 large-text minimum; 6.9:1 on
  `ocean-950`. Never use it below 24px.
  **Darker greens rejected (user, 2026-10-11):** `lime-600`/`lime-700` are
  not brand colours and must not be used for this accent. They were applied
  on 2026-10-08 (`480de85`) and reverted. The accent stays `lime-500`; the
  site is **not** fully WCAG 2.2 AA conformant on light surfaces and the
  exception (`ACCENT_CONTRAST_EXCEPTION`, tests/e2e/accessibility.spec.ts)
  must be accepted in writing at handoff. Any other fix (e.g. a different
  in-brand colour or ground) needs a new brand decision.
- `--color-text-accent-brand` — the vivid `lime-500`. Only on dark surfaces:
  dark sections, photography, dark bento blocks.

A dark block that is **not** a `[data-tone]` section does not inherit the swap
and must declare `--color-text-accent: var(--color-text-accent-brand)` itself.
`.ds-service-operations-bento` is the worked example.

Never reach for `--primitive-color-lime-*` from a component file.

### Closed panels get `inert`, not just `aria-hidden`

`aria-hidden` hides a panel from screen readers but leaves its links focusable,
so keyboard users tab into an invisible menu — this was live on every page.
Closed panels carry **both** `inert` (removes them from the tab order) and
`aria-hidden`. When a panel closes while focus is inside it, focus must be
returned to the control that opened it, or it falls to `<body>`.

### Interactive targets are at least 24×24px

WCAG 2.5.8. For a small visual like a carousel dot, keep the ink small and grow
the *control*: `box-sizing: content-box` with padding, and `background-clip:
content-box` so the dot still looks 8px.

### Reduced motion is global

`globals.css` collapses all animation and transition durations to ~0 under
`prefers-reduced-motion`. Durations collapse rather than `animation: none`
because several components advance state on `animationend` — removing the
animation would delete the event and stall them mid-reveal.

### `globals.css` is the stylesheet that ships

`src/design-system/styles/base.css` contains a near-identical set of base rules
and **is imported by nothing**. Anything that has to reach the site goes in
`src/app/globals.css`. (Consolidating the two is open work; see below.)

## Manual pass

Run before any release that changes layout, navigation, or forms. Automation
cannot judge any of this.

- [ ] **Keyboard only, no mouse.** Every page: reach every control, operate
      every menu, submit the contact form and the home profiler. Focus must always be visible and
      must never enter a closed panel or get stuck.
- [ ] **Screen reader.** VoiceOver (Safari) on the home, a service page and
      contact. Headings must outline the page sensibly; images must say
      something useful or nothing at all; form errors must be announced.
- [ ] **200% zoom and 320px width.** No horizontal scrolling, no clipped or
      overlapping text.
- [ ] **Reduced motion on** (System Settings → Accessibility → Display). Nothing
      moves; nothing is stuck invisible because a reveal never completed.
- [ ] **Alt text review.** Automation confirms the attribute exists, never that
      it is meaningful. Decorative images take `alt=""`.
- [ ] **Copy in both locales.** Link text should make sense out of context —
      no bare "read more"; buttons should say what they do.

## Known gaps

Recorded honestly rather than quietly passed.

- **CI exists but deploys do not depend on it.** `.github/workflows/ci.yml`
  runs `test:e2e`, which includes this suite, on pull requests and pushes to
  main. Production is deployed manually with `vercel --prod`, so a red run
  only blocks a release if the person releasing checks it.
- **Manual pass status (2026-09-30):** an automated keyboard check confirmed a
  visible focus indicator on the first eight tab stops of `/es` and `/en`,
  and screenshots at 320/390/768/1440px showed no horizontal overflow
  (`docs/evidence/remediation-2026-09-30/`). VoiceOver, 200% zoom and a full
  keyboard-only pass were **not** done and remain open.
- **The logo marquee auto-scrolls indefinitely.** Reduced motion stops it, but
  WCAG 2.2.2 wants a pause control for any motion over 5s regardless of the
  preference. It is decorative, so this is low severity, but it is not
  conformant.
- **Axe covers one page per template.** A bespoke section on an unscanned route
  can still regress. Add the route to `ROUTES` when a template gains one.
- **No real assistive-technology testing has been done** — only the manual
  checklist above, which has not yet been run end-to-end by a screen-reader
  user.
- **`base.css` / `globals.css` duplication** is unresolved and is a live trap:
  edits to the dead file silently do nothing.
