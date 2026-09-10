import { useReducedMotion } from 'framer-motion'
import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import { gallery } from '../data/content'
import { galleryPhotos } from '../lib/gallery'

/**
 * "Inside the factory" photo slider. Photos roll continuously right-to-left in a
 * seamless loop: the strip is rendered twice and translated by exactly half its
 * width, so the second copy lands where the first began (no gap, no jump).
 * Tiles are small (about six across a desktop screen); hovering pauses the roll.
 * Photos come from src/assets/gallery/ — the section renders nothing until at
 * least one exists. Under prefers-reduced-motion the strip is a plain
 * horizontally scrollable row instead.
 */
const MIN_TILES = 12 // enough tiles in one copy to cover any screen width
const SECONDS_PER_TILE = 5 // roll speed: one tile width every 5 s

export default function Gallery() {
  const reduce = useReducedMotion()
  if (galleryPhotos.length === 0) return null

  // Repeat short sets so the strip is always wider than the viewport.
  const set = []
  while (set.length < MIN_TILES) set.push(...galleryPhotos)
  const copies = reduce ? [set.slice(0, galleryPhotos.length)] : [set, set]

  return (
    <section id={gallery.id} aria-labelledby="gallery-heading" className="scroll-mt-20 overflow-hidden bg-white">
      <div className="container-site pt-16 md:pt-20">
        <Reveal>
          <Eyebrow>{gallery.eyebrow}</Eyebrow>
          <h2 id="gallery-heading" className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-teal-deep md:text-4xl">
            {gallery.title}
          </h2>
        </Reveal>
      </div>

      <Reveal className="mt-10 md:mt-12" duration={0.8}>
        <div
          className={`hf-marquee pb-16 md:pb-20 ${reduce ? 'hf-marquee--static' : ''}`}
          style={{ '--hf-marquee-dur': `${set.length * SECONDS_PER_TILE}s` }}
          role="region"
          aria-label={gallery.ariaLabel}
        >
          <div className="hf-marquee-track">
            {copies.map((list, c) => (
              <ul key={c} className="hf-marquee-set" aria-hidden={c > 0 ? 'true' : undefined}>
                {list.map((p, i) => (
                  <li key={`${c}-${i}`} className="hf-marquee-tile">
                    <img src={p.src} alt={c === 0 ? p.alt : ''} loading={c === 0 ? 'eager' : 'lazy'} decoding="async" draggable="false" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
