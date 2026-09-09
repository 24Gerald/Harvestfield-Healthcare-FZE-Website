import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import HeroBackground from '../three/HeroBackground'
import { hero } from '../data/content'

const EASE = [0.22, 0.61, 0.36, 1]

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const fade = (delay) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: EASE, delay } }

  return (
    <section
      id="top"
      ref={ref}
      className="on-dark relative isolate flex min-h-[100svh] items-center overflow-hidden bg-teal-deep text-white"
    >
      {/* 3D / SVG background layer — never blocks first paint, unmounts when scrolled past */}
      <HeroBackground hostRef={ref} />

      <div className="container-site relative z-10 pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="max-w-2xl">
          <motion.div {...fade(0)}>
            <Eyebrow className="text-white/70">{hero.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h1
            className="mt-5 text-[2.6rem] font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]"
            {...fade(0.08)}
          >
            {hero.title}
          </motion.h1>
          <motion.p className="mt-6 max-w-xl text-lg text-white/80 md:text-xl" {...fade(0.16)}>
            {hero.subtitle}
          </motion.p>
          <motion.div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center" {...fade(0.24)}>
            <Button href={hero.primaryCta.href} variant="solidOnDark">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="ghostOnDark">
              {hero.secondaryCta.label}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
