/**
 * Resolves an optional-asset path from src/data/siteConfig.js against the site's
 * base path.
 *
 * A value that is already a complete URL is returned untouched, so a config
 * entry can point at an absolute address (a CDN-hosted model, say) or carry an
 * inlined `data:` URI, instead of only a path relative to the site root.
 */
export function assetUrl(path) {
  if (!path) return path
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
