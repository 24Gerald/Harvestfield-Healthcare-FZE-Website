import { motion, useReducedMotion } from 'framer-motion'
import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import gdmLogo from '../assets/gdm-logo-white.png'
import { trustedBy as c } from '../data/content'
import { EASE_OUT } from '../lib/motion'

/**
 * "Technology partner" — the GDM relationship, stated plainly.
 *
 * Replaces the old "Trusted by" strip, which was a claim a single licensor logo
 * could not support. Naming the dependency turns it into evidence: a
 * prequalified product owner accepted this facility into its manufacturing
 * arrangement, which is third-party validation the site otherwise never uses.
 *
 * GDM supply their mark in white only, so it sits on a teal chip here rather
 * than directly on the light band.
 */
const logos = { gdm: gdmLogo }

export default function TrustedBy() {
  const reduce = useReducedMotion()
  return (
    <section aria-labelledby="technology-partner-heading" className="bg-teal-tint-solid">
      <div className="container-site section-pad">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow className="text-teal-deep">{c.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal variant="rise" delay={0.08} duration={0.8}>
              <h2 id="technology-partner-heading" className="mt-4 text-3xl font-bold leading-tight text-teal-deep sm:text-4xl lg:text-5xl">
                {c.title}
              </h2>
            </Reveal>

            <ul className="mt-8 flex flex-wrap gap-4">
              {c.partners.map((p, i) => (
                <Reveal key={p.name} as="li" delay={0.25 + i * 0.1}>
                  <motion.a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.name} — ${p.role} (opens in a new tab)`}
                    className="group flex items-center gap-4 rounded-2xl bg-teal-deep px-5 py-4"
                    whileHover={reduce ? undefined : { y: -3 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                  >
                    <img src={logos[p.logo]} alt="" className="h-10 w-auto max-w-[130px] object-contain" draggable="false" />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-white group-hover:underline group-hover:underline-offset-4">{p.name}</span>
                      <span className="mt-0.5 block text-xs text-white/65">{p.role}</span>
                    </span>
                  </motion.a>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.15} className="space-y-5 text-base text-ink/85 md:text-lg lg:col-span-7 lg:pt-2">
            {c.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
