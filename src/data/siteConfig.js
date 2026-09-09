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

/**
 * Real 3D mosquito for the hero scene.
 *
 * Drop a glTF export into public/models/mosquito/ (Sketchfab's "glTF" download
 * unzips to scene.gltf + scene.bin + textures/ — copy all of it). Any .gltf or
 * .glb works. If the file is missing or fails to load, the hero silently falls
 * back to the procedural mosquito, so this is safe to leave enabled.
 *
 * Tuning: most models need `rotation` adjusted so the head points toward +z
 * (the net). Try [0, Math.PI, 0] if it flies backwards, [0, Math.PI / 2, 0]
 * or [0, -Math.PI / 2, 0] if it flies sideways.
 */
export const HERO_MOSQUITO_MODEL = {
  enabled: true,
  url: 'models/mosquito/scene.gltf', // relative to the site base path
  length: 1.1, // world units — the model is scaled so its longest side matches this
  rotation: [0, 0, 0], // Euler radians, applied so the head faces +z
  opacity: 0.92,
  wingNodes: [], // optional node names to flutter, e.g. ['Wing_L', 'Wing_R'] — check the file in a glTF viewer
  // Shown in the footer only once the model has actually loaded (licence attribution).
  credit: {
    title: 'Mosquito Monster',
    author: 'COMODOX',
    url: 'https://sketchfab.com/3d-models/mosquito-monster-0df94ab7ce0145818ea22309774ee0ea',
    authorUrl: 'https://sketchfab.com/comodox',
    platform: 'Sketchfab',
    platformUrl: 'https://sketchfab.com',
  },
}

/**
 * Optional filmed / rendered mosquito as a transparent video layer in the hero.
 *
 * Provide BOTH encodings for full browser coverage and drop them in public/video/:
 *   webm — VP9 with alpha channel (Chrome, Edge, Firefox, Android)
 *   hevc — HEVC/H.265 with alpha in a .mov container (Safari, iOS); export from
 *          Apple Compressor / Final Cut / After Effects with "HEVC with alpha"
 * Footage on a plain black background with no alpha channel also works: set
 * blend to 'screen' and the black disappears against the teal.
 * When a file is present the video flies the same approach → stop → retreat
 * path as the 3D mosquitoes and the 3D mosquitoes are hidden (the net stays).
 */
export const HERO_MOSQUITO_VIDEO = {
  enabled: true,
  webm: 'video/mosquito.webm',
  hevc: 'video/mosquito.mov',
  blend: 'normal', // 'normal' for alpha footage, 'screen' for black-background footage
  width: 360, // px on desktop; scales down on small screens
  replace3D: true,
}

export const navLinks = [
  { label: 'The Factory', href: '#factory' },
  { label: 'The Net', href: '#net' },
  { label: 'Supply', href: '#supply' },
  { label: 'FAQ', href: '#faq' },
]

export const CTA = { label: 'Request Supply', href: '#request-supply' }
