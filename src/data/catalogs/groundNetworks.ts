/**
 * Ground networks catalog - v0.1 values from docs/GAME_DATA.md.
 * Owner: Track C. Every entry carries source and confidence.
 */
import type { GroundNetworkSpec } from '@/engine/types'

export const groundNetworks: GroundNetworkSpec[] = [
  {
    id: 'neiva',
    name: 'Neiva station',
    stations: 1,
    passesMultiplier: 1,
    costUsdM: 0,
    source: 'Game model of station geometry',
    confidence: 'game',
  },
  {
    id: 'regional',
    name: 'Regional network (3)',
    stations: 3,
    passesMultiplier: 2.2,
    costUsdM: 2,
    source: 'Game model of station geometry',
    confidence: 'game',
  },
  {
    id: 'dsn',
    name: 'DSN',
    stations: 3,
    passesMultiplier: 3.5,
    costUsdM: 8,
    source: 'Game model of station geometry',
    confidence: 'game',
  },
]
