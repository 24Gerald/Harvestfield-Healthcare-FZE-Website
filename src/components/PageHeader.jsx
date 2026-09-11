import Reveal from './Reveal'
import Eyebrow from './Eyebrow'
import SplitText from './SplitText'
import { usePageMeta } from '../lib/pageMeta'

/**
 * Top band for every page other than the home page. The nav is fixed and
 * transparent over a dark hero, so a page that opened on a white section would
 * put white nav text on white; this band keeps that contract on all pages.
 *
 * Also sets the page's title, description, canonical and Open Graph tags,
 * since the site is a single HTML shell.
 */
export default function PageHeader({ page }) {
  usePageMeta(page)

  return (
    <section className="on-dark bg-teal-deep text-white">
      <div className="container-site pb-14 pt-32 md:pb-20 md:pt-40">
        <Reveal>
          <Eyebrow className="text-white/70">{page.eyebrow}</Eyebrow>
        </Reveal>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
          <SplitText text={page.title} delay={0.1} stagger={0.06} duration={0.8} />
        </h1>
        {page.standfirst && (
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl">{page.standfirst}</p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
