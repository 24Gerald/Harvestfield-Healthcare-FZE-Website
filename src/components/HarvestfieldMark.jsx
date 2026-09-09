import logoFull from '../assets/logo-full-white.png'
import logoMark from '../assets/logo-mark-white.png'

/**
 * Client-supplied logo (white lockup, for dark backgrounds).
 * Source: HH_FULL_WHITE_LOGO — exported from the brand files as a PNG with
 * transparency; the vector master should replace these PNGs if it becomes available.
 * Both components render on teal-deep only; there is no dark-on-light variant yet.
 */

/** The cross mark alone. */
export default function HarvestfieldMark({ className = 'h-8 w-8', title = 'Harvestfield Healthcare' }) {
  return <img src={logoMark} alt={title} className={className} draggable="false" />
}

/** Full lockup: mark, divider, "Harvestfield Healthcare — Free Zone Enterprise". */
export function HarvestfieldLogo({ className = 'h-10 md:h-11', title = 'Harvestfield Healthcare Free Zone Enterprise' }) {
  return <img src={logoFull} alt={title} className={`w-auto ${className}`} draggable="false" />
}
