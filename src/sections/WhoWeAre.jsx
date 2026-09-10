import Reveal from '../components/Reveal'
import { renderInline } from '../components/InlineMarkup'
import { whoWeAre } from '../data/content'

/**
 * "Who we are" — one quiet paragraph on a plain band directly beneath the hero.
 * Deliberately unstyled: no eyebrow, no heading, no imagery. It establishes the
 * company category without taking anything from the malaria narrative that
 * follows, so anything that competes for attention here works against it.
 */
export default function WhoWeAre() {
  return (
    <section aria-label="Who we are" className="bg-teal-tint-solid">
      <div className="container-site py-12 md:py-16">
        <Reveal>
          <p className="max-w-3xl text-lg leading-relaxed text-ink/85 md:text-xl">{renderInline(whoWeAre.body)}</p>
        </Reveal>
      </div>
    </section>
  )
}
