// TODO: replace with client-supplied vector logo (SVG/AI/EPS)
//
// Placeholder reconstruction of the Harvestfield interlocking dual-cross mark:
// two overlapping plus shapes with a rounded interlock at the centre. Stroke
// colour follows `currentColor`, so set `text-teal-deep` on light backgrounds
// and `text-white` on dark ones.

export default function HarvestfieldMark({ className = 'h-8 w-8', title = 'Harvestfield Healthcare' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Left cross */}
      <path d="M22 12v40" />
      <path d="M10 24h20" />
      {/* Right cross, offset so the arms interlock through the centre */}
      <path d="M42 12v40" />
      <path d="M34 40h20" />
      {/* Rounded interlock */}
      <path d="M30 24c0 4.4 3.6 8 8 8" strokeWidth="4" />
      <path d="M34 40c0-4.4-3.6-8-8-8" strokeWidth="4" />
    </svg>
  )
}

/** Mark + wordmark lockup used in the nav and footer. */
export function HarvestfieldLogo({ className = '', markClassName = 'h-8 w-8', stacked = false }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <HarvestfieldMark className={markClassName} />
      <span className={`leading-none ${stacked ? 'flex flex-col gap-1' : ''}`}>
        <span className="block text-[15px] font-bold tracking-heading">Harvestfield</span>
        <span className="block text-[10px] font-semibold uppercase tracking-eyebrow opacity-80">Healthcare FZE</span>
      </span>
    </span>
  )
}
