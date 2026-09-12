import { useEffect, useState } from 'react'

const cache = new Map()

/**
 * Checks (once per URL) whether an optional asset really exists before a loader
 * is pointed at it. SPA hosts answer missing paths with index.html and a 200,
 * so a plain `ok` is not enough — the content type must not be HTML.
 * Returns null while checking, then true/false.
 */
export function useAssetAvailable(url, enabled = true) {
  const inline = typeof url === 'string' && url.startsWith('data:')
  const [ok, setOk] = useState(() => (enabled ? (inline ? true : cache.has(url) ? cache.get(url) : null) : false))
  useEffect(() => {
    if (!enabled || inline) return
    if (cache.has(url)) {
      setOk(cache.get(url))
      return
    }
    let alive = true
    fetch(url, { method: 'HEAD' })
      .then((r) => r.ok && !(r.headers.get('content-type') || '').includes('text/html'))
      .catch(() => false)
      .then((v) => {
        cache.set(url, v)
        if (alive) setOk(v)
      })
    return () => {
      alive = false
    }
  }, [url, enabled, inline])
  return ok
}
