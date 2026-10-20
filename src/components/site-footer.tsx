"use client"

import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/button"
import { renderHeadingAccent } from "@/components/heading-accent"
import { FooterLangMenu } from "@/app/_components/home/footer-lang-menu"
import { useTitleReveal } from "@/hooks/use-title-reveal"
import type {
  FooterColumn,
  FooterSection,
  FooterSocialLink,
} from "@/app/_components/home/content/types"
import { SiteLink } from "@/components/site-link"
import { ConsentPreferencesLink } from "@/app/_components/consent/consent-preferences-link"

type SiteFooterProps = {
  footerColumns: FooterColumn[]
  footer: FooterSection
  integrated?: boolean
  tone?: "default" | "dark"
}


export function SiteFooter({
  footerColumns,
  footer,
  integrated = false,
  tone = "default",
}: SiteFooterProps) {
  useTitleReveal()

  return (
    <footer
      id="cta"
      data-track-section="footer"
      className={`ds-footer-site${integrated ? " ds-footer-site--integrated" : ""}${
        tone === "dark" ? " ds-footer-site--dark" : ""
      }`}
      aria-label={footer.ariaLabel}
    >
      <div className="ds-footer-site__shell">
        <section
          className="ds-footer-site__top"
          aria-label={footer.ctaPrimary.label}
          data-track-section="footer-cta"
        >
          <h3
            className="ds-footer-site__top-heading ds-title-reveal"
            data-title-reveal="words"
            data-reveal-state="idle"
            aria-label={footer.tagline}
          >
            {renderHeadingAccent(footer.tagline, footer.taglineEmphasis)}
          </h3>
          <Button variant={tone === "dark" ? "inverse-primary" : "primary"} href={footer.ctaPrimary.href}>
            <span>{footer.ctaPrimary.label}</span>
          </Button>
        </section>

        <div className="ds-footer-site__main">
          <div className="ds-footer-site__brand-col">
            <Link className="ds-footer-site__brand" href="/">
              <Image
                src={tone === "dark" ? "/img/shared/brand/zitrone-logo-white.svg" : "/img/shared/brand/zitrone-logo-dark.svg"}
                alt="Zitrone"
                width={714}
                height={150}
                unoptimized
              />
            </Link>
            <p className="ds-footer-site__legal-stack">{footer.legal.copyright}</p>
          </div>

          <nav className="ds-footer-site__nav-grid" aria-label={footer.ariaLabel}>
            {footerColumns.map((column) => (
              <div className="ds-footer-site__nav-col" key={column.label}>
                <p className="ds-footer-site__nav-title">{column.label}</p>
                <ul className="ds-footer-site__nav-links">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link className="ds-footer-site__nav-link" href={link.href}>
                        <span>{link.label}</span>
                        <span className="ds-footer-site__nav-link-arrow" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="ds-footer-site__nav-col">
              <p className="ds-footer-site__nav-title">{footer.contactLabel}</p>
              <address className="ds-footer-site__nav-address">
                {footer.address.map((line, index) => (
                  <span key={line}>
                    {line}
                    {index < footer.address.length - 1 ? <br /> : null}
                  </span>
                ))}
              </address>
              <ul className="ds-footer-site__nav-links">
                {footer.contactLinks.map((link) => (
                  <li key={link.label}>
                    <SiteLink className="ds-footer-site__nav-link" href={link.href}>
                      <span>{link.label}</span>
                      <span className="ds-footer-site__nav-link-arrow" aria-hidden="true">
                        →
                      </span>
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="ds-footer-site__bottom">
          <div className="ds-footer-site__legal-group">
            {footer.legal.links.map((link) => (
              <SiteLink className="ds-footer-site__legal-link" href={link.href} key={link.label}>
                {link.label}
              </SiteLink>
            ))}
            <ConsentPreferencesLink className="ds-footer-site__legal-link" />
          </div>

          {footer.socialLinks.length > 0 ? (
            <div className="ds-footer-site__socials" aria-label={footer.socialsLabel}>
              {footer.socialLinks.map((link) => (
                <SocialLink key={link.icon} href={link.href} icon={link.icon} label={link.label} />
              ))}
            </div>
          ) : null}

          <FooterLangMenu />
        </div>
      </div>
    </footer>
  )
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string
  icon: FooterSocialLink["icon"]
  label: string
}) {
  return (
    <a
      className="ds-footer-site__social"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      {icon === "linkedin" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M6.94 8.5A1.56 1.56 0 1 1 6.94 5.38a1.56 1.56 0 0 1 0 3.12ZM8.5 18.62H5.38V9.88H8.5v8.74ZM18.62 18.62H15.5v-4.25c0-1.01-.02-2.3-1.4-2.3-1.41 0-1.62 1.1-1.62 2.23v4.32H9.36V9.88h3v1.19h.04c.42-.79 1.44-1.62 2.97-1.62 3.18 0 3.77 2.1 3.77 4.83v4.34Z"
          />
        </svg>
      ) : null}
      {icon === "instagram" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7.2 3.6h9.6A3.6 3.6 0 0 1 20.4 7.2v9.6a3.6 3.6 0 0 1-3.6 3.6H7.2a3.6 3.6 0 0 1-3.6-3.6V7.2A3.6 3.6 0 0 1 7.2 3.6Zm0 1.8A1.8 1.8 0 0 0 5.4 7.2v9.6c0 .99.81 1.8 1.8 1.8h9.6c.99 0 1.8-.81 1.8-1.8V7.2a1.8 1.8 0 0 0-1.8-1.8H7.2Zm9.9 1.35a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM12 7.8A4.2 4.2 0 1 1 7.8 12 4.2 4.2 0 0 1 12 7.8Zm0 1.8A2.4 2.4 0 1 0 14.4 12 2.4 2.4 0 0 0 12 9.6Z"
          />
        </svg>
      ) : null}
      {icon === "facebook" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M13.35 20.4V12.9h2.52l.38-2.92h-2.9V8.12c0-.84.23-1.42 1.44-1.42h1.54V4.08a20.5 20.5 0 0 0-2.24-.12c-2.22 0-3.74 1.35-3.74 3.84v2.18H7.86v2.92h2.49v7.5h3Z"
          />
        </svg>
      ) : null}
      {icon === "twitter" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M18.9 4.5h-2.54l-3.4 4.16-3-4.16H4.5l5.65 7.83L4.8 19.5h2.55l3.93-4.8 3.46 4.8h5.46l-5.87-8.13L18.9 4.5Zm-3 13.47-7.06-9.9h1.38l7.09 9.9H15.9Z"
          />
        </svg>
      ) : null}
    </a>
  )
}
