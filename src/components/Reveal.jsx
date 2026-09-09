import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 0.61, 0.36, 1]

/**
 * Subtle fade-up on scroll. Wrap any block; pass `delay` (seconds) to stagger
 * siblings. Disabled entirely under prefers-reduced-motion.
 */
export default function Reveal({ children, delay = 0, y = 20, className = '', as = 'div', once = true, ...rest }) {
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
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
