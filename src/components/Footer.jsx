import { Link } from 'react-router-dom'
import { HarvestfieldLogo } from './HarvestfieldMark'
import { navLinks, site } from '../data/siteConfig'

export default function Footer() {
  return (
    <footer className="on-dark bg-teal-deep text-white">
      <div className="container-site py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" aria-label="Harvestfield Healthcare — back to top" className="inline-block">
              <HarvestfieldLogo markClassName="h-9 w-9" />
            </a>
            <p className="mt-5 max-w-sm text-sm text-white/75">
              New-generation dual-insecticide mosquito nets, cut, sewn and packed in Nigeria.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow text-white/60">Site</p>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-white/85 hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#request-supply" className="text-sm text-white/85 hover:text-white">
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

        {/* TODO: add partner logos once client provides permission + logo files */}
        {/*
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="eyebrow text-white/60">Partners</p>
          <div className="mt-4 flex flex-wrap items-center gap-8">
            <img src={gdmLogo} alt="GDM Health Products" className="h-8" />
            <img src={whoPqLogo} alt="WHO Prequalification" className="h-8" />
          </div>
        </div>
        */}

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. {site.parent}
          </p>
          <Link to="/legal" className="hover:text-white">
            Legal
          </Link>
        </div>
      </div>
    </footer>
  )
}
