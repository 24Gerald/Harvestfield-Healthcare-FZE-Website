/**
 * Illustrated net mesh (SVG). Two uses:
 *   variant="hero"  — background for the hero on mobile / reduced-motion,
 *                     with two mosquito forms that drift to the net and are stopped
 *                     (CSS keyframes in src/styles/index.css).
 *   variant="render"— the static, elegant net render in The Net section, with
 *                     callouts for the two active ingredients.
 *
 * No product photography exists yet — this is an illustration, not a photo.
 * When a real render/photo is available, swap the <NetIllustration variant="render" />
 * in src/sections/TheNet.jsx for an <img> with descriptive alt text.
 */
const W = 600
const H = 460

function Lattice({ step = 26, stroke, opacity, curved = true }) {
  const cols = []
  const rows = []
  for (let x = step; x < W; x += step) {
    cols.push(curved ? `M${x} 0 Q${x + 6} ${H / 2} ${x} ${H}` : `M${x} 0 V${H}`)
  }
  for (let y = step; y < H; y += step) {
    rows.push(curved ? `M0 ${y} Q${W / 2} ${y + 8} ${W} ${y}` : `M0 ${y} H${W}`)
  }
  return (
    <g fill="none" stroke={stroke} strokeWidth="1" opacity={opacity} strokeLinecap="round">
      {cols.map((d) => (
        <path key={d} d={d} />
      ))}
      {rows.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  )
}

function MosquitoGlyph({ x, y, className = '', fill = '#ffffff' }) {
  return (
    <g className={`hf-mosquito ${className}`} transform={`translate(${x} ${y})`} fill={fill}>
      <g transform="translate(0 0)">
        <ellipse cx="0" cy="0" rx="13" ry="3.2" opacity="0.85" />
        <circle cx="14" cy="-0.5" r="3.4" opacity="0.85" />
        <path d="M17 -0.5 L28 -2" stroke={fill} strokeWidth="1" opacity="0.7" />
        <ellipse className="hf-wing" cx="-2" cy="-7" rx="9" ry="3.6" opacity="0.5" transform="rotate(-18 -2 -7)" />
        <ellipse className="hf-wing" cx="-2" cy="7" rx="9" ry="3.6" opacity="0.5" transform="rotate(18 -2 7)" />
      </g>
    </g>
  )
}

export default function NetIllustration({ variant = 'render', animated = true, className = '' }) {
  if (variant === 'hero') {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="hf-hero-fade" cx="55%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="hf-hero-mask">
            <rect width={W} height={H} fill="url(#hf-hero-fade)" />
          </mask>
        </defs>
        <g mask="url(#hf-hero-mask)" className={animated ? 'hf-net-breathe' : ''} transform="skewY(-7)">
          <Lattice stroke="#a9d3d8" opacity="0.8" />
        </g>
        {/* Mosquitoes drift in from the left and are stopped at the lattice. */}
        <MosquitoGlyph x={330} y={150} />
        <MosquitoGlyph x={360} y={290} className="hf-mosquito--b" />
      </svg>
    )
  }

  // variant === 'render'
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-labelledby="hf-net-render-title">
      <title id="hf-net-render-title">
        Illustration of the Synera DuoForte polyester net mesh, showing the two active ingredients bound into its fibres
      </title>
      <defs>
        <linearGradient id="hf-render-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0b3b43" />
          <stop offset="100%" stopColor="#10515b" />
        </linearGradient>
        <radialGradient id="hf-render-fade" cx="50%" cy="48%" r="58%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="80%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="hf-render-mask">
          <rect width={W} height={H} fill="url(#hf-render-fade)" />
        </mask>
        <radialGradient id="hf-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a9d3d8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a9d3d8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} rx="24" fill="url(#hf-render-bg)" />
      <circle cx="300" cy="225" r="220" fill="url(#hf-glow)" />
      <g mask="url(#hf-render-mask)" transform="rotate(-4 300 230)">
        <Lattice step={22} stroke="#a9d3d8" opacity="0.75" />
        {/* Fibre highlights — a few strands drawn heavier to suggest depth */}
        <g fill="none" stroke="#ffffff" strokeWidth="1.6" opacity="0.5" strokeLinecap="round">
          <path d="M242 0 Q248 230 242 460" />
          <path d="M0 220 Q300 228 600 220" />
          <path d="M374 0 Q380 230 374 460" />
        </g>
      </g>

      {/* Active-ingredient callouts */}
      <g fontFamily="Montserrat, sans-serif" fill="#ffffff">
        <g transform="translate(78 96)">
          <circle r="5" fill="#ffffff" />
          <circle r="11" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
          <line x1="12" y1="0" x2="48" y2="0" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
          <text x="56" y="-4" fontSize="12" fontWeight="600" letterSpacing="1.2">ALPHA-CYPERMETHRIN</text>
          <text x="56" y="14" fontSize="11" opacity="0.75">3.75 g/kg · knockdown</text>
        </g>
        <g transform="translate(330 350)">
          <circle r="5" fill="#ffffff" />
          <circle r="11" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
          <line x1="12" y1="0" x2="48" y2="0" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
          <text x="56" y="-4" fontSize="12" fontWeight="600" letterSpacing="1.2">CHLORFENAPYR</text>
          <text x="56" y="14" fontSize="11" opacity="0.75">5.6 g/kg · resistance-breaking</text>
        </g>
      </g>
      <text x="26" y="436" fontFamily="Montserrat, sans-serif" fontSize="10" fontWeight="600" letterSpacing="1.6" fill="#ffffff" opacity="0.55">
        ILLUSTRATION — POLYESTER KNIT, DUAL-AI
      </text>
    </svg>
  )
}
