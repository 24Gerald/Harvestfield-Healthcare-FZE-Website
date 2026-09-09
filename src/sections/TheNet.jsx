import { motion, useReducedMotion } from 'framer-motion'
import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import NetIllustration from '../components/NetIllustration'
import { net } from '../data/content'
import { EASE_OUT } from '../lib/motion'

/** Check mark whose stroke draws in when the benefit scrolls into view. */
function DrawnCheck({ delay = 0 }) {
  const reduce = useReducedMotion()
  return (
    <span className="mt-1 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-teal-deep text-white" aria-hidden="true">
      <motion.svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      >
        <motion.path
          d="M2.5 7.5l3 3 6-7"
          variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1 } }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay }}
        />
      </motion.svg>
    </span>
  )
}

export default function TheNet() {
  const reduce = useReducedMotion()
  return (
    <section id={net.id} className="scroll-mt-20 bg-white">
      <div className="container-site section-pad">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Copy */}
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow className="text-teal-deep">{net.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal variant="rise" delay={0.08} duration={0.8}>
              <h2 className="mt-4 text-3xl font-bold text-teal-deep sm:text-4xl lg:text-5xl">{net.title}</h2>
            </Reveal>
            <Reveal delay={0.15} className="mt-6 space-y-5 text-base text-ink/85 md:text-lg">
              {net.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>

            {/* Active ingredients */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {net.ingredients.map((ai, i) => (
                <Reveal key={ai.name} delay={0.2 + i * 0.1}>
                  <motion.div
                    className="h-full rounded-2xl border border-teal-deep/15 p-5"
                    whileHover={reduce ? undefined : { y: -4, borderColor: 'rgba(16,81,91,0.45)' }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                  >
                    <p className="eyebrow text-muted">{ai.role}</p>
                    <p className="mt-2 text-lg font-semibold text-teal-deep">{ai.name}</p>
                    <p className="text-2xl font-bold tracking-heading text-ink">{ai.dose}</p>
                    <p className="mt-2 text-sm text-muted">{ai.detail}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>

            {/* Spec chips */}
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Specifications">
              {net.specs.map((s, i) => (
                <Reveal key={s} as="li" variant="pop" delay={0.3 + i * 0.08} duration={0.45} className="rounded-full bg-teal-tint px-4 py-1.5 text-sm font-medium text-teal-deep">
                  {s}
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Illustration + benefits */}
          <div className="lg:col-span-6">
            <Reveal delay={0.1}>
              <motion.div
                className="overflow-hidden rounded-3xl"
                initial={reduce ? false : { clipPath: 'inset(0 0 0 100% round 24px)' }}
                whileInView={{ clipPath: 'inset(0 0 0 0% round 24px)' }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.1 }}
              >
                <NetIllustration variant="render" className="w-full" />
              </motion.div>
              <p className="mt-3 text-xs text-muted">{net.designerNote}</p>
            </Reveal>
            <ul className="mt-8 space-y-5">
              {net.benefits.map((b, i) => (
                <Reveal key={b.title} as="li" delay={0.15 + i * 0.1} className="flex gap-4">
                  <DrawnCheck delay={0.25 + i * 0.1} />
                  <div>
                    <h3 className="text-base font-semibold text-teal-deep">{b.title}</h3>
                    <p className="mt-1 text-sm text-muted md:text-base">{b.detail}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
