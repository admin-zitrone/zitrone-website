import { EMAIL_COLOR, EMAIL_FONT_STACK } from './tokens'

/**
 * Master email layout for every Zitrone transactional email.
 *
 * Anatomy, top to bottom:
 *   1. Ink header bar with the wordmark
 *   2. Full-bleed hero photograph
 *   3. White content card, rounded into the photo above it
 *   4. Ink footer: wordmark, socials, address, preference links
 *
 * Every governed value is resolved to a literal in `tokens.ts`, which also
 * records where each one came from; `npm run email:check` guards the copy.
 *
 * Both wordmarks are referenced as PNG: Gmail and Outlook do not render SVG.
 */

export { EMAIL_COLOR, EMAIL_FONT_STACK } from './tokens'

const CONTENT_WIDTH = 600
const CARD_PADDING = 40
/* Tall enough that the card can sit on it without hiding the subject. */
const HERO_HEIGHT = 300
const HERO_OVERLAP = 32
/* The whole message reads as one card on the page background. */
const SHELL_RADIUS = 24

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/* ── Content blocks ────────────────────────────────────────────
   Each returns a full-width table row inside the white card. */

export function emailKicker(text: string) {
  return `
              <tr>
                <td style="padding-bottom:14px;">
                  <p style="margin:0;font-size:12px;line-height:16px;letter-spacing:0.1em;text-transform:uppercase;color:${EMAIL_COLOR.action};font-weight:600;">${escapeHtml(text)}</p>
                </td>
              </tr>`
}

export function emailHeading(text: string) {
  return `
              <tr>
                <td style="padding-bottom:12px;">
                  <h1 class="zt-h1" style="margin:0;font-size:32px;line-height:40px;font-weight:500;letter-spacing:-0.5px;color:${EMAIL_COLOR.heading};">${escapeHtml(text)}</h1>
                </td>
              </tr>`
}

/** The intro. Two lines is the target; the card carries the rest. */
export function emailLede(text: string) {
  return `
              <tr>
                <td style="padding-bottom:32px;">
                  <p style="margin:0;font-size:16px;line-height:26px;color:${EMAIL_COLOR.body};">${escapeHtml(text)}</p>
                </td>
              </tr>`
}

export function emailSectionLabel(text: string) {
  return `
              <tr>
                <td style="padding-bottom:12px;">
                  <p style="margin:0;font-size:12px;line-height:16px;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL_COLOR.secondary};">${escapeHtml(text)}</p>
                </td>
              </tr>`
}

export type EmailListItem = {
  title: string
  body: string
  /** The first item is where we would start; it gets a lime rule. */
  lead?: boolean
}

/**
 * An ordered list of named things — services, steps, options. Kept
 * typographic: a stack of filled cards inside a card reads as decoration,
 * and the reader is comparing names, not scanning tiles.
 */
export function emailList(items: EmailListItem[]) {
  const rows = items
    .map((item) => {
      const rule = item.lead ? EMAIL_COLOR.accent : EMAIL_COLOR.turquoise
      return `<tr>
                      <td style="padding:0 0 4px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td width="3" style="width:3px;background:${rule};border-radius:2px;font-size:0;line-height:0;">&nbsp;</td>
                            <td style="padding:2px 0 14px 16px;">
                              <p style="margin:0 0 3px;font-size:17px;line-height:24px;font-weight:600;color:${EMAIL_COLOR.heading};">${escapeHtml(item.title)}</p>
                              <p style="margin:0;font-size:15px;line-height:23px;color:${EMAIL_COLOR.secondary};">${escapeHtml(item.body)}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>`
    })
    .join('\n                    ')

  return `
              <tr>
                <td style="padding-bottom:26px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    ${rows}
                  </table>
                </td>
              </tr>`
}

/**
 * Label/value rows where the value is actionable — an address to write to,
 * a number to call. Sales should never have to retype these.
 */
export function emailLinkRows(
  rows: Array<{ label: string; value: string; href?: string }>,
) {
  const body = rows
    .map((row, index) => {
      const border =
        index === rows.length - 1 ? 'none' : `1px solid ${EMAIL_COLOR.hairline}`
      const value = row.href
        ? `<a href="${escapeHtml(row.href)}" style="color:${EMAIL_COLOR.turquoise};text-decoration:none;">${escapeHtml(row.value)}</a>`
        : escapeHtml(row.value)

      return `<tr>
                      <td class="zt-row-label" style="padding:11px 0;border-bottom:${border};font-size:12px;line-height:16px;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL_COLOR.secondary};vertical-align:top;width:150px;">${escapeHtml(row.label)}</td>
                      <td class="zt-row-value" style="padding:11px 0;border-bottom:${border};font-size:15px;line-height:22px;color:${EMAIL_COLOR.heading};vertical-align:top;">${value}</td>
                    </tr>`
    })
    .join('\n                    ')

  return `
              <tr>
                <td style="padding-bottom:32px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    ${body}
                  </table>
                </td>
              </tr>`
}

/** Label/value facts. Typographic rows, never cards. */
export function emailRows(rows: Array<{ label: string; value: string }>) {
  const body = rows
    .map((row, index) => {
      const border =
        index === rows.length - 1 ? 'none' : `1px solid ${EMAIL_COLOR.hairline}`
      return `<tr>
                      <td class="zt-row-label" style="padding:11px 0;border-bottom:${border};font-size:12px;line-height:16px;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL_COLOR.secondary};vertical-align:top;width:150px;">${escapeHtml(row.label)}</td>
                      <td class="zt-row-value" style="padding:11px 0;border-bottom:${border};font-size:15px;line-height:22px;color:${EMAIL_COLOR.heading};vertical-align:top;">${escapeHtml(row.value)}</td>
                    </tr>`
    })
    .join('\n                    ')

  return `
              <tr>
                <td style="padding-bottom:32px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    ${body}
                  </table>
                </td>
              </tr>`
}

/** Free text the person wrote, set as body copy rather than a panel. */
export function emailQuote(text: string) {
  return `
              <tr>
                <td style="padding-bottom:32px;">
                  <p style="margin:0;font-size:15px;line-height:25px;color:${EMAIL_COLOR.heading};">${escapeHtml(text)}</p>
                </td>
              </tr>`
}

export function emailNote(text: string) {
  return `
              <tr>
                <td style="padding-bottom:32px;">
                  <p style="margin:0;font-size:14px;line-height:21px;color:${EMAIL_COLOR.secondary};">${escapeHtml(text)}</p>
                </td>
              </tr>`
}

/** Ink pill, the transactional twin of the site's primary CTA. */
export function emailButton(label: string, href: string) {
  return `
              <tr>
                <td align="center" style="padding:16px 0 28px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                    <tr>
                      <td style="background:${EMAIL_COLOR.accent};border-radius:999px;">
                        <a href="${escapeHtml(href)}" style="display:inline-block;padding:15px 30px;font-size:15px;line-height:20px;font-weight:600;color:${EMAIL_COLOR.ink};text-decoration:none;">${escapeHtml(label)}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>`
}

/* ── Footer ────────────────────────────────────────────────────── */

export type EmailFooter = {
  /** Shown above the address so the sender is identifiable at a glance. */
  companyName?: string
  websiteHref?: string
  /** One sentence on why the recipient got this email (transactional best practice). */
  reason?: string
  address: string[]
  contactEmail: string
  phone?: string
  legal: string
  /** `icon` names a PNG in /img/shared/email/social-<icon>-white.png. */
  socials: Array<{ icon: string; label: string; href: string }>
  /**
   * Preference links. `unsubscribe` and `preferences` must point at pages
   * that actually work before this ships — a dead unsubscribe is worse for
   * deliverability and for trust than no link at all.
   */
  privacyHref: string
  unsubscribeHref?: string
  preferencesHref?: string
  privacyLabel: string
  unsubscribeLabel: string
  preferencesLabel: string
}

function footerBlock(footer: EmailFooter, baseUrl: string, logoAlt: string) {
  const linkStyle = `color:${EMAIL_COLOR.inkText};text-decoration:none;font-size:12px;line-height:18px;letter-spacing:0.06em;text-transform:uppercase;font-weight:500;`

  /* Icons ship as white PNGs: SVG does not render in Gmail or Outlook, and
     an icon font is worse. Each keeps its label as alt text. */
  const socials = footer.socials
    .map(
      (social) =>
        `<td style="padding:0 9px;">
                    <a href="${escapeHtml(social.href)}" style="text-decoration:none;">
                      <img src="${escapeHtml(baseUrl)}/img/shared/email/social-${escapeHtml(social.icon)}-white.png" width="22" height="22" alt="${escapeHtml(social.label)}" style="display:block;border:0;outline:none;width:22px;height:22px;">
                    </a>
                  </td>`,
    )
    .join('\n                  ')

  const preferences = [
    footer.unsubscribeHref
      ? `<a href="${escapeHtml(footer.unsubscribeHref)}" style="${linkStyle}">${escapeHtml(footer.unsubscribeLabel)}</a>`
      : '',
    footer.preferencesHref
      ? `<a href="${escapeHtml(footer.preferencesHref)}" style="${linkStyle}">${escapeHtml(footer.preferencesLabel)}</a>`
      : '',
    `<a href="${escapeHtml(footer.privacyHref)}" style="${linkStyle}">${escapeHtml(footer.privacyLabel)}</a>`,
    footer.websiteHref ? `<a href="${escapeHtml(footer.websiteHref)}" style="${linkStyle}">zitrone.mx</a>` : '',
  ]
    .filter(Boolean)
    .join('<span style="color:#3B5A5B;"> &nbsp;·&nbsp; </span>')

  return `
        <tr>
          <td bgcolor="${EMAIL_COLOR.ink}" style="background-color:${EMAIL_COLOR.ink};padding:40px ${CARD_PADDING}px;border-radius:0 0 ${SHELL_RADIUS}px ${SHELL_RADIUS}px;" align="center">

            <a href="${escapeHtml(baseUrl)}" style="text-decoration:none;">
              <img src="${escapeHtml(baseUrl)}/img/shared/brand/zitrone-logo-white.png" width="118" height="25" alt="${escapeHtml(logoAlt)}" style="display:block;margin:0 auto;border:0;outline:none;width:118px;height:auto;">
            </a>

            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:26px auto 0;">
              <tr>
                  ${socials}
              </tr>
            </table>

            <p style="margin:26px 0 0;font-size:13px;line-height:21px;color:#9DB3B4;text-align:center;">
              ${footer.companyName ? `<strong style="color:${EMAIL_COLOR.inkText};font-weight:600;">${escapeHtml(footer.companyName)}</strong><br>` : ''}${footer.address.map((line) => escapeHtml(line)).join('<br>')}<br>
              <a href="mailto:${escapeHtml(footer.contactEmail)}" style="color:#9DB3B4;text-decoration:none;">${escapeHtml(footer.contactEmail)}</a>${footer.phone ? ` &nbsp;·&nbsp; <a href="tel:${escapeHtml(footer.phone.replace(/[^\d+]/g, ''))}" style="color:#9DB3B4;text-decoration:none;">${escapeHtml(footer.phone)}</a>` : ''}
            </p>

            ${footer.reason ? `<p style="margin:22px 0 0;font-size:12px;line-height:18px;color:#6C8586;text-align:center;">${escapeHtml(footer.reason)}</p>` : ''}

            <p style="margin:24px 0 0;text-align:center;">${preferences}</p>

            <p style="margin:18px 0 0;font-size:12px;line-height:18px;color:#6C8586;text-align:center;">${escapeHtml(footer.legal)}</p>

          </td>
        </tr>`
}

function heroBlock(hero: { src: string; alt: string }) {
  return `            <!-- 2 · Hero, with the card riding over its bottom edge.
                 Negative margins are dropped by most clients, so the
                 overlap is built the only way that survives: the photo is
                 a cell background and the white rounded block sits inside
                 it. VML repeats it for Outlook, which ignores CSS
                 backgrounds entirely. -->
            <tr>
              <td
                background="${escapeHtml(hero.src)}"
                bgcolor="${EMAIL_COLOR.ink}"
                valign="bottom"
                height="${HERO_HEIGHT}"
                style="background-color:${EMAIL_COLOR.ink};background-image:url('${escapeHtml(hero.src)}');background-size:cover;background-position:center;background-repeat:no-repeat;height:${HERO_HEIGHT}px;font-size:0;line-height:0;"
              >
                <!--[if gte mso 9]>
                <v:image xmlns:v="urn:schemas-microsoft-com:vml" src="${escapeHtml(hero.src)}" style="width:${CONTENT_WIDTH}px;height:${HERO_HEIGHT}px;" />
                <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="false" stroke="false" style="position:absolute;width:${CONTENT_WIDTH}px;height:${HERO_HEIGHT}px;">
                <v:textbox inset="0,0,0,0"><![endif]-->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td height="${HERO_OVERLAP}" style="height:${HERO_OVERLAP}px;font-size:0;line-height:0;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td bgcolor="${EMAIL_COLOR.surface}" style="background-color:${EMAIL_COLOR.surface};border-radius:${HERO_OVERLAP}px ${HERO_OVERLAP}px 0 0;height:${HERO_OVERLAP}px;font-size:0;line-height:0;">&nbsp;</td>
                  </tr>
                </table>
                <!--[if gte mso 9]></v:textbox></v:rect><![endif]-->
              </td>
            </tr>`
}

/* ── Document ──────────────────────────────────────────────────── */

export type EmailDocument = {
  locale: 'es' | 'en'
  title: string
  /** The line clients preview in the inbox, before the body. */
  preheader: string
  /** Rendered blocks, in order, placed inside the white card. */
  body: string
  /**
   * Full-bleed photograph under the header bar. Omitted by internal
   * messages, which are read for their data, not their mood.
   */
  hero?: { src: string; alt: string }
  footer: EmailFooter
  /** Absolute origin for images and relative links. */
  baseUrl: string
  logoAlt: string
}

export function renderEmailDocument(doc: EmailDocument) {
  return `<!doctype html>
<html lang="${doc.locale}" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${escapeHtml(doc.title)}</title>
    <!--[if mso]>
    <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
    <![endif]-->
    <style>
      /* Clients that keep the style block get real mobile behaviour; the
         rest fall back to the 600px column, which stays readable. */
      @media only screen and (max-width: 620px) {
        .zt-shell { width: 100% !important; }
        .zt-outer-pad { padding: 12px 10px 20px !important; }
        .zt-card-pad { padding-left: 24px !important; padding-right: 24px !important; }
        .zt-h1 { font-size: 26px !important; line-height: 33px !important; }
        .zt-bento-cell { width: 100% !important; max-width: 100% !important; }
        .zt-row-label { display: block !important; width: 100% !important; padding-bottom: 2px !important; border-bottom: none !important; }
        .zt-row-value { display: block !important; width: 100% !important; padding-top: 0 !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:${EMAIL_COLOR.page};font-family:${EMAIL_FONT_STACK};-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(doc.preheader)}</div>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${EMAIL_COLOR.page};">
      <tr>
        <td align="center" class="zt-outer-pad" style="padding:24px 20px 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="zt-shell" width="${CONTENT_WIDTH}" style="width:${CONTENT_WIDTH}px;max-width:100%;">

            <!-- 1 · Header bar -->
            <tr>
              <td bgcolor="${EMAIL_COLOR.ink}" style="background-color:${EMAIL_COLOR.ink};padding:24px ${CARD_PADDING}px;border-radius:${SHELL_RADIUS}px ${SHELL_RADIUS}px 0 0;" align="center">
                <a href="${escapeHtml(doc.baseUrl)}" style="text-decoration:none;">
                  <img src="${escapeHtml(doc.baseUrl)}/img/shared/brand/zitrone-logo-white.png" width="124" height="26" alt="${escapeHtml(doc.logoAlt)}" style="display:block;margin:0 auto;border:0;outline:none;width:124px;height:auto;">
                </a>
              </td>
            </tr>

${doc.hero ? heroBlock(doc.hero) : ''}
            <!-- 3 · White card. Its top is rounded only by the block that
                 rides on the photograph; with no photograph it sits flush
                 under the header bar, with no gap to show through. -->
            <!-- The cell behind the card is ink so the card's rounded bottom
                 reads as resting on the footer. Outlook squares the corners. -->
            <tr>
              <td bgcolor="${EMAIL_COLOR.ink}" style="background-color:${EMAIL_COLOR.ink};">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td bgcolor="${EMAIL_COLOR.surface}" class="zt-card-pad" style="background-color:${EMAIL_COLOR.surface};padding:${doc.hero ? '8px' : '40px'} ${CARD_PADDING}px 44px;border-radius:0 0 ${SHELL_RADIUS}px ${SHELL_RADIUS}px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
${doc.body}
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 4 · Footer -->
${footerBlock(doc.footer, doc.baseUrl, doc.logoAlt)}

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
