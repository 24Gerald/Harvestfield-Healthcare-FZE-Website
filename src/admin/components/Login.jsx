import { useState } from 'react'
import { motion } from 'framer-motion'
import { HarvestfieldLogo } from '../../components/HarvestfieldMark'
import { ADMIN } from '../config'
import { sha256Hex, hasVault, loadToken, saveToken } from '../lib/vault'
import { makeClient } from '../lib/github'
import { Btn, Field, inputClass, EASE } from './ui'

/**
 * Step 1: password (checked against a hash).
 * Step 2 (first time on this browser only): paste a GitHub token, which is
 * verified against the repo and then stored encrypted with the password.
 */
export default function Login({ onReady }) {
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [stage, setStage] = useState('password') // password | token
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submitPassword(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const ok = (await sha256Hex(password)) === ADMIN.passwordHash
    if (!ok) {
      setBusy(false)
      setError('That password is not right.')
      return
    }
    if (hasVault()) {
      const t = await loadToken(password)
      if (t) {
        try {
          const who = await makeClient(t).whoami()
          onReady({ token: t, user: who.login })
          return
        } catch (err) {
          setError(`Stored token no longer works: ${err.message}. Paste a new one.`)
        }
      }
    }
    setBusy(false)
    setStage('token')
  }

  async function submitToken(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const who = await makeClient(token.trim()).whoami()
      await saveToken(password, token.trim())
      onReady({ token: token.trim(), user: who.login })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="on-dark flex min-h-screen items-center justify-center bg-[radial-gradient(120%_90%_at_70%_20%,#15606b_0%,#10515b_45%,#0b3b43_100%)] p-6 text-white">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="w-full max-w-md">
        <HarvestfieldLogo className="h-12" />
        <h1 className="mt-8 text-3xl font-bold">Blog admin</h1>
        <p className="mt-2 text-white/75">{stage === 'password' ? 'Sign in to write and publish posts.' : 'One-time setup on this browser.'}</p>

        <motion.form
          key={stage}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          onSubmit={stage === 'password' ? submitPassword : submitToken}
          className="mt-8 rounded-3xl bg-white p-6 text-ink shadow-2xl"
        >
          {stage === 'password' ? (
            <Field label="Password">
              <input type="password" autoFocus autoComplete="current-password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Field>
          ) : (
            <>
              <Field
                label="GitHub token"
                hint="Fine-grained personal access token for this repository with Contents: read and write. It is encrypted with your password and never leaves this browser."
              >
                <input type="password" autoFocus className={inputClass} value={token} onChange={(e) => setToken(e.target.value)} placeholder="github_pat_…" required />
              </Field>
              <ol className="mt-4 list-decimal space-y-1 pl-5 text-xs text-muted">
                <li>GitHub → Settings → Developer settings → Personal access tokens → Fine-grained → Generate.</li>
                <li>Repository access: only {ADMIN.owner}/{ADMIN.repo}.</li>
                <li>Permissions → Repository → Contents: Read and write. Generate and paste it here.</li>
              </ol>
            </>
          )}
          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <Btn type="submit" busy={busy} className="mt-6 w-full">
            {stage === 'password' ? 'Sign in' : 'Save and continue'}
          </Btn>
        </motion.form>
        <p className="mt-6 text-xs text-white/50">Publishing writes to {ADMIN.owner}/{ADMIN.repo} on branch {ADMIN.branch}.</p>
      </motion.div>
    </div>
  )
}
