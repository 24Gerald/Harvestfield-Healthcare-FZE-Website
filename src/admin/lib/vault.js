/** Password check + encrypted token storage (WebCrypto only, nothing leaves the browser). */
const KEY = 'hf-admin-vault'
const enc = new TextEncoder()
const dec = new TextDecoder()

export async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function deriveKey(password, salt) {
  const base = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
}

const b64 = (u8) => btoa(String.fromCharCode(...u8))
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))

export const hasVault = () => !!localStorage.getItem(KEY)

export async function saveToken(password, token) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(token)))
  localStorage.setItem(KEY, JSON.stringify({ salt: b64(salt), iv: b64(iv), ct: b64(ct) }))
}

export async function loadToken(password) {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  const { salt, iv, ct } = JSON.parse(raw)
  const key = await deriveKey(password, unb64(salt))
  try {
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(iv) }, key, unb64(ct))
    return dec.decode(pt)
  } catch {
    return null
  }
}

export const clearVault = () => localStorage.removeItem(KEY)
