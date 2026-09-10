/**
 * Optional partner / supporter logo files. Drop an image into src/assets/partners/
 * whose file name contains the partner's `logo` key (see README.txt there) and it
 * is picked up automatically. Returns the image URL, or null when no file exists.
 * `variant` looks for a "<key>-white" file first (for dark backgrounds).
 */
const files = import.meta.glob('../assets/partners/*.{png,svg,jpg,jpeg,webp}', { eager: true, import: 'default' })

export function partnerLogo(key, variant) {
  const k = key.toLowerCase()
  const names = Object.keys(files)
  const find = (needle) => names.find((p) => p.split('/').pop().toLowerCase().includes(needle))
  const hit = (variant && find(`${k}-${variant}`)) || find(k)
  return hit ? files[hit] : null
}
