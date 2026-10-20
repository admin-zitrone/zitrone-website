# Decision 0001: Project Organization

## Status

Accepted.

## Decision

Keep local reference captures in `References/`.

Keep project documentation under `docs/`.

Keep future original implementation under `src/`.

Keep design-system source under `src/design-system/`.

Keep design-system documentation under `docs/design-system/`.

## Reasoning

The reference is generated/minified and full of third-party marketing code. Separating reference evidence, documentation, and source implementation makes the project easier to learn from and harder to accidentally pollute with copied/generated code.
