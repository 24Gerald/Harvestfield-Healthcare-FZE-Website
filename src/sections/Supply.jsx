import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import Button from '../components/Button'
import { supply } from '../data/content'

function Column({ data, delay, soft = false }) {
  return (
    <Reveal delay={delay} className="flex h-full flex-col rounded-3xl bg-white/[0.06] p-7 ring-1 ring-white/10 md:p-9">
      <p className="eyebrow text-white/60">{data.audience}</p>
      <h3 className="mt-3 text-2xl font-bold text-white md:text-3xl">{data.title}</h3>
      <p className="mt-4 text-base text-white/80">{data.body}</p>
      <ul className="mt-6 space-y-2.5">
        {data.points.map((p) => (
          <li key={p} className="flex items-center gap-3 text-sm text-white/85">
            <span className="h-1.5 w-1.5 flex-none rounded-full bg-teal-soft" aria-hidden="true" />
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex-1" />
      <div>
        {soft ? (
          <a
            href={data.cta.href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white underline-offset-4 hover:underline"
          >
            {data.cta.label}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4" /></svg>
          </a>
        ) : (
          <Button href={data.cta.href} variant="solidOnDark">
            {data.cta.label}
          </Button>
        )}
      </div>
    </Reveal>
  )
}

export default function Supply() {
  return (
    <section id={supply.id} className="on-dark scroll-mt-20 bg-teal-deep text-white">
      <div className="container-site section-pad">
        <Reveal className="max-w-2xl">
          <Eyebrow className="text-white/70">{supply.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{supply.title}</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
          <Column data={supply.programs} delay={0.05} />
          <Column data={supply.families} delay={0.12} soft />
        </div>
      </div>
    </section>
  )
}
