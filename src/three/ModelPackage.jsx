/**
 * The Synera DuoForte pack, from a supplied glTF model.
 *
 * Replaces the procedural pouch in ProductPackage.jsx when a model file is
 * present (PRODUCT_MODEL in src/data/siteConfig.js). The model is centred and
 * scaled to the card at runtime rather than relying on its authored units, so
 * a re-export at a different scale still lands correctly.
 *
 * Motion matches the pouch it replaces: a slow continuous turn on Y, a gentle
 * bob, and drag-to-turn with inertia. `?packpose=<radians>` freezes it at an
 * angle, which is how public/product/pack-still.webp is captured — and the
 * reason preserveDrawingBuffer is switched on only in that mode, so the
 * canvas can be read back with its alpha channel intact.
 */
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei/core/PerformanceMonitor'
import { useGLTF } from '@react-three/drei/core/Gltf'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// Longest dimension of the model, in world units. 2.75 matches the height of
// the pouch this replaces, so the card's framing does not change.
const TARGET = 2.75
const SPIN = 0.32 // rad/s, the same rate as the procedural pack

/* Exposure control.
 *
 * The supplied material is glossy (roughness 0.2), so the film's wrinkles throw
 * a lot of specular. With a full-strength key light and environment the top of
 * the pack — where the light lands most squarely — clipped to white across a
 * quarter of its area, losing the seal strip and the top of the printed panel.
 * These values hold it in range: measured clipping above 247/255 in the top
 * third fell from 25.8% to 8.4%, while the green panel's median moved only
 * 107 -> 99, so the print stays saturated rather than going flat. The rest of
 * the clipping is the seal strip's own near-white artwork.
 *
 * Changing any of these means re-capturing public/product/pack-still.webp, or
 * the static fallback will be lit differently from the model. */
const ENV_INTENSITY = 0.32 // environment reflection on the model's own materials
const KEY_INTENSITY = 0.40 // main directional light
const EXPOSURE = 0.90

function Environment() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.02).texture
    scene.environment = env
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
  return null
}

function Model({ url, paused, pose }) {
  const spin = useRef()
  const drag = useRef({ active: false, velocity: 0 })
  const { scene } = useGLTF(url)

  // Centre on the origin and normalise the scale. Measured after cloning so the
  // model's own node transforms (this one carries a 90° X rotation) are included.
  const { object, scale, offset } = useMemo(() => {
    const obj = scene.clone(true)
    obj.traverse((o) => {
      if (!o.isMesh) return
      // A pack modelled as a sheet vanishes at grazing angles when single-sided.
      o.material.side = THREE.DoubleSide
      if (o.material.map) {
        o.material.map.anisotropy = 8
        o.material.map.colorSpace = THREE.SRGBColorSpace
      }
      // glTF has no envMapIntensity, so three defaults it to 1 — far too strong
      // against a RoomEnvironment probe for a material this glossy.
      o.material.envMapIntensity = ENV_INTENSITY
    })
    const box = new THREE.Box3().setFromObject(obj)
    const size = box.getSize(new THREE.Vector3())
    const centre = box.getCenter(new THREE.Vector3())
    const s = TARGET / Math.max(size.x, size.y, size.z, 1e-6)
    return { object: obj, scale: s, offset: centre.multiplyScalar(-s) }
  }, [scene])

  useFrame((state, dt) => {
    const g = spin.current
    if (!g) return
    const t = state.clock.elapsedTime
    if (pose != null) {
      g.rotation.set(-0.1, pose, 0)
      g.position.y = 0
      return
    }
    if (!drag.current.active) {
      drag.current.velocity = THREE.MathUtils.damp(drag.current.velocity, 0, 3, dt)
      g.rotation.y += ((paused ? 0 : SPIN) + drag.current.velocity) * dt
    }
    g.rotation.x = Math.sin(t * 0.6) * 0.05 - 0.1
    g.rotation.z = Math.sin(t * 0.4) * 0.015
    g.position.y = Math.sin(t * 0.9) * 0.05
  })

  useEffect(() => {
    const onMove = (e) => {
      if (!drag.current.active || !spin.current) return
      const dx = e.movementX || 0
      spin.current.rotation.y += dx * 0.01
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
    <group ref={spin} onPointerDown={() => (drag.current.active = true)}>
      <primitive object={object} scale={scale} position={offset} />
    </group>
  )
}

export default function ModelPackage({ url, active = true }) {
  const [dpr, setDpr] = useState(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2))
  const pose = useMemo(() => {
    if (typeof window === 'undefined') return null
    const v = new URLSearchParams(window.location.search).get('packpose')
    return v == null || v === '' || Number.isNaN(Number(v)) ? null : Number(v)
  }, [])
  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0.05, 5.95], fov: 34 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
        toneMapping: THREE.NeutralToneMapping,
        toneMappingExposure: EXPOSURE,
        // Only while capturing the still: it costs memory, and toDataURL needs it.
        preserveDrawingBuffer: pose != null,
      }}
      style={{ touchAction: 'pan-y', cursor: 'grab' }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <Environment />
      <ambientLight intensity={0.56} />
      {/* key — lower and less overhead than the procedural pack's, which was lit
          for a matte film rather than this glossy one */}
      <directionalLight position={[2.6, 2.2, 6.0]} intensity={KEY_INTENSITY} />
      {/* fill */}
      <directionalLight position={[-4.5, 1.2, 3.5]} intensity={0.3} />
      {/* rim, to lift the silhouette off the panel */}
      <directionalLight position={[-1.5, 2.5, -5]} intensity={0.38} />
      {/* soft bounce from below */}
      <directionalLight position={[0, -3.5, 1.5]} intensity={0.16} />
      <Suspense fallback={null}>
        <Model url={url} paused={!active} pose={pose} />
      </Suspense>
    </Canvas>
  )
}
