import Reveal from '../components/Reveal'
import { today } from '../data/content'

/**
 * "Where we are today" — four status statements, four across, each on its own
 * hairline rule. Replaces the old four-figure counter strip: for a company in
 * its first month of production, verifiable status reads stronger than scale,
 * and every figure in the old strip was either unsupported or a future target
 * presented as present capacity.
 *
 * Each item is a short bold lead sentence with the supporting detail beneath.
 */
export default function Today() {
  return (
    <section aria-labelledby="today-heading" className="bg-white">
      <div className="container-site section-pad">
        <Reveal variant="rise" duration={0.8}>
          <h2 id="today-heading" className="max-w-2xl text-3xl font-bold text-teal-deep sm:text-4xl lg:text-5xl">
            {today.title}
          </h2>
        </Reveal>

        <ul className="mt-10 grid gap-x-6 gap-y-9 sm:grid-cols-2 md:mt-12 lg:grid-cols-4 lg:gap-x-10">
          {today.items.map((it, i) => (
            <Reveal key={it.lead} as="li" delay={i * 0.1} duration={0.8} className="min-w-0 border-l border-teal-deep/15 pl-5">
              <p className="text-lg font-bold leading-snug tracking-heading text-teal-deep sm:text-xl">{it.lead}</p>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{it.detail}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
