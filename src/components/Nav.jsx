import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { HarvestfieldLogo } from './HarvestfieldMark'
import Button from './Button'
import { navLinks, CTA } from '../data/siteConfig'

/**
 * Sticky nav: transparent over the (dark) hero, solid teal-deep once scrolled.
 * The hero is teal-deep so nav text is white in both states.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on resize to desktop and lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const mq = window.matchMedia('(min-width: 768px)')
    const close = () => mq.matches && setOpen(false)
    mq.addEventListener('change', close)
    return () => {
      document.body.style.overflow = prev
      mq.removeEventListener('change', close)
    }
  }, [open])

  return (
    <header
      className={`on-dark fixed inset-x-0 top-0 z-50 text-white transition-colors duration-300 ease-brand ${
        scrolled || open ? 'bg-teal-deep shadow-[0_1px_0_rgba(255,255,255,0.08)]' : 'bg-transparent'
      }`}
    >
      <nav aria-label="Primary" className="container-site flex h-16 items-center justify-between md:h-20">
        <a href="#top" className="rounded-sm" aria-label="Harvestfield Healthcare — home">
          <HarvestfieldLogo />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-white/85 transition-colors duration-200 hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button href={CTA.href} variant="solidOnDark" className="px-5 py-2.5">
            {CTA.label}
          </Button>
        </div>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M4 4l14 14M18 4L4 18" />
            ) : (
              <path d="M3 6h16M3 11h16M3 16h16" />
            )}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="border-t border-white/10 bg-teal-deep md:hidden"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="container-site flex flex-col py-4">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-base font-medium text-white/90"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="pt-3">
                <Button href={CTA.href} variant="solidOnDark" className="w-full" onClick={() => setOpen(false)}>
                  {CTA.label}
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
