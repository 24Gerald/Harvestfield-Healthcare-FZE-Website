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
 * so it never blocks first paint.
 *
 * The net must never be missing. The SVG illustration is drawn from first
 * paint and only crossfades out once the WebGL canvas reports it has
 * initialised; if the 3D layer throws at any point, the boundary below keeps
 * the SVG in place. So a slow chunk, a blocked GPU or a lost context all
 * degrade to the same finished picture rather than a bare gradient.
 */
import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
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

/** Catches a failure inside the 3D layer so the hero keeps its SVG net. */
class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err) {
    console.warn('[hero] 3D layer failed, keeping the SVG net:', err?.message)
    this.props.onFail?.()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function HeroBackground({ hostRef }) {
  const reduce = useReducedMotion()
  const small = useIsSmallViewport()
  const webgl = useWebGLAvailable()
  const [inView, setInView] = useState(false)
  const observed = useRef(false)
  // 'svg' → SVG shown; 'fading' → canvas is up, SVG crossfading out; 'canvas' → SVG unmounted
  const [layer, setLayer] = useState('svg')
  const [failed, setFailed] = useState(false)

  const onCanvasReady = () => {
    setLayer((cur) => (cur === 'svg' ? 'fading' : cur))
  }
  useEffect(() => {
    if (layer !== 'fading') return
    const t = setTimeout(() => setLayer('canvas'), 700)
    return () => clearTimeout(t)
  }, [layer])
  // Scrolling away unmounts the canvas; when it comes back, start from the SVG again.
  useEffect(() => {
    if (!inView) setLayer('svg')
  }, [inView])

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

  const useSvg = reduce || !webgl || failed || (small && HERO_MOBILE_MODE === 'svg')
  const lite = small && HERO_MOBILE_MODE === 'webgl-lite'
  const showSvg = useSvg || layer !== 'canvas'

  // A supplied mosquito video replaces the 3D/SVG mosquitoes (the net stays).
  const base = import.meta.env.BASE_URL
  const videoWebm = useAssetAvailable(`${base}${HERO_MOSQUITO_VIDEO.webm}`, HERO_MOSQUITO_VIDEO.enabled)
  const videoHevc = useAssetAvailable(`${base}${HERO_MOSQUITO_VIDEO.hevc}`, HERO_MOSQUITO_VIDEO.enabled)
  const hideMosquitoes = HERO_MOSQUITO_VIDEO.replace3D && (videoWebm || videoHevc)

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Always-on base: brand gradient. Guarantees a finished look before/without the 3D layer. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_20%,#15606b_0%,#10515b_45%,#0b3b43_100%)]" />

      {showSvg && (
        <div
          className={`absolute inset-y-0 right-[-10%] w-[120%] transition-opacity duration-700 ease-out sm:right-[-5%] sm:w-[85%] md:w-[70%] ${
            layer === 'fading' && !useSvg ? 'opacity-0' : 'opacity-50'
          }`}
        >
          <NetIllustration variant="hero" animated={!reduce} mosquitoes={!hideMosquitoes} className="h-full w-full" />
        </div>
      )}

      {!useSvg && inView && (
        <div className="absolute inset-0 opacity-85">
          <SceneBoundary onFail={() => setFailed(true)}>
            <Suspense fallback={null}>
              <HeroCanvas lite={lite} mosquitoes={!hideMosquitoes} onReady={onCanvasReady} />
            </Suspense>
          </SceneBoundary>
        </div>
      )}

      {/* Optional transparent mosquito video (renders nothing until a file exists) */}
      <HeroVideoMosquito />

      {/* Vignette behind the text block so the headline always has contrast. */}
      <div className="absolute inset-0 bg-[radial-gradient(95%_55%_at_50%_64%,rgba(11,59,67,0.92)_0%,rgba(11,59,67,0.55)_45%,rgba(11,59,67,0)_82%)] md:bg-[radial-gradient(70%_80%_at_18%_55%,rgba(11,59,67,0.85)_0%,rgba(11,59,67,0.45)_40%,rgba(11,59,67,0)_75%)]" />
      {/* Soft fade into the next (white) section. */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-teal-deep/40" />
    </div>
  )
}
