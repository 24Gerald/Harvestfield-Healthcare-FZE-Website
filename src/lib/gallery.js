/**
 * Photos for the factory slider. Any image dropped into src/assets/gallery/ is
 * included, in natural file-name order (01-…, 02-… or plain names). Returns
 * [{ src, alt }]; empty when the folder has no photos (the section then hides).
 */
const files = import.meta.glob('../assets/gallery/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' })

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })

export const galleryPhotos = Object.keys(files)
  .sort((a, b) => collator.compare(a.split('/').pop(), b.split('/').pop()))
  .map((path) => {
    const name = path.split('/').pop().replace(/\.[^.]+$/, '')
    // "03-quality-check" → "quality check"; a leading timestamp/number is dropped.
    const words = name.replace(/^[0-9a-z]{0,10}-(?=[a-z])/i, '').replace(/[-_]+/g, ' ').trim()
    return { src: files[path], alt: words ? `Harvestfield Healthcare FZE factory: ${words}` : 'Inside the Harvestfield Healthcare FZE factory' }
  })
