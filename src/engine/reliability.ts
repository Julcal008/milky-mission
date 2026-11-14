/**
 * RELIABILITY MODEL — series system with TRL-based instrument failure rates.
 * Owner: Track A.
 *
 * Invariants: 0 <= reliability <= 1; more instruments never increase reliability;
 *             longer missions never increase reliability.
 * Assumptions: independent failures, constant annual rate, no redundancy modelled.
 * Source: NASA TRL definitions; failure rates are game values (docs/GAME_DATA.md).
 */
import { getBus, getInstruments } from './catalog'
import type { Catalogs, MissionConfig } from './types'
import { DAYS_PER_YEAR } from './units'

/** Annual failure probability by TRL. Game values, labelled as such in GAME_DATA. */
export const TRL_FAILURE_PER_YEAR: Record<number, number> = {
  9: 0.05,
  8: 0.1,
  7: 0.15,
  6: 0.2,
  5: 0.3,
}

export function trlFailureProbability(trl: number): number {
  return TRL_FAILURE_PER_YEAR[trl] ?? 0.3
}

export interface ReliabilityBreakdown {
  busReliability: number
  instrumentsReliability: number
  overall: number
}

export function computeReliability(
  config: MissionConfig,
  catalogs: Catalogs,
  missionDays = 365,
): ReliabilityBreakdown {
  const bus = getBus(catalogs, config.busId)
  const instruments = getInstruments(catalogs, config.instrumentIds)
  const years = missionDays / DAYS_PER_YEAR

  const busReliability = Math.min(1, Math.max(0, bus.reliabilityPerYear ** years))

  const instrumentsReliability = instruments.reduce(
    (product, instrument) =>
      product * Math.min(1, Math.max(0, 1 - trlFailureProbability(instrument.trl) * years)),
    1,
  )

  return {
    busReliability,
    instrumentsReliability,
    overall: busReliability * instrumentsReliability,
  }
}
