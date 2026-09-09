import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import { factory } from '../data/content'

/* Simple line icons for the four process steps — icons, not photos (no factory photography yet). */
const icons = {
  'Netting in': (
    <path d="M4 8h24v16H4zM4 12h24M4 16h24M4 20h24M10 8v16M16 8v16M22 8v16" />
  ),
  Cut: <path d="M8 6l16 20M24 6L8 26M12 8a3 3 0 100 .01M20 24a3 3 0 100 .01" />,
  Sew: <path d="M6 24c4-6 6-6 10 0s6 6 10 0M14 6l4 4-4 4M18 10H6" />,
  'Pack and ship': <path d="M4 12l12-6 12 6v10l-12 6-12-6zM4 12l12 6 12-6M16 18v10" />,
}

export default function Factory() {
  return (
    <section id={factory.id} className="scroll-mt-20 bg-teal-tint-solid">
      <div className="container-site section-pad">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Eyebrow className="text-teal-deep">{factory.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold text-teal-deep sm:text-4xl lg:text-5xl">{factory.title}</h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-5 text-base text-ink/85 md:text-lg lg:col-span-7 lg:pt-2">
            {factory.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
        </div>

        {/* Process strip */}
        <ol className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4" aria-label="Manufacturing process">
          {factory.process.map((step, i) => (
            <Reveal key={step.step} as="li" delay={0.1 + i * 0.08} className="relative">
              <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_1px_0_rgba(16,81,91,0.08)]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-tint text-teal-deep">
                    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {icons[step.step]}
                    </svg>
                  </span>
                  <span className="text-xs font-semibold text-muted">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-teal-deep">{step.step}</h3>
                <p className="mt-2 text-sm text-muted">{step.detail}</p>
              </div>
              {/* Connector arrow between steps on large screens */}
              {i < factory.process.length - 1 && (
                <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-teal-deep/30 lg:block" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                </span>
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
