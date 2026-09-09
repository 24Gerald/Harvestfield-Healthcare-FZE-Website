import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '../lib/motion'

/**
 * Count-up for stat values. "12M", "30%", "2", "1,200" animate from zero the
 * first time they scroll into view; anything without a number (e.g. the
 * "[VALUE]" placeholders) renders as plain text.
 */
export default function Counter({ value, className = '', duration = 1.6 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion()
  const match = /^([^\d]*)([\d][\d,]*(?:\.\d+)?)(.*)$/.exec(value)

  useEffect(() => {
    if (!match || !inView || reduce || !ref.current) return
    const [, prefix, num, suffix] = match
    const target = parseFloat(num.replace(/,/g, ''))
    const decimals = (num.split('.')[1] || '').length
    const grouped = num.includes(',')
    const controls = animate(0, target, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => {
        const fixed = v.toFixed(decimals)
        ref.current.textContent = prefix + (grouped ? Number(fixed).toLocaleString('en-US', { minimumFractionDigits: decimals }) : fixed) + suffix
      },
    })
    return () => controls.stop()
  }, [inView, reduce, duration, match])

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {value}
    </span>
  )
}
