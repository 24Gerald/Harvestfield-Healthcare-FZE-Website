/**
 * Blog posts live in the repository as JSON files in content/posts/, written by
 * the admin panel (/admin) through the GitHub API. Vite bundles them at build
 * time, so every commit from the panel triggers a redeploy and the post is live
 * about two minutes later. Only posts with published: true and a publishedAt in
 * the past are included in the public build.
 *
 * Note: a post stops being public when the NEXT build runs, not when it is
 * saved as a draft. If a draft is still visible on the live site, the site is
 * serving a stale build — check the host has redeployed.
 *
 * Post shape: { title, slug, publishedAt, published, excerpt, author, cover, coverAlt, body (HTML) }
 */
const modules = import.meta.glob('/content/posts/*.json', { eager: true, import: 'default' })

const all = Object.values(modules)
  .filter((p) => p && p.slug)
  .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

// Fail closed: a post is public only if it says so. `published !== false` would
// treat a file with the key missing — hand-written, or written by an older
// schema — as live, which is the wrong default for a publication flag.
export const posts = all.filter((p) => p.published === true && new Date(p.publishedAt) <= new Date())

export const getPost = (slug) => posts.find((p) => p.slug === slug) || null

export function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Resolve a media path stored by the admin panel ("blog-media/x.jpg") against the site base. */
export const mediaUrl = (path) => (path ? (/^https?:/.test(path) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`) : null)

/**
 * The body is HTML written by the site's own editors in the admin panel.
 * Still, strip anything executable before rendering, and rewrite media paths.
 */
export function safeHtml(html = '') {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('script, iframe, object, embed, style').forEach((n) => n.remove())
  doc.querySelectorAll('*').forEach((el) => {
    for (const attr of [...el.attributes]) {
      if (/^on/i.test(attr.name) || (attr.name === 'href' && /^\s*javascript:/i.test(attr.value))) el.removeAttribute(attr.name)
    }
    if (el.tagName === 'IMG' && el.getAttribute('src')) el.setAttribute('src', mediaUrl(el.getAttribute('src')))
    if (el.tagName === 'A' && /^https?:/.test(el.getAttribute('href') || '')) {
      el.setAttribute('target', '_blank')
      el.setAttribute('rel', 'noopener noreferrer')
    }
  })
  return doc.body.innerHTML
}
