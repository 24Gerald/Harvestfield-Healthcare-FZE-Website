/**
 * Per-page metadata for a single-page app.
 *
 * The site ships one HTML shell, so index.html's title, description, canonical
 * and Open Graph tags describe the home page and every other route inherits
 * them. Part 5 of the build specification cares about exactly this: a search
 * result or a LinkedIn preview should identify the page it points at. This
 * hook rewrites those tags on navigation and restores nothing — each route
 * sets its own, and the home page sets the defaults back.
 */
import { useEffect } from 'react'
import { site } from '../data/siteConfig'

const OG_IMAGE = `${site.url}/og-image.jpg`

function tag(selector, create) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  return el
}

const meta = (name, value) => {
  const attr = name.startsWith('og:') ? 'property' : 'name'
  tag(`meta[${attr}="${name}"]`, () => {
    const el = document.createElement('meta')
    el.setAttribute(attr, name)
    return el
  }).setAttribute('content', value)
}

/**
 * @param {{ docTitle?: string, title?: string, description: string, path: string }} page
 */
export function usePageMeta(page) {
  useEffect(() => {
    if (!page) return
    const title = page.docTitle || `${page.title} | ${site.shortName}`
    const url = `${site.url}${page.path === '/' ? '/' : page.path}`

    document.title = title
    meta('description', page.description)
    meta('og:title', title)
    meta('og:description', page.description)
    meta('og:url', url)
    meta('og:image', OG_IMAGE)
    meta('twitter:title', title)
    meta('twitter:description', page.description)
    meta('twitter:image', OG_IMAGE)

    tag('link[rel="canonical"]', () => {
      const el = document.createElement('link')
      el.setAttribute('rel', 'canonical')
      return el
    }).setAttribute('href', url)
  }, [page])
}
