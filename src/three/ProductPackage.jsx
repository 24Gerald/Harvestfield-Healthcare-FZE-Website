/**
 * 3D pack shot for The Net section — the Synera DuoForte pillow pack.
 *
 * Built to match the photographed pack:
 *   - translucent white poly film with the artwork printed on it: printed areas
 *     are opaque, unprinted film is see-through (alpha map derived from the artwork)
 *   - the folded net bundle inside, visible through the film
 *   - a flat heat-seal border all the way round with a slightly wavy cut edge
 *     and crimp lines on the top seal
 *   - inflated pillow shape with soft lumps from the folded contents, plus
 *     micro-crinkles (vertex noise) and a wrinkle bump map for the film
 *   - image-based lighting (RoomEnvironment) so the plastic picks up reflections
 *
 * Artwork: public/product/front.png, back.png; helpers net-bundle.png, wrinkles.png
 * (all from scripts/make-product-placeholder.py — swap in real print files).
 */
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei/core/PerformanceMonitor'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const PACK = { w: 2.2, h: 2.75, puff: 0.3, seal: 0.12, cornerR: 0.1 }

/* ---------- small value-noise for lumps and crinkles ---------- */
const hash = (x, y) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}
const smooth = (t) => t * t * (3 - 2 * t)
function noise2(x, y) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const a = hash(xi, yi)
  const b = hash(xi + 1, yi)
  const c = hash(xi, yi + 1)
  const d = hash(xi + 1, yi + 1)
  const u = smooth(xf)
  const v = smooth(yf)
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v
}

/** Pillow surface: inflated profile + content lumps + film crinkles. */
function puffedGeometry(w, h, puff, { lumps = 0.06, crinkle = 0.006, seed = 0, segments = 64 } = {}) {
  const g = new THREE.PlaneGeometry(w, h, segments, Math.round(segments * (h / w)))
  const pos = g.attributes.position
  const hw = w / 2
  const hh = h / 2
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const nx = x / hw
    const ny = y / hh
    // Superellipse falloff: flat-ish centre, rounding toward the sealed edge.
    const fx = Math.sqrt(Math.max(0, 1 - Math.pow(Math.abs(nx), 2.6)))
    const fy = Math.sqrt(Math.max(0, 1 - Math.pow(Math.abs(ny), 2.8)))
    const body = fx * fy
    const lump = (noise2(x * 1.6 + seed, y * 1.6 + seed) - 0.5) * lumps + (noise2(x * 3.2 + seed * 2, y * 3.2 + seed) - 0.5) * lumps * 0.5
    const crk = (noise2(x * 28 + seed, y * 28 + seed) - 0.5) * crinkle
    pos.setZ(i, puff * body + (lump + crk) * body)
  }
  g.computeVertexNormals()
  return g
}

/** Flat seal frame around the pouch with a slightly irregular outer cut. */
function sealGeometry(w, h, seal, r) {
  const ow = w / 2 + seal
  const oh = h / 2 + seal
  const shape = new THREE.Shape()
  const N = 220
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2
    // rounded-rectangle outline via superellipse, then a tiny wobble on the cut edge
    const c = Math.cos(t)
    const s = Math.sin(t)
    const k = 6
    const x = Math.sign(c) * Math.pow(Math.abs(c), 2 / k) * ow
    const y = Math.sign(s) * Math.pow(Math.abs(s), 2 / k) * oh
    const wob = 1 + (noise2(i * 0.35, 7.7) - 0.5) * 0.02
    if (i === 0) shape.moveTo(x * wob, y * wob)
    else shape.lineTo(x * wob, y * wob)
  }
  const hole = new THREE.Path()
  const iw = w / 2 - 0.02
  const ih = h / 2 - 0.02
  hole.moveTo(-iw + r, -ih)
  hole.lineTo(iw - r, -ih)
  hole.quadraticCurveTo(iw, -ih, iw, -ih + r)
  hole.lineTo(iw, ih - r)
  hole.quadraticCurveTo(iw, ih, iw - r, ih)
  hole.lineTo(-iw + r, ih)
  hole.quadraticCurveTo(-iw, ih, -iw, ih - r)
  hole.lineTo(-iw, -ih + r)
  hole.quadraticCurveTo(-iw, -ih, -iw + r, -ih)
  shape.holes.push(hole)
  return new THREE.ShapeGeometry(shape, 8)
}

/** Alpha map from the artwork: printed pixels opaque, bare film translucent. */
function alphaFromArtwork(texture, filmAlpha = 0.72) {
  const img = texture.image
  const c = document.createElement('canvas')
  c.width = img.width
  c.height = img.height
  const ctx = c.getContext('2d')
  ctx.drawImage(img, 0, 0)
  const data = ctx.getImageData(0, 0, c.width, c.height)
  const px = data.data
  for (let i = 0; i < px.length; i += 4) {
    const lum = (px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114) / 255
    // white/near-white → bare film; anything printed → opaque, with a soft ramp
    const ink = THREE.MathUtils.clamp((0.95 - lum) / 0.08, 0, 1)
    const a = filmAlpha + (1 - filmAlpha) * ink
    px[i] = px[i + 1] = px[i + 2] = Math.round(a * 255)
    px[i + 3] = 255
  }
  ctx.putImageData(data, 0, 0)
  const t = new THREE.CanvasTexture(c)
  t.flipY = texture.flipY
  return t
}

/** Crimp lines for the top heat seal. */
function crimpTexture() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 32
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, 256, 32)
  ctx.strokeStyle = 'rgba(120,130,130,0.55)'
  ctx.lineWidth = 1
  for (let y = 3; y < 32; y += 4) {
    ctx.beginPath()
    ctx.moveTo(0, y + 0.5)
    ctx.lineTo(256, y + 0.5)
    ctx.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = THREE.RepeatWrapping
  t.repeat.set(3, 1)
  return t
}

function Environment() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
  return null
}

function Pack({ front, back, bundle, wrinkles, paused }) {
  const group = useRef()
  const drag = useRef({ active: false, velocity: 0 })
  const [frontTex, backTex, bundleTex, wrinkleTex] = useLoader(THREE.TextureLoader, [front, back, bundle, wrinkles])

  const maps = useMemo(() => {
    for (const t of [frontTex, backTex, bundleTex]) {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 8
    }
    wrinkleTex.wrapS = wrinkleTex.wrapT = THREE.RepeatWrapping
    wrinkleTex.repeat.set(2.2, 2.8)
    return { frontAlpha: alphaFromArtwork(frontTex), backAlpha: alphaFromArtwork(backTex), crimp: crimpTexture() }
  }, [frontTex, backTex, bundleTex, wrinkleTex])

  const filmGeo = useMemo(() => puffedGeometry(PACK.w, PACK.h, PACK.puff, { lumps: 0.05, seed: 1.3 }), [])
  const filmGeoBack = useMemo(() => puffedGeometry(PACK.w, PACK.h, PACK.puff, { lumps: 0.05, seed: 4.1 }), [])
  const bundleGeo = useMemo(() => puffedGeometry(PACK.w * 0.94, PACK.h * 0.94, PACK.puff * 0.7, { lumps: 0.05, crinkle: 0, seed: 2.2, segments: 40 }), [])
  const sealGeo = useMemo(() => sealGeometry(PACK.w, PACK.h, PACK.seal, PACK.cornerR), [])
  const crimpGeo = useMemo(() => new THREE.PlaneGeometry(PACK.w * 0.9, PACK.seal * 0.7), [])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    if (!drag.current.active) {
      const auto = paused ? 0 : 0.32
      drag.current.velocity = THREE.MathUtils.damp(drag.current.velocity, 0, 3, dt)
      g.rotation.y += (auto + drag.current.velocity) * dt
    }
    g.rotation.x = Math.sin(t * 0.6) * 0.05 - 0.1
    g.rotation.z = Math.sin(t * 0.4) * 0.015
    g.position.y = Math.sin(t * 0.9) * 0.05
  })

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

  // Translucent printed film. Alpha comes from the artwork; the film itself is glossy.
  const film = {
    transparent: true,
    roughness: 0.36,
    metalness: 0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.4,
    envMapIntensity: 0.65,
    bumpMap: wrinkleTex,
    bumpScale: 0.004,
    depthWrite: false,
    side: THREE.FrontSide,
  }

  return (
    <group ref={group} onPointerDown={() => (drag.current.active = true)}>
      {/* Folded net inside — rendered first so the film composites over it */}
      <mesh geometry={bundleGeo} renderOrder={0}>
        <meshStandardMaterial map={bundleTex} roughness={0.95} metalness={0} envMapIntensity={0.3} />
      </mesh>
      <mesh geometry={bundleGeo} rotation={[0, Math.PI, 0]} renderOrder={0}>
        <meshStandardMaterial map={bundleTex} roughness={0.95} metalness={0} envMapIntensity={0.3} />
      </mesh>

      {/* Heat-seal border — flat, translucent, slightly wavy edge */}
      <mesh geometry={sealGeo} renderOrder={1}>
        <meshPhysicalMaterial color="#f3f3ef" transparent opacity={0.94} roughness={0.45} clearcoat={0.4} clearcoatRoughness={0.4} envMapIntensity={0.6} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Crimp lines on the top seal (both faces) */}
      <mesh geometry={crimpGeo} position={[0, PACK.h / 2 + PACK.seal * 0.55, 0.003]} renderOrder={2}>
        <meshBasicMaterial map={maps.crimp} transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <mesh geometry={crimpGeo} position={[0, PACK.h / 2 + PACK.seal * 0.55, -0.003]} rotation={[0, Math.PI, 0]} renderOrder={2}>
        <meshBasicMaterial map={maps.crimp} transparent opacity={0.5} depthWrite={false} />
      </mesh>

      {/* Printed film, front and back */}
      <mesh geometry={filmGeo} renderOrder={3}>
        <meshPhysicalMaterial map={frontTex} alphaMap={maps.frontAlpha} {...film} />
      </mesh>
      <mesh geometry={filmGeoBack} rotation={[0, Math.PI, 0]} renderOrder={3}>
        <meshPhysicalMaterial map={backTex} alphaMap={maps.backAlpha} {...film} />
      </mesh>
    </group>
  )
}

export default function ProductPackage({ front, back, bundle, wrinkles, paused = false }) {
  const [dpr, setDpr] = useState(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2))
  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.1, 5.6], fov: 34 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
      style={{ touchAction: 'pan-y', cursor: 'grab' }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <Environment />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <directionalLight position={[-4, 1, 3]} intensity={0.45} />
      <directionalLight position={[0, -2, -4]} intensity={0.7} color="#a9d3d8" />
      <Suspense fallback={null}>
        <Pack front={front} back={back} bundle={bundle} wrinkles={wrinkles} paused={paused} />
      </Suspense>
    </Canvas>
  )
}
