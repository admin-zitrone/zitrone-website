# Enforcement Audit

This project now has a lightweight enforcement layer for point 1: protecting the design-system contract so components do not quietly drift back toward one-off values.

## Command

Run the audit from the repo root:

```sh
zsh scripts/design-system-audit.sh
```

## What It Guards Today

1. No primitive token leaks inside reusable component and layout CSS.
2. No stale banned token aliases after promotion work.
3. No raw governed measure values for hero widths, hero copy measure, panel heights, carousel progress widths, and responsive service-card heights inside component/layout CSS.
4. No generic focus-ring bypass inside the governed marketing component grammar.
5. No generic label/body/nav typography wiring inside `marketing.css` where component tokens should own the contract.
6. No direct stat-number typography wiring inside `marketing.css` where the stat-card token family should own the contract.
7. No proof/footer column templates inside `marketing.css`; shared layout primitives own those column counts now.

## Why This Exists

The system is now strong enough that the main risk is drift, not absence. This audit makes a few high-value rules executable so we do not have to rely only on memory or manual reviews.

## Current Scope

This is intentionally small and explicit.

- It protects the current CSS design-system layers.
- It does not try to be a universal linter.
- It focuses on the token-promotion work we have already done.

## What Comes Next

As more families mature, this audit should expand to cover:

- promotion gates for `Stable` token families
- broader banned-value checks for component/layout CSS
- documentation completeness checks for governed families
- optional preview/specimen checks when we want stronger visual verification
