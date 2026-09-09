/**
 * Server mode (Vercel): the browser talks to /api/admin/* and the GitHub token
 * stays on the server. Same interface as makeClient() in ./github.js.
 */
const call = async (path, body) => {
  const res = await fetch(`/api/admin/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Server responded ${res.status}`)
  return data
}

/** null when no server (GitHub Pages), else { configured, missing, branch }. */
export async function probeServer() {
  try {
    const res = await fetch('/api/admin/health', { credentials: 'same-origin' })
    if (!res.ok) return null
    const ct = res.headers.get('content-type') || ''
    if (!ct.includes('application/json')) return null // static hosts answer with index.html
    return res.json()
  } catch {
    return null
  }
}

export const serverLogin = (password) => call('login', { password })
export const serverLogout = () => call('logout')

export function makeServerClient() {
  const gh = (op, args) => call('gh', { op, ...args }).then((d) => d.result)
  return {
    whoami: () => gh('whoami'),
    list: (dir) => gh('list', { dir }),
    readJson: (path) => gh('readJson', { path }),
    getSha: (path) => gh('getSha', { path }),
    write: (path, content, message, { isBase64 = false } = {}) => gh('write', { path, content, message, isBase64 }),
    remove: (path, message) => gh('remove', { path, message }),
    latestRun: () => gh('latestRun'),
  }
}
