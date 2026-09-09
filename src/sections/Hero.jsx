import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import SplitText from '../components/SplitText'
import HeroBackground from '../three/HeroBackground'
import { hero } from '../data/content'
import { EASE_OUT } from '../lib/motion'

/**
 * Entrance choreography (all under one timeline, disabled with reduced motion):
 *   0.00s  eyebrow tracks in from wide letter-spacing
 *   0.15s  headline words rise out of their lines, one after another
 *   0.55s  subhead un-blurs into place
 *   0.75s  CTAs rise
 *   0.30s  the 3D layer fades up behind everything
 * On scroll, the text block drifts up slightly faster than the scene (parallax) and fades.
 */
export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 60])

  const rise = (delay) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE_OUT, delay } }

  return (
    <section
      id="top"
      ref={ref}
      className="on-dark relative isolate flex min-h-[100svh] items-center overflow-hidden bg-teal-deep text-white"
    >
      {/* 3D / SVG background layer — never blocks first paint, unmounts when scrolled past */}
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y: sceneY }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.3 }}
      >
        <HeroBackground hostRef={ref} />
      </motion.div>

      <motion.div
        className="container-site relative z-10 pb-20 pt-32 md:pb-28 md:pt-40"
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
      >
        <div className="max-w-2xl">
          <motion.div
            initial={reduce ? false : { opacity: 0, letterSpacing: '0.4em' }}
            animate={{ opacity: 1, letterSpacing: '0.08em' }}
            transition={{ duration: 1.1, ease: EASE_OUT }}
          >
            <Eyebrow className="text-white/70">{hero.eyebrow}</Eyebrow>
          </motion.div>

          <h1 className="mt-5 text-[2.6rem] font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]">
            <SplitText text={hero.title} delay={0.15} stagger={0.07} duration={0.9} />
          </h1>

          <motion.p
            className="mt-6 max-w-xl text-lg text-white/80 md:text-xl"
            initial={reduce ? false : { opacity: 0, y: 14, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.55 }}
          >
            {hero.subtitle}
          </motion.p>

          <motion.div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center" {...rise(0.75)}>
            <Button href={hero.primaryCta.href} variant="solidOnDark">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="ghostOnDark">
              {hero.secondaryCta.label}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue — a single line that breathes, then fades once the visitor scrolls */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
          style={{ opacity: textOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <span className="block h-10 w-px overflow-hidden bg-white/15">
            <motion.span
              className="block h-full w-full bg-white/70"
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 1.8, ease: EASE_OUT, repeat: Infinity, repeatDelay: 0.4 }}
            />
          </span>
        </motion.div>
      )}
    </section>
  )
}
