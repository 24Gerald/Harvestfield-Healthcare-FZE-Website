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

/** True when any pixel is less than fully opaque (a logo on a transparent background). */
function canvasHasAlpha(ctx, w, h) {
  try {
    const { data } = ctx.getImageData(0, 0, w, h)
    for (let i = 3; i < data.length; i += 4) if (data[i] < 250) return true
    return false
  } catch {
    return false // tainted canvas — fall back to the file type
  }
}

/** Resize an image in the browser and return { base64, name, type } ready for the API. */
export async function prepareImage(file, maxEdge) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(bitmap, 0, 0, w, h)
  // Transparency must survive: JPEG has no alpha channel, so a logo on a
  // transparent background would flatten onto the canvas's black and lose every
  // black element in it. Keep those as PNG, and put white behind anything else
  // before encoding to JPEG.
  const type = canvasHasAlpha(ctx, w, h) ? 'image/png' : 'image/jpeg'
  if (type === 'image/jpeg') {
    ctx.globalCompositeOperation = 'destination-over'
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'source-over'
  }
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
