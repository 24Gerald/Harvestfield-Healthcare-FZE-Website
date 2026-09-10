import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import { management as c } from '../data/content'
import { managementPhoto } from '../lib/managementPhotos'
import { EASE_OUT } from '../lib/motion'

/**
 * "Management" — the Chairman and Managing Director. Each card shows a 4:5
 * portrait (optional file in src/assets/management/, initials until it
 * exists), name, role and the first paragraph of the bio; the rest expands
 * in place under "Read full profile". Photos are cropped from the top with
 * object-fit, never stretched.
 */
export default function Management() {
  return (
    <section id={c.id} aria-labelledby="management-heading" className="scroll-mt-20 bg-white">
      <div className="container-site section-pad">
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow className="text-teal-deep">{c.eyebrow}</Eyebrow>
          </Reveal>
          <h2 id="management-heading" className="mt-4 text-3xl font-bold leading-tight text-teal-deep sm:text-4xl lg:text-5xl">
            <Reveal as="span" variant="rise" delay={0.08} duration={0.8} className="block">
              {c.title}
            </Reveal>
          </h2>
          {c.intro && (
            <Reveal delay={0.15}>
              <p className="mt-5 text-base text-ink/80 md:text-lg">{c.intro}</p>
            </Reveal>
          )}
        </div>

        <ul className="mt-12 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-10 lg:gap-14">
          {c.people.map((p, i) => (
            <Reveal key={p.name} as="li" delay={0.1 + i * 0.12} className="h-full">
              <PersonCard person={p} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function PersonCard({ person: p }) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const id = useId()
  const photo = managementPhoto(p.photo)
  const [first, ...rest] = p.bio

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-teal-tint-solid">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-teal-soft/60 sm:aspect-[5/5] md:aspect-[4/5]">
        {photo ? (
          <img
            src={photo}
            alt={`${p.name}, ${p.role}`}
            className="h-full w-full object-cover object-top"
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center" role="img" aria-label={`${p.name} (portrait to follow)`}>
            <span className="flex h-28 w-28 items-center justify-center rounded-full bg-white/80 text-3xl font-bold tracking-wide text-teal-deep md:h-32 md:w-32 md:text-4xl">
              {p.initials}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <h3 className="text-2xl font-bold leading-tight text-teal-deep md:text-[1.75rem]">{p.name}</h3>
        <p className="eyebrow mt-2 text-muted">{p.role}</p>

        <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink/85 md:text-base">
          <p>{first}</p>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={id}
                key="more"
                initial={reduce ? false : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={reduce ? undefined : { height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-0">
                  {rest.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {rest.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={id}
            className="group mt-6 inline-flex w-fit items-center gap-2 rounded-full text-sm font-semibold text-teal-deep underline decoration-teal-soft decoration-2 underline-offset-4 transition-colors hover:decoration-teal-deep"
          >
            {open ? c.readLess : c.readMore}
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
              <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </article>
  )
}
