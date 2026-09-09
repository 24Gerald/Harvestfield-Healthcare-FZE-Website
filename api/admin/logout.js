import { json, sessionCookie } from '../../lib/server/session.js'

export default function handler(req, res) {
  res.setHeader('Set-Cookie', sessionCookie('', { clear: true }))
  json(res, 200, { ok: true })
}
