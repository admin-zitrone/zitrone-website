# Decision: Root Workspace Scaffold

**Date:** 2026-04-13  
**Status:** Accepted

## Context
We need a clean application shell inside the `On It` workspace so the Maven design-system work can eventually turn into a real website implementation without dragging along unrelated experiments or outside repo structure.

## Decision
We have scaffolded an isolated Next.js application directly at the root of `On It` with the following parameters:
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (native CSS variable approach instead of Tailwind configure objects)
- **Formatting:** Prettier and ESLint (strict configurations)

## Consequences
- The design-system theory created in `docs/` remains the source of truth.
- The app shell can stay minimal until the Maven system is stable enough to start real website implementation.
- Future website work can happen in this workspace without reintroducing a second competing design language.
