/**
 * Solar arrays catalog - v0.1 values from docs/GAME_DATA.md.
 * Owner: Track C. Every entry carries source and confidence.
 */
import type { ArraySpec } from '@/engine/types'

export const arrays: ArraySpec[] = [
  {
    id: 'si',
    name: 'Silicon array',
    powerWPerM2: 180,
    degradationPerYear: 0.05,
    massKgPerM2: 2.5,
    costUsdMPerM2: 0.15,
    source: '18% cell efficiency x 1361 W/m2, before packing',
    confidence: 'derived',
  },
  {
    id: 'gaas',
    name: 'GaAs triple junction',
    powerWPerM2: 300,
    degradationPerYear: 0.03,
    massKgPerM2: 2.0,
    costUsdMPerM2: 0.35,
    source: '30% cell efficiency x 1361 W/m2, before packing',
    confidence: 'derived',
  },
]
