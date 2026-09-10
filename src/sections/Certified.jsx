import { motion, useReducedMotion } from 'framer-motion'
import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import { certified as c } from '../data/content'
import { EASE_OUT } from '../lib/motion'
import { partnerLogo, certifiedPhoto } from '../lib/partnerLogos'

/**
 * "Certified by" — three quality credentials, each with a photo and the
 * certifier's mark. Photos live in src/assets/certified/, marks in
 * src/assets/partners/ (see the READMEs); labelled placeholders stand in until
 * the files exist.
 */
function PhotoPlaceholder({ label }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(135deg,#15606b_0%,#0b3b43_100%)]">
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-[0.12]" preserveAspectRatio="none">
        <defs>
          <pattern id="hf-mesh" width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 7h14M7 0v14" stroke="#fff" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hf-mesh)" />
      </svg>
      <span className="absolute bottom-3 left-4 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
        Photo: {label}
      </span>
    </div>
  )
}

export default function Certified() {
  const reduce = useReducedMotion()
  return (
    <section id={c.id} className="on-dark scroll-mt-20 bg-teal-deep text-white">
      <div className="container-site section-pad">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow className="text-white/70">{c.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal variant="rise" delay={0.08} duration={0.8}>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{c.title}</h2>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {c.items.map((it, i) => {
            const photo = certifiedPhoto(it.key)
            const logo = partnerLogo(it.key)
            return (
              <Reveal key={it.key} as="li" delay={0.1 + i * 0.12} duration={0.7}>
                <motion.article
                  className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white text-ink shadow-[0_24px_60px_-40px_rgba(0,0,0,0.6)]"
                  whileHover={reduce ? undefined : { y: -6 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                >
                  <div className="relative aspect-[3/2] w-full">
                    {photo ? (
                      <img src={photo} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
                    ) : (
                      <PhotoPlaceholder label={it.photo} />
                    )}
                    {/* certifier's mark, overlapping the photo edge */}
                    <span className="absolute -bottom-8 right-5 flex h-20 w-20 items-center justify-center rounded-full bg-white p-2 shadow-[0_10px_30px_-12px_rgba(16,81,91,0.45)] ring-4 ring-white">
                      {logo ? (
                        <img src={logo} alt={it.logoAlt} className="max-h-full max-w-full object-contain" draggable="false" />
                      ) : (
                        <span className="text-center text-[11px] font-bold uppercase leading-tight tracking-wide text-teal-deep">{it.key}</span>
                      )}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col px-6 pb-7 pt-8">
                    <p className="eyebrow text-teal-deep/70">{it.kicker}</p>
                    <h3 className="mt-2 text-xl font-bold text-teal-deep">{it.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{it.body}</p>
                  </div>
                </motion.article>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
