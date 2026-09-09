/**
 * Password check + encrypted token storage (WebCrypto only).
 *
 * Two places a token can live, both encrypted with the admin password:
 *   1. src/admin/vault.json — committed to the repo ("remember on all devices").
 *      Any device then needs only the password. The ciphertext is public, so the
 *      password is the only thing standing between the internet and repo write
 *      access: use a long passphrase. PBKDF2 at 600k iterations slows guessing.
 *   2. localStorage on this browser — per-device fallback.
 */
import repoVault from '../vault.json'

const KEY = 'hf-admin-vault'
const ITERATIONS = 600000
const enc = new TextEncoder()
const dec = new TextDecoder()

export async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function deriveKey(password, salt, iterations) {
  const base = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
}

const b64 = (u8) => btoa(String.fromCharCode(...u8))
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))

export async function encryptToken(password, token) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt, ITERATIONS)
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(token)))
  return { v: 1, kdf: 'PBKDF2-SHA256', iterations: ITERATIONS, salt: b64(salt), iv: b64(iv), ct: b64(ct) }
}

async function decryptVault(password, vault) {
  if (!vault?.ct) return null
  try {
    const key = await deriveKey(password, unb64(vault.salt), vault.iterations || ITERATIONS)
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(vault.iv) }, key, unb64(vault.ct))
    return dec.decode(pt)
  } catch {
    return null
  }
}

/** Token from the vault committed to the repo, or null. */
export const hasRepoVault = () => Boolean(repoVault && repoVault.ct)
export const loadRepoToken = (password) => decryptVault(password, repoVault)

/** Per-browser vault. */
export const hasVault = () => !!localStorage.getItem(KEY)
export async function saveToken(password, token) {
  localStorage.setItem(KEY, JSON.stringify(await encryptToken(password, token)))
}
export async function loadToken(password) {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  return decryptVault(password, JSON.parse(raw))
}
export const clearVault = () => localStorage.removeItem(KEY)
