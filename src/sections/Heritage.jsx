import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import { heritage as c } from '../data/content'
import { partnerLogo } from '../lib/partnerLogos'

/**
 * "The Harvestfield Group" — the distribution-to-manufacturing record.
 *
 * Replaces the old "Working alongside" block. Only the parent company appears
 * here: PVAC and OgunInvest were removed because presenting a federal
 * initiative and a state agency as partners implies an affiliation that is not
 * documented.
 */
export default function Heritage() {
  const logo = partnerLogo(c.parent.logo)
  return (
    <section id={c.id} aria-labelledby="heritage-heading" className="scroll-mt-20 bg-white">
      <div className="container-site section-pad">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow className="text-teal-deep">{c.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal variant="rise" delay={0.08} duration={0.8}>
              <h2 id="heritage-heading" className="mt-4 text-3xl font-bold leading-tight text-teal-deep sm:text-4xl lg:text-5xl">
                {c.title}
              </h2>
            </Reveal>

            <Reveal delay={0.25} className="mt-8">
              <a
                href={c.parent.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${c.parent.name} (opens in a new tab)`}
                className="group inline-flex items-center gap-3 rounded-2xl bg-teal-tint-solid px-4 py-3 ring-1 ring-teal-deep/10 transition-shadow hover:shadow-[0_10px_30px_-18px_rgba(16,81,91,0.6)]"
              >
                {logo ? (
                  <img src={logo} alt={c.parent.name} className="h-9 w-auto max-w-[120px] object-contain" draggable="false" />
                ) : (
                  <span className="text-sm font-bold tracking-tight text-teal-deep">{c.parent.name}</span>
                )}
                <span className="text-sm font-semibold text-teal-deep group-hover:underline group-hover:underline-offset-4">
                  {c.parent.name}
                </span>
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="space-y-5 text-base text-ink/85 md:text-lg lg:col-span-7 lg:pt-2">
            {c.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
