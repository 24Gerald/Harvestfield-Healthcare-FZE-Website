/**
 * Minimal Sanity client: GROQ queries over the public HTTP API, no SDK.
 *
 * Reads a PUBLIC dataset through Sanity's CDN, so published posts appear on the
 * site the moment they are published in Sanity Studio — no rebuild, no panel on
 * this site. Configure with two environment variables at build time:
 *   VITE_SANITY_PROJECT_ID   e.g. "abcd1234"
 *   VITE_SANITY_DATASET      e.g. "production"
 * (GitHub Actions: repository Variables; Netlify: Site settings → Environment.)
 * Also add the site origin(s) under Sanity → API → CORS origins.
 */
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const apiVersion = '2024-06-01'

export const sanityConfigured = () => Boolean(projectId)

async function query(groq, params = {}) {
  if (!projectId) throw new Error('Sanity is not configured (VITE_SANITY_PROJECT_ID missing)')
  const qs = new URLSearchParams({ query: groq })
  for (const [k, v] of Object.entries(params)) qs.set(`$${k}`, JSON.stringify(v))
  const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?${qs}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sanity responded ${res.status}`)
  const data = await res.json()
  return data.result
}

const postFields = `
  _id, title, "slug": slug.current, publishedAt, excerpt,
  "author": author->{name},
  "cover": mainImage{asset->{_id, url, metadata{dimensions{width,height}}}, alt}
`

export function fetchPosts() {
  return query(`*[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc) { ${postFields} }`)
}

export function fetchPost(slug) {
  return query(
    `*[_type == "post" && slug.current == $slug][0] { ${postFields}, body[]{ ..., _type == "image" => { asset->{_id, url, metadata{dimensions{width,height}}} } } }`,
    { slug },
  )
}

/** Image URL with sizing/format params via Sanity's image CDN. */
export function imageUrl(image, { w = 1200 } = {}) {
  const url = image?.asset?.url
  if (!url) return null
  return `${url}?w=${w}&auto=format&fit=max`
}

export function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
