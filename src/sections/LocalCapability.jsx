import { motion, useReducedMotion } from 'framer-motion'
import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import { renderInline } from '../components/InlineMarkup'
import { localCapability as c } from '../data/content'
import { EASE_OUT } from '../lib/motion'
import { partnerLogo } from '../lib/partnerLogos'

/**
 * "Local manufacturing" — the local-capability story and the public/private
 * supporters behind it. Supporter logos are optional files in
 * src/assets/partners/ (see README.txt there); a wordmark stands in until a
 * logo file exists. Each supporter links out to its own site.
 */
export default function LocalCapability() {
  const reduce = useReducedMotion()
  return (
    <section id={c.id} className="scroll-mt-20 bg-teal-tint-solid">
      <div className="container-site section-pad">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow className="text-teal-deep">{c.eyebrow}</Eyebrow>
            </Reveal>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-teal-deep sm:text-4xl lg:text-5xl">
              {c.title.map((line, i) => (
                <Reveal key={line} as="span" variant="rise" delay={0.08 + i * 0.1} duration={0.8} className="block">
                  {line}
                </Reveal>
              ))}
            </h2>
          </div>
          <Reveal delay={0.15} className="space-y-5 text-base text-ink/85 md:text-lg lg:col-span-7 lg:pt-2">
            {c.body.map((p) => (
              <p key={p}>{renderInline(p)}</p>
            ))}
          </Reveal>
        </div>

        {/* Supporters — one compact row of three on desktop, stacked on phones. */}
        <div className="mt-12 border-t border-teal-deep/10 pt-8">
          <Reveal>
            <Eyebrow as="h3" className="text-muted">
              {c.supportersLabel}
            </Eyebrow>
          </Reveal>
          <ul className="mt-5 grid gap-3 md:grid-cols-3 md:gap-4">
            {c.supporters.map((s, i) => {
              const logo = partnerLogo(s.logo)
              return (
                <Reveal key={s.name} as="li" delay={0.1 + i * 0.08}>
                  <motion.a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.fullName} (opens in a new tab)`}
                    className="group flex h-full items-start gap-4 rounded-2xl bg-white px-4 py-4 shadow-[0_1px_0_rgba(16,81,91,0.08)] transition-shadow hover:shadow-[0_14px_32px_-20px_rgba(16,81,91,0.35)]"
                    whileHover={reduce ? undefined : { y: -3 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                  >
                    <span className="flex h-12 w-16 flex-none items-center justify-center">
                      {logo ? (
                        <img src={logo} alt="" className="max-h-full max-w-full object-contain" draggable="false" />
                      ) : (
                        <span className="text-sm font-bold tracking-tight text-teal-deep">{s.name}</span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-teal-deep group-hover:underline group-hover:underline-offset-4">
                        {s.name} <span aria-hidden="true" className="text-teal-deep/60">↗</span>
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-muted">{s.fullName}</span>
                    </span>
                  </motion.a>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
