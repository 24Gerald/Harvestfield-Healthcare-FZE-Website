import { json } from '../../lib/server/session.js'

/** Tells the admin panel whether server mode is available and configured. */
export default function handler(req, res) {
  const configured = Boolean(process.env.GITHUB_TOKEN && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET)
  const missing = ['GITHUB_TOKEN', 'ADMIN_PASSWORD', 'ADMIN_SESSION_SECRET'].filter((k) => !process.env[k])
  json(res, 200, { mode: 'server', configured, missing, branch: process.env.GITHUB_BRANCH || 'claude/new-session-g34dfl' })
}
