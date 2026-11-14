/**
 * Launch vehicles catalog - v0.1 values from docs/GAME_DATA.md.
 * Owner: Track C. Every entry carries source and confidence.
 */
import type { LauncherSpec } from '@/engine/types'

export const launchers: LauncherSpec[] = [
  {
    id: 'rideshare',
    name: 'Rideshare (SSO 550)',
    capacityKg: { leo400: 0, sso500: 150, sso700: 0 },
    fairingM3: 1.0,
    costUsdM: 1.2,
    fixedOrbit: true,
    scheduleRisk: 0.25,
    source: 'Published rideshare pricing',
    confidence: 'estimate',
    note: 'Fixed 550 km SSO; cannot target other orbits',
  },
  {
    id: 'electron',
    name: 'Electron',
    capacityKg: { leo400: 300, sso500: 250, sso700: 180 },
    fairingM3: 1.5,
    costUsdM: 8,
    source: 'Rocket Lab payload user guide and list price',
    confidence: 'estimate',
  },
  {
    id: 'firefly',
    name: 'Firefly Alpha',
    capacityKg: { leo400: 900, sso500: 750, sso700: 550 },
    fairingM3: 6,
    costUsdM: 15,
    source: 'Firefly payload user guide',
    confidence: 'estimate',
  },
  {
    id: 'vegac',
    name: 'Vega-C',
    capacityKg: { leo400: 2800, sso500: 2300, sso700: 2000 },
    fairingM3: 12,
    costUsdM: 38,
    source: 'Arianespace/ESA public performance data',
    confidence: 'estimate',
  },
  {
    id: 'f9',
    name: 'Falcon 9',
    capacityKg: { leo400: 12000, sso500: 9000, sso700: 7000 },
    fairingM3: 60,
    costUsdM: 67,
    source: 'SpaceX payload user guide and list price',
    confidence: 'estimate',
  },
]
