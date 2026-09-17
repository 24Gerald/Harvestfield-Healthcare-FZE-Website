/**
 * Photos in src/assets/gallery/, in natural file-name order (01-…, 02-… or
 * plain names).
 *
 * `galleryPhotos` drives the factory slider and excludes the one photo named by
 * FACTORY_STILL, which "The Factory" shows as a still image instead — so a
 * single setting keeps the same picture from appearing in both places.
 * `factoryStill` is that photo. Both are null/empty when the folder is empty,
 * and the sections hide themselves.
 */
import { FACTORY_STILL } from '../data/siteConfig'

const files = import.meta.glob('../assets/gallery/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' })

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
const fileName = (path) => path.split('/').pop()

const describe = (path) => {
  const name = fileName(path).replace(/\.[^.]+$/, '')
  // "03-quality-check" → "quality check"; a leading timestamp/number is dropped.
  const words = name.replace(/^[0-9a-z]{0,10}-(?=[a-z])/i, '').replace(/[-_]+/g, ' ').trim()
  return words ? `Harvestfield Healthcare FZE factory: ${words}` : 'Inside the Harvestfield Healthcare FZE factory'
}

const stillPath = FACTORY_STILL ? Object.keys(files).find((p) => fileName(p) === FACTORY_STILL) : undefined

/** The production hall still shown in "The Factory", or null when unset/missing. */
export const factoryStill = stillPath
  ? { src: files[stillPath], alt: 'The Harvestfield Healthcare FZE production hall in Ogun State, Nigeria' }
  : null

export const galleryPhotos = Object.keys(files)
  .filter((path) => path !== stillPath)
  .sort((a, b) => collator.compare(fileName(a), fileName(b)))
  .map((path) => ({ src: files[path], alt: describe(path) }))
