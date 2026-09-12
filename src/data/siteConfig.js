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
}

/**
 * Form backend adapter switch — see src/lib/formAdapter.js.
 *   'formsubmit' → FormSubmit.co relays each submission to site.contactEmail.
 *                  Works on any host (GitHub Pages included). The FIRST submission
 *                  triggers a one-time activation email to that inbox — click it.
 *   'netlify'    → Netlify Forms (zero-config on Netlify hosting; set the
 *                  notification email in Netlify → Forms → Form notifications)
 *   'mailto'     → opens the visitor's mail client addressed to site.contactEmail
 *   'endpoint'   → POSTs JSON to FORM_ENDPOINT_URL below
 *
 * Client asked (Sept 2026) for submissions to reach info@harvestfieldhealthcare.com
 * while the site is on GitHub Pages, hence 'formsubmit'. Switch to 'netlify'
 * once hosting moves to Netlify if a first-party inbox is preferred.
 */
export const FORM_BACKEND = 'formsubmit'
export const FORM_ENDPOINT_URL = '' // e.g. 'https://api.example.com/supply-requests'

/**
 * Photographic hero background.
 *
 * Drop the approved photograph at public/hero/ using the file name below and
 * the hero switches to it automatically: the illustrated 3D net is replaced by
 * the photograph, and only the mosquitoes are rendered over it. Until the file
 * exists the hero keeps the 3D net, so the page is never left as a bare
 * gradient. Any format works — .jpg, .webp or .png.
 *
 *   position — object-position for the photo, so the subject stays in frame as
 *              the viewport changes shape. "72% 28%" keeps a subject on the
 *              right, slightly above centre.
 *   overlay  — 0-1. How much teal is laid over the photograph. The headline is
 *              white, so this is what guarantees its contrast; lower it only
 *              after checking the text against the image.
 */
export const HERO_BACKGROUND = {
  enabled: true,
  src: 'hero/hero-mother-and-child.jpg',
  position: '72% 28%',
  positionMobile: '64% 24%',
  overlay: 0.52,
}

/**
 * Hero 3D scene behaviour on small viewports.
 *   'webgl-lite'  → the R3F scene with two mosquitoes, lower pixel-ratio cap, coarser
 *                   canopy mesh and no mouse parallax. Default.
 *   'svg'         → lightweight CSS/SVG animation of the same concept (no WebGL) —
 *                   switch to this if device testing shows the lite scene is too heavy.
 * Reduced-motion users and devices without WebGL always get the SVG version.
 */
export const HERO_MOBILE_MODE = 'webgl-lite'
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

// The five-page navigation from the build specification (Part 3). Labels and
// paths live with the page copy in content.js so the two cannot drift apart.
export const navLinks = [
  { label: 'Home', href: '/', route: true },
  { label: 'About', href: '/about', route: true },
  { label: 'Synera DuoForte', href: '/synera-duoforte', route: true },
  { label: 'Manufacturing and quality', href: '/manufacturing', route: true },
  { label: 'Leadership', href: '/about#management', route: true },
  { label: 'News', href: '/news', route: true },
  { label: 'Contact', href: '/contact', route: true },
]

// Primary button. The home page has its own request form; the Contact page
// carries the same form for every other page, so the button routes there.
export const CTA = { label: 'Request supply', href: '/contact' }
