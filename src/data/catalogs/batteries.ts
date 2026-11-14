/**
 * Batteries catalog - v0.1 values from docs/GAME_DATA.md.
 * Owner: Track C. Every entry carries source and confidence.
 */
import type { BatterySpec } from '@/engine/types'

export const batteries: BatterySpec[] = [
  {
    id: 'b300',
    name: 'Li-ion 300 Wh',
    capacityWh: 300,
    massKg: 2.5,
    costUsdM: 0.4,
    maxDoD: 0.8,
    source: 'Typical Li-ion smallsat pack (~120 Wh/kg)',
    confidence: 'estimate',
  },
  {
    id: 'b800',
    name: 'Li-ion 800 Wh',
    capacityWh: 800,
    massKg: 6,
    costUsdM: 0.9,
    maxDoD: 0.8,
    source: 'Typical Li-ion smallsat pack (~133 Wh/kg)',
    confidence: 'estimate',
  },
  {
    id: 'b1600',
    name: 'Li-ion 1600 Wh',
    capacityWh: 1600,
    massKg: 12,
    costUsdM: 1.7,
    maxDoD: 0.8,
    source: 'Typical Li-ion smallsat pack (~133 Wh/kg)',
    confidence: 'estimate',
  },
]
