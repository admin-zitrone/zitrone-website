# Documentation And Governance

Status: in progress.

This file defines how we document and govern the design system so it can scale without turning vague or contradictory.

## Why This Layer Exists

A design system is only scalable if people can answer the same questions every time:

- What is this token or component for?
- Where is it allowed?
- What should never use it?
- What accessibility constraints apply?
- What evidence from Maven supports it?
- Where is it implemented?
- Is it still experimental, or can other layers depend on it?

Without that structure, the system becomes a pile of nice-looking files instead of a reliable product tool.

## Required Entry Contract

Every governed token family and every governed component family must include:

1. Purpose
2. Usage rules
3. Do guidance
4. Don't guidance
5. Accessibility constraints
6. Source evidence from Maven
7. Implementation file or files
8. Promotion status

If one of these fields is missing, the entry is incomplete.

## Promotion Status Model

Use only these statuses:

### Candidate

Use when the role is observed or proposed, but not yet proven enough for broad dependency.

Typical signs:

- The role exists in research or one specimen
- The role still needs more responsive, interaction, or accessibility proof
- The role may change shape or naming

### Needs Test

Use when the role is implemented and promising, but still blocked on explicit validation.

Typical signs:

- The role exists in the live specimen
- The role is already consumed by real system files
- We still need broader cross-section testing, browser verification, accessibility checks, or more Maven fidelity proof

### Stable

Use when the role is safe for broad reuse.

Typical signs:

- The role is implemented and documented
- The role passed accessibility and responsive checks for its purpose
- The role is used in more than one section or is a foundational contract other layers now depend on
- We do not expect naming or behavior changes without a deliberate migration

## Evidence Rule

Do not promote from taste alone.

Source evidence should come from one or more of:

- `docs/research/maven-clinic/design-system-audit.md`
- `docs/research/maven-clinic/layer-1-token-inventory.md`
- `docs/research/maven-clinic/page-anatomy.md`
- verified local reference assets or saved HTML/CSS behavior

If evidence is inferred rather than directly observed, say so.

## Accessibility Rule

Accessibility notes should describe the real constraint, not generic filler.

Good examples:

- Requires inverse focus ring on dark sections
- Must preserve readable alt text because the image carries meaning
- Do not use for normal-size white text because contrast is too weak
- Reduced motion must resolve to a complete static state

Bad examples:

- Be accessible
- Follow WCAG

## File Ownership Rule

Each entry must point to the implementation files that currently own it.

Use the smallest truthful ownership set:

- token file
- component file
- motion file
- preview specimen

This makes it easy to trace whether the documentation still matches reality.

## Governance Workflow

1. Observe a repeated behavior or decision in Maven.
2. Record it in research or foundation docs.
3. Create or update a governed token/component entry.
4. Mark it `Candidate` or `Needs Test`.
5. Implement it in the live system.
6. Run accessibility and specimen checks.
7. Promote to `Stable` only when the evidence and implementation both hold.

## Current Registers

- Token register: `docs/design-system/token-governance-register.md`
- Component register: `docs/design-system/component-governance-register.md`

## What Comes Next

- Add review dates and owner notes once the system has more than one maintainer
- Add deprecation guidance when we start replacing earlier candidate roles
