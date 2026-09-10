/**
 * GitHub Contents API, server side. The token is GITHUB_TOKEN in the Vercel
 * environment and never reaches the browser. Writes are confined to the
 * content directories the blog uses.
 */
const API = 'https://api.github.com'

export const repoConfig = () => ({
  owner: process.env.GITHUB_OWNER || '24Gerald',
  repo: process.env.GITHUB_REPO || 'Harvestfield-Healthcare-FZE-Website',
  branch: process.env.GITHUB_BRANCH || 'claude/new-session-g34dfl',
  token: process.env.GITHUB_TOKEN || '',
})

const ALLOWED_PREFIXES = ['content/posts/', 'public/blog-media/', 'src/assets/gallery/']
export const isAllowedPath = (p) =>
  typeof p === 'string' && !p.includes('..') && ALLOWED_PREFIXES.some((pre) => p === pre.slice(0, -1) || p.startsWith(pre))

async function gh(path, init = {}) {
  const { owner, repo, token } = repoConfig()
  const res = await fetch(`${API}/repos/${owner}/${repo}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'harvestfield-admin',
      ...(init.headers || {}),
    },
  })
  if (res.status === 404) return null
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `GitHub responded ${res.status}`)
  }
  return res.status === 204 ? true : res.json()
}

const utf8ToB64 = (s) => Buffer.from(s, 'utf8').toString('base64')
const b64ToUtf8 = (b) => Buffer.from(b.replace(/\n/g, ''), 'base64').toString('utf8')

export const ops = {
  async whoami() {
    const r = await gh('')
    if (!r) throw new Error('GITHUB_TOKEN cannot see the repository')
    return { login: 'site', repo: r.full_name }
  },
  async list({ dir }) {
    const { branch } = repoConfig()
    const items = await gh(`/contents/${dir}?ref=${branch}`)
    return Array.isArray(items) ? items.map(({ name, type, sha, size }) => ({ name, type, sha, size })) : []
  },
  async readJson({ path }) {
    const { branch } = repoConfig()
    const f = await gh(`/contents/${path}?ref=${branch}`)
    if (!f) return null
    return { sha: f.sha, data: JSON.parse(b64ToUtf8(f.content)) }
  },
  async getSha({ path }) {
    const { branch } = repoConfig()
    const f = await gh(`/contents/${path}?ref=${branch}`)
    return f?.sha || null
  },
  async write({ path, content, message, isBase64 }) {
    const { branch } = repoConfig()
    const sha = await ops.getSha({ path })
    const body = { message, branch, content: isBase64 ? content : utf8ToB64(content) }
    if (sha) body.sha = sha
    const r = await gh(`/contents/${path}`, { method: 'PUT', body: JSON.stringify(body) })
    return { sha: r?.content?.sha || null }
  },
  async remove({ path, message }) {
    const { branch } = repoConfig()
    const sha = await ops.getSha({ path })
    if (!sha) return true
    await gh(`/contents/${path}`, { method: 'DELETE', body: JSON.stringify({ message, branch, sha }) })
    return true
  },
  /** Latest deployment for the branch (Vercel's GitHub integration records these), mapped to a run-like shape. */
  async latestRun() {
    const { branch, owner, repo } = repoConfig()
    const deps = await gh(`/deployments?ref=${encodeURIComponent(branch)}&per_page=1`)
    const d = deps?.[0]
    if (!d) return null
    const statuses = await gh(`/deployments/${d.id}/statuses?per_page=1`)
    const s = statuses?.[0]
    const state = s?.state // pending | in_progress | success | failure | error | queued
    return {
      status: state === 'success' || state === 'failure' || state === 'error' ? 'completed' : 'in_progress',
      conclusion: state === 'success' ? 'success' : state === 'failure' || state === 'error' ? 'failure' : null,
      html_url: s?.target_url || s?.environment_url || `https://github.com/${owner}/${repo}/deployments`,
    }
  },
}

export const WRITE_OPS = new Set(['write', 'remove'])
export const PATH_OPS = new Set(['list', 'readJson', 'getSha', 'write', 'remove'])
