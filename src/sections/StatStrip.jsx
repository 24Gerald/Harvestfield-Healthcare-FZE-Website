import Reveal from '../components/Reveal'
import { stats } from '../data/stats'

/**
 * GDM-style stat strip: oversized number, short label beneath, four across.
 * Values come from src/data/stats.js and are placeholders until the client
 * confirms real figures.
 *
 * Short values (e.g. "12M", "2", "30%") get the full oversized treatment;
 * longer strings — including the "[VALUE]" placeholders — scale to fit their
 * column so nothing wraps or overflows.
 */
const sizeFor = (value) =>
  value.length <= 4
    ? 'text-5xl sm:text-6xl lg:text-7xl'
    : 'text-[clamp(1.5rem,6.6vw,3.5rem)] md:text-[clamp(1.5rem,3.2vw,3.5rem)]'

export default function StatStrip() {
  return (
    <section aria-label="Key figures" className="bg-white">
      <div className="container-site py-16 md:py-20">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-8 lg:gap-x-10">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="min-w-0 border-l border-teal-deep/15 pl-5">
              <dd className={`order-first font-bold leading-none tracking-heading text-teal-deep [overflow-wrap:anywhere] ${sizeFor(s.value)}`}>
                {s.value}
              </dd>
              <dt className="mt-3 max-w-[14ch] text-sm leading-snug text-muted">{s.label}</dt>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
