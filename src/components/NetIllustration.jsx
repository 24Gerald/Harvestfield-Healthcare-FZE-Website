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

function MosquitoGlyph({ x, y, className = '', fill = '#dff2f4' }) {
  // Silhouette with proper anatomy: head + proboscis, humped thorax, tapered abdomen,
  // six jointed legs trailing back, two long veined wings. Faces right (toward the net).
  return (
    <g className={`hf-mosquito ${className}`} transform={`translate(${x} ${y})`} fill={fill} stroke={fill} strokeLinecap="round" strokeLinejoin="round">
      <g fill="none" strokeWidth="1.1" opacity="0.8">
        <path d="M6 4 L-2 14 L-14 20" />
        <path d="M4 5 L-8 12 L-22 12" />
        <path d="M1 5 L-12 8 L-26 2" />
        <path d="M8 3 L14 12 L8 22" />
        <path d="M6 4 L2 14 L-8 24" />
        <path d="M3 5 L-6 10 L-18 18" />
      </g>
      <path d="M-3 0 C-10 -1 -20 1 -28 5 C-20 3 -10 3 -3 3 Z" opacity="0.9" />
      <ellipse cx="4" cy="0" rx="7" ry="4.5" opacity="0.95" />
      <circle cx="13" cy="-0.5" r="3.2" opacity="0.95" />
      <path d="M16 0 L30 3" fill="none" strokeWidth="0.9" opacity="0.85" />
      <path d="M14 -3 C17 -8 20 -9 24 -9 M14 -3 C16 -7 18 -10 20 -12" fill="none" strokeWidth="0.6" opacity="0.7" />
      <g className="hf-wing" opacity="0.55">
        <path d="M2 -2 C6 -14 22 -20 30 -14 C24 -8 12 -4 2 -2 Z" />
        <path d="M4 -4 C12 -12 22 -16 28 -14" fill="none" strokeWidth="0.5" opacity="0.7" />
      </g>
      <g className="hf-wing" opacity="0.4">
        <path d="M0 -2 C2 -12 12 -20 20 -18 C14 -10 6 -5 0 -2 Z" />
      </g>
    </g>
  )
}

export default function NetIllustration({ variant = 'render', animated = true, mosquitoes = true, className = '' }) {
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
        {mosquitoes && (
          <>
            <MosquitoGlyph x={330} y={150} />
            <MosquitoGlyph x={360} y={290} className="hf-mosquito--b" />
          </>
        )}
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
