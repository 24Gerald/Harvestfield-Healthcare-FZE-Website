/**
 * Decides what sits behind the hero text and mounts it lazily.
 *
 *   prefers-reduced-motion      → static gradient + non-animated SVG net
 *   small viewport / touch      → CSS/SVG animation (HERO_MOBILE_MODE='svg')
 *                                 or the R3F scene in "lite" mode
 *   otherwise                   → the R3F scene (HeroNetScene.jsx)
 *
 * The WebGL canvas is only mounted while the hero is on screen. Once the user
 * scrolls past, it is fully unmounted so the GPU context is released; scrolling
 * back up remounts it. The 3D bundle is a separate, dynamically imported chunk,
 * so it never blocks first paint — the gradient and text render immediately.
 */
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import NetIllustration from '../components/NetIllustration'
import HeroVideoMosquito from '../components/HeroVideoMosquito'
import { HERO_MOBILE_MODE, HERO_MOBILE_BREAKPOINT, HERO_MOSQUITO_VIDEO } from '../data/siteConfig'
import { useAssetAvailable } from '../lib/useAssetAvailable'

const HeroCanvas = lazy(() => import('./HeroNetScene').then((m) => ({ default: m.HeroCanvas })))

const SMALL_QUERY = `(max-width: ${HERO_MOBILE_BREAKPOINT - 1}px), (pointer: coarse)`

function useIsSmallViewport() {
  const [small, setSmall] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(SMALL_QUERY).matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia(SMALL_QUERY)
    const onChange = (e) => setSmall(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return small
}

function useWebGLAvailable() {
  const [ok, setOk] = useState(true)
  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      setOk(!!(c.getContext('webgl2') || c.getContext('webgl')))
    } catch {
      setOk(false)
    }
  }, [])
  return ok
}

export default function HeroBackground({ hostRef }) {
  const reduce = useReducedMotion()
  const small = useIsSmallViewport()
  const webgl = useWebGLAvailable()
  const [inView, setInView] = useState(false)
  const observed = useRef(false)

  // Mount/unmount the scene with the hero's visibility.
  useEffect(() => {
    const el = hostRef.current
    if (!el || observed.current) return
    observed.current = true
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0, rootMargin: '0px 0px 0px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [hostRef])

  const useSvg = reduce || !webgl || (small && HERO_MOBILE_MODE === 'svg')
  const lite = small && HERO_MOBILE_MODE === 'webgl-lite'

  // A supplied mosquito video replaces the 3D/SVG mosquitoes (the net stays).
  const base = import.meta.env.BASE_URL
  const videoWebm = useAssetAvailable(`${base}${HERO_MOSQUITO_VIDEO.webm}`, HERO_MOSQUITO_VIDEO.enabled)
  const videoHevc = useAssetAvailable(`${base}${HERO_MOSQUITO_VIDEO.hevc}`, HERO_MOSQUITO_VIDEO.enabled)
  const hideMosquitoes = HERO_MOSQUITO_VIDEO.replace3D && (videoWebm || videoHevc)

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Always-on base: brand gradient. Guarantees a finished look before/without the 3D layer. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_20%,#15606b_0%,#10515b_45%,#0b3b43_100%)]" />

      {useSvg ? (
        <div className="absolute inset-y-0 right-[-10%] w-[120%] opacity-50 sm:right-[-5%] sm:w-[85%] md:w-[70%]">
          <NetIllustration variant="hero" animated={!reduce} mosquitoes={!hideMosquitoes} className="h-full w-full" />
        </div>
      ) : (
        inView && (
          <div className="absolute inset-0 opacity-85">
            <Suspense fallback={null}>
              <HeroCanvas lite={lite} mosquitoes={!hideMosquitoes} />
            </Suspense>
          </div>
        )
      )}

      {/* Optional transparent mosquito video (renders nothing until a file exists) */}
      <HeroVideoMosquito />

      {/* Vignette behind the text block so the headline always has contrast. */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_18%_55%,rgba(11,59,67,0.85)_0%,rgba(11,59,67,0.45)_40%,rgba(11,59,67,0)_75%)]" />
      {/* Soft fade into the next (white) section. */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-teal-deep/40" />
    </div>
  )
}
