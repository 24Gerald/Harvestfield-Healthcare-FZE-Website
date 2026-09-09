export const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

export const nowLocalInput = () => {
  const d = new Date()
  d.setSeconds(0, 0)
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16)
}
export const isoToLocalInput = (iso) => {
  if (!iso) return nowLocalInput()
  const d = new Date(iso)
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16)
}
export const localInputToIso = (v) => new Date(v).toISOString()

export const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '')

/** Resize an image in the browser and return { base64, name, type } ready for the API. */
export async function prepareImage(file, maxEdge) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h)
  const keepPng = file.type === 'image/png' && scale === 1 && file.size < 400 * 1024
  const type = keepPng ? 'image/png' : 'image/jpeg'
  const dataUrl = canvas.toDataURL(type, 0.86)
  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'image'
  const name = `${Date.now().toString(36)}-${base}.${type === 'image/png' ? 'png' : 'jpg'}`
  return { base64: dataUrl.split(',')[1], name, type, width: w, height: h }
}

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result.split(',')[1])
    r.onerror = reject
    r.readAsDataURL(file)
  })
