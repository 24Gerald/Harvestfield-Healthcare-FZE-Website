/**
 * Stateless admin sessions for the Vercel functions: an HMAC-signed token in an
 * httpOnly cookie. Secret comes from ADMIN_SESSION_SECRET (any long random string).
 */
import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto'

const COOKIE = 'hf_admin'
const TTL_SECONDS = 12 * 60 * 60

const secret = () => process.env.ADMIN_SESSION_SECRET || ''

const sign = (payload) => createHmac('sha256', secret()).update(payload).digest('base64url')

export function issueSession() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TTL_SECONDS * 1000, n: randomBytes(8).toString('hex') })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function verifySession(token) {
  if (!token || !secret()) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false
  const expected = sign(payload)
  if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return false
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return typeof exp === 'number' && exp > Date.now()
  } catch {
    return false
  }
}

export function sessionCookie(token, { clear = false } = {}) {
  const attrs = ['Path=/', 'HttpOnly', 'SameSite=Strict', 'Secure']
  if (clear) return `${COOKIE}=; ${attrs.join('; ')}; Max-Age=0`
  return `${COOKIE}=${token}; ${attrs.join('; ')}; Max-Age=${TTL_SECONDS}`
}

export function readSession(req) {
  const raw = req.headers?.cookie || ''
  const m = raw.split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`))
  return m ? m.slice(COOKIE.length + 1) : null
}

export function constantTimeEqual(a, b) {
  const ba = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  if (ba.length !== bb.length) {
    // still compare something of equal length to keep timing flat
    timingSafeEqual(bb, bb)
    return false
  }
  return timingSafeEqual(ba, bb)
}

export function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

export function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string' && req.body) {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return {}
}
