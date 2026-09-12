import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import Eyebrow from './Eyebrow'
import { pages } from '../data/content'

/**
 * Four cards pointing at the pages that carry the rest of the site. Each card
 * reuses the page's own title and standfirst, so this band adds no copy of
 * its own — it is navigation, not a summary.
 */
const ORDER = ['product', 'manufacturing', 'about', 'contact']

export default function PageLinks() {
  return (
    <section aria-labelledby="page-links-heading" className="bg-teal-tint-solid">
      <div className="container-site section-pad">
        <Reveal>
          <Eyebrow as="h2" id="page-links-heading" className="text-teal-deep">
            Explore the site
          </Eyebrow>
        </Reveal>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {ORDER.map((key, i) => {
            const pg = pages[key]
            return (
              <Reveal key={key} as="li" delay={0.08 + i * 0.08} className="h-full">
                <Link
                  to={pg.path}
                  className="group flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-teal-deep/10 transition-shadow duration-300 hover:shadow-[0_18px_40px_-28px_rgba(16,81,91,0.45)]"
                >
                  <p className="eyebrow text-muted">{pg.navLabel}</p>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-teal-deep">{pg.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{pg.standfirst}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-teal-deep">
                    Open
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="transition-transform duration-300 ease-brand group-hover:translate-x-1"
                    >
                      <path d="M2 7h10M8 3l4 4-4 4" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
