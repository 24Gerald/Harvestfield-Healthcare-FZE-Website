import { Link } from 'react-router-dom'
import { HarvestfieldLogo } from './HarvestfieldMark'
import { navLinks, CTA, site, HERO_MOSQUITO_MODEL } from '../data/siteConfig'
import { useModelStatus } from '../lib/modelStatus'
import { smoothScrollTo } from '../lib/motion'
import { partnerLogo } from '../lib/partnerLogos'

const PARENT = { name: 'Harvestfield Industries', url: 'https://www.harvestfield-ng.com' }

/**
 * Below md the footer is a two-column grid: the logo and tagline across the
 * top, then the site links down the left and the address, email and
 * parent-company chip down the right, both columns starting on the same
 * line. From md up the layout is the original three columns — every mobile
 * class here has an md: counterpart restoring the original value.
 */
export default function Footer() {
  const modelLoaded = useModelStatus() === 'loaded'
  const credit = HERO_MOSQUITO_MODEL.credit
  const parentLogo = partnerLogo('harvestfield-industries', 'white')
  return (
    <footer className="on-dark bg-teal-deep text-white">
      <div className="container-site py-10 md:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10">
          {/* Brand: full width on mobile; the parent chip shows here from md, in the address column below md */}
          <div className="col-span-2 md:col-span-1">
            <a href="#top" onClick={(e) => { e.preventDefault(); smoothScrollTo('#top') }} aria-label="Harvestfield Healthcare — back to top" className="inline-block">
              <HarvestfieldLogo className="h-10 md:h-12" />
            </a>
            <p className="mt-4 max-w-sm text-sm text-white/75 md:mt-5">
              A Nigerian healthcare manufacturer producing Synera DuoForte dual-insecticide nets in Ogun State.
            </p>
            <a
              href={`mailto:${site.contactEmail}`}
              className="mt-3 inline-block text-sm text-white/85 underline-offset-4 hover:text-white hover:underline md:hidden"
            >
              {site.contactEmail}
            </a>
            <a
              href={PARENT.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${PARENT.name} (opens in a new tab)`}
              className="group mt-7 hidden items-center gap-3 text-sm text-white/75 hover:text-white md:inline-flex"
            >
              {parentLogo ? (
                <span className="inline-flex items-center rounded-lg bg-white px-2.5 py-1.5 transition-opacity group-hover:opacity-90">
                  <img src={parentLogo} alt={PARENT.name} className="h-8 w-auto" draggable="false" />
                </span>
              ) : (
                <span className="rounded-md border border-white/25 px-2.5 py-1 text-xs font-semibold tracking-wide text-white/85">{PARENT.name}</span>
              )}
              <span>A {PARENT.name} company ↗</span>
            </a>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow text-white/60">Site</p>
            <ul className="mt-3 space-y-2 md:mt-4 md:space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  {l.route ? (
                    <Link to={l.href} className="text-sm text-white/85 hover:text-white">
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} onClick={(e) => { e.preventDefault(); smoothScrollTo(l.href) }} className="text-sm text-white/85 hover:text-white">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
              <li>
                <Link to={CTA.href} className="text-sm text-white/85 hover:text-white">
                  {CTA.label}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="eyebrow text-white/60">Address</p>
            <address className="mt-3 text-[13px] not-italic leading-relaxed text-white/85 md:mt-4 md:text-sm">
              {site.name}
              <br />
              {site.address.line1}
              <br />
              {site.address.line2}
            </address>
            <a
              href={`mailto:${site.contactEmail}`}
              className="mt-3 hidden text-sm text-white/85 underline-offset-4 hover:text-white hover:underline md:inline-block"
            >
              {site.contactEmail}
            </a>
            <a
              href={PARENT.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${PARENT.name} (opens in a new tab)`}
              className="mt-5 inline-flex items-center rounded-lg bg-white px-2.5 py-1.5 md:hidden"
            >
              {parentLogo ? (
                <img src={parentLogo} alt={PARENT.name} className="h-7 w-auto" draggable="false" />
              ) : (
                <span className="text-xs font-semibold tracking-wide text-teal-deep">{PARENT.name}</span>
              )}
            </a>
          </div>
        </div>

        {/* One line where it fits; on a narrow phone the privacy link drops to its own line whole, rather than the copyright breaking mid-sentence */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-t border-white/10 pt-5 text-xs text-white/60 md:mt-12 md:pt-6">
          <p className="whitespace-nowrap">
            © {new Date().getFullYear()} {site.name}.
            {modelLoaded && credit && (
              <>
                {' '}
                3D mosquito:{' '}
                <a href={credit.url} target="_blank" rel="nofollow noopener noreferrer" className="underline-offset-2 hover:text-white hover:underline">
                  {credit.title}
                </a>{' '}
                by{' '}
                <a href={credit.authorUrl} target="_blank" rel="nofollow noopener noreferrer" className="underline-offset-2 hover:text-white hover:underline">
                  {credit.author}
                </a>{' '}
                on{' '}
                <a href={credit.platformUrl} target="_blank" rel="nofollow noopener noreferrer" className="underline-offset-2 hover:text-white hover:underline">
                  {credit.platform}
                </a>
                .
              </>
            )}
          </p>
          <Link to="/privacy" className="whitespace-nowrap hover:text-white">
            Privacy &amp; data notice
          </Link>
        </div>
      </div>
    </footer>
  )
}
