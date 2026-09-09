# Harvestfield Healthcare FZE — website

Marketing site for Harvestfield Healthcare FZE, manufacturer of the Synera DuoForte dual-insecticide mosquito net (designed by GDM Health Products). Built with React 18 + Vite, Tailwind CSS v4, Framer Motion and React Three Fiber. Deploys to Netlify at `harvestfieldhealthcare.com`.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve dist/ locally
npm run lint
```

Node 22 is pinned in `netlify.toml`.

## Deploy to Netlify

1. Create a new site from this repository in Netlify. `netlify.toml` already sets the build command, publish directory, SPA redirect and cache headers.
2. Add the custom domain `harvestfieldhealthcare.com` under **Domain management**.
3. After the first deploy, open **Forms** in the Netlify UI — the `request-supply` form is registered from `public/__forms.html`. Add `info@harvestfieldhealthcare.com` under **Form notifications** once email forwarding for that address is confirmed.

## Where things live

```
src/
  components/   Nav, Footer, Button, Eyebrow, Reveal (scroll fade), HarvestfieldMark (logo), NetIllustration (SVG)
  sections/     Hero, StatStrip, Factory, TheNet, Supply, FAQ, RequestSupply — one file per page section, in order
  three/        HeroNetScene.jsx (all 3D scene code), HeroBackground.jsx (lazy mount + fallbacks)
  data/         siteConfig.js, content.js (all copy), stats.js, faq.js
  lib/          formAdapter.js (form backend switch)
  pages/        Home.jsx, Legal.jsx (/legal stub)
  styles/       index.css (Tailwind + design tokens + SVG fallback keyframes)
public/         favicon, robots.txt, sitemap.xml, og-placeholder.svg, __forms.html (Netlify form definition)
```

## Things that are placeholders (and how to swap them)

Every placeholder is marked with a `TODO:` comment in the code. `grep -rn "TODO" src public index.html` lists them all.

| What | Where | How to replace |
| --- | --- | --- |
| **Logo** | `src/components/HarvestfieldMark.jsx` | The mark is a hand-drawn SVG approximation. Paste the paths from the client's vector logo into `HarvestfieldMark` (keep `stroke="currentColor"` / `fill="currentColor"` so it stays white on dark and teal on light), or replace the component body with an `<img>`. The wordmark lockup is `HarvestfieldLogo` in the same file. Also replace `public/favicon.svg`. |
| **Stat figures** | `src/data/stats.js` | Replace each `value: '[VALUE]'` with the real figure (e.g. `'12M'`, `'2'`, `'30%'`). Labels can stay. Nothing else changes. |
| **Section copy** | `src/data/content.js`, `src/data/faq.js` | All headings, body text, CTA labels and FAQ answers are here. The approved concept site was unreachable from the build environment, so body copy was written from the brief — paste the concept text over it. |
| **Photography / product render** | `src/sections/TheNet.jsx`, `src/sections/Factory.jsx` | The Net section uses `<NetIllustration variant="render" />`; swap it for an `<img>` with descriptive `alt` text. The Factory process strip uses line icons (no photos exist yet); add images inside each step card if wanted. |
| **OG image** | `index.html`, `public/og-placeholder.svg` | Replace with a 1200×630 PNG/JPG and update the two `og:image` / `twitter:image` URLs. |
| **Partner logos** | `src/components/Footer.jsx` | A commented-out block is ready. Add logo files to `src/assets/` and un-comment once the client has permission. |
| **Privacy notice** | `src/pages/Legal.jsx` | Route stub only. Draft after confirming NDPR requirements. |
| **Mosquito 3D model** | `public/models/mosquito/`, `HERO_MOSQUITO_MODEL` in `src/data/siteConfig.js` | The hero flies a real glTF model at the net when one is present. Unzip a Sketchfab glTF download (scene.gltf, scene.bin, textures/) into `public/models/mosquito/`. Missing or broken file → procedural mosquito, automatically. Adjust `rotation`/`length` in the config so the head faces the net; attribution appears in the footer once the model loads. |

## Pointing the form at a different backend

The form in `src/sections/RequestSupply.jsx` calls one function, `submitSupplyRequest()`, in `src/lib/formAdapter.js`. Switch backends by changing `FORM_BACKEND` in `src/data/siteConfig.js`:

- `'netlify'` (default) — Netlify Forms. Works out of the box on Netlify hosting. Keep the field names in `public/__forms.html` in sync with the React form.
- `'mailto'` — opens the visitor's mail client addressed to `info@harvestfieldhealthcare.com`. No server needed; useful if the site is ever hosted elsewhere.
- `'endpoint'` — POSTs JSON to `FORM_ENDPOINT_URL`. Reserved for a real backend once the client confirms one. Do not wire a third-party form service without that confirmation.

Adding another provider is one more `case` in `formAdapter.js`.

## The hero 3D scene

`src/three/HeroNetScene.jsx` contains the whole scene: `NetLattice` (procedural plane + shader), `Mosquito` (primitives + flight path), `CameraRig` (subtle parallax) and `HeroCanvas` (the R3F canvas). `src/three/HeroBackground.jsx` decides what to show:

| Condition | What renders |
| --- | --- |
| `prefers-reduced-motion` or no WebGL | Brand gradient + static SVG net |
| Viewport under 1024px or touch pointer | Gradient + CSS/SVG animation of the same concept (no WebGL) |
| Desktop | Gradient + lazy-loaded WebGL scene, mounted only while the hero is on screen |

The 3D bundle (~220 kB gzipped) is a separate chunk loaded on demand and never blocks first paint. Tweak the mobile behaviour with `HERO_MOBILE_MODE` and `HERO_MOBILE_BREAKPOINT` in `src/data/siteConfig.js`; `'webgl-lite'` runs the scene on small screens with two mosquitoes and no parallax if device testing shows it is cheap enough.

### Swapping in real modelled assets

- **Net:** replace the `<mesh>` inside `NetLattice` with a loaded model (e.g. `useGLTF`). Keep it centred on local `z = 0`. If you keep the shader, the breathing displacement and contact ripples keep working; the `impacts` ref is the contract between mosquitoes and net.
- **Mosquito:** replace the primitives inside `Mosquito`'s `<group>` with the model, oriented so it faces `+z`. The flight path, soft stop, wing flutter (attach `wingL`/`wingR` refs to the model's wing nodes) and distance fade live in `useFrame` and are independent of geometry.
- Timing, targets and count are in `MOSQUITO_SET` at the bottom of the file.

## Design tokens

Defined in `src/styles/index.css` under `@theme` and available as Tailwind utilities (`bg-teal-deep`, `text-muted`, `tracking-eyebrow`, …). Montserrat is self-hosted via `@fontsource/montserrat` (imported in `src/main.jsx`).
