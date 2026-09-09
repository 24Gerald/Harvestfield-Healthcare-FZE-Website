import { useSyncExternalStore } from 'react'

/**
 * Tiny external store so UI outside the 3D canvas (the footer credit line)
 * knows whether the real mosquito model actually loaded.
 *   'idle' → not attempted   'loaded' → model in use   'fallback' → procedural mosquito in use
 */
let status = 'idle'
const listeners = new Set()

export const modelStatus = {
  get: () => status,
  set(next) {
    if (status === next) return
    status = next
    listeners.forEach((l) => l())
  },
  subscribe(l) {
    listeners.add(l)
    return () => listeners.delete(l)
  },
}

export function useModelStatus() {
  return useSyncExternalStore(modelStatus.subscribe, modelStatus.get, modelStatus.get)
}
