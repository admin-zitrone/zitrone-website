# Emails

Transactional email for Zitrone. Templates live in `src/emails/` and are part
of this repo on purpose: they consume the design tokens in
`src/design-system/tokens/`, the images in `public/img/`, and they are sent by
routes in `src/app/api/`. Splitting them out would buy the same
asset-contract sync problem the deck system has, with none of its benefit.

## Commands

| Command | What it does |
|---|---|
| `npm run email:preview` | Renders every template with its sample payload into `.email-previews/` (gitignored). Open `index.html`. |
| `npm run email:check` | Fails if the email palette has drifted from the design system. |

## Files

| File | Role |
|---|---|
| `tokens.ts` | The palette, resolved to hex literals, plus the design-system variable each one came from. |
| `layout.ts` | The master document and the content blocks every email composes from. |
| `samples.ts` | Realistic payloads that drive the previews. |
| `profiler-brief-email.ts` | One template: the confirmation for the home profiler. |

A new email is a new file next to `profiler-brief-email.ts` that composes
blocks and calls `renderEmailDocument`. It should not introduce markup or
colours of its own.

## Why email is not the website

Email clients are roughly a 2005 browser with the CSS support removed. The
constraints below are not preferences; each one is a client that breaks.

**No custom properties.** Every governed value is a hex literal in
`tokens.ts`. That copy is the risk, so `EMAIL_TOKEN_SOURCE` records where each
literal came from and `npm run email:check` resolves those variables and fails
loudly on drift. To change a colour: change the token first, run the check,
update the literal it names.

**No webfonts.** Outlook drops `@font-face` and Gmail strips it, so Manrope is
unavailable. The stack falls back to the host's UI sans. This is the single
deliberate divergence from the site and has no fix worth its cost.

**No SVG.** Gmail and Outlook do not render it. The wordmark and the social
icons ship as white PNGs, registered in `assets.manifest.json` like every
other asset.

**No flexbox or grid.** Layout is 600px tables with inline styles, because
Outlook renders through the Word engine. Mobile behaviour comes from an
embedded media query; clients that strip the `<style>` block still get a
readable single column.

**No negative margins.** The card that overlaps the hero photograph is built
the only way that survives: the photo is a cell background and the white
rounded block sits inside it, with VML repeating the image for Outlook.

**`border-radius` is ignored by Outlook desktop.** Rounded corners degrade to
square. Acceptable; forcing them needs VML per corner.

## Rules for composing

**`emailList` vs `emailRows`.** Services, plans and options are parallel
objects the reader chooses between: `emailList`, with a lime rule on the one
we lead with and turquoise on the rest. Facts with a label are not objects:
`emailRows`, typographic, hairline separated. A stack of filled cards inside
a card reads as decoration.

**One accent per message.** Lime marks the primary thing. If everything is
accented, nothing is.

**Buttons are optional.** A confirmation of something the reader already did
does not need a CTA; pushing one is noise. `emailButton` exists, centred, for
messages that genuinely ask for an action.

## Sending

**`reply_to` is mandatory.** Templates tell the reader to reply. The sender
address lives on the verified Resend domain, which nobody reads, so whatever
sends an email must set:

```
from:     Zitrone <hola@send.zitrone.mx>   (verified sending domain)
reply_to: opina@zitrone.com.mx             (the mailbox people read)
```

Resend accepts any address as `reply_to`, verified or not. Without it the
instruction in the footer is a lie.

**Verify a subdomain, not the apex.** Zitrone's mail runs on Google
Workspace. Verifying `send.zitrone.mx` adds DKIM and SPF records for that
subdomain only and leaves the Workspace MX and SPF untouched.

**Unsubscribe and preferences are off until they work.** `EmailFooter` takes
both as optional URLs and omits the links when absent. A dead unsubscribe
costs more in deliverability and trust than a missing one. They become
required the moment this layout is used for anything that is not
transactional.

## Before shipping a template

A browser is the most forgiving renderer there is. Send the preview to a real
Gmail, Outlook and Apple Mail account and read it on a phone before calling
it done.

## Active inquiry integration

Home and Contact now share `contact-request-email.ts` (sales notification and
visitor confirmation), sent by `/api/contact-request` after durable persistence.
The existing profiler-only templates remain available as previews. See
[the activation and recovery runbook](docs/contact-email-delivery.md) for the
pending database migration, real-mail acceptance test and recovery commands.
For internal sales notifications, Reply-To is the visitor's address; for visitor
confirmations, Reply-To is `opina@zitrone.com.mx`.
