# Handoff configuration evidence

Read-only observations, evening of 2026-10-12 America/Mexico_City (2026-10-13 UTC). Source checkout HEAD7ded61a. No changes to external services.

- project-domains.json: GET /v9/projects/prj_nsMWJdqhkAswimnns9Ps3YJsUToQ/domains (team scope). Only .mx hosts and default .vercel.app entry.
- legacy-apex-config.json / legacy-www-config.json: GET /v6/domains/<host>/config with projectId and teamId. Accepted existing DNS does not mean the host belongs to this project. No verification challenge is returned by these config endpoints.
- dns.json: public DNS via resolver1.1.1.1; empty successful AAAA answer means no answer observed, not a complete zone inventory. Two timeout results retained. No DKIM selector enumeration attempted.
- http.json: curl HEAD, certificate verification enabled, no redirect following, no browser JavaScript or form submission. Campaign value handoff-check is synthetic.
- Vercel CLI project inspect confirmed team Zitrone/project zitrone-website/Node24; deployment inspect confirmed dpl_73pEEgsqV4WGLi17cLSB1ZtodEM2 Ready, production, created2026-10-12 18:27:43 GMT-0600, aliased to www.zitrone.mx and zitrone.mx. Domain inspect for zitrone.com.mx denied access in current team. These CLI observations are summarized here; raw API/domain/HTTP responses are in adjacent files.

The shell's default DNS resolver initially timed out; the successful DNS/API/HTTPS responses are the basis for the sheet. No active TXT challenge has been generated. No invented verification token or claim that the cutover already happened.
