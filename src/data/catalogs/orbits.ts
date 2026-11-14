/**
 * Orbits catalog - v0.1 values from docs/GAME_DATA.md.
 * Owner: Track C. Every entry carries source and confidence.
 */
import type { OrbitSpec } from '@/engine/types'

export const orbits: OrbitSpec[] = [
  {
    id: 'sso500',
    name: 'SSO 500 km',
    altitudeKm: 500,
    inclinationDeg: 97.4,
    dragMSYear: 8,
    radiationKradYear: 3,
    source: 'Derived from Keplerian geometry',
    confidence: 'derived',
  },
  {
    id: 'sso700',
    name: 'SSO 700 km',
    altitudeKm: 700,
    inclinationDeg: 98.2,
    dragMSYear: 3,
    radiationKradYear: 5,
    source: 'Derived from Keplerian geometry',
    confidence: 'derived',
  },
  {
    id: 'leo400',
    name: 'LEO 400 km, 51.6°',
    altitudeKm: 400,
    inclinationDeg: 51.6,
    dragMSYear: 60,
    radiationKradYear: 6,
    source: 'Derived from Keplerian geometry',
    confidence: 'derived',
  },
  {
    id: 'leo550eq',
    name: 'LEO 550 km, 5°',
    altitudeKm: 550,
    inclinationDeg: 5,
    dragMSYear: 12,
    radiationKradYear: 4,
    source: 'Derived from Keplerian geometry',
    confidence: 'derived',
  },
]
