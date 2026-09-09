/**
 * 3D pack shot for The Net section — the Synera DuoForte pillow pack.
 *
 * Geometry: two "puffed" planes (front/back) whose vertices bulge outward like
 * an inflated poly bag, meeting at the edges, plus a flat heat-seal strip at the
 * top and bottom. Material: glossy plastic (clearcoat) with the pack artwork
 * mapped on each face. Slow auto-rotation, drag to turn, gentle float.
 *
 * Artwork: public/product/front.png and back.png (see scripts/make-product-placeholder.py).
 * Loads lazily while in view; static front image under reduced motion / no WebGL.
 */
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei/core/PerformanceMonitor'
import * as THREE from 'three'

const PACK = { w: 2.2, h: 2.75, puff: 0.28, seal: 0.22 }

/** Plane that bulges outward — a pillow. `sign` = +1 front, -1 back. */
function puffedGeometry(w, h, puff, segments = 48) {
  const g = new THREE.PlaneGeometry(w, h, segments, Math.round(segments * (h / w)))
  const pos = g.attributes.position
  const hw = w / 2
  const hh = h / 2
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) / hw
    const y = pos.getY(i) / hh
    // Superellipse falloff: flat-ish centre, rounding toward the edges.
    const fx = Math.sqrt(Math.max(0, 1 - Math.pow(Math.abs(x), 2.4)))
    const fy = Math.sqrt(Math.max(0, 1 - Math.pow(Math.abs(y), 2.6)))
    pos.setZ(i, puff * fx * fy)
  }
  g.computeVertexNormals()
  return g
}

function Pack({ front, back, paused }) {
  const group = useRef()
  const drag = useRef({ active: false, lastX: 0, velocity: 0 })
  const [frontTex, backTex] = useLoader(THREE.TextureLoader, [front, back])
  useEffect(() => {
    for (const t of [frontTex, backTex]) {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 8
    }
  }, [frontTex, backTex])

  const geo = useMemo(() => puffedGeometry(PACK.w, PACK.h, PACK.puff), [])
  const sealGeo = useMemo(() => new THREE.PlaneGeometry(PACK.w * 0.96, PACK.seal, 24, 2), [])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    if (!drag.current.active) {
      const auto = paused ? 0 : 0.35
      drag.current.velocity = THREE.MathUtils.damp(drag.current.velocity, 0, 3, dt)
      g.rotation.y += (auto + drag.current.velocity) * dt
    }
    g.rotation.x = Math.sin(t * 0.6) * 0.06 - 0.08
    g.position.y = Math.sin(t * 0.9) * 0.05
  })

  // Pointer drag → rotate. Handled on the canvas via props below.
  useEffect(() => {
    const onMove = (e) => {
      if (!drag.current.active || !group.current) return
      const dx = e.movementX || 0
      group.current.rotation.y += dx * 0.01
      drag.current.velocity = dx * 0.6
    }
    const onUp = () => {
      drag.current.active = false
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  const plastic = { roughness: 0.38, metalness: 0.02, clearcoat: 0.55, clearcoatRoughness: 0.35 }

  return (
    <group ref={group} onPointerDown={() => (drag.current.active = true)}>
      <mesh geometry={geo} position={[0, 0, 0]}>
        <meshPhysicalMaterial map={frontTex} {...plastic} />
      </mesh>
      <mesh geometry={geo} rotation={[0, Math.PI, 0]}>
        <meshPhysicalMaterial map={backTex} {...plastic} />
      </mesh>
      {/* Heat-seal strips */}
      <mesh geometry={sealGeo} position={[0, PACK.h / 2 + PACK.seal / 2 - 0.02, 0]}>
        <meshPhysicalMaterial color="#f1f1ee" roughness={0.5} clearcoat={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={sealGeo} position={[0, -PACK.h / 2 - PACK.seal / 2 + 0.02, 0]}>
        <meshPhysicalMaterial color="#f1f1ee" roughness={0.5} clearcoat={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export default function ProductPackage({ front, back, paused = false }) {
  const [dpr, setDpr] = useState(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2))
  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.1, 5.4], fov: 34 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      style={{ touchAction: 'pan-y', cursor: 'grab' }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <directionalLight position={[-4, 1, 3]} intensity={0.6} />
      <directionalLight position={[0, -2, -4]} intensity={0.8} color="#a9d3d8" />
      <Suspense fallback={null}>
        <Pack front={front} back={back} paused={paused} />
      </Suspense>
    </Canvas>
  )
}
