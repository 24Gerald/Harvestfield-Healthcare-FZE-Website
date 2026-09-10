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

## Deploy to Vercel (recommended)

1. In Vercel: **Add New → Project → Import** this GitHub repository. Framework is detected as Vite; `vercel.json` sets the build, the SPA rewrites, `/admin`, and cache headers.
2. Before the first deploy, add these **Environment Variables** (Production and Preview):

   | Variable | Value |
   | --- | --- |
   | `GITHUB_TOKEN` | Fine-grained personal access token for this repo, *Contents: read and write* only. Lets the admin panel publish posts. |
   | `ADMIN_PASSWORD` | The admin panel password. |
   | `ADMIN_SESSION_SECRET` | Any long random string (e.g. `openssl rand -hex 32`). Signs login sessions. |
   | `GITHUB_BRANCH` | Branch the admin writes to and Vercel deploys from (currently `claude/new-session-g34dfl`; change both when you move to `main`). |

3. Deploy. Every push to the branch redeploys; every post published from `/admin` is a push.
4. **Domains:** add `harvestfieldhealthcare.com` (and `www`) in the project's Domains tab and follow the DNS instructions. Adding `admin.harvestfieldhealthcare.com` as well makes the admin panel answer on that subdomain (rewrite in `vercel.json`).

With those variables set, the admin panel runs in **server mode**: password only, no token in the browser. On a host without functions (GitHub Pages) it falls back to browser mode, where the token is entered once and kept encrypted.

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
| **Logo** | `src/assets/logo-full-white.png`, `src/assets/logo-mark-white.png`, `public/favicon.png` | Client PNGs (white, for dark backgrounds). Replace with the vector master when available; a teal-on-white variant is still needed for any future light-background use. |
| **Stat figures** | `src/data/stats.js` | `value` is the big number, optional `unit` sits beside it, `label` beneath. |
| **Section copy** | `src/data/content.js`, `src/data/faq.js` | All headings, body text, CTA labels and FAQ answers are here. The approved concept site was unreachable from the build environment, so body copy was written from the brief — paste the concept text over it. |
| **Photography / product render** | `src/sections/TheNet.jsx`, `src/sections/Factory.jsx` | The Net section uses `<NetIllustration variant="render" />`; swap it for an `<img>` with descriptive `alt` text. The Factory process strip uses line icons (no photos exist yet); add images inside each step card if wanted. |
| **OG image** | `index.html`, `public/og-placeholder.svg` | Replace with a 1200×630 PNG/JPG and update the two `og:image` / `twitter:image` URLs. |
| **Privacy & data notice** | `src/data/legal.js` | Full draft at `/privacy` (NDPA 2023 / NDPR). Items in [brackets] need the client's confirmation; have counsel review before launch. |
| **Pack artwork (3D pack shot)** | `public/product/front.png`, `back.png` | Reconstructed from pack photos by `scripts/make-product-placeholder.py`. Replace with the real print artwork flattened to PNG/JPG (~1000×1250, front and back). |
| **Pack still (loading / no-WebGL fallback)** | `public/product/pack-still.png` | Transparent render of the 3D pack. After swapping the artwork, re-capture it: open the site with `?packpose=-0.32`, screenshot the pack canvas with a transparent background and crop. |
| **Certified-by section** | `src/assets/partners/{iso,who,nafdac}.png`, `certified` in `src/data/content.js` | The marks are in-house stand-ins; drop the official files in with the same names to replace them. Confirm each certification claim before launch. |
| **Management portraits** | `src/assets/management/chairman.jpg`, `managing-director.jpg` | Drop the portraits in (any of jpg/png/webp); initials show in the frame until then. Bios live in `management` in `src/data/content.js`. |
| **Factory photo slider** | `src/assets/gallery/` or the admin panel's Gallery tab | Drop JPG/PNG/WebP photos in (numbered `01-…`, `02-…` for order); the “Inside the factory” slider is hidden until at least one exists. |
| **Supporter logos (Local manufacturing section)** | `src/assets/partners/` | Drop `pvac.png` and `oguninvest.png` (or .svg) in this folder; they are picked up automatically. Until then the names show as wordmarks. |
| **Partner logos** | `src/assets/gdm-logo-white.png`, `trustedBy` in `src/data/content.js` | Add a partner: drop the logo in `src/assets/`, register it in `TrustedBy.jsx`'s `logos` map, add an entry with `url`. |
| **Mosquito 3D model** | `public/models/mosquito/`, `HERO_MOSQUITO_MODEL` in `src/data/siteConfig.js` | The hero flies a real glTF model at the net when one is present. Unzip a Sketchfab glTF download (scene.gltf, scene.bin, textures/) into `public/models/mosquito/`. Missing or broken file → procedural mosquito, automatically. Adjust `rotation`/`length` in the config so the head faces the net; attribution appears in the footer once the model loads. |
| **Mosquito video** | `public/video/`, `HERO_MOSQUITO_VIDEO` in `src/data/siteConfig.js` | Drop `mosquito.webm` (VP9 with alpha) and `mosquito.mov` (HEVC with alpha, for Safari) into `public/video/` and the hero flies the footage at the net instead of the 3D mosquitoes. Black-background footage without alpha: set `blend: 'screen'`. Nothing renders until a file exists. |

## Pointing the form at a different backend

The form in `src/sections/RequestSupply.jsx` calls one function, `submitSupplyRequest()`, in `src/lib/formAdapter.js`. Switch backends by changing `FORM_BACKEND` in `src/data/siteConfig.js` (currently `'formsubmit'` so the form works on GitHub Pages):

- `'formsubmit'` (current) — FormSubmit.co relays each submission by email to `info@harvestfieldhealthcare.com`. Works on any host. The first ever submission sends a one-time activation email to that inbox; click the link once and every later submission is delivered.
- `'netlify'` — Netlify Forms. Works out of the box on Netlify hosting. Keep the field names in `public/__forms.html` in sync with the React form.
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

## Blog and the admin panel

Posts are written in the site's own admin panel at `/admin/` (password-protected). The panel stores each post as JSON in `content/posts/` and uploads media to `public/blog-media/` by committing to this repository through the GitHub API. Every commit triggers the Pages/Netlify deploy, so a post is live on `/blog` about two minutes after publishing. No external CMS, no database.

- **Login (server mode, Vercel):** `/api/admin/login` checks `ADMIN_PASSWORD` and issues an httpOnly session cookie; `/api/admin/gh` performs the GitHub writes with the server-held `GITHUB_TOKEN`, restricted to `content/posts/`, `public/blog-media/` and `src/assets/gallery/` (the home-page photo slider, managed from the panel's Gallery tab).
- **Login (browser mode, GitHub Pages):** the password is checked in the browser against a hash in `src/admin/config.js`. The very first login (ever) asks for a GitHub token (fine-grained personal access token with *Contents: read and write* on this repo) — that token is what actually authorises the commits, because a static site has no server to hold a secret. With "remember on all devices" the token is encrypted with the password (PBKDF2 600k + AES-GCM) and committed as `src/admin/vault.json`; from then on every device needs only the password. Because that ciphertext is public, **the password is the only protection for repo write access — use a long passphrase** and rotate the token if the password ever leaks. To revoke: delete the token on GitHub and empty `vault.json` to `{}`.
- **Branch:** commits go to the branch named in `src/admin/config.js` (`ADMIN.branch`). Change it to `main` once the site has a main branch.
- **Change the password:** run `node -e "crypto.subtle.digest('SHA-256', new TextEncoder().encode('new-password')).then(b=>console.log(Buffer.from(b).toString('hex')))"` and paste the hash into `src/admin/config.js`.
- **Post format:** see `content/posts/example-post.json`. Body is HTML from the editor; the site strips anything executable before rendering (`src/lib/posts.js`).

## Design tokens

Defined in `src/styles/index.css` under `@theme` and available as Tailwind utilities (`bg-teal-deep`, `text-muted`, `tracking-eyebrow`, …). Montserrat is self-hosted via `@fontsource/montserrat` (imported in `src/main.jsx`).
