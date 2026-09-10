import { useReducedMotion } from 'framer-motion'
import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import { renderInline } from '../components/InlineMarkup'
import { localCapability as c } from '../data/content'
import { partnerLogo } from '../lib/partnerLogos'

/**
 * "Local manufacturing" — the local-capability story and the public/private
 * supporters behind it. Supporter logos are optional files in
 * src/assets/partners/ (see README.txt there); a wordmark stands in until a
 * logo file exists. Each supporter links out to its own site.
 */
const MIN_TILES = 9 // enough pills in one copy to outrun any screen width

function SupporterTicker({ supporters, reduce }) {
  const set = []
  while (set.length < MIN_TILES) set.push(...supporters)
  const copies = reduce ? [supporters] : [set, set]

  return (
    <div
      className={`hf-marquee hf-marquee--logos ${reduce ? 'hf-marquee--static' : ''}`}
      style={{ '--hf-marquee-dur': `${set.length * 6}s` }}
      role="region"
      aria-label={supporters.map((s) => s.fullName).join(', ')}
    >
      <div className="hf-marquee-track">
        {copies.map((list, copy) => (
          <ul key={copy} className="hf-marquee-set" aria-hidden={copy > 0 ? 'true' : undefined}>
            {list.map((s, i) => {
              const logo = partnerLogo(s.logo)
              return (
                <li key={`${copy}-${i}`} className="hf-marquee-tile">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={copy > 0 ? -1 : undefined}
                    aria-label={`${s.fullName} (opens in a new tab)`}
                    className="group flex items-center gap-3 px-5 py-2.5"
                  >
                    <span className="flex h-9 w-16 flex-none items-center justify-center">
                      {logo ? (
                        <img src={logo} alt="" className="h-full w-full object-contain" draggable="false" />
                      ) : (
                        <span className="text-xs font-bold tracking-tight text-teal-deep">{s.name}</span>
                      )}
                    </span>
                    <span className="whitespace-nowrap text-sm font-semibold text-teal-deep group-hover:underline group-hover:underline-offset-4">
                      {s.name}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        ))}
      </div>
    </div>
  )
}

export default function LocalCapability() {
  const reduce = useReducedMotion()
  return (
    <section id={c.id} className="scroll-mt-20 bg-teal-tint-solid">
      <div className="container-site section-pad">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow className="text-teal-deep">{c.eyebrow}</Eyebrow>
            </Reveal>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-teal-deep sm:text-4xl lg:text-5xl">
              {c.title.map((line, i) => (
                <Reveal key={line} as="span" variant="rise" delay={0.08 + i * 0.1} duration={0.8} className="block">
                  {line}
                </Reveal>
              ))}
            </h2>
          </div>
          <Reveal delay={0.15} className="space-y-5 text-base text-ink/85 md:text-lg lg:col-span-7 lg:pt-2">
            {c.body.map((p) => (
              <p key={p}>{renderInline(p)}</p>
            ))}
          </Reveal>
        </div>

        {/* Supported by — a slow logo ticker, so three partners take one slim row
            instead of a block of cards. Pauses on hover, static under reduced motion. */}
        <div className="mt-10 border-t border-teal-deep/10 pt-7">
          <Reveal>
            <Eyebrow as="h3" className="text-muted">
              {c.supportersLabel}
            </Eyebrow>
          </Reveal>
          <Reveal className="mt-5" duration={0.7}>
            <SupporterTicker supporters={c.supporters} reduce={reduce} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
