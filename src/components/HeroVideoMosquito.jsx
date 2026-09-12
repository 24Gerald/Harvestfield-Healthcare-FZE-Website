import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { HERO_MOSQUITO_VIDEO as cfg } from '../data/siteConfig'
import { useAssetAvailable } from '../lib/useAssetAvailable'
import { assetUrl } from '../lib/assetUrl'
import { EASE_OUT, EASE_IN_OUT } from '../lib/motion'

/**
 * Transparent mosquito video flying the hero's approach → stop → retreat loop.
 * Renders nothing until one of the configured files actually exists.
 * The path is expressed in % of the hero so it scales with the viewport.
 */
export default function HeroVideoMosquito() {
  const webm = assetUrl(cfg.webm)
  const hevc = assetUrl(cfg.hevc)
  const hasWebm = useAssetAvailable(webm, cfg.enabled)
  const hasHevc = useAssetAvailable(hevc, cfg.enabled)
  const reduce = useReducedMotion()
  const x = useMotionValue(120)
  const y = useMotionValue(30)
  const scale = useMotionValue(0.6)
  const rotate = useMotionValue(-8)
  const ref = useRef(null)

  const available = hasWebm || hasHevc
  const leftPct = useMotionTemplatePercent(x)
  const topPct = useMotionTemplatePercent(y)

  useEffect(() => {
    if (!available || reduce) return
    // One 12 s loop: drift in from off-screen right, decelerate at the net (x≈58%),
    // probe with two small nudges, then drift back out. Values are % of the hero box.
    const opts = { duration: 12, repeat: Infinity, ease: [EASE_OUT, 'linear', 'linear', EASE_IN_OUT, EASE_IN_OUT] }
    const a = [
      animate(x, [120, 58, 56, 58, 90, 120], { ...opts, times: [0, 0.4, 0.47, 0.55, 0.8, 1] }),
      animate(y, [30, 42, 41, 43, 36, 30], { ...opts, times: [0, 0.4, 0.47, 0.55, 0.8, 1] }),
      animate(scale, [0.6, 1, 1.02, 1, 0.8, 0.6], { ...opts, times: [0, 0.4, 0.47, 0.55, 0.8, 1] }),
      animate(rotate, [-8, 4, 6, 4, -4, -8], { ...opts, times: [0, 0.4, 0.47, 0.55, 0.8, 1] }),
    ]
    return () => a.forEach((c) => c.stop())
  }, [available, reduce, x, y, scale, rotate])

  if (!available) return null

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 will-change-transform"
      style={{
        left: leftPct,
        top: topPct,
        scale,
        rotate,
        width: `min(${cfg.width}px, 45vw)`,
        mixBlendMode: cfg.blend,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <video autoPlay muted loop playsInline preload="auto" className="block h-auto w-full">
        {hasHevc && <source src={hevc} type='video/mp4; codecs="hvc1"' />}
        {hasWebm && <source src={webm} type="video/webm" />}
      </video>
    </motion.div>
  )
}

function useMotionTemplatePercent(mv) {
  // Framer's motion values are unitless numbers; the layout wants percentages.
  const pct = useMotionValue('0%')
  useEffect(() => mv.on('change', (v) => pct.set(`${v}%`)), [mv, pct])
  return pct
}
