import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { SPRING_SOFT } from '../lib/motion'

/**
 * Card that tilts toward the cursor with a moving sheen, like a card being
 * turned in the light. Max tilt is small on purpose. Static under reduced motion
 * or on touch devices.
 */
export default function TiltCard({ className = '', children, maxTilt = 5 }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const px = useMotionValue(50)
  const py = useMotionValue(50)
  const rotateX = useSpring(rx, SPRING_SOFT)
  const rotateY = useSpring(ry, SPRING_SOFT)
  const sheen = useMotionTemplate`radial-gradient(60% 50% at ${px}% ${py}%, rgba(255,255,255,0.12), transparent 70%)`

  const onPointerMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width
    const ny = (e.clientY - r.top) / r.height
    rx.set((0.5 - ny) * maxTilt * 2)
    ry.set((nx - 0.5) * maxTilt * 2)
    px.set(nx * 100)
    py.set(ny * 100)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 1200 }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
      {!reduce && (
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: sheen }} />
      )}
    </motion.div>
  )
}
