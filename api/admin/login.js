import { constantTimeEqual, issueSession, json, readBody, sessionCookie } from '../../lib/server/session.js'

/** POST { password } → sets the session cookie. */
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || !process.env.ADMIN_SESSION_SECRET) return json(res, 503, { error: 'Admin is not configured on the server' })
  const { password } = readBody(req)
  // Small fixed delay blunts online guessing without needing shared state.
  await new Promise((r) => setTimeout(r, 400))
  if (!constantTimeEqual(password || '', expected)) return json(res, 401, { error: 'That password is not right.' })
  res.setHeader('Set-Cookie', sessionCookie(issueSession()))
  json(res, 200, { ok: true, user: 'admin' })
}
