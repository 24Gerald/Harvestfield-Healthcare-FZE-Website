/**
 * Hero 3D scene — "The Net Holds"
 *
 * A soft, ambient background layer for the hero: a breathing net lattice in
 * brand teal, and two or three abstract mosquito forms that drift toward it,
 * are gently stopped at its surface, then drift away and loop back.
 *
 * Scene graph
 *   <HeroCanvas>                      R3F <Canvas> + lights + performance guard
 *     <HeroNetScene>                  the rotated group that holds everything
 *       <NetLattice />                procedural plane + custom shader
 *       <Mosquito /> × N              primitives + procedural flight path
 *       <CameraRig />                 optional slow mouse parallax
 *
 * Everything moves in the *net's local frame*: the net sits on the local z = 0
 * plane and the mosquitoes approach from negative z (the far side, away from
 * the viewer) toward the viewer — so the viewer is the protected sleeper.
 *
 * Mosquito bodies
 *   <Mosquito> is the flight rig: path, soft stop at the net, contact ripples.
 *   It renders one of two bodies inside its group, both facing +z:
 *     <ModelBody>      a real glTF model from public/models/mosquito/ (see
 *                      HERO_MOSQUITO_MODEL in src/data/siteConfig.js)
 *     <ProceduralBody> the built-in anatomically modelled mosquito (see
 *                      ./RealisticMosquito.jsx) — used by default, and as the
 *                      fallback while a model loads, if it is missing, or fails.
 *   The rig writes per-frame animation state (wing flutter, depth fade) into a
 *   ref that either body reads, so swapping bodies never touches the rig.
 *
 * Swapping the net later
 *   - Replace the body of <NetLattice> with a loaded mesh; keep it on z = 0 and
 *     keep the `impacts` uniform contract if you want ripples on contact.
 *
 * Mounting, lazy-loading and fallbacks are handled by ./HeroBackground.jsx —
 * this file is pure scene code.
 */
import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
// Deep imports keep the rest of drei out of the bundle (drei is otherwise a ~1 MB barrel).
import { PerformanceMonitor } from '@react-three/drei/core/PerformanceMonitor'
import { useGLTF } from '@react-three/drei/core/Gltf'
import * as THREE from 'three'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { HERO_MOSQUITO_MODEL } from '../data/siteConfig'
import { modelStatus } from '../lib/modelStatus'
import { useAssetAvailable } from '../lib/useAssetAvailable'
import RealisticMosquito from './RealisticMosquito'

/* ---------------------------------------------------------------------------
   Shared constants
   ------------------------------------------------------------------------ */
const MAX_IMPACTS = 3 // one per mosquito
const NET_SIZE = [10, 6.5] // world units, width × height
const NET_SEGMENTS = [56, 36] // vertex resolution — low-poly budget on purpose
const NET_TILT = { x: 0.06, y: -0.38, z: 0.02 } // radians; angles the net across the hero

// Colours. The brief specifies teal-deep for the net; the hero background is
// itself teal-deep, so the lattice uses the light teal token to stay visible.
// If the hero ever moves to a light background, pass color="#10515B" instead.
const NET_COLOR = '#a9d3d8'
const MOSQUITO_COLOR = '#eef6f7'

/**
 * Fabric "breathing" — the same formula runs in the vertex shader and in JS so
 * mosquitoes can find the true surface height at their x/y and stop on it.
 */
function surfaceWave(x, y, t) {
  return (
    Math.sin(x * 1.1 + t * 0.55) * 0.09 +
    Math.sin(y * 1.6 - t * 0.42) * 0.07 +
    Math.sin((x + y) * 0.7 + t * 0.28) * 0.05
  )
}

/* ---------------------------------------------------------------------------
   NetLattice — procedural mesh in brand teal
   ------------------------------------------------------------------------ */
const netVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec4 uImpacts[${MAX_IMPACTS}]; // x, y (local), strength, start time
  varying vec2 vUv;
  varying float vLift;

  void main() {
    vUv = uv;
    vec3 p = position;

    // 1. Slow, layered sine displacement — fabric breathing (mirrors surfaceWave()).
    float wave =
      sin(p.x * 1.1 + uTime * 0.55) * 0.09 +
      sin(p.y * 1.6 - uTime * 0.42) * 0.07 +
      sin((p.x + p.y) * 0.7 + uTime * 0.28) * 0.05;

    // 2. Contact ripples — a damped ring spreading from where a mosquito was stopped.
    float ripple = 0.0;
    for (int i = 0; i < ${MAX_IMPACTS}; i++) {
      vec4 im = uImpacts[i];
      float age = uTime - im.w;
      if (im.z > 0.0 && age >= 0.0 && age < 3.0) {
        float d = distance(p.xy, im.xy);
        ripple += im.z * sin(d * 5.0 - age * 7.0) * exp(-d * 1.4) * exp(-age * 1.6);
      }
    }

    p.z += wave + ripple;
    vLift = wave + ripple;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const netFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform vec2 uCells;
  uniform float uLineWidth;
  varying vec2 vUv;
  varying float vLift;

  void main() {
    // Anti-aliased grid lines in screen space (fwidth keeps them ~1–2px at any distance).
    vec2 coord = vUv * uCells;
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float dist = min(grid.x, grid.y);
    float line = 1.0 - smoothstep(uLineWidth - 0.9, uLineWidth, dist);

    // Fade the lattice out toward its edges so it dissolves into the background.
    float edge =
      smoothstep(0.0, 0.22, vUv.x) * smoothstep(0.0, 0.22, 1.0 - vUv.x) *
      smoothstep(0.0, 0.26, vUv.y) * smoothstep(0.0, 0.26, 1.0 - vUv.y);

    // Slight brightening where the fabric lifts toward the viewer.
    float shade = 0.85 + vLift * 1.4;

    float alpha = line * edge * shade * uOpacity;
    if (alpha < 0.005) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`

export function NetLattice({ impacts, color = NET_COLOR, opacity = 0.55 }) {
  const material = useRef()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uCells: { value: new THREE.Vector2(34, 22) },
      uLineWidth: { value: 1.4 },
      uImpacts: { value: Array.from({ length: MAX_IMPACTS }, () => new THREE.Vector4(0, 0, 0, -10)) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame((state) => {
    const m = material.current
    if (!m) return
    m.uniforms.uTime.value = state.clock.elapsedTime
    // Copy the latest impact records written by the mosquitoes.
    for (let i = 0; i < MAX_IMPACTS; i++) {
      const im = impacts.current[i]
      if (im) m.uniforms.uImpacts.value[i].set(im.x, im.y, im.strength, im.time)
    }
  })

  return (
    <mesh renderOrder={0}>
      <planeGeometry args={[NET_SIZE[0], NET_SIZE[1], NET_SEGMENTS[0], NET_SEGMENTS[1]]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={netVertexShader}
        fragmentShader={netFragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/* ---------------------------------------------------------------------------
   Mosquito — flight rig (path, soft stop, contact ripples)
   ------------------------------------------------------------------------ */
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2

// Phase boundaries of one flight cycle (normalised 0..1)
const APPROACH_END = 0.42
const HOLD_END = 0.62

export function Mosquito({
  index = 0,
  impacts,
  // Where on the net (local x/y) this mosquito aims for, and how far out it starts.
  target = [0, 0],
  drift = [1.2, 0.7], // lateral drift amplitude while retreating/approaching
  period = 9, // seconds per full cycle
  phase = 0, // 0..1 offset so mosquitoes are staggered
  zFar = -4.2,
  scale = 1,
  color = MOSQUITO_COLOR,
}) {
  const group = useRef()

  // Per-frame animation state shared with whichever body is mounted.
  //   flutter: wing angle offset (radians), depth: 0 (far) → 1 (at the net),
  //   probe: 0..1 intensity while the mosquito is pushing against the net.
  const anim = useRef({ flutter: 0, depth: 0, probe: 0 })

  // Scratch objects reused every frame (no allocations in the render loop).
  const scratch = useMemo(
    () => ({ pos: new THREE.Vector3(), next: new THREE.Vector3(), contactMade: false }),
    [],
  )

  // Per-mosquito randomness so no two paths are identical.
  const seed = useMemo(() => {
    const s = index * 7.31 + 1.7
    return {
      a: Math.sin(s) * 6.28,
      b: Math.cos(s * 1.3) * 6.28,
      jitter: 0.8 + ((index * 37) % 5) * 0.1,
    }
  }, [index])

  const margin = 0.16 // how far behind the surface the mosquito is held

  /**
   * Flight path in net-local space for a normalised cycle position p (0..1).
   *   0            → APPROACH_END : drift in from zFar, decelerating toward the net
   *   APPROACH_END → HOLD_END     : held at the surface, probing with decaying jabs
   *   HOLD_END     → 1            : drift away again
   */
  const pathAt = (p, t, out) => {
    // Lateral drift — lissajous curve around the target, wider when far from the net.
    const far = p < APPROACH_END ? 1 - p / APPROACH_END : p > HOLD_END ? (p - HOLD_END) / (1 - HOLD_END) : 0
    const lx = Math.sin(p * Math.PI * 2 + seed.a) * drift[0] * (0.25 + 0.75 * far)
    const ly = Math.sin(p * Math.PI * 4 + seed.b) * drift[1] * (0.25 + 0.75 * far)
    // Hover jitter — small, quick, keeps it alive while held.
    const jx = Math.sin(t * 3.1 * seed.jitter) * 0.03
    const jy = Math.cos(t * 2.3 * seed.jitter) * 0.03

    const x = target[0] + lx + jx
    const y = target[1] + ly + jy
    const surface = surfaceWave(x, y, t) - margin

    let z
    if (p < APPROACH_END) {
      z = THREE.MathUtils.lerp(zFar, surface, easeOutCubic(p / APPROACH_END))
    } else if (p < HOLD_END) {
      // Soft stop: three decaying jabs against the surface — never through it.
      const q = (p - APPROACH_END) / (HOLD_END - APPROACH_END)
      const jab = Math.abs(Math.sin(q * Math.PI * 3)) * (1 - q) * 0.26
      z = surface - jab
    } else {
      const q = (p - HOLD_END) / (1 - HOLD_END)
      z = THREE.MathUtils.lerp(surface, zFar, easeInOutSine(q))
    }
    return out.set(x, y, z)
  }

  useFrame((state) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const p = ((t / period + phase) % 1 + 1) % 1

    // Position, then heading: face the point slightly ahead on the path.
    // lookAt() expects world space, so convert the local look-ahead point via the parent.
    pathAt(p, t, scratch.pos)
    pathAt((p + 0.004) % 1, t + 0.03, scratch.next)
    g.position.copy(scratch.pos)
    g.lookAt(g.parent.localToWorld(scratch.next))

    // Register a contact ripple on the net the moment the hold phase begins.
    const holding = p >= APPROACH_END && p < HOLD_END
    if (holding) {
      if (!scratch.contactMade) {
        scratch.contactMade = true
        impacts.current[index % MAX_IMPACTS] = { x: scratch.pos.x, y: scratch.pos.y, strength: 0.18 * scale, time: t }
      }
    } else {
      scratch.contactMade = false
    }

    // Shared animation state for the body.
    const a = anim.current
    a.probe = holding ? 1 - (p - APPROACH_END) / (HOLD_END - APPROACH_END) : 0
    a.flutter = Math.sin(t * 95 + index) * (0.55 + a.probe * 0.25) // wings beat harder while pushing
    a.depth = THREE.MathUtils.clamp(1 - (Math.abs(scratch.pos.z) - margin) / Math.abs(zFar), 0, 1)
  })

  return (
    <group ref={group} scale={scale} renderOrder={1}>
      <MosquitoBody anim={anim} color={color} />
    </group>
  )
}

/* ---------------------------------------------------------------------------
   Mosquito bodies
   ------------------------------------------------------------------------ */

/** Chooses the real model when configured and present, with the procedural body as fallback. */
function MosquitoBody({ anim, color }) {
  const available = useAssetAvailable(`${import.meta.env.BASE_URL}${HERO_MOSQUITO_MODEL.url}`, HERO_MOSQUITO_MODEL.enabled)
  if (!available) return <ProceduralBody anim={anim} color={color} />
  return (
    <ModelErrorBoundary fallback={<ProceduralBody anim={anim} color={color} />}>
      <Suspense fallback={<ProceduralBody anim={anim} color={color} />}>
        <ModelBody anim={anim} />
      </Suspense>
    </ModelErrorBoundary>
  )
}

/** Catches a missing/broken model file and shows the procedural body instead. */
class ModelErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err) {
    modelStatus.set('fallback')
    if (import.meta.env.DEV) console.warn('[hero] mosquito model unavailable, using procedural body:', err?.message)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/**
 * Real glTF model. Normalised to a known size, centred, rotated per config so
 * the head faces +z, and given per-instance materials for the depth fade.
 */
function ModelBody({ anim }) {
  const cfg = HERO_MOSQUITO_MODEL
  const url = `${import.meta.env.BASE_URL}${cfg.url}`
  const { scene } = useGLTF(url)

  const { object, wings, materials, scale, offset } = useMemo(() => {
    // Clone so each mosquito gets its own transforms and materials (SkeletonUtils' clone handles rigged models).
    const obj = cloneSkeleton(scene)
    const box = new THREE.Box3().setFromObject(obj)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const s = cfg.length / Math.max(size.x, size.y, size.z, 1e-6)

    const mats = []
    obj.traverse((node) => {
      if (!node.isMesh) return
      node.frustumCulled = false
      const list = Array.isArray(node.material) ? node.material : [node.material]
      const cloned = list.map((m) => {
        const c = m.clone()
        c.transparent = true
        c.opacity = cfg.opacity
        mats.push(c)
        return c
      })
      node.material = Array.isArray(node.material) ? cloned : cloned[0]
    })
    const w = cfg.wingNodes.map((n) => obj.getObjectByName(n)).filter(Boolean)
    return { object: obj, wings: w, materials: mats, scale: s, offset: center.multiplyScalar(-s) }
  }, [scene, cfg])

  useEffect(() => {
    modelStatus.set('loaded')
  }, [])

  const wingRest = useMemo(() => wings.map((w) => w.rotation.x), [wings])

  useFrame(() => {
    const a = anim.current
    const fade = 0.35 + a.depth * 0.65
    for (const m of materials) m.opacity = cfg.opacity * fade
    for (let i = 0; i < wings.length; i++) {
      wings[i].rotation.x = wingRest[i] + a.flutter * (i % 2 === 0 ? 1 : -1)
    }
    // Without named wing nodes, a subtle body tremor stands in for the wing beat.
    if (wings.length === 0) object.position.y = Math.sin(a.flutter * 4) * 0.004
  })

  return (
    <group rotation={cfg.rotation}>
      <primitive object={object} scale={scale} position={offset} />
    </group>
  )
}

/** Built-in mosquito body (procedural, anatomically modelled). */
function ProceduralBody({ anim }) {
  useEffect(() => {
    if (modelStatus.get() !== 'loaded') modelStatus.set('fallback')
  }, [])
  return <RealisticMosquito anim={anim} />
}

/* ---------------------------------------------------------------------------
   CameraRig — near-imperceptible parallax on mouse move (desktop only)
   ------------------------------------------------------------------------ */
function CameraRig({ enabled }) {
  const { camera, pointer } = useThree()
  useFrame(() => {
    if (!enabled) return
    // Very slow lerp toward a tiny offset; the scene barely shifts.
    camera.position.x += (pointer.x * 0.25 - camera.position.x) * 0.02
    camera.position.y += (pointer.y * 0.15 - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)
  })
  return null
}

/* ---------------------------------------------------------------------------
   HeroNetScene — the rotated group holding net + mosquitoes
   ------------------------------------------------------------------------ */
const MOSQUITO_SET = [
  { target: [1.0, 0.5], drift: [1.3, 0.7], period: 11, phase: 0.0, scale: 1.05 },
  { target: [-1.4, -0.6], drift: [1.0, 0.8], period: 13.5, phase: 0.45, scale: 0.9 },
  { target: [2.7, -1.0], drift: [1.2, 0.6], period: 12, phase: 0.75, scale: 0.8 },
]

export default function HeroNetScene({ lite = false, mosquitoes = true }) {
  // Shared contact records: mosquitoes write, the lattice reads.
  const impacts = useRef([])
  const set = lite ? MOSQUITO_SET.slice(0, 2) : MOSQUITO_SET

  return (
    <group rotation={[NET_TILT.x, NET_TILT.y, NET_TILT.z]} position={[0.8, 0.1, 0]}>
      <NetLattice impacts={impacts} />
      {mosquitoes &&
        set.map((m, i) => <Mosquito key={i} index={i} impacts={impacts} {...m} />)}
    </group>
  )
}

/* ---------------------------------------------------------------------------
   HeroCanvas — the R3F canvas with lights and a performance guard
   ------------------------------------------------------------------------ */
export function HeroCanvas({ lite = false, mosquitoes = true }) {
  const maxDpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)
  const [dpr, setDpr] = useState(maxDpr)

  // Start fetching the model as soon as we know the file exists (no-op otherwise).
  const modelUrl = `${import.meta.env.BASE_URL}${HERO_MOSQUITO_MODEL.url}`
  const modelOk = useAssetAvailable(modelUrl, HERO_MOSQUITO_MODEL.enabled)
  useEffect(() => {
    if (modelOk) useGLTF.preload(modelUrl)
  }, [modelOk, modelUrl])

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 7.5], fov: 38, near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power', stencil: false }}
      frameloop="always"
      style={{ pointerEvents: 'none' }} // the hero text/buttons stay clickable
      aria-hidden="true"
    >
      {/* If frame rate drops, halve the pixel ratio; restore when it recovers. */}
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(maxDpr)} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 3, 5]} intensity={1.1} />
      {/* Rim light from behind the net: catches wing edges and legs so the dark body separates from the teal. */}
      <directionalLight position={[-3, 2, -4]} intensity={1.6} color="#a9d3d8" />
      <HeroNetScene lite={lite} mosquitoes={mosquitoes} />
      <CameraRig enabled={!lite} />
    </Canvas>
  )
}
