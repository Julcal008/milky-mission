/**
 * Reference mission from docs/GAME_DATA.md — used by engine tests and the UI fixtures.
 * Owner: Track A.
 */
import type { MissionConfig } from '../types'

export const baselineConfig: MissionConfig = {
  scenarioId: 'storm-watch',
  seed: 20260514,
  orbitId: 'sso500',
  launcherId: 'electron',
  busId: 'micro',
  propulsionId: 'mono',
  arrayId: 'gaas',
  arrayAreaM2: 1.2,
  batteryId: 'b300',
  commsId: 'sband',
  groundNetworkId: 'neiva',
  storageId: 's16',
  instrumentIds: ['xrs', 'mag', 'gnssro', 'suvi'],
  requirements: ['R1', 'R2', 'R3'],
}
