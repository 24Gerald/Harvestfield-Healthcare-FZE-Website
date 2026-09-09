/**
 * Form submission adapter.
 *
 * The Request Supply form calls `submitSupplyRequest(values)` and nothing else.
 * To point the form at a different backend, change FORM_BACKEND in
 * src/data/siteConfig.js — or add a new case to the switch below.
 *
 * Notification email: once email forwarding for info@harvestfieldhealthcare.com
 * is confirmed, add it as a form notification in Netlify (Site settings → Forms →
 * Form notifications). Nothing in this file needs to change for that.
 */
import { FORM_BACKEND, FORM_ENDPOINT_URL, site } from '../data/siteConfig'

export const FORM_NAME = 'request-supply'

/** @typedef {{ fullName: string, organization?: string, email: string, message: string, 'bot-field'?: string }} SupplyRequest */

/** @param {SupplyRequest} values */
export async function submitSupplyRequest(values) {
  switch (FORM_BACKEND) {
    case 'formsubmit':
      return submitViaFormSubmit(values)
    case 'netlify':
      return submitToNetlify(values)
    case 'mailto':
      return submitViaMailto(values)
    case 'endpoint':
      return submitToEndpoint(values)
    default:
      throw new Error(`Unknown FORM_BACKEND "${FORM_BACKEND}"`)
  }
}

/* ---------- Netlify Forms -------------------------------------------------
   Netlify accepts a URL-encoded POST to any path on the site. The static
   twin of this form lives in public/__forms.html so Netlify's build-time
   parser can register it (SPA-rendered forms are otherwise invisible).     */
async function submitToNetlify(values) {
  const body = new URLSearchParams({ 'form-name': FORM_NAME, ...values }).toString()
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) throw new Error(`Netlify Forms responded ${res.status}`)
}

/* ---------- FormSubmit.co ------------------------------------------------
   Relays the submission by email to site.contactEmail, no account needed.
   The first ever submission sends a one-time activation link to that inbox.
   AJAX endpoint returns JSON; `_captcha` off because the honeypot handles bots. */
async function submitViaFormSubmit(values) {
  const res = await fetch(`https://formsubmit.co/ajax/${site.contactEmail}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _subject: `Supply request — ${values.organization || values.fullName}`,
      _template: 'table',
      _captcha: 'false',
      _replyto: values.email,
      name: values.fullName,
      organization: values.organization || '—',
      email: values.email,
      message: values.message,
    }),
  })
  if (!res.ok) throw new Error(`FormSubmit responded ${res.status}`)
  const data = await res.json().catch(() => ({}))
  if (data.success === 'false' || data.success === false) throw new Error(data.message || 'FormSubmit rejected the submission')
}

/* ---------- mailto: fallback ---------------------------------------------
   No server involved — opens the visitor's mail client pre-filled.          */
async function submitViaMailto(values) {
  const subject = encodeURIComponent(`Supply request — ${values.organization || values.fullName}`)
  const bodyText = [
    `Name: ${values.fullName}`,
    `Organization: ${values.organization || '—'}`,
    `Email: ${values.email}`,
    '',
    values.message,
  ].join('\n')
  window.location.href = `mailto:${site.contactEmail}?subject=${subject}&body=${encodeURIComponent(bodyText)}`
}

/* ---------- Custom JSON endpoint -----------------------------------------
   Reserved for a real backend once the client confirms one.                 */
async function submitToEndpoint(values) {
  if (!FORM_ENDPOINT_URL) throw new Error('FORM_ENDPOINT_URL is not set in src/data/siteConfig.js')
  const res = await fetch(FORM_ENDPOINT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })
  if (!res.ok) throw new Error(`Endpoint responded ${res.status}`)
}
