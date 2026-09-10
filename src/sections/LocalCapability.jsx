import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import { renderInline } from '../components/InlineMarkup'
import { localCapability as c } from '../data/content'

/**
 * "Local manufacturing" — what manufacturing malaria commodities inside Nigeria
 * changes, argued specifically rather than generically.
 *
 * The supporter logos that used to close this section (PVAC, OgunInvest) were
 * removed: presenting a federal initiative and a state agency as partners
 * implies an affiliation that is not documented. No administration or
 * programme is named, so the section reads the same in ten years.
 */
export default function LocalCapability() {
  return (
    <section id={c.id} aria-labelledby="local-manufacturing-heading" className="scroll-mt-20 bg-teal-tint-solid">
      <div className="container-site section-pad">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow className="text-teal-deep">{c.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal variant="rise" delay={0.08} duration={0.8}>
              <h2 id="local-manufacturing-heading" className="mt-4 text-3xl font-bold leading-tight text-teal-deep sm:text-4xl lg:text-5xl">
                {c.title}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="space-y-5 text-base text-ink/85 md:text-lg lg:col-span-7 lg:pt-2">
            {c.body.map((p) => (
              <p key={p}>{renderInline(p)}</p>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
