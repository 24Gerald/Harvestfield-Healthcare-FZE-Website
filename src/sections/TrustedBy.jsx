import { motion, useReducedMotion } from 'framer-motion'
import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import gdmLogo from '../assets/gdm-logo-white.png'
import { trustedBy } from '../data/content'
import { EASE_OUT } from '../lib/motion'

/**
 * "Trusted by" band. Partner logos are supplied by the client with permission;
 * each links out to the partner's site. Add more partners in src/data/content.js.
 */
const logos = { gdm: gdmLogo }

export default function TrustedBy() {
  const reduce = useReducedMotion()
  return (
    <section aria-labelledby="trusted-by-heading" className="on-dark bg-teal-deep text-white">
      <div className="container-site py-14 md:py-16">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <Reveal>
            <Eyebrow as="h2" id="trusted-by-heading" className="text-white/70">
              {trustedBy.eyebrow}
            </Eyebrow>
            <p className="mt-3 max-w-md text-base text-white/80">{trustedBy.body}</p>
          </Reveal>
          <ul className="flex flex-wrap items-center gap-10">
            {trustedBy.partners.map((p, i) => (
              <Reveal key={p.name} as="li" delay={0.1 + i * 0.1}>
                <motion.a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.name} — ${p.role} (opens in a new tab)`}
                  className="group flex flex-col items-start gap-2"
                  whileHover={reduce ? undefined : { y: -3 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                >
                  <img
                    src={logos[p.logo]}
                    alt={p.name}
                    className="h-12 w-auto opacity-90 transition-opacity duration-300 group-hover:opacity-100 md:h-14"
                    draggable="false"
                  />
                  <span className="text-xs text-white/60 transition-colors group-hover:text-white/85">{p.role}</span>
                </motion.a>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
