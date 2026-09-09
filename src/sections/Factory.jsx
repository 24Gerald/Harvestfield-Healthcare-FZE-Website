import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import { factory } from '../data/content'
import { EASE_OUT } from '../lib/motion'

/* Simple line icons for the four process steps — icons, not photos (no factory photography yet). */
const icons = {
  'Netting in': <path d="M4 8h24v16H4zM4 12h24M4 16h24M4 20h24M10 8v16M16 8v16M22 8v16" />,
  Cut: <path d="M8 6l16 20M24 6L8 26M12 8a3 3 0 100 .01M20 24a3 3 0 100 .01" />,
  Sew: <path d="M6 24c4-6 6-6 10 0s6 6 10 0M14 6l4 4-4 4M18 10H6" />,
  'Pack and ship': <path d="M4 12l12-6 12 6v10l-12 6-12-6zM4 12l12 6 12-6M16 18v10" />,
}

/** Step icon whose strokes draw themselves in when the card appears. */
function DrawnIcon({ children, delay = 0 }) {
  const reduce = useReducedMotion()
  return (
    <motion.svg
      viewBox="0 0 32 32"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      <motion.g
        variants={{ hidden: { pathLength: 0, opacity: 0.3 }, show: { pathLength: 1, opacity: 1 } }}
        transition={{ duration: 1.1, ease: EASE_OUT, delay }}
      >
        {children}
      </motion.g>
    </motion.svg>
  )
}

export default function Factory() {
  const stripRef = useRef(null)
  const reduce = useReducedMotion()
  // The connector line between the four steps draws as the strip scrolls into view.
  const { scrollYProgress } = useScroll({ target: stripRef, offset: ['start 85%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 })
  const lineScale = useTransform(progress, [0, 1], [0, 1])

  return (
    <section id={factory.id} className="scroll-mt-20 bg-teal-tint-solid">
      <div className="container-site section-pad">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow className="text-teal-deep">{factory.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal variant="rise" delay={0.08} duration={0.8}>
              <h2 className="mt-4 text-3xl font-bold text-teal-deep sm:text-4xl lg:text-5xl">{factory.title}</h2>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="space-y-5 text-base text-ink/85 md:text-lg lg:col-span-7 lg:pt-2">
            {factory.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
        </div>

        {/* Process strip */}
        <div ref={stripRef} className="relative mt-16">
          {/* Connector line, large screens: sits behind the cards at icon height and draws left → right */}
          <div aria-hidden="true" className="absolute left-0 right-0 top-[3rem] hidden h-px bg-teal-deep/10 lg:block">
            <motion.div
              className="h-full w-full origin-left bg-teal-deep/40"
              style={reduce ? { scaleX: 1 } : { scaleX: lineScale }}
            />
          </div>

          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4" aria-label="Manufacturing process">
            {factory.process.map((step, i) => (
              <Reveal key={step.step} as="li" delay={0.1 + i * 0.12} duration={0.7} className="relative">
                <motion.div
                  className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_1px_0_rgba(16,81,91,0.08)]"
                  whileHover={reduce ? undefined : { y: -6, boxShadow: '0 18px 40px -20px rgba(16,81,91,0.35)' }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-tint text-teal-deep ring-4 ring-teal-tint-solid">
                      <DrawnIcon delay={0.2 + i * 0.12}>{icons[step.step]}</DrawnIcon>
                    </span>
                    <span className="text-xs font-semibold text-muted">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-teal-deep">{step.step}</h3>
                  <p className="mt-2 text-sm text-muted">{step.detail}</p>
                </motion.div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
