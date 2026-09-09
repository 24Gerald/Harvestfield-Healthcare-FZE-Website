import Reveal from '../components/Reveal'
import Counter from '../components/Counter'
import { stats } from '../data/stats'

/**
 * GDM-style stat strip: oversized number, short label beneath, four across.
 * Numbers count up from zero the first time they scroll into view (placeholders
 * such as "[VALUE]" render as-is). Values come from src/data/stats.js.
 *
 * The number is oversized; an optional unit ("million", "years") sits beside it
 * at a smaller size so the figure keeps its weight.
 */

export default function StatStrip() {
  return (
    <section aria-label="Key figures" className="bg-white">
      <div className="container-site py-16 md:py-20">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-8 lg:gap-x-10">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} variant="rise" duration={0.8} className="min-w-0 border-l border-teal-deep/15 pl-5">
              <dd className="order-first flex flex-wrap items-baseline gap-x-2 font-bold leading-none tracking-heading text-teal-deep">
                <Counter value={s.value} className="text-5xl sm:text-6xl lg:text-7xl" />
                {s.unit && <span className="text-xl font-semibold text-teal-deep/75 sm:text-2xl">{s.unit}</span>}
              </dd>
              <dt className="mt-3 max-w-[14ch] text-sm leading-snug text-muted">{s.label}</dt>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
