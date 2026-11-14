/**
 * Spacecraft buses catalog - v0.1 values from docs/GAME_DATA.md.
 * Owner: Track C. Every entry carries source and confidence.
 */
import type { BusSpec } from '@/engine/types'

export const buses: BusSpec[] = [
  {
    id: 'cubesat12u',
    name: 'CubeSat 12U',
    dryMassKg: 24,
    payloadCapacityKg: 8,
    payloadVolumeM3: 0.02,
    busPowerW: 60,
    costUsdM: 2.5,
    reliabilityPerYear: 0.9,
    source: 'NASA State-of-the-Art Small Spacecraft Technology; CubeSat 101',
    confidence: 'estimate',
  },
  {
    id: 'micro',
    name: 'MicroSat 150',
    dryMassKg: 95,
    payloadCapacityKg: 60,
    payloadVolumeM3: 0.6,
    busPowerW: 220,
    costUsdM: 9,
    reliabilityPerYear: 0.94,
    source: 'Representative smallsat class; parametric cost',
    confidence: 'estimate',
  },
  {
    id: 'small',
    name: 'SmallSat 300',
    dryMassKg: 180,
    payloadCapacityKg: 120,
    payloadVolumeM3: 1.2,
    busPowerW: 450,
    costUsdM: 18,
    reliabilityPerYear: 0.96,
    source: 'Representative smallsat class; parametric cost',
    confidence: 'estimate',
  },
]
