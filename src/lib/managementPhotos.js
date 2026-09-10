/**
 * Optional portrait files for the Management section. Drop an image into
 * src/assets/management/ whose file name contains the person's `photo` key
 * (see README.txt there). Returns the image URL, or null when no file exists.
 */
const files = import.meta.glob('../assets/management/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' })

export function managementPhoto(key) {
  const k = key.toLowerCase()
  const hit = Object.keys(files).find((p) => p.split('/').pop().toLowerCase().includes(k))
  return hit ? files[hit] : null
}
