import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import { renderInline } from '../components/InlineMarkup'
import { factory } from '../data/content'
import { EASE_OUT } from '../lib/motion'

/* Line icons for the four process steps — icons, not photos (no factory photography yet).
   Each icon is a list of strokes so every stroke can draw itself in. */
const P = (d) => ({ tag: 'path', d })
const C = (cx, cy, r) => ({ tag: 'circle', cx, cy, r })
const icons = {
  // A roll of netting with the mesh showing, and the unrolled tail below.
  'Netting in': [
    P('M4 12h20a5 5 0 010 10H4'),
    P('M4 12v10M9 12v10M14 12v10M19 12v10'),
    P('M4 17h20M24 17a5 5 0 00-5-5'),
    P('M4 27h18'),
  ],
  // Tailor's scissors: two tapered blades crossing at the pivot, finger rings at the back.
  Cut: [
    P('M15.5 15.2 26.2 4.6c.9-.9 2.3.4 1.5 1.4L18.3 17.2'),
    P('M15.5 16.8 26.2 27.4c.9.9 2.3-.4 1.5-1.4L18.3 14.8'),
    P('M14.2 14.9 11.2 11.6'),
    P('M14.2 17.1l-3 3.3'),
    C(8.7, 8.6, 3.4),
    C(8.7, 23.4, 3.4),
    C(15.6, 16, 1.4),
  ],
  // Sewing needle with a threaded eye, a loose loop of thread, and the stitches it leaves.
  Sew: [
    P('M6.5 25.5 22.8 9.2c.9-.9 2.4-.7 3 .3.5.8.3 1.8-.4 2.5L9.6 28.6'),
    P('M22.6 12.5c-.7-.7-.7-1.7 0-2.4s1.7-.7 2.4 0'),
    P('M23.8 11.3c3.1 2.4 3.9 5.6 1.6 8.2s-6.1 3-8.7 6.5'),
    P('M4 20.5h2.4M8.9 20.5h2.4M4 15.5h2.4M8.9 15.5h2.4'),
  ],
  // Sealed carton seen in slight perspective, with the tape line across the lid.
  'Pack and ship': [
    P('M4 12l12-6 12 6v10l-12 6-12-6z'),
    P('M4 12l12 6 12-6M16 18v10'),
    P('M10 9l12 6'),
  ],
}

/** Step icon whose strokes draw themselves in when the card appears. */
function DrawnIcon({ strokes, delay = 0 }) {
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
      {strokes.map((st, i) => {
        const Tag = st.tag === 'circle' ? motion.circle : motion.path
        const { tag: _tag, ...attrs } = st
        return (
          <Tag
            key={i}
            {...attrs}
            variants={{ hidden: { pathLength: 0, opacity: 0.25 }, show: { pathLength: 1, opacity: 1 } }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: delay + i * 0.08 }}
          />
        )
      })}
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
              <p key={p}>{renderInline(p)}</p>
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
                      <DrawnIcon strokes={icons[step.step]} delay={0.2 + i * 0.12} />
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
