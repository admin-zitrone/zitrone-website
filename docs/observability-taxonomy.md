# Zitrone Observability Taxonomy

> **Nota del 30-sep-2026: los eventos `billing_*` de abajo se retiraron con el formulario de facturación (commit `5b2bad4`).** La conversión de leads para GTM es `generate_lead` ([analytics-tracking.md](analytics-tracking.md)); los eventos `contact_*` son diagnóstico.

## Purpose

This document defines how Zitrone tracks product behavior, operational flow health, and application failures across the marketing site and billing workflow.

The goal is consistency:

- product analytics answer what users did
- Sentry answers what failed and where
- server-side workflow events answer what operational state a request reached

## Principles

- Use `snake_case` event names only.
- Treat event schemas as product contracts, not ad hoc debug notes.
- Never send personally identifiable tax data in analytics payloads.
- Keep client analytics lightweight and business-focused.
- Reserve Sentry for errors, request failures, and performance traces.
- Prefer stable identifiers such as `requestId`, `locale`, `path`, and `component`.

## Data Handling Rules

Never include these fields in analytics or Sentry extras unless explicitly approved through a security review:

- RFC
- legal name / razón social
- fiscal postal code
- billing email
- free-form notes
- uploaded document names or contents
- webhook secrets or auth headers

Allowed shared fields:

- `locale`
- `path`
- `component`
- `destination`
- `navigationType`
- `requestId`
- `serviceType`
- `status`
- `errorCount`
- `source`

## Current Event Inventory

### Shared client events

| Event | Purpose | Required fields |
| --- | --- | --- |
| `navigation_started` | App Router transition started | `url`, `navigationType` |
| `locale_switch_selected` | User selected a locale switch | `locale`, `destination` |
| `client_error` | Browser error reached global listener | `message`, `source` |
| `client_unhandled_rejection` | Unhandled promise rejection in browser | `reason` |

### Home and marketing events

| Event | Purpose | Required fields |
| --- | --- | --- |
| `home_cta_clicked` | Primary home CTA clicked | `locale`, `destination`, `component` |
| `home_client_story_viewed` | User changed client proof story/tab | `locale`, `component` |
| `footer_social_clicked` | Footer social destination clicked | `locale`, `destination` |

### Blog events

| Event | Purpose | Required fields |
| --- | --- | --- |
| `blog_list_viewed` | Blog index rendered and visible | `locale`, `path` |
| `blog_article_viewed` | Blog article detail viewed | `locale`, `path` |
| `blog_cta_clicked` | Blog CTA clicked | `locale`, `destination`, `component` |

### Billing workflow events

| Event | Purpose | Required fields |
| --- | --- | --- |
| `billing_form_viewed` | Billing form reached by user | `locale`, `path` |
| `billing_form_submit_attempt` | User attempted submission | `locale`, `serviceType` |
| `billing_request_validation_error` | Request rejected before workflow delivery | `locale`, `serviceType`, `errorCount` |
| `billing_request_fallback_required` | No workflow destination configured | `locale`, `serviceType`, `requestId` |
| `billing_request_delivery_error` | Webhook/network delivery failed | `locale`, `serviceType`, `requestId`, `status` |
| `billing_request_accepted` | Workflow accepted request | `locale`, `serviceType`, `requestId` |
| `billing_request_client_error` | UI-level submit failure surfaced to user | `locale`, `status` |

## Error Monitoring Responsibilities

### Vercel Analytics / custom tracking

Use for:

- page and flow usage
- CTA performance
- locale selection behavior
- billing funnel conversion

Do not use for:

- stack traces
- raw exceptions
- operational secrets

### Sentry

Use for:

- render errors
- unhandled rejections
- nested server component request errors
- billing workflow transport failures
- performance traces when sampling is enabled

Do not use for:

- recording business success events already covered by analytics
- storing fiscal identity data

## Naming and Payload Conventions

- Event names must describe the user or system action, not the UI label.
- Payload keys should be short, stable, and reusable across pages.
- `component` should identify the UI surface, such as `home_hero_cta` or `blog_subscribe_panel`.
- `destination` should be a normalized route or external domain, not display copy.
- `status` should be machine-readable such as `200`, `422`, `network-error`, or `fallback-required`.

## Rollout Priority

### Phase 1

- Keep `navigation_started`, client error events, and current billing workflow events healthy.
- Enable Sentry in preview/production with conservative trace sampling.

### Phase 2

- Instrument home CTA clicks, locale switch, footer social clicks.
- Instrument blog list and article views.

### Phase 3

- Add billing operational lifecycle events once persistence exists:
  - `billing_request_received`
  - `billing_request_needs_fix`
  - `billing_request_issued`
  - `billing_request_rejected`

## Review Checklist For New Events

Before adding any event:

1. Is the event name reusable and specific?
2. Does the payload avoid PII and fiscal data?
3. Can this event already be inferred from an existing one?
4. Does the event help a product, operations, or engineering decision?
5. Is the event documented here and added to the shared event registry?
