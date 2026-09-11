import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { HarvestfieldLogo } from './HarvestfieldMark'
import Button from './Button'
import { navLinks, CTA } from '../data/siteConfig'
import { EASE_OUT, smoothScrollTo } from '../lib/motion'

/**
 * Sticky nav: transparent over the (dark) hero, solid teal-deep on scroll.
 * The hero is teal-deep so nav text is white in both states.
 * Motion: a pill slides between links on hover; the bar tucks away while
 * scrolling down and returns on the first upward scroll.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const onHome = pathname === '/'

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > 320 && y > prev && !open)
  })

  // Section links ease-scroll on the home page; from any other page they navigate home with the hash.
  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    if (onHome) smoothScrollTo(href)
    else navigate(`/${href}`)
  }

  // Close the menu on resize to desktop (lg — five labels plus the button need it) and lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const mq = window.matchMedia('(min-width: 1024px)')
    const close = () => mq.matches && setOpen(false)
    mq.addEventListener('change', close)
    return () => {
      document.body.style.overflow = prev
      mq.removeEventListener('change', close)
    }
  }, [open])

  return (
    <motion.header
      className={`on-dark fixed inset-x-0 top-0 z-50 text-white transition-colors duration-300 ease-brand ${
        scrolled || open || !onHome ? 'bg-teal-deep/95 shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md' : 'bg-transparent'
      }`}
      animate={reduce ? undefined : { y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
    >
      <nav aria-label="Primary" className="container-site flex h-16 items-center justify-between md:h-20">
        <a href="/" onClick={(e) => (onHome ? go(e, '#top') : (e.preventDefault(), navigate('/')))} className="rounded-sm" aria-label="Harvestfield Healthcare — home">
          <HarvestfieldLogo className="h-9 md:h-11" />
        </a>

        <ul className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setHovered(null)}>
          {navLinks.map((l) => (
            <li key={l.href} className="relative">
              {hovered === l.href && !reduce && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-white/10"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              {l.route ? (
                <Link
                  to={l.href}
                  onMouseEnter={() => setHovered(l.href)}
                  onFocus={() => setHovered(l.href)}
                  className={`relative block whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 hover:text-white ${pathname.startsWith(l.href) ? 'text-white' : 'text-white/85'}`}
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  href={l.href}
                  onMouseEnter={() => setHovered(l.href)}
                  onFocus={() => setHovered(l.href)}
                  onClick={(e) => go(e, l.href)}
                  className="relative block rounded-full px-4 py-2 text-sm font-medium text-white/85 transition-colors duration-200 hover:text-white"
                >
                  {l.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href={CTA.href} variant="solidOnDark" className="whitespace-nowrap px-5 py-2.5">
            {CTA.label}
          </Button>
        </div>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M4 4l14 14M18 4L4 18" /> : <path d="M3 6h16M3 11h16M3 16h16" />}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="border-t border-white/10 bg-teal-deep lg:hidden"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
          >
            <ul className="container-site flex flex-col py-4">
              {navLinks.map((l, i) => (
                <li key={l.href}>
                  <motion.a
                    href={l.route ? l.href : l.href}
                    onClick={(e) => (l.route ? (setOpen(false), e.preventDefault(), navigate(l.href)) : go(e, l.href))}
                    className="block py-3 text-base font-medium text-white/90"
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: EASE_OUT, delay: 0.05 + i * 0.05 }}
                  >
                    {l.label}
                  </motion.a>
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
    </motion.header>
  )
}
