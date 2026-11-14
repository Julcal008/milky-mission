/**
 * Communications catalog - v0.1 values from docs/GAME_DATA.md.
 * Owner: Track C. Every entry carries source and confidence.
 */
import type { CommsSpec } from '@/engine/types'

export const comms: CommsSpec[] = [
  {
    id: 'uhf',
    name: 'UHF 437 MHz',
    band: 'UHF',
    txPowerW: 1,
    antennaGainDbi: 3,
    maxRateMbps: 0.0096,
    massKg: 1.5,
    costUsdM: 0.3,
    source: 'Representative UHF TT&C terminal',
    confidence: 'estimate',
    note: 'TT&C only; cannot carry science data',
  },
  {
    id: 'sband',
    name: 'S-band 2.2 GHz',
    band: 'S',
    txPowerW: 5,
    antennaGainDbi: 12,
    maxRateMbps: 2,
    massKg: 4,
    costUsdM: 1.2,
    source: 'Representative S-band smallsat terminal',
    confidence: 'estimate',
  },
  {
    id: 'xband',
    name: 'X-band 8.2 GHz',
    band: 'X',
    txPowerW: 10,
    antennaGainDbi: 28,
    maxRateMbps: 50,
    massKg: 9,
    costUsdM: 4,
    source: 'Representative X-band smallsat terminal',
    confidence: 'estimate',
  },
  {
    id: 'ka',
    name: 'Ka-band 26 GHz',
    band: 'Ka',
    txPowerW: 20,
    antennaGainDbi: 34,
    maxRateMbps: 200,
    massKg: 12,
    costUsdM: 6,
    source: 'Representative Ka-band smallsat terminal',
    confidence: 'estimate',
  },
]
