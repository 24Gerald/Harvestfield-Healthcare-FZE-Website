/**
 * Shared motion vocabulary. Every animation on the site draws from these so the
 * whole page moves with one character: decisive, unhurried, never bouncy.
 */
import { animate } from 'framer-motion'

export const EASE = [0.22, 0.61, 0.36, 1] // standard
export const EASE_OUT = [0.16, 1, 0.3, 1] // expo-out: fast start, long settle (entrances, scroll)
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] // symmetrical (state changes)

export const SPRING_SOFT = { type: 'spring', stiffness: 170, damping: 26, mass: 0.6 }
export const SPRING_MAGNET = { type: 'spring', stiffness: 220, damping: 18, mass: 0.4 }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let current // the in-flight scroll animation, so a new click cancels the last

/**
 * Eased scroll to an in-page anchor. Duration scales with distance (0.55–1.1s)
 * and the animation yields to the user the moment they scroll or touch.
 */
export function smoothScrollTo(hash, { offset = 0 } = {}) {
  const id = hash.replace(/^#/, '')
  const el = id ? document.getElementById(id) : null
  const targetY = el ? el.getBoundingClientRect().top + window.scrollY - offset : 0

  if (prefersReducedMotion()) {
    window.scrollTo({ top: targetY, behavior: 'instant' })
    if (id) history.replaceState(null, '', `#${id}`)
    return
  }

  current?.stop()
  const from = window.scrollY
  const distance = Math.abs(targetY - from)
  const duration = Math.min(1.1, Math.max(0.55, distance / 1800))

  const cancel = () => current?.stop()
  window.addEventListener('wheel', cancel, { once: true, passive: true })
  window.addEventListener('touchstart', cancel, { once: true, passive: true })

  current = animate(from, targetY, {
    duration,
    ease: EASE_OUT,
    // 'instant' so the CSS scroll-behavior: smooth rule doesn't re-animate each frame.
    onUpdate: (v) => window.scrollTo({ top: v, behavior: 'instant' }),
    onComplete: () => {
      if (id) history.replaceState(null, '', `#${id}`)
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
    },
  })
}
