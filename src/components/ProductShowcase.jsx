import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const ProductPackage = lazy(() => import('../three/ProductPackage'))

/**
 * Card that hosts the 3D pack. The WebGL canvas mounts only while the card is
 * on screen; the front artwork shows underneath as the loading state and as the
 * static fallback (reduced motion / no WebGL).
 */
export default function ProductShowcase({ className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [inView, setInView] = useState(false)
  const [ready, setReady] = useState(false)
  const base = import.meta.env.BASE_URL
  const front = `${base}product/front.png`
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

  const webgl = typeof document !== 'undefined' && !!document.createElement('canvas').getContext('webgl2')
  const use3D = !reduce && webgl

  return (
    <div
      ref={ref}
      className={`relative aspect-[4/5] overflow-hidden rounded-3xl bg-[radial-gradient(80%_70%_at_50%_40%,#e7eeef_0%,#d5e2e4_100%)] ${className}`}
      onPointerEnter={() => setReady(true)}
    >
      {/* Static artwork: loading state and fallback */}
      <img
        src={front}
        alt="Synera DuoForte pack, front"
        className={`absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-md shadow-[0_30px_60px_-30px_rgba(16,81,91,0.5)] transition-opacity duration-700 ${use3D && inView ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
      />
      {use3D && inView && (
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <ProductPackage front={front} back={back} bundle={bundle} wrinkles={wrinkles} paused={false} />
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
