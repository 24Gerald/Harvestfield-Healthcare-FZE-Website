import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'

/** Hairline reading-progress bar along the top edge, under the nav. */
export default function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })
  if (reduce) return null
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-teal-soft/80"
      style={{ scaleX }}
    />
  )
}
