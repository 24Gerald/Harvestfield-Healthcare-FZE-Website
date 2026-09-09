/**
 * Site-wide configuration. Everything a non-developer is likely to need to
 * change lives here or in the sibling files in src/data/.
 */
export const site = {
  name: 'Harvestfield Healthcare FZE',
  shortName: 'Harvestfield Healthcare',
  url: 'https://harvestfieldhealthcare.com',
  parent: 'A Harvestfield Industries company.',
  address: {
    line1: 'Harvestfield Industries Free Trade Zone',
    line2: 'Ogun State, Nigeria',
  },
  // Notification address for form submissions once email forwarding is confirmed.
  // Netlify Forms: add this under Site settings → Forms → Form notifications.
  contactEmail: 'info@harvestfieldhealthcare.com',
  replyTime: 'two working days',
}

/**
 * Form backend adapter switch — see src/lib/formAdapter.js.
 *   'netlify'  → Netlify Forms (default; zero-config on Netlify hosting)
 *   'mailto'   → opens the visitor's mail client addressed to site.contactEmail
 *   'endpoint' → POSTs JSON to FORM_ENDPOINT_URL below
 *
 * Do NOT switch to a third-party service (Formspree, HubSpot, etc.) without
 * client confirmation — that is what the 'endpoint' option is reserved for.
 */
export const FORM_BACKEND = 'netlify'
export const FORM_ENDPOINT_URL = '' // e.g. 'https://api.example.com/supply-requests'

/**
 * Hero 3D scene behaviour on small viewports.
 *   'svg'         → lightweight CSS/SVG animation of the same concept (no WebGL). Default.
 *   'webgl-lite'  → the R3F scene with fewer mosquitoes and no mouse parallax.
 * Benchmark on real devices before switching to 'webgl-lite'.
 */
export const HERO_MOBILE_MODE = 'svg'
// Viewports narrower than this, and any device whose primary pointer is touch
// (phones, tablets), count as "mobile" for the hero and get the lightweight layer.
export const HERO_MOBILE_BREAKPOINT = 1024

export const navLinks = [
  { label: 'The Factory', href: '#factory' },
  { label: 'The Net', href: '#net' },
  { label: 'Supply', href: '#supply' },
  { label: 'FAQ', href: '#faq' },
]

export const CTA = { label: 'Request Supply', href: '#request-supply' }
