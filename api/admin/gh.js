import { json, readBody, readSession, verifySession } from '../../lib/server/session.js'
import { isAllowedPath, ops, PATH_OPS } from '../../lib/server/github.js'

/**
 * POST { op, ...args } — proxies the blog's GitHub operations with the server-held
 * token. Requires a valid session cookie. Paths are restricted to content dirs.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })
  if (!verifySession(readSession(req))) return json(res, 401, { error: 'Please sign in again.' })
  if (!process.env.GITHUB_TOKEN) return json(res, 503, { error: 'GITHUB_TOKEN is not set on the server' })
  const { op, ...args } = readBody(req)
  if (!ops[op]) return json(res, 400, { error: `Unknown op ${op}` })
  if (PATH_OPS.has(op)) {
    const p = args.path ?? args.dir
    if (!isAllowedPath(p)) return json(res, 403, { error: 'Path not allowed' })
  }
  try {
    const result = await ops[op](args)
    json(res, 200, { result })
  } catch (e) {
    json(res, 502, { error: e.message })
  }
}
