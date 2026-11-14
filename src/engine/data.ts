/**
 * DATA MODEL — generated science data, downlink capacity and delivery fraction.
 * Owner: Track A.
 *
 * Invariants: delivered fraction ∈ [0, 1]; adding an instrument never reduces generated data.
 * Assumptions: instruments generate at their nominal rate for the whole mission; the
 *              recorder smooths short-term peaks but cannot create downlink capacity.
 */
import { getInstruments, getStorage } from './catalog'
import type { Catalogs, MissionConfig } from './types'

export interface DataBreakdown {
  generatedGbPerDay: number
  downlinkGbPerDay: number
  /** Fraction of generated data that reaches the ground, 0..1. */
  deliveredFraction: number
  bufferCapacityGb: number
  /** Days until the recorder is full at the current deficit; null if downlink keeps up. */
  daysToFillBuffer: number | null
}

export function computeDataBreakdown(
  config: MissionConfig,
  catalogs: Catalogs,
  downlinkGbPerDay: number,
): DataBreakdown {
  const instruments = getInstruments(catalogs, config.instrumentIds)
  const storage = getStorage(catalogs, config.storageId)

  const generatedGbPerDay = instruments.reduce(
    (sum, instrument) => sum + instrument.dataGbPerDay,
    0,
  )

  const deliveredFraction =
    generatedGbPerDay <= 0 ? 1 : Math.min(1, Math.max(0, downlinkGbPerDay / generatedGbPerDay))

  const deficit = generatedGbPerDay - downlinkGbPerDay
  const daysToFillBuffer = deficit > 0 ? storage.capacityGb / deficit : null

  return {
    generatedGbPerDay,
    downlinkGbPerDay,
    deliveredFraction,
    bufferCapacityGb: storage.capacityGb,
    daysToFillBuffer,
  }
}
