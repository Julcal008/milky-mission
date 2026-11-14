/**
 * Onboard storage catalog - v0.1 values from docs/GAME_DATA.md.
 * Owner: Track C. Every entry carries source and confidence.
 */
import type { StorageSpec } from '@/engine/types'

export const storage: StorageSpec[] = [
  {
    id: 's4',
    name: '4 GB recorder',
    capacityGb: 4,
    massKg: 1,
    costUsdM: 0.1,
    source: 'Representative COTS recorder',
    confidence: 'estimate',
  },
  {
    id: 's16',
    name: '16 GB recorder',
    capacityGb: 16,
    massKg: 2,
    costUsdM: 0.3,
    source: 'Representative COTS recorder',
    confidence: 'estimate',
  },
  {
    id: 's64',
    name: '64 GB recorder',
    capacityGb: 64,
    massKg: 4,
    costUsdM: 0.6,
    source: 'Representative COTS recorder',
    confidence: 'estimate',
  },
]
