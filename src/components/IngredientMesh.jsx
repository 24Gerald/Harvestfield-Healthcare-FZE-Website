import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * A strip of net mesh where the two active ingredients "pop" at random fibre
 * intersections: a ring expands from the node, a dot settles, and the
 * ingredient label appears beside it, then fades. Several nodes can be live at
 * once. Static (two labelled nodes) under reduced motion.
 */
const W = 640
const H = 240
const STEP = 32
const COLS = Math.floor(W / STEP) - 1
const ROWS = Math.floor(H / STEP) - 1

export default function IngredientMesh({ ingredients, className = '' }) {
  const reduce = useReducedMotion()
  const [pops, setPops] = useState([])
  const counter = useRef(0)

  useEffect(() => {
    if (reduce) return
    let last = -1
    const tick = () => {
      let cell
      do {
        cell = Math.floor(Math.random() * COLS * ROWS)
      } while (cell === last)
      last = cell
      const col = (cell % COLS) + 1
      const row = Math.floor(cell / COLS) + 1
      const id = counter.current++
      const ing = ingredients[id % ingredients.length]
      const flip = col > COLS * 0.6 // keep the label inside the strip
      setPops((p) => [...p.slice(-4), { id, x: col * STEP, y: row * STEP, ing, flip }])
      setTimeout(() => setPops((p) => p.filter((k) => k.id !== id)), 2600)
    }
    tick()
    const iv = setInterval(tick, 1100)
    return () => clearInterval(iv)
  }, [reduce, ingredients])

  const staticPops = reduce
    ? ingredients.map((ing, i) => ({ id: i, x: STEP * (4 + i * 8), y: STEP * (2 + i * 2), ing, flip: i === 1 }))
    : pops

  return (
    <figure className={`overflow-hidden rounded-3xl bg-teal-deep ${className}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Active ingredients bound at points across the net fibres">
        <defs>
          <radialGradient id="hf-im-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g stroke="#a9d3d8" strokeWidth="1" opacity="0.55">
          {Array.from({ length: COLS + 2 }, (_, i) => (
            <line key={`c${i}`} x1={i * STEP} y1="0" x2={i * STEP} y2={H} />
          ))}
          {Array.from({ length: ROWS + 2 }, (_, i) => (
            <line key={`r${i}`} x1="0" y1={i * STEP} x2={W} y2={i * STEP} />
          ))}
        </g>
        {staticPops.map((p) => (
          <g key={p.id} className={reduce ? '' : 'hf-node'} transform={`translate(${p.x} ${p.y})`}>
            <circle r="26" fill="url(#hf-im-glow)" className="hf-node-glow" />
            <circle r="4" fill="none" stroke="#ffffff" strokeWidth="1.5" className="hf-node-ring" />
            <circle r="3.2" fill="#ffffff" className="hf-node-dot" />
            <g className="hf-node-label" transform={`translate(${p.flip ? -14 : 14} 0)`} textAnchor={p.flip ? 'end' : 'start'}>
              <text y="-3" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="700" fill="#ffffff" letterSpacing="0.6">
                {p.ing.name.toUpperCase()}
              </text>
              <text y="12" fontFamily="Montserrat, sans-serif" fontSize="10" fill="#dff2f4">
                {p.ing.dose} · {p.ing.role.toLowerCase()}
              </text>
            </g>
          </g>
        ))}
      </svg>
      <figcaption className="sr-only">
        {ingredients.map((i) => `${i.name} ${i.dose}`).join(' and ')} are bound into the polyester fibre at every point of the mesh.
      </figcaption>
    </figure>
  )
}
