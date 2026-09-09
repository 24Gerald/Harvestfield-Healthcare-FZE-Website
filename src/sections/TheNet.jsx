import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import NetIllustration from '../components/NetIllustration'
import { net } from '../data/content'

export default function TheNet() {
  return (
    <section id={net.id} className="scroll-mt-20 bg-white">
      <div className="container-site section-pad">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Copy */}
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow className="text-teal-deep">{net.eyebrow}</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold text-teal-deep sm:text-4xl lg:text-5xl">{net.title}</h2>
            </Reveal>
            <Reveal delay={0.08} className="mt-6 space-y-5 text-base text-ink/85 md:text-lg">
              {net.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>

            {/* Active ingredients */}
            <Reveal delay={0.14} className="mt-8 grid gap-4 sm:grid-cols-2">
              {net.ingredients.map((ai) => (
                <div key={ai.name} className="rounded-2xl border border-teal-deep/15 p-5">
                  <p className="eyebrow text-muted">{ai.role}</p>
                  <p className="mt-2 text-lg font-semibold text-teal-deep">{ai.name}</p>
                  <p className="text-2xl font-bold tracking-heading text-ink">{ai.dose}</p>
                  <p className="mt-2 text-sm text-muted">{ai.detail}</p>
                </div>
              ))}
            </Reveal>

            {/* Spec chips */}
            <Reveal delay={0.2} className="mt-6 flex flex-wrap gap-2" as="ul" aria-label="Specifications">
              {net.specs.map((s) => (
                <li key={s} className="rounded-full bg-teal-tint px-4 py-1.5 text-sm font-medium text-teal-deep">
                  {s}
                </li>
              ))}
            </Reveal>
          </div>

          {/* Illustration + benefits */}
          <div className="lg:col-span-6">
            <Reveal delay={0.1}>
              <NetIllustration variant="render" className="w-full rounded-3xl" />
              <p className="mt-3 text-xs text-muted">{net.designerNote}</p>
            </Reveal>
            <ul className="mt-8 space-y-5">
              {net.benefits.map((b, i) => (
                <Reveal key={b.title} as="li" delay={0.15 + i * 0.08} className="flex gap-4">
                  <span className="mt-1 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-teal-deep text-white" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.5l3 3 6-7" /></svg>
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-teal-deep">{b.title}</h3>
                    <p className="mt-1 text-sm text-muted md:text-base">{b.detail}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
