import { Link } from 'react-router-dom'
import { HarvestfieldLogo } from './HarvestfieldMark'
import { navLinks, site, HERO_MOSQUITO_MODEL } from '../data/siteConfig'
import { useModelStatus } from '../lib/modelStatus'
import { smoothScrollTo } from '../lib/motion'
import { partnerLogo } from '../lib/partnerLogos'

const PARENT = { name: 'Harvestfield Industries', url: 'https://www.harvestfield-ng.com' }

export default function Footer() {
  const modelLoaded = useModelStatus() === 'loaded'
  const credit = HERO_MOSQUITO_MODEL.credit
  const parentLogo = partnerLogo('harvestfield-industries', 'white')
  return (
    <footer className="on-dark bg-teal-deep text-white">
      <div className="container-site py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" onClick={(e) => { e.preventDefault(); smoothScrollTo('#top') }} aria-label="Harvestfield Healthcare — back to top" className="inline-block">
              <HarvestfieldLogo className="h-12" />
            </a>
            <p className="mt-5 max-w-sm text-sm text-white/75">
              A Nigerian healthcare manufacturer producing Synera DuoForte dual-insecticide nets in Ogun State.
            </p>
            <a
              href={PARENT.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${PARENT.name} (opens in a new tab)`}
              className="group mt-7 inline-flex items-center gap-3 text-sm text-white/75 hover:text-white"
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
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={(e) => { e.preventDefault(); smoothScrollTo(l.href) }} className="text-sm text-white/85 hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#request-supply" onClick={(e) => { e.preventDefault(); smoothScrollTo('#request-supply') }} className="text-sm text-white/85 hover:text-white">
                  Request Supply
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <p className="eyebrow text-white/60">Address</p>
            <address className="mt-4 text-sm not-italic leading-relaxed text-white/85">
              {site.name}
              <br />
              {site.address.line1}
              <br />
              {site.address.line2}
            </address>
            <a
              href={`mailto:${site.contactEmail}`}
              className="mt-3 inline-block text-sm text-white/85 underline-offset-4 hover:text-white hover:underline"
            >
              {site.contactEmail}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
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
          <Link to="/privacy" className="hover:text-white">
            Privacy &amp; data notice
          </Link>
        </div>
      </div>
    </footer>
  )
}
