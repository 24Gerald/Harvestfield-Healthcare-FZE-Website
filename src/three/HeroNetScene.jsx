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
 * Swapping in real assets later
 *   - Replace the body of <NetLattice> with a loaded mesh; keep it on z = 0 and
 *     keep the `impacts` uniform contract if you want ripples on contact.
 *   - Replace the primitives inside <Mosquito> with a loaded model. The flight
 *     path, orientation and impact logic live in `useFrame` and do not depend
 *     on the geometry — only on the group's forward axis being +z.
 *
 * Mounting, lazy-loading and fallbacks are handled by ./HeroBackground.jsx —
 * this file is pure scene code.
 */
import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
// Deep import keeps the rest of drei out of the bundle (drei is otherwise a ~1 MB barrel).
import { PerformanceMonitor } from '@react-three/drei/core/PerformanceMonitor'
import * as THREE from 'three'

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
   Mosquito — abstract primitive form + procedural flight path
   ------------------------------------------------------------------------ */
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2

// Phase boundaries of one flight cycle (normalised 0..1)
const APPROACH_END = 0.44
const HOLD_END = 0.6

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
  const wingL = useRef()
  const wingR = useRef()
  const bodyMat = useRef()
  const wingMat = useRef()

  // Scratch objects reused every frame (no allocations in the render loop).
  const scratch = useMemo(
    () => ({ pos: new THREE.Vector3(), next: new THREE.Vector3(), lastPhase: 0, contactMade: false }),
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

  const margin = 0.14 // how far behind the surface the mosquito is held

  /**
   * Flight path in net-local space for a normalised cycle position p (0..1).
   *   0            → APPROACH_END : drift in from zFar, decelerating toward the net
   *   APPROACH_END → HOLD_END     : held at the surface with a soft, decaying bounce
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
      // Soft stop: two decaying nudges against the surface — never through it.
      const q = (p - APPROACH_END) / (HOLD_END - APPROACH_END)
      const bounce = Math.abs(Math.sin(q * Math.PI * 2)) * (1 - q) * 0.22
      z = surface - bounce
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
    if (p >= APPROACH_END && p < HOLD_END) {
      if (!scratch.contactMade) {
        scratch.contactMade = true
        impacts.current[index % MAX_IMPACTS] = { x: scratch.pos.x, y: scratch.pos.y, strength: 0.16 * scale, time: t }
      }
    } else {
      scratch.contactMade = false
    }

    // Wing flutter — fast, subtle oscillation on the wing meshes only.
    const flutter = Math.sin(t * 95 + index) * 0.55
    if (wingL.current) wingL.current.rotation.x = 0.35 + flutter
    if (wingR.current) wingR.current.rotation.x = -0.35 - flutter

    // Fade with distance so far-away mosquitoes read as atmosphere, not focus.
    const depth = THREE.MathUtils.clamp(1 - (Math.abs(scratch.pos.z) - margin) / Math.abs(zFar), 0, 1)
    if (bodyMat.current) bodyMat.current.opacity = 0.25 + depth * 0.5
    if (wingMat.current) wingMat.current.opacity = 0.12 + depth * 0.25
  })

  return (
    <group ref={group} scale={scale} renderOrder={1}>
      {/* Body — capsule laid along +z (forward). Swap this block for a modelled body. */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.045, 0.3, 3, 10]} />
        <meshStandardMaterial ref={bodyMat} color={color} roughness={0.7} transparent depthWrite={false} />
      </mesh>
      {/* Head + proboscis */}
      <mesh position={[0, 0.02, 0.2]}>
        <sphereGeometry args={[0.055, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} transparent opacity={0.6} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.02, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.18, 4]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} depthWrite={false} />
      </mesh>
      {/* Wings — thin planes either side; flutter is driven in useFrame */}
      <group position={[0, 0.06, 0.02]}>
        <mesh ref={wingL} position={[-0.17, 0, 0]} rotation={[0.35, 0, 0.15]}>
          <circleGeometry args={[0.16, 14]} />
          <meshBasicMaterial ref={wingMat} color="#ffffff" transparent side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh ref={wingR} position={[0.17, 0, 0]} rotation={[-0.35, 0, -0.15]}>
          <circleGeometry args={[0.16, 14]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
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
  { target: [0.9, 0.4], drift: [1.4, 0.8], period: 10, phase: 0.0, scale: 1 },
  { target: [-1.6, -0.5], drift: [1.1, 0.9], period: 12.5, phase: 0.42, scale: 0.85 },
  { target: [2.6, -1.1], drift: [1.3, 0.6], period: 11, phase: 0.72, scale: 0.75 },
]

export default function HeroNetScene({ lite = false }) {
  // Shared contact records: mosquitoes write, the lattice reads.
  const impacts = useRef([])
  const set = lite ? MOSQUITO_SET.slice(0, 2) : MOSQUITO_SET

  return (
    <group rotation={[NET_TILT.x, NET_TILT.y, NET_TILT.z]} position={[0.8, 0.1, 0]}>
      <NetLattice impacts={impacts} />
      {set.map((m, i) => (
        <Mosquito key={i} index={i} impacts={impacts} {...m} />
      ))}
    </group>
  )
}

/* ---------------------------------------------------------------------------
   HeroCanvas — the R3F canvas with lights and a performance guard
   ------------------------------------------------------------------------ */
export function HeroCanvas({ lite = false }) {
  const maxDpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)
  const [dpr, setDpr] = useState(maxDpr)

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
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 3, 5]} intensity={0.6} />
      <HeroNetScene lite={lite} />
      <CameraRig enabled={!lite} />
    </Canvas>
  )
}
