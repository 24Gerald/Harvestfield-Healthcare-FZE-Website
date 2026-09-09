# Harvestfield blog — Sanity Studio

Editors write posts here. The Studio is hosted by Sanity (at `https://harvestfield.sanity.studio` once deployed), so the website itself has no admin panel. Published posts appear on `/blog` within seconds — no rebuild.

## One-time setup

1. Create a free Sanity project at https://www.sanity.io/manage → **Create project**. Note the **Project ID** and use dataset name `production` (set it to **public**).
2. In the project's **API → CORS origins**, add the site origins:
   `https://harvestfieldhealthcare.com`, `https://24gerald.github.io`, and `http://localhost:5173` for local dev.
3. Put the project id in this folder (either edit `sanity.config.js` / `sanity.cli.js`, or set `SANITY_STUDIO_PROJECT_ID`).
4. In this folder run:
   ```bash
   npm install
   npx sanity login
   npx sanity deploy      # publishes the Studio to https://harvestfield.sanity.studio
   ```
5. Give the website the same project id: add repository variables `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET=production` (GitHub → Settings → Secrets and variables → Actions → Variables), and the same two in Netlify's environment when hosting moves there. Re-run the deploy once.

## Writing a post

Open the Studio → **Blog post** → **Create**. Title, slug (auto), publish date, excerpt, cover image, body. Press **Publish**. Done — it is live on `/blog` and at `/blog/<slug>`. Unpublish to remove it. Set a future publish date to schedule.
