import Reveal from '../components/Reveal'
import Eyebrow from '../components/Eyebrow'
import { purpose as c } from '../data/content'

/**
 * "Our purpose" — deliberately placed late on the page, so it reads as a
 * conclusion the visitor has been led to rather than a claim made before
 * anything has been earned. One heading, one paragraph, nothing else.
 */
export default function Purpose() {
  return (
    <section aria-labelledby="purpose-heading" className="on-dark bg-teal-deep text-white">
      <div className="container-site py-16 md:py-24">
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow className="text-white/70">{c.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal variant="rise" delay={0.08} duration={0.8}>
            <h2 id="purpose-heading" className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {c.title}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 text-base text-white/80 md:text-lg">{c.body}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
