import { ADMIN } from '../config'

const API = 'https://api.github.com'
const utf8ToB64 = (str) => btoa(unescape(encodeURIComponent(str)))
const b64ToUtf8 = (b) => decodeURIComponent(escape(atob(b.replace(/\n/g, ''))))

export function makeClient(token) {
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
  const base = `${API}/repos/${ADMIN.owner}/${ADMIN.repo}`

  async function req(path, init = {}) {
    const res = await fetch(`${base}${path}`, { ...init, headers: { ...headers, ...(init.headers || {}) } })
    if (res.status === 404) return null
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.message || `GitHub responded ${res.status}`)
    }
    return res.status === 204 ? true : res.json()
  }

  return {
    /** Confirms the token can see the repo; returns the authenticated login. */
    async whoami() {
      const me = await fetch(`${API}/user`, { headers }).then((r) => (r.ok ? r.json() : null))
      const repo = await req('')
      if (!repo) throw new Error('This token cannot see the repository. Check it has Contents: read and write on it.')
      return { login: me?.login || 'token', repo: repo.full_name }
    },
    async list(dir) {
      const items = await req(`/contents/${dir}?ref=${ADMIN.branch}`)
      return Array.isArray(items) ? items : []
    },
    async readJson(path) {
      const f = await req(`/contents/${path}?ref=${ADMIN.branch}`)
      if (!f) return null
      return { sha: f.sha, data: JSON.parse(b64ToUtf8(f.content)) }
    },
    async getSha(path) {
      const f = await req(`/contents/${path}?ref=${ADMIN.branch}`)
      return f?.sha || null
    },
    /** Create or update a file. `content` is a UTF-8 string or a base64 string when `isBase64`. */
    async write(path, content, message, { isBase64 = false } = {}) {
      const sha = await this.getSha(path)
      const body = { message, branch: ADMIN.branch, content: isBase64 ? content : utf8ToB64(content) }
      if (sha) body.sha = sha
      return req(`/contents/${path}`, { method: 'PUT', body: JSON.stringify(body) })
    },
    async remove(path, message) {
      const sha = await this.getSha(path)
      if (!sha) return true
      return req(`/contents/${path}`, { method: 'DELETE', body: JSON.stringify({ message, branch: ADMIN.branch, sha }) })
    },
    /** Latest deploy run for the branch (public data, but sent with the token to avoid rate limits). */
    async latestRun() {
      const r = await req(`/actions/workflows/${ADMIN.workflowFile}/runs?branch=${encodeURIComponent(ADMIN.branch)}&per_page=1`)
      return r?.workflow_runs?.[0] || null
    },
  }
}
