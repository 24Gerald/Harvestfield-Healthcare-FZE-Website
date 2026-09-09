/**
 * 3D pack shot for The Net section — the Synera DuoForte pillow pack.
 *
 * Built to match the photographed pack:
 *   - translucent white poly film with the artwork printed on it: printed areas
 *     are opaque, unprinted film is see-through (alpha map derived from the artwork)
 *   - the folded net bundle inside, visible through the film
 *   - each side is ONE continuous sheet: the inflated pillow rolls smoothly into
 *     a flat heat-seal flange (no separate seal plate, no hard step), the flange
 *     has softly rounded corners, a slightly wavy cut edge and crimp lines on the
 *     top seal — all done in the same surface and the same material
 *   - soft lumps from the folded contents, micro-crinkles (vertex noise) and a
 *     wrinkle bump map for the film
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

const PACK = { w: 2.2, h: 2.75, puff: 0.3, seal: 0.13, cornerR: 0.16 }
const FILM_ALPHA = 0.72 // bare (unprinted) film opacity
const SEAL_ALPHA = 0.82 // fused double-layer seal is a touch more opaque

/* ---------- small value-noise for lumps and crinkles ---------- */
const hash = (x, y) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}
const smooth = (t) => t * t * (3 - 2 * t)
const smoothstep = (a, b, x) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}
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

/**
 * One side of the pouch as a single sheet: pillow body + heat-seal flange.
 *
 * Extra vertex attributes drive the shader:
 *   aFlange  0 on the printed body → 1 on the seal (colour / alpha / roughness blend)
 *   aTop     1 on the top seal strip (crimp lines)
 *   aOutside signed distance to the wavy rounded outline (> 0 is cut away)
 * UVs are clamped to the body so the artwork stops at the seal.
 */
function pouchGeometry(w, h, puff, seal, cornerR, { lumps = 0.05, crinkle = 0.006, seed = 0, segments = 110 } = {}) {
  const W = w + 2 * seal
  const H = h + 2 * seal
  const g = new THREE.PlaneGeometry(W, H, segments, Math.round(segments * (H / W)))
  const pos = g.attributes.position
  const uv = g.attributes.uv
  const n = pos.count
  const flangeAttr = new Float32Array(n)
  const topAttr = new Float32Array(n)
  const outAttr = new Float32Array(n)
  const hw = w / 2
  const hh = h / 2
  // the pillow profile reaches zero a little way into the flange so the roll-off
  // is gentle instead of meeting the seal at a hard crease
  const rw = hw + seal * 0.35
  const rh = hh + seal * 0.35
  const ow = hw + seal
  const oh = hh + seal
  for (let i = 0; i < n; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const ax = Math.abs(x)
    const ay = Math.abs(y)

    // inflated profile — finite slope at the edge (no sqrt cliff)
    const fx = Math.max(0, 1 - Math.pow(ax / rw, 2.35))
    const fy = Math.max(0, 1 - Math.pow(ay / rh, 2.6))
    let body = fx * fy
    body = body * body * (3 - 2 * body) * 0.85 + body * 0.15 // slightly fuller, still C1 at the toe

    // how far this vertex sits beyond the printed body rectangle
    const dx = Math.max(ax - hw, 0)
    const dy = Math.max(ay - hh, 0)
    const d = Math.hypot(dx, dy)
    const toe = 1 - smoothstep(0, seal * 0.55, d) // extra softening of the fold
    const flange = smoothstep(-0.01, seal * 0.4, d)

    const lump = (noise2(x * 1.6 + seed, y * 1.6 + seed) - 0.5) * lumps + (noise2(x * 3.2 + seed * 2, y * 3.2 + seed) - 0.5) * lumps * 0.5
    const crk = (noise2(x * 28 + seed, y * 28 + seed) - 0.5) * crinkle
    const pillow = (puff + lump + crk) * body * toe

    // seal: essentially flat, with a whisper of ripple and a tiny outward curl at the cut
    const ripple = (noise2(x * 7 + seed * 3, y * 7 + seed) - 0.5) * 0.006
    const curl = Math.pow(smoothstep(seal * 0.3, seal, d), 2) * 0.012
    const sealZ = 0.002 + ripple + curl

    pos.setZ(i, pillow + sealZ * flange)

    // rounded outline with a slightly irregular cut
    const qx = ax - (ow - cornerR)
    const qy = ay - (oh - cornerR)
    const sdf = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - cornerR
    const wob = (noise2(x * 5.5 + seed, y * 5.5 + 3.1) - 0.5) * 0.018 + (noise2(x * 21 + seed, y * 21) - 0.5) * 0.004
    outAttr[i] = sdf + wob

    flangeAttr[i] = flange
    topAttr[i] = y > hh ? smoothstep(hh - 0.005, hh + 0.02, y) : 0

    uv.setXY(i, THREE.MathUtils.clamp((x + hw) / w, 0, 1), THREE.MathUtils.clamp((y + hh) / h, 0, 1))
  }
  g.setAttribute('aFlange', new THREE.BufferAttribute(flangeAttr, 1))
  g.setAttribute('aTop', new THREE.BufferAttribute(topAttr, 1))
  g.setAttribute('aOutside', new THREE.BufferAttribute(outAttr, 1))
  g.computeVertexNormals()
  return g
}

/** The folded contents — a softer, smaller pillow that sits inside the film. */
function bundleGeometry(w, h, puff, { lumps = 0.05, seed = 0, segments = 48 } = {}) {
  const g = new THREE.PlaneGeometry(w, h, segments, Math.round(segments * (h / w)))
  const pos = g.attributes.position
  const hw = w / 2
  const hh = h / 2
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const fx = Math.max(0, 1 - Math.pow(Math.abs(x) / hw, 2.2))
    const fy = Math.max(0, 1 - Math.pow(Math.abs(y) / hh, 2.4))
    const body = fx * fy
    const lump = (noise2(x * 1.7 + seed, y * 1.7 + seed) - 0.5) * lumps + (noise2(x * 3.4 + seed * 2, y * 3.4 + seed) - 0.5) * lumps * 0.5
    pos.setZ(i, (puff + lump) * body)
  }
  g.computeVertexNormals()
  return g
}

/** Alpha map from the artwork: printed pixels opaque, bare film translucent. */
function alphaFromArtwork(texture, filmAlpha = FILM_ALPHA) {
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

/**
 * Shader patch for the film material: blends the printed body into the seal
 * (white, a little more opaque, more matte), draws crimp lines on the top seal
 * and trims the sheet to the wavy rounded outline.
 */
function patchFilmShader(shader) {
  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      `#include <common>
      attribute float aFlange;
      attribute float aTop;
      attribute float aOutside;
      varying float vFlange;
      varying float vTop;
      varying float vOutside;
      varying vec2 vLocal;`,
    )
    .replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
      vFlange = aFlange;
      vTop = aTop;
      vOutside = aOutside;
      vLocal = position.xy;`,
    )
  shader.fragmentShader = shader.fragmentShader
    .replace(
      '#include <common>',
      `#include <common>
      varying float vFlange;
      varying float vTop;
      varying float vOutside;
      varying vec2 vLocal;`,
    )
    .replace(
      '#include <alphamap_fragment>',
      `#include <alphamap_fragment>
      if (vOutside > 0.0) discard;
      // soft anti-aliased cut edge
      float edge = 1.0 - smoothstep(-0.006, 0.0, vOutside);
      // fused seal: whiter, slightly more opaque than bare film
      vec3 sealTint = vec3(0.965, 0.965, 0.945);
      diffuseColor.rgb = mix(diffuseColor.rgb, sealTint, vFlange);
      diffuseColor.a = mix(diffuseColor.a, ${SEAL_ALPHA.toFixed(3)}, vFlange) * edge;
      // crimp lines across the top seal
      float crimp = 0.5 + 0.5 * sin(vLocal.y * 290.0 + sin(vLocal.x * 40.0) * 0.6);
      crimp = smoothstep(0.35, 0.85, crimp);
      diffuseColor.rgb *= 1.0 - 0.13 * crimp * vTop * vFlange;`,
    )
    .replace(
      '#include <roughnessmap_fragment>',
      `#include <roughnessmap_fragment>
      roughnessFactor = mix(roughnessFactor, 0.6, vFlange);`,
    )
}

function makeFilmMaterial(map, alphaMap, bumpMap) {
  const m = new THREE.MeshPhysicalMaterial({
    map,
    alphaMap,
    bumpMap,
    bumpScale: 0.004,
    transparent: true,
    roughness: 0.36,
    metalness: 0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.4,
    envMapIntensity: 0.65,
    depthWrite: false,
    side: THREE.FrontSide,
  })
  m.onBeforeCompile = patchFilmShader
  m.customProgramCacheKey = () => 'hf-pack-film'
  return m
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

  const materials = useMemo(() => {
    for (const t of [frontTex, backTex, bundleTex]) {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 8
    }
    wrinkleTex.wrapS = wrinkleTex.wrapT = THREE.RepeatWrapping
    wrinkleTex.repeat.set(2.2, 2.8)
    return {
      front: makeFilmMaterial(frontTex, alphaFromArtwork(frontTex), wrinkleTex),
      back: makeFilmMaterial(backTex, alphaFromArtwork(backTex), wrinkleTex),
    }
  }, [frontTex, backTex, bundleTex, wrinkleTex])
  useEffect(() => () => {
    materials.front.dispose()
    materials.back.dispose()
  }, [materials])

  const filmGeo = useMemo(() => pouchGeometry(PACK.w, PACK.h, PACK.puff, PACK.seal, PACK.cornerR, { seed: 1.3 }), [])
  const filmGeoBack = useMemo(() => pouchGeometry(PACK.w, PACK.h, PACK.puff, PACK.seal, PACK.cornerR, { seed: 4.1 }), [])
  const bundleGeo = useMemo(() => bundleGeometry(PACK.w * 0.93, PACK.h * 0.93, PACK.puff * 0.68, { seed: 2.2 }), [])

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

  return (
    <group ref={group} onPointerDown={() => (drag.current.active = true)}>
      {/* Folded net inside — rendered first so the film composites over it */}
      <mesh geometry={bundleGeo} renderOrder={0}>
        <meshStandardMaterial map={bundleTex} roughness={0.95} metalness={0} envMapIntensity={0.3} />
      </mesh>
      <mesh geometry={bundleGeo} rotation={[0, Math.PI, 0]} renderOrder={0}>
        <meshStandardMaterial map={bundleTex} roughness={0.95} metalness={0} envMapIntensity={0.3} />
      </mesh>

      {/* Printed film + seal, front and back — one continuous sheet each */}
      <mesh geometry={filmGeo} material={materials.front} renderOrder={1} />
      <mesh geometry={filmGeoBack} material={materials.back} rotation={[0, Math.PI, 0]} renderOrder={1} />
    </group>
  )
}

export default function ProductPackage({ front, back, bundle, wrinkles, paused = false }) {
  const [dpr, setDpr] = useState(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2))
  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.05, 5.95], fov: 34 }}
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
