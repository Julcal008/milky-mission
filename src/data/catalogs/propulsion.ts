/**
 * Propulsion catalog - v0.1 values from docs/GAME_DATA.md.
 * Owner: Track C. Every entry carries source and confidence.
 */
import type { PropulsionSpec } from '@/engine/types'

export const propulsion: PropulsionSpec[] = [
  {
    id: 'none',
    name: 'No propulsion',
    dryMassKg: 0,
    propellantMaxKg: 0,
    ispS: 0,
    costUsdM: 0,
    source: 'Game simplification',
    confidence: 'game',
  },
  {
    id: 'coldgas',
    name: 'Cold gas',
    dryMassKg: 6,
    propellantMaxKg: 8,
    ispS: 60,
    costUsdM: 0.8,
    source: 'Representative cold-gas system',
    confidence: 'estimate',
  },
  {
    id: 'mono',
    name: 'Monopropellant',
    dryMassKg: 14,
    propellantMaxKg: 20,
    ispS: 220,
    costUsdM: 2.5,
    source: 'Representative monopropellant system',
    confidence: 'estimate',
  },
  {
    id: 'green',
    name: 'Green monopropellant',
    dryMassKg: 16,
    propellantMaxKg: 25,
    ispS: 250,
    costUsdM: 3.5,
    source: 'Representative green monopropellant system',
    confidence: 'estimate',
  },
]
