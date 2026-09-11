import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import { malaria as c } from '../data/content'
import { smoothScrollTo } from '../lib/motion'

/**
 * "Why this matters" — the resistance argument, placed between the company
 * introduction and the product so the reader knows why the net exists before
 * being told what it is. No figures are published here without a dated source,
 * so both claims are written qualitatively.
 */
export default function Malaria() {
  return (
    <section id={c.id} aria-labelledby="malaria-heading" className="on-dark scroll-mt-20 bg-teal-deep text-white">
      <div className="container-site section-pad">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow className="text-white/70">{c.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal variant="rise" delay={0.08} duration={0.8}>
              <h2 id="malaria-heading" className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                {c.title}
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:pt-2">
            <Reveal delay={0.15} className="space-y-5 text-base text-white/80 md:text-lg">
              {c.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
            <Reveal delay={0.3}>
              <a
                href={c.link.href}
                onClick={(e) => {
                  e.preventDefault()
                  smoothScrollTo(c.link.href)
                }}
                className="group mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white underline-offset-4 hover:underline"
              >
                {c.link.label}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-brand group-hover:translate-x-1"
                >
                  <path d="M2 7h10M8 3l4 4-4 4" />
                </svg>
              </a>
            </Reveal>
            {c.source && (
              <Reveal delay={0.35}>
                <p className="mt-6 text-xs text-white/55">
                  <a href={c.source.href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-white/80 hover:underline">
                    {c.source.label}
                  </a>
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
