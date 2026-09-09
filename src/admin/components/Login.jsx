import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HarvestfieldLogo } from '../../components/HarvestfieldMark'
import { ADMIN } from '../config'
import { sha256Hex, hasVault, loadToken, saveToken, hasRepoVault, loadRepoToken, encryptToken } from '../lib/vault'
import { makeClient } from '../lib/github'
import { probeServer, serverLogin } from '../lib/server'
import { Btn, Field, inputClass, EASE } from './ui'

/**
 * Step 1: password (checked against a hash).
 * Step 2 (only until a token has been stored): paste a GitHub token once. It is
 * verified against the repo, then stored encrypted with the password — in the
 * site repo itself ("all devices", default) and/or in this browser.
 */
export default function Login({ onReady }) {
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [stage, setStage] = useState('password') // password | token
  const [remember, setRemember] = useState('all') // all | device
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [server, setServer] = useState(undefined) // undefined = probing, null = none, object = server mode

  useEffect(() => {
    probeServer().then(setServer)
  }, [])

  async function submitPassword(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    // Server mode (Vercel): the server checks the password and holds the GitHub token.
    if (server?.configured) {
      try {
        const r = await serverLogin(password)
        onReady({ mode: 'server', user: r.user })
      } catch (err) {
        setError(err.message)
        setBusy(false)
      }
      return
    }
    const ok = (await sha256Hex(password)) === ADMIN.passwordHash
    if (!ok) {
      setBusy(false)
      setError('That password is not right.')
      return
    }
    // Try the vault committed to the site first, then this browser's vault.
    const candidates = []
    if (hasRepoVault()) candidates.push(await loadRepoToken(password))
    if (hasVault()) candidates.push(await loadToken(password))
    for (const t of candidates.filter(Boolean)) {
      try {
        const who = await makeClient(t).whoami()
        onReady({ token: t, user: who.login })
        return
      } catch (err) {
        setError(`A stored token no longer works: ${err.message}. Paste a new one.`)
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
      const t = token.trim()
      const client = makeClient(t)
      const who = await client.whoami()
      await saveToken(password, t)
      if (remember === 'all') {
        setNote('Storing the encrypted token in the site…')
        const vault = await encryptToken(password, t)
        await client.write('src/admin/vault.json', JSON.stringify(vault, null, 2) + '\n', 'Admin: store encrypted access token')
        setNote('')
      }
      onReady({ token: t, user: who.login, storedInRepo: remember === 'all' })
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
              <fieldset className="mt-4 space-y-2 text-sm">
                <legend className="text-xs font-semibold uppercase tracking-eyebrow text-teal-deep">Remember it</legend>
                <label className="flex items-start gap-2">
                  <input type="radio" name="remember" checked={remember === 'all'} onChange={() => setRemember('all')} className="mt-1" />
                  <span>
                    <strong>On all devices</strong> — stored encrypted in the site itself, so from now on every device only needs the password. About two minutes to take effect.
                  </span>
                </label>
                <label className="flex items-start gap-2">
                  <input type="radio" name="remember" checked={remember === 'device'} onChange={() => setRemember('device')} className="mt-1" />
                  <span>
                    <strong>This browser only</strong>
                  </span>
                </label>
              </fieldset>
              {note && <p className="mt-3 text-xs text-teal-deep">{note}</p>}
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
        <p className="mt-6 text-xs text-white/50">
          {server?.configured
            ? `Server mode · publishing to ${ADMIN.owner}/${ADMIN.repo} on ${server.branch}`
            : server && !server.configured
              ? `Server found but not configured — missing ${server.missing.join(', ')} in the hosting environment. Using browser mode.`
              : `Publishing writes to ${ADMIN.owner}/${ADMIN.repo} on branch ${ADMIN.branch}.`}
        </p>
      </motion.div>
    </div>
  )
}
