/**
 * Canopy shape — shared by the mosquito rig (JS) and the fabric shader (GLSL
 * copy in HeroNetScene.jsx). Keep the two in sync: the mosquitoes stop exactly
 * where the shader draws the tulle.
 */
import { MathUtils } from 'three'

export const CANOPY = {
  topY: 3.6, // where the fabric gathers to the hanging cord
  hoopY: 2.9, // rigid hoop that holds the canopy open
  hoopR: 0.95,
  bottomY: -3.2, // hem (below the viewport — the fabric runs off the bottom of the hero)
  bottomR: 2.35,
  foldAmp: 0.17, // depth of the hanging folds at the hem
}

const clamp01 = (v) => Math.min(1, Math.max(0, v))

/** Radius of the tulle at height y and angle theta (radians), at time t. */
export function canopyRadius(y, theta, t) {
  const c = CANOPY
  let r
  if (y > c.hoopY) {
    // Gather cone above the hoop
    r = MathUtils.lerp(c.hoopR, 0.05, clamp01((y - c.hoopY) / (c.topY - c.hoopY)))
  } else {
    // Flare below the hoop — slightly concave so it hangs rather than tents
    const k = clamp01((c.hoopY - y) / (c.hoopY - c.bottomY))
    r = c.hoopR + (c.bottomR - c.hoopR) * Math.pow(k, 1.35)
  }
  const drop = clamp01((c.hoopY - y) / (c.hoopY - c.bottomY))
  const folds = c.foldAmp * drop * (Math.sin(theta * 11.0 + 0.4) * 0.6 + Math.sin(theta * 6.0 - 1.3) * 0.4)
  const breathe = 0.05 * drop * Math.sin(theta * 2.0 + t * 0.6) + 0.03 * Math.sin(y * 1.5 + t * 0.45)
  return r + folds + breathe
}

