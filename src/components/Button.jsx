import { useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { smoothScrollTo, SPRING_MAGNET } from '../lib/motion'

const base =
  'relative isolate inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200 ease-brand focus-visible:outline-2 focus-visible:outline-offset-4 select-none'

const variants = {
  // Solid — on light backgrounds
  solid: 'bg-teal-deep text-white hover:bg-teal-deeper',
  // Solid — on dark backgrounds
  solidOnDark: 'bg-white text-teal-deep hover:bg-teal-soft',
  // Outline/ghost — on light backgrounds
  ghost: 'border border-teal-deep/40 text-teal-deep hover:border-teal-deep hover:bg-teal-tint',
  // Outline/ghost — on dark backgrounds
  ghostOnDark: 'border border-white/50 text-white hover:border-white hover:bg-white/10',
}

// Ripple colour per variant — a soft ink spread from the click point.
const rippleColor = {
  solid: 'rgba(255,255,255,0.28)',
  solidOnDark: 'rgba(16,81,91,0.18)',
  ghost: 'rgba(16,81,91,0.14)',
  ghostOnDark: 'rgba(255,255,255,0.22)',
}

const MAGNET_RADIUS = 6 // px the button follows the cursor

/**
 * Brand button with three layers of motion, all disabled under reduced motion:
 *   1. Magnetic pull — the button leans a few pixels toward the cursor (desktop only).
 *   2. Press — a slight scale-down on pointer down.
 *   3. Ripple — an ink spread from the exact click point.
 * In-page `href="#…"` links scroll with an eased animation instead of a jump.
 */
export default function Button({ href, variant = 'solid', className = '', onClick, children, ...rest }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const [ripples, setRipples] = useState([])

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, SPRING_MAGNET)
  const y = useSpring(my, SPRING_MAGNET)

  const onPointerMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
    mx.set(dx * MAGNET_RADIUS)
    my.set(dy * MAGNET_RADIUS)
  }
  const onPointerLeave = () => {
    mx.set(0)
    my.set(0)
  }
  const onPointerDown = (e) => {
    if (reduce) return
    const r = ref.current.getBoundingClientRect()
    const size = Math.max(r.width, r.height) * 2.2
    const id = Date.now() + Math.random()
    setRipples((rs) => [...rs, { id, x: e.clientX - r.left - size / 2, y: e.clientY - r.top - size / 2, size }])
    setTimeout(() => setRipples((rs) => rs.filter((k) => k.id !== id)), 650)
  }
  const handleClick = (e) => {
    onClick?.(e)
    if (href && href.startsWith('#') && !e.defaultPrevented) {
      e.preventDefault()
      smoothScrollTo(href, { offset: 0 })
    }
  }

  const Tag = href ? motion.a : motion.button
  const tagProps = href ? { href } : { type: rest.type || 'button' }

  return (
    <Tag
      ref={ref}
      className={`${base} ${variants[variant]} ${className}`}
      style={reduce ? undefined : { x, y }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onClick={handleClick}
      {...rest}
      {...tagProps}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          className="hf-ripple pointer-events-none absolute rounded-full"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size, background: rippleColor[variant] }}
        />
      ))}
    </Tag>
  )
}
