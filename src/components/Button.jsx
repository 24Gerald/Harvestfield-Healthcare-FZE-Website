import { motion, useReducedMotion } from 'framer-motion'

const base =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200 ease-brand focus-visible:outline-2 focus-visible:outline-offset-4'

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

/**
 * Brand button. Renders an <a> when `href` is given, otherwise a <button>.
 * Hover: soft scale + colour shift, no bouncy easing.
 */
export default function Button({ href, variant = 'solid', className = '', children, ...rest }) {
  const reduce = useReducedMotion()
  const classes = `${base} ${variants[variant]} ${className}`
  const motionProps = reduce
    ? {}
    : { whileHover: { scale: 1.03 }, whileTap: { scale: 0.98 }, transition: { duration: 0.2, ease: [0.22, 0.61, 0.36, 1] } }

  if (href) {
    return (
      <motion.a href={href} className={classes} {...motionProps} {...rest}>
        {children}
      </motion.a>
    )
  }
  return (
    <motion.button type="button" className={classes} {...motionProps} {...rest}>
      {children}
    </motion.button>
  )
}
