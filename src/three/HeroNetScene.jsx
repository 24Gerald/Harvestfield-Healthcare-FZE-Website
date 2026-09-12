/**
 * Hero 3D scene — "The Net Holds"
 *
 * A hanging bed net (canopy), gathered to a point above a hoop and draping
 * down in folds, with mosquitoes that drift in, are stopped at the tulle,
 * probe it, and drift away again.
 *
 * Scene graph
 *   <HeroCanvas>                      R3F <Canvas> + lights + performance guard
 *     <HeroNetScene>                  the group that holds everything
 *       <NetCanopy />                 surface-of-revolution tulle + hoop + cord
 *       <Mosquito /> × N              flight rig; renders one of two bodies
 *       <CameraRig />                 optional slow mouse parallax (desktop)
 *
 * Coordinates: the canopy's axis is the group's y axis. Mosquitoes move in
 * cylindrical coordinates (theta around the axis, y height, r distance from the
 * axis) and stop at r = canopyRadius(y, theta) + margin — the same function the
 * vertex shader uses to shape the fabric, so they touch the actual surface.
 *
 * Mosquito bodies
 *   <ModelBody>      a real glTF model from public/models/mosquito/ (see
 *                    HERO_MOSQUITO_MODEL in src/data/siteConfig.js)
 *   <ProceduralBody> the built-in anatomically modelled mosquito
 *                    (./RealisticMosquito.jsx) — default and fallback.
 *
 * Mounting, lazy-loading and fallbacks live in ./HeroBackground.jsx.
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
import { assetUrl } from '../lib/assetUrl'
import RealisticMosquito from './RealisticMosquito'
import { CANOPY, canopyRadius } from './canopy'

const MAX_IMPACTS = 3
const NET_COLOR = '#f1f7f8' // white tulle
const MOSQUITO_COLOR = '#eef6f7'

/* ---------------------------------------------------------------------------
   NetCanopy — tulle as a shaded, translucent mesh surface
   ------------------------------------------------------------------------ */
const canopyGLSL = /* glsl */ `
  const float TOP_Y = ${CANOPY.topY.toFixed(3)};
  const float HOOP_Y = ${CANOPY.hoopY.toFixed(3)};
  const float HOOP_R = ${CANOPY.hoopR.toFixed(3)};
  const float BOTTOM_Y = ${CANOPY.bottomY.toFixed(3)};
  const float BOTTOM_R = ${CANOPY.bottomR.toFixed(3)};
  const float FOLD_AMP = ${CANOPY.foldAmp.toFixed(3)};

  float canopyRadius(float y, float theta, float t) {
    float r;
    if (y > HOOP_Y) {
      r = mix(HOOP_R, 0.05, clamp((y - HOOP_Y) / (TOP_Y - HOOP_Y), 0.0, 1.0));
    } else {
      float k = clamp((HOOP_Y - y) / (HOOP_Y - BOTTOM_Y), 0.0, 1.0);
      r = HOOP_R + (BOTTOM_R - HOOP_R) * pow(k, 1.35);
    }
    float drop = clamp((HOOP_Y - y) / (HOOP_Y - BOTTOM_Y), 0.0, 1.0);
    float folds = FOLD_AMP * drop * (sin(theta * 11.0 + 0.4) * 0.6 + sin(theta * 6.0 - 1.3) * 0.4);
    float breathe = 0.05 * drop * sin(theta * 2.0 + t * 0.6) + 0.03 * sin(y * 1.5 + t * 0.45);
    return r + folds + breathe;
  }

  vec3 canopyPoint(float y, float theta, float t) {
    float r = canopyRadius(y, theta, t);
    return vec3(r * sin(theta), y, r * cos(theta));
  }
`

const canopyVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec4 uImpacts[${MAX_IMPACTS}]; // xyz = local contact point, w = strength
  uniform float uImpactTimes[${MAX_IMPACTS}];
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vDrop;
  ${canopyGLSL}

  void main() {
    vUv = uv;
    // The base mesh is a unit cylinder: recover angle + height, then reshape it.
    float theta = atan(position.x, position.z);
    float y = position.y;
    vec3 p = canopyPoint(y, theta, uTime);

    // Finite-difference normal so the folds shade correctly.
    float e = 0.02;
    vec3 tT = canopyPoint(y, theta + e, uTime) - canopyPoint(y, theta - e, uTime);
    vec3 tY = canopyPoint(y + e, theta, uTime) - canopyPoint(y - e, theta, uTime);
    vec3 n = normalize(cross(tY, tT));
    if (dot(n, vec3(sin(theta), 0.0, cos(theta))) < 0.0) n = -n; // outward

    // Contact ripples — the fabric gives slightly where a mosquito pushes.
    float ripple = 0.0;
    for (int i = 0; i < ${MAX_IMPACTS}; i++) {
      vec4 im = uImpacts[i];
      float age = uTime - uImpactTimes[i];
      if (im.w > 0.0 && age >= 0.0 && age < 3.0) {
        float d = distance(p, im.xyz);
        ripple += im.w * sin(d * 6.0 - age * 7.0) * exp(-d * 1.6) * exp(-age * 1.5);
      }
    }
    p -= n * ripple; // pushed inward

    vNormal = normalize(normalMatrix * n);
    vDrop = clamp((HOOP_Y - y) / (HOOP_Y - BOTTOM_Y), 0.0, 1.0);
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const canopyFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform vec2 uCells;
  uniform vec3 uLightDir;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vDrop;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(cameraPosition - vWorldPos);
    float ndv = abs(dot(n, v));

    // Tulle reads brighter at grazing angles (more threads overlap) — fresnel-like.
    float fresnel = pow(1.0 - ndv, 2.2);
    // Soft two-sided lighting so folds show as light/dark bands.
    float light = 0.55 + 0.45 * abs(dot(n, normalize(uLightDir)));

    // Fine mesh cells, anti-aliased in screen space.
    vec2 coord = vUv * uCells;
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = 1.0 - smoothstep(0.4, 1.3, min(grid.x, grid.y));

    float membrane = 0.10 + 0.30 * fresnel;
    float alpha = (membrane + line * 0.45) * light * uOpacity;
    // Fade the hem so the fabric dissolves off the bottom instead of ending hard.
    alpha *= 1.0 - smoothstep(0.85, 1.0, vDrop);
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(uColor * (0.85 + 0.15 * light), alpha);
  }
`

export function NetCanopy({ impacts, lite = false, color = NET_COLOR, opacity = 0.95 }) {
  const material = useRef()
  const c = CANOPY
  const height = c.topY - c.bottomY

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uCells: { value: new THREE.Vector2(170, 75) },
      uLightDir: { value: new THREE.Vector3(2, 3, 5).normalize() },
      uImpacts: { value: Array.from({ length: MAX_IMPACTS }, () => new THREE.Vector4(0, 0, 0, 0)) },
      uImpactTimes: { value: new Array(MAX_IMPACTS).fill(-10) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame((state) => {
    const m = material.current
    if (!m) return
    m.uniforms.uTime.value = state.clock.elapsedTime
    for (let i = 0; i < MAX_IMPACTS; i++) {
      const im = impacts.current[i]
      if (im) {
        m.uniforms.uImpacts.value[i].set(im.x, im.y, im.z, im.strength)
        m.uniforms.uImpactTimes.value[i] = im.time
      }
    }
  })

  const segs = lite ? [80, 48] : [128, 80]

  return (
    <group>
      {/* Fabric: a unit cylinder the vertex shader reshapes into the canopy */}
      <mesh position={[0, (c.topY + c.bottomY) / 2, 0]} renderOrder={0} frustumCulled={false}>
        <cylinderGeometry args={[1, 1, height, segs[0], segs[1], true]} />
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={canopyVertexShader}
          fragmentShader={canopyFragmentShader}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Hoop — the fabric-covered ring that holds the canopy open */}
      <mesh position={[0, c.hoopY, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[c.hoopR + 0.02, 0.035, 10, 72]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>
      {/* Hanging cord up to the ceiling */}
      <mesh position={[0, c.topY + 1.2, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 2.4, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.8} />
      </mesh>
      {/* Gather knot at the top */}
      <mesh position={[0, c.topY, 0]}>
        <sphereGeometry args={[0.09, 12, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
    </group>
  )
}

/* ---------------------------------------------------------------------------
   Mosquito — flight rig in cylindrical coordinates around the canopy
   ------------------------------------------------------------------------ */
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2

// Phase boundaries of one flight cycle (normalised 0..1)
const APPROACH_END = 0.42
const HOLD_END = 0.62

export function Mosquito({
  index = 0,
  impacts,
  theta = 0.6, // angle around the canopy axis where this mosquito aims (0 = facing the camera)
  height = 0.5, // y on the canopy it aims for
  drift = [0.5, 0.7], // lateral drift: radians around the axis, world units up/down
  period = 11,
  phase = 0,
  rFar = 5.5, // how far out (from the axis) the approach starts
  scale = 1,
  color = MOSQUITO_COLOR,
}) {
  const group = useRef()
  const anim = useRef({ flutter: 0, depth: 0, probe: 0 })
  const scratch = useMemo(() => ({ pos: new THREE.Vector3(), next: new THREE.Vector3(), contactMade: false }), [])
  const seed = useMemo(() => {
    const s = index * 7.31 + 1.7
    return { a: Math.sin(s) * 6.28, b: Math.cos(s * 1.3) * 6.28, jitter: 0.8 + ((index * 37) % 5) * 0.1 }
  }, [index])
  const margin = 0.22

  /** Position in group-local space for normalised cycle position p. */
  const pathAt = (p, t, out) => {
    const far = p < APPROACH_END ? 1 - p / APPROACH_END : p > HOLD_END ? (p - HOLD_END) / (1 - HOLD_END) : 0
    const th = theta + Math.sin(p * Math.PI * 2 + seed.a) * drift[0] * (0.25 + 0.75 * far) + Math.sin(t * 3.1 * seed.jitter) * 0.01
    const y = height + Math.sin(p * Math.PI * 4 + seed.b) * drift[1] * (0.25 + 0.75 * far) + Math.cos(t * 2.3 * seed.jitter) * 0.03
    const surface = canopyRadius(y, th, t) + margin

    let r
    if (p < APPROACH_END) {
      r = THREE.MathUtils.lerp(rFar, surface, easeOutCubic(p / APPROACH_END))
    } else if (p < HOLD_END) {
      // Soft stop: three decaying jabs against the tulle — never through it.
      const q = (p - APPROACH_END) / (HOLD_END - APPROACH_END)
      r = surface + Math.abs(Math.sin(q * Math.PI * 3)) * (1 - q) * 0.28
    } else {
      const q = (p - HOLD_END) / (1 - HOLD_END)
      r = THREE.MathUtils.lerp(surface, rFar, easeInOutSine(q))
    }
    return out.set(r * Math.sin(th), y, r * Math.cos(th))
  }

  useFrame((state) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const p = ((t / period + phase) % 1 + 1) % 1

    pathAt(p, t, scratch.pos)
    pathAt((p + 0.004) % 1, t + 0.03, scratch.next)
    g.position.copy(scratch.pos)
    g.lookAt(g.parent.localToWorld(scratch.next))

    const holding = p >= APPROACH_END && p < HOLD_END
    if (holding) {
      if (!scratch.contactMade) {
        scratch.contactMade = true
        impacts.current[index % MAX_IMPACTS] = { x: scratch.pos.x, y: scratch.pos.y, z: scratch.pos.z, strength: 0.14 * scale, time: t }
      }
    } else {
      scratch.contactMade = false
    }

    const a = anim.current
    a.probe = holding ? 1 - (p - APPROACH_END) / (HOLD_END - APPROACH_END) : 0
    a.flutter = Math.sin(t * 95 + index) * (0.55 + a.probe * 0.25)
    const dist = Math.hypot(scratch.pos.x, scratch.pos.z)
    a.depth = THREE.MathUtils.clamp(1 - (dist - canopyRadius(scratch.pos.y, theta, t)) / (rFar - 1), 0, 1)
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
  const available = useAssetAvailable(assetUrl(HERO_MOSQUITO_MODEL.url), HERO_MOSQUITO_MODEL.enabled)
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
    const obj = cloneSkeleton(scene) // SkeletonUtils' clone handles rigged models
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
    for (let i = 0; i < wings.length; i++) wings[i].rotation.x = wingRest[i] + a.flutter * (i % 2 === 0 ? 1 : -1)
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
function CameraRig({ enabled, base }) {
  const { camera, pointer } = useThree()
  useFrame(() => {
    if (!enabled) return
    camera.position.x += (base[0] + pointer.x * 0.25 - camera.position.x) * 0.02
    camera.position.y += (base[1] + pointer.y * 0.15 - camera.position.y) * 0.02
    camera.lookAt(0.6, 0.4, 0)
  })
  return null
}

/* ---------------------------------------------------------------------------
   HeroNetScene — canopy + mosquitoes
   ------------------------------------------------------------------------ */
// theta: 0 faces the camera; positive = toward screen-right when viewed from +z.
// Scales are roughly half what they were: a mosquito reads as an insect at this
// size rather than a graphic, which is what the photographic hero needs.
const MOSQUITO_SET = [
  { theta: 0.55, height: 0.9, drift: [0.35, 0.6], period: 11, phase: 0.0, scale: 0.27 },
  { theta: -0.5, height: -0.6, drift: [0.3, 0.7], period: 13.5, phase: 0.45, scale: 0.23 },
  { theta: 1.15, height: 1.7, drift: [0.35, 0.5], period: 12, phase: 0.75, scale: 0.2 },
]

// Mobile: two mosquitoes working the gathered top around the hoop, above the text block.
const MOBILE_SET = [
  { theta: 0.6, height: 2.55, drift: [0.35, 0.3], period: 11, phase: 0.0, scale: 0.25 },
  { theta: -0.45, height: 3.15, drift: [0.3, 0.25], period: 13, phase: 0.5, scale: 0.21 },
]

export default function HeroNetScene({ lite = false, mosquitoes = true, net = true }) {
  const impacts = useRef([])
  const set = lite ? MOBILE_SET : MOSQUITO_SET
  // Desktop: canopy hangs on the right with the hoop below the nav, fabric running off the bottom.
  // Mobile (lite): centred, hoop in the upper fifth; the MOBILE_SET mosquitoes work the
  // narrow gathered top so the action sits above the text block rather than behind it.
  const position = lite ? [0.3, 0.7, 0] : [2.4, -1.0, 0]
  const rotation = [0, -0.35, 0]

  return (
    <group position={position} rotation={rotation} scale={lite ? 0.8 : 0.92}>
      {/* Omitted over the photographic hero: the photograph carries the net. The
          flight paths are unchanged, so the mosquitoes still work the same
          volume — they simply have nothing to ripple. */}
      {net && <NetCanopy impacts={impacts} lite={lite} />}
      {mosquitoes && set.map((m, i) => <Mosquito key={i} index={i} impacts={impacts} {...m} />)}
    </group>
  )
}

/* ---------------------------------------------------------------------------
   HeroCanvas — the R3F canvas with lights and a performance guard
   ------------------------------------------------------------------------ */
export function HeroCanvas({ lite = false, mosquitoes = true, net = true, onReady }) {
  const maxDpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, lite ? 1.5 : 2)
  const [dpr, setDpr] = useState(maxDpr)
  const cameraPos = lite ? [0, 0.6, 10.5] : [0, 0.4, 8.5]

  // Start fetching the model as soon as we know the file exists (no-op otherwise).
  const modelUrl = assetUrl(HERO_MOSQUITO_MODEL.url)
  const modelOk = useAssetAvailable(modelUrl, HERO_MOSQUITO_MODEL.enabled)
  useEffect(() => {
    if (modelOk) useGLTF.preload(modelUrl)
  }, [modelOk, modelUrl])

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: cameraPos, fov: lite ? 42 : 36, near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power', stencil: false }}
      frameloop="always"
      style={{ pointerEvents: 'none' }} // the hero text/buttons stay clickable
      aria-hidden="true"
      onCreated={({ camera }) => {
        camera.lookAt(0.6, 0.4, 0)
        onReady?.()
      }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(maxDpr)} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 3, 5]} intensity={1.1} />
      {/* Rim light from behind: catches wing edges and legs so the dark body separates from the teal. */}
      <directionalLight position={[-3, 2, -4]} intensity={1.6} color="#a9d3d8" />
      <HeroNetScene lite={lite} mosquitoes={mosquitoes} net={net} />
      <CameraRig enabled={!lite} base={cameraPos} />
    </Canvas>
  )
}
