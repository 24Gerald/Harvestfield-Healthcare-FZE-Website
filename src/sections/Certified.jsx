import { motion, useReducedMotion } from 'framer-motion'
import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import { certified as c } from '../data/content'
import { EASE_OUT } from '../lib/motion'
import { partnerLogo } from '../lib/partnerLogos'

/**
 * "Certified by" — three quality credentials, each with the certifier's mark.
 * Marks live in src/assets/partners/ (see the README there); a text wordmark
 * stands in until a file exists.
 */
export default function Certified() {
  const reduce = useReducedMotion()
  return (
    <section id={c.id} className="on-dark scroll-mt-20 bg-teal-deep text-white">
      <div className="container-site section-pad">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow className="text-white/70">{c.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal variant="rise" delay={0.08} duration={0.8}>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{c.title}</h2>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {c.items.map((it, i) => {
            const logo = partnerLogo(it.key)
            return (
              <Reveal key={it.key} as="li" delay={0.1 + i * 0.12} duration={0.7}>
                <motion.article
                  className="flex h-full flex-col rounded-3xl bg-white p-6 text-ink shadow-[0_24px_60px_-40px_rgba(0,0,0,0.6)] sm:p-7"
                  whileHover={reduce ? undefined : { y: -6 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                >
                  <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white p-2 shadow-[0_10px_30px_-12px_rgba(16,81,91,0.45)] ring-1 ring-teal-deep/10">
                    {logo ? (
                      <img src={logo} alt={it.logoAlt} className="max-h-full max-w-full object-contain" draggable="false" />
                    ) : (
                      <span className="text-center text-[11px] font-bold uppercase leading-tight tracking-wide text-teal-deep">{it.key}</span>
                    )}
                  </span>
                  <div className="mt-6 flex flex-1 flex-col">
                    <p className="eyebrow text-teal-deep/70">{it.kicker}</p>
                    <h3 className="mt-2 text-xl font-bold text-teal-deep">{it.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{it.body}</p>
                  </div>
                </motion.article>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
