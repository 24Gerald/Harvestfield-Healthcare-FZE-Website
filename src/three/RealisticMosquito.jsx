/**
 * Procedural, anatomically-based mosquito (Anopheles-like: the malaria vector).
 *
 * Built from primitives so it ships without any asset, but modelled properly:
 *   head with compound eyes, proboscis, antennae and palps
 *   humped thorax, tapered banded abdomen
 *   six three-segment legs that trail in flight and reach forward to grasp
 *   the net while the mosquito probes it
 *   two long veined wings, each drawn as three phase-offset ghosts so the
 *   wing beat reads as motion blur instead of a strobing plane
 *
 * Driven by the flight rig in HeroNetScene.jsx through `anim.current`:
 *   flutter (wing angle), depth (0 far → 1 at net), probe (0..1 while pushing)
 */
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BODY_COLOR = '#2b1d16'
const BAND_COLOR = '#5a4535'
const EYE_COLOR = '#0c0806'

/* ---------- textures (generated once, shared by every mosquito) ---------- */
let wingTexture
function getWingTexture() {
  if (wingTexture) return wingTexture
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 192
  const ctx = c.getContext('2d')
  // Membrane
  ctx.save()
  ctx.translate(256, 96)
  ctx.scale(1, 0.36)
  ctx.beginPath()
  ctx.arc(0, 0, 250, 0, Math.PI * 2)
  const g = ctx.createRadialGradient(-60, 0, 20, 0, 0, 260)
  g.addColorStop(0, 'rgba(255,255,255,0.55)')
  g.addColorStop(1, 'rgba(220,240,242,0.28)')
  ctx.fillStyle = g
  ctx.fill()
  ctx.restore()
  // Veins — longitudinal
  ctx.strokeStyle = 'rgba(70,50,38,0.9)'
  ctx.lineWidth = 2
  const veins = [
    [10, 96, 200, 60, 500, 90],
    [10, 96, 220, 80, 505, 100],
    [10, 96, 240, 100, 490, 118],
    [10, 96, 200, 122, 440, 140],
    [10, 96, 160, 130, 330, 150],
  ]
  for (const [x0, y0, cx, cy, x1, y1] of veins) {
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.quadraticCurveTo(cx, cy, x1, y1)
    ctx.stroke()
  }
  // Cross veins
  ctx.lineWidth = 1.2
  for (const [x, y0, y1] of [[180, 68, 88], [300, 76, 104], [380, 90, 118], [260, 108, 132]]) {
    ctx.beginPath()
    ctx.moveTo(x, y0)
    ctx.lineTo(x, y1)
    ctx.stroke()
  }
  // Scale fringe along the trailing edge (Anopheles wings look spotted)
  ctx.fillStyle = 'rgba(60,44,34,0.8)'
  for (let i = 0; i < 40; i++) {
    const t = i / 40
    const x = 20 + t * 470
    const y = 96 + Math.sqrt(Math.max(0, 1 - ((x - 256) / 250) ** 2)) * 90 * 0.36 + 2
    ctx.fillRect(x, y, 3, 4 + Math.random() * 3)
  }
  wingTexture = new THREE.CanvasTexture(c)
  wingTexture.colorSpace = THREE.SRGBColorSpace
  return wingTexture
}

let bandTexture
function getBandTexture() {
  if (bandTexture) return bandTexture
  const c = document.createElement('canvas')
  c.width = 32
  c.height = 256
  const ctx = c.getContext('2d')
  ctx.fillStyle = BODY_COLOR
  ctx.fillRect(0, 0, 32, 256)
  ctx.fillStyle = BAND_COLOR
  for (let y = 24; y < 256; y += 32) ctx.fillRect(0, y, 32, 6)
  bandTexture = new THREE.CanvasTexture(c)
  bandTexture.colorSpace = THREE.SRGBColorSpace
  return bandTexture
}

/* ---------- shared geometry ---------- */
const legSeg = new THREE.CylinderGeometry(1, 0.7, 1, 5) // scaled per segment
const sphereGeo = new THREE.SphereGeometry(1, 12, 10)
const wingGeo = new THREE.PlaneGeometry(1, 0.36)
wingGeo.translate(0.5, 0, 0) // hinge at x = 0 so rotation flaps from the root

function antennaGeometry(side) {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(side * 0.09, 0.06, 0.12),
    new THREE.Vector3(side * 0.16, 0.02, 0.22),
  )
  return new THREE.TubeGeometry(curve, 8, 0.004, 4, false)
}

/**
 * One leg: hip → femur → tibia → tarsus. `pose` blends between the trailing
 * flight pose (0) and the forward grasping pose (1).
 */
function Leg({ side, index, mat, poseRef, phase }) {
  const hip = useRef()
  const knee = useRef()
  const ankle = useRef()
  // Rest angles per leg pair: front legs reach forward, rear legs trail back.
  const base = [
    { hip: 0.9, knee: 1.5, ankle: 0.6, spread: 0.55 }, // front
    { hip: 1.4, knee: 1.6, ankle: 0.7, spread: 0.75 }, // middle
    { hip: 2.1, knee: 1.4, ankle: 0.8, spread: 0.6 }, // rear
  ][index]
  const lengths = [0.34, 0.36, 0.42]

  useFrame((state) => {
    const p = poseRef.current
    const t = state.clock.elapsedTime
    const sway = Math.sin(t * 5 + phase) * 0.06 * (1 - p)
    // Grasping: every leg swings forward toward the net and opens at the knee.
    const hipAngle = THREE.MathUtils.lerp(base.hip, 0.45 + index * 0.12, p) + sway
    const kneeAngle = THREE.MathUtils.lerp(base.knee, 1.0, p)
    const ankleAngle = THREE.MathUtils.lerp(base.ankle, 0.5, p)
    if (hip.current) hip.current.rotation.set(hipAngle, 0, side * base.spread)
    if (knee.current) knee.current.rotation.x = -kneeAngle
    if (ankle.current) ankle.current.rotation.x = ankleAngle
  })

  return (
    <group ref={hip} position={[side * 0.06, -0.03, 0.12 - index * 0.11]}>
      {/* femur */}
      <mesh geometry={legSeg} material={mat} position={[0, -lengths[0] / 2, 0]} scale={[0.011, lengths[0], 0.011]} />
      <group ref={knee} position={[0, -lengths[0], 0]}>
        <mesh geometry={legSeg} material={mat} position={[0, -lengths[1] / 2, 0]} scale={[0.008, lengths[1], 0.008]} />
        <group ref={ankle} position={[0, -lengths[1], 0]}>
          <mesh geometry={legSeg} material={mat} position={[0, -lengths[2] / 2, 0]} scale={[0.006, lengths[2], 0.006]} />
        </group>
      </group>
    </group>
  )
}

/** A wing drawn as three ghost copies at phase offsets — a cheap motion blur. */
function Wing({ side, mat, animRef }) {
  const ghosts = [useRef(), useRef(), useRef()]
  const offsets = [0, 0.42, 0.84]
  useFrame(() => {
    const a = animRef.current
    for (let i = 0; i < 3; i++) {
      const g = ghosts[i].current
      if (!g) continue
      // Flap about the body axis (z): wings sweep up/down; slight fore/aft feathering.
      const angle = Math.sin(a.flutterPhase + offsets[i]) * (0.55 + a.probe * 0.25)
      g.rotation.set(0.15, 0, side * (0.35 + angle))
    }
  })
  return (
    <group position={[side * 0.05, 0.11, 0.02]} rotation={[0, side * -0.25, 0]}>
      {ghosts.map((r, i) => (
        <mesh key={i} ref={r} geometry={wingGeo} material={mat} scale={[side * 0.62, 0.62, 1]} />
      ))}
    </group>
  )
}

export default function RealisticMosquito({ anim }) {
  const body = useRef()
  const poseRef = useRef(0)
  const wingAnim = useRef({ flutterPhase: 0, probe: 0 })

  const mats = useMemo(() => {
    const bodyMat = new THREE.MeshStandardMaterial({ color: BODY_COLOR, roughness: 0.55, metalness: 0.05, transparent: true })
    const abdomenMat = new THREE.MeshStandardMaterial({ map: getBandTexture(), roughness: 0.6, transparent: true })
    const eyeMat = new THREE.MeshStandardMaterial({ color: EYE_COLOR, roughness: 0.25, metalness: 0.1, transparent: true })
    const legMat = new THREE.MeshStandardMaterial({ color: '#1f150f', roughness: 0.7, transparent: true })
    const wingMat = new THREE.MeshBasicMaterial({
      map: getWingTexture(),
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    return { bodyMat, abdomenMat, eyeMat, legMat, wingMat }
  }, [])

  const antL = useMemo(() => antennaGeometry(-1), [])
  const antR = useMemo(() => antennaGeometry(1), [])

  useFrame((state) => {
    const a = anim.current
    const t = state.clock.elapsedTime
    poseRef.current = a.probe
    wingAnim.current.flutterPhase = t * 140 // ~22 beats/s on screen; ghosts fill the gaps
    wingAnim.current.probe = a.probe

    // Body pitches nose-down slightly in flight and more while probing the net.
    if (body.current) {
      body.current.rotation.x = -0.18 - a.probe * 0.28 + Math.sin(t * 2.2) * 0.02
      body.current.position.y = Math.sin(t * 9) * 0.004 // hover tremor
    }
    // Distance fade so far mosquitoes read as atmosphere, near ones as the subject.
    const fade = 0.35 + a.depth * 0.65
    mats.bodyMat.opacity = fade
    mats.abdomenMat.opacity = fade
    mats.eyeMat.opacity = fade
    mats.legMat.opacity = fade * 0.95
    mats.wingMat.opacity = 0.32 * fade
  })

  return (
    <group ref={body} scale={1.35}>
      {/* Thorax — humped */}
      <mesh geometry={sphereGeo} material={mats.bodyMat} position={[0, 0.03, 0.03]} scale={[0.075, 0.085, 0.11]} />
      {/* Abdomen — tapered, banded, angled slightly down */}
      <mesh geometry={sphereGeo} material={mats.abdomenMat} position={[0, -0.01, -0.2]} rotation={[0.12, 0, 0]} scale={[0.05, 0.05, 0.24]} />
      <mesh geometry={sphereGeo} material={mats.abdomenMat} position={[0, -0.03, -0.42]} rotation={[0.18, 0, 0]} scale={[0.028, 0.026, 0.06]} />
      {/* Head */}
      <group position={[0, 0.03, 0.15]}>
        <mesh geometry={sphereGeo} material={mats.bodyMat} scale={[0.045, 0.045, 0.045]} />
        <mesh geometry={sphereGeo} material={mats.eyeMat} position={[-0.03, 0.005, 0.01]} scale={[0.024, 0.026, 0.024]} />
        <mesh geometry={sphereGeo} material={mats.eyeMat} position={[0.03, 0.005, 0.01]} scale={[0.024, 0.026, 0.024]} />
        {/* Proboscis */}
        <mesh geometry={legSeg} material={mats.legMat} position={[0, -0.02, 0.2]} rotation={[Math.PI / 2 + 0.25, 0, 0]} scale={[0.006, 0.34, 0.006]} />
        {/* Palps */}
        <mesh geometry={legSeg} material={mats.legMat} position={[-0.012, -0.01, 0.12]} rotation={[Math.PI / 2 + 0.2, 0, -0.1]} scale={[0.004, 0.16, 0.004]} />
        <mesh geometry={legSeg} material={mats.legMat} position={[0.012, -0.01, 0.12]} rotation={[Math.PI / 2 + 0.2, 0, 0.1]} scale={[0.004, 0.16, 0.004]} />
        {/* Antennae */}
        <mesh geometry={antL} material={mats.legMat} position={[-0.015, 0.02, 0.03]} />
        <mesh geometry={antR} material={mats.legMat} position={[0.015, 0.02, 0.03]} />
      </group>
      {/* Legs — three pairs */}
      {[0, 1, 2].map((i) => (
        <group key={i}>
          <Leg side={-1} index={i} mat={mats.legMat} poseRef={poseRef} phase={i * 1.3} />
          <Leg side={1} index={i} mat={mats.legMat} poseRef={poseRef} phase={i * 1.3 + 0.7} />
        </group>
      ))}
      {/* Wings */}
      <Wing side={-1} mat={mats.wingMat} animRef={wingAnim} />
      <Wing side={1} mat={mats.wingMat} animRef={wingAnim} />
    </group>
  )
}
