import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '../lib/motion'

/**
 * Word-by-word masked reveal: each word rises out of its own clipping line.
 * Screen readers get the full sentence; the animated spans are hidden from them.
 */
export default function SplitText({ as: Tag = 'span', text, className = '', delay = 0, stagger = 0.045, duration = 0.7 }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')

  if (reduce) return <Tag className={className}>{text}</Tag>

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '105%', rotate: 2 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration, ease: EASE_OUT, delay: delay + i * stagger }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
