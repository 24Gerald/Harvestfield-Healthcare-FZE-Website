import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '../lib/motion'

const variants = {
  // Subtle fade-up — the default, used for paragraphs and cards.
  fade: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } },
  // Masked rise — headings emerge from a clipped line. Pair with an overflow-hidden wrapper below.
  rise: { hidden: { opacity: 0, y: '60%', clipPath: 'inset(0 0 100% 0)' }, show: { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' } },
  // Scale-in — chips and small objects.
  pop: { hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } },
}

/**
 * Scroll-triggered reveal. Wrap any block; pass `delay` (seconds) to stagger
 * siblings and `variant` to choose the motion. Disabled under prefers-reduced-motion.
 */
export default function Reveal({
  children,
  delay = 0,
  variant = 'fade',
  duration = 0.6,
  className = '',
  as = 'div',
  once = true,
  ...rest
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as] ?? motion.div

  if (reduce) {
    const Plain = as
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    )
  }

  return (
    <Tag
      className={className}
      variants={variants[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '0px 0px -10% 0px' }}
      transition={{ duration, ease: EASE_OUT, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
