import Reveal from './Reveal'
import Button from './Button'
import { pageCta } from '../data/content'

/** Closing band on the Phase 2 pages, routing back to the request form. `tone` keeps it distinct from the section above it. */
export default function PageCta({ tone = 'tint' }) {
  return (
    <section aria-labelledby="page-cta-heading" className={tone === 'white' ? 'bg-white' : 'bg-teal-tint-solid'}>
      <div className="container-site py-16 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Reveal variant="rise" duration={0.8}>
              <h2 id="page-cta-heading" className="text-2xl font-bold leading-tight text-teal-deep sm:text-3xl">
                {pageCta.title}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-3 text-base text-ink/80">{pageCta.body}</p>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="flex-none">
            <Button href={pageCta.cta.href}>{pageCta.cta.label}</Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
