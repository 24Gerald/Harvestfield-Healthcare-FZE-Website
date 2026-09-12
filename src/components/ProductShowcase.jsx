import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { PRODUCT_MODEL } from '../data/siteConfig'
import { useAssetAvailable } from '../lib/useAssetAvailable'

const ProductPackage = lazy(() => import('../three/ProductPackage'))
const ModelPackage = lazy(() => import('../three/ModelPackage'))

/**
 * Card that hosts the 3D pack. The WebGL canvas mounts only while the card is
 * on screen; the pre-rendered still shows underneath as the loading state and
 * as the static fallback (reduced motion / no WebGL).
 *
 * The pack itself is the supplied glTF model when one is present, and the
 * procedural pouch built from the print artwork when it is not — see
 * PRODUCT_MODEL in src/data/siteConfig.js.
 */
export default function ProductShowcase({ className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [inView, setInView] = useState(false)
  // The canvas mounts once the card has been on screen for a moment and then
  // stays mounted (paused while off screen) — mount/unmount churn during a fast
  // scroll-through would race the WebGL setup.
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)
  const base = import.meta.env.BASE_URL
  const front = `${base}product/front.png`
  // WebP: the still is a photographic render with an alpha channel, which PNG
  // stores at roughly seven times the size for no visible gain.
  const still = `${base}product/pack-still.webp`
  const back = `${base}product/back.png`
  const bundle = `${base}product/net-bundle.png`
  const wrinkles = `${base}product/wrinkles.png`

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '120px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || mounted) return
    const id = setTimeout(() => setMounted(true), 180)
    return () => clearTimeout(id)
  }, [inView, mounted])

  const modelUrl = `${base}${PRODUCT_MODEL.url}`
  const hasModel = useAssetAvailable(modelUrl, PRODUCT_MODEL.enabled)

  const webgl = typeof document !== 'undefined' && !!document.createElement('canvas').getContext('webgl2')
  const use3D = !reduce && webgl

  return (
    <div
      ref={ref}
      className={`relative aspect-[4/5] overflow-hidden rounded-3xl bg-[radial-gradient(80%_70%_at_50%_40%,#e7eeef_0%,#d5e2e4_100%)] ${className}`}
      onPointerEnter={() => setReady(true)}
    >
      {/* Pre-rendered still of the 3D pack: loading state and fallback, so the
          soft seal and edges look the same before WebGL is up (and without it) */}
      <img
        src={still}
        alt="Synera DuoForte pack, front"
        className={`absolute left-1/2 top-1/2 max-h-[84%] w-auto max-w-[82%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_28px_40px_rgba(16,81,91,0.22)] transition-opacity duration-700 ${use3D && mounted ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
      />
      {use3D && mounted && (
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            {hasModel ? (
              <ModelPackage url={modelUrl} active={inView} />
            ) : (
              <ProductPackage front={front} back={back} bundle={bundle} wrinkles={wrinkles} active={inView} />
            )}
          </Suspense>
        </div>
      )}
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-teal-deep backdrop-blur-sm">
        {use3D ? 'Drag to turn the pack' : 'Synera DuoForte pack'}
      </p>
      {ready && null}
    </div>
  )
}
