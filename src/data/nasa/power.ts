/**
 * POWER CLIMATOLOGY
 * Owner: Track C
 * Source: NASA LaRC POWER, cached in ./power_neiva.json and ./power_magdalena.json.
 * Inputs:  site id (Neiva or Magdalena basin)
 * Outputs: monthly top-of-atmosphere and surface insolation, cloud amount and
 *          the usable-day fraction for optical instruments
 * Invariants: 0 <= cloudAmountPct <= 100; surface insolation <= TOA insolation
 * Assumptions: climatology is a 20+ year monthly baseline; the game maps cloud
 *              amount linearly to usable days.
 *
 * Unit warning: POWER returns kWh/m2/day, not W/m2. Do NOT pass the daily mean
 * into PowerOptions.irradianceFactor: the engine already applies sunlightFraction
 * and MEAN_INCIDENCE, so a daily mean would double-count night and understate the
 * array by roughly 3x. The array stays anchored to the solar constant; POWER's
 * gameplay hook is cloud cover for optical instruments.
 */
import magdalenaJson from './power_magdalena.json'
import neivaJson from './power_neiva.json'

export const CLIMATOLOGY_MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
] as const

export type ClimatologyMonth = (typeof CLIMATOLOGY_MONTHS)[number]
export type PowerSiteId = 'neiva' | 'magdalena'

export interface PowerSiteClimatology {
  id: PowerSiteId
  name: string
  latitude: number
  longitude: number
  /** Daily top-of-atmosphere insolation, kWh/m2/day. */
  toaKwhPerM2Day: Record<ClimatologyMonth, number>
  /** Daily surface insolation, kWh/m2/day (including cloud and atmosphere). */
  surfaceKwhPerM2Day: Record<ClimatologyMonth, number>
  /** Cloud amount, percent 0..100. */
  cloudAmountPct: Record<ClimatologyMonth, number>
  annual: {
    toaKwhPerM2Day: number
    surfaceKwhPerM2Day: number
    cloudAmountPct: number
  }
}

interface PowerCache {
  location: { name: string; latitude: number; longitude: number }
  data: {
    properties: {
      parameter: {
        ALLSKY_SFC_SW_DWN: Record<string, number>
        CLOUD_AMT: Record<string, number>
        TOA_SW_DWN: Record<string, number>
      }
    }
  }
}

function monthlyValues(record: Record<string, number>): Record<ClimatologyMonth, number> {
  const result = {} as Record<ClimatologyMonth, number>
  for (const month of CLIMATOLOGY_MONTHS) {
    result[month] = record[month]
  }
  return result
}

function buildSite(id: PowerSiteId, cache: PowerCache): PowerSiteClimatology {
  const params = cache.data.properties.parameter
  return {
    id,
    name: cache.location.name,
    latitude: cache.location.latitude,
    longitude: cache.location.longitude,
    toaKwhPerM2Day: monthlyValues(params.TOA_SW_DWN),
    surfaceKwhPerM2Day: monthlyValues(params.ALLSKY_SFC_SW_DWN),
    cloudAmountPct: monthlyValues(params.CLOUD_AMT),
    annual: {
      toaKwhPerM2Day: params.TOA_SW_DWN.ANN,
      surfaceKwhPerM2Day: params.ALLSKY_SFC_SW_DWN.ANN,
      cloudAmountPct: params.CLOUD_AMT.ANN,
    },
  }
}

export const POWER_SITES: Record<PowerSiteId, PowerSiteClimatology> = {
  neiva: buildSite('neiva', neivaJson as PowerCache),
  magdalena: buildSite('magdalena', magdalenaJson as PowerCache),
}

/** Solar constant at 1 AU, W/m2. Reference: docs/DATA_PROVENANCE.md. */
export const SOLAR_CONSTANT_W_PER_M2 = 1361

/** Converts a daily insolation in kWh/m2/day to a 24-hour mean flux in W/m2. */
export function kwhPerM2DayToWPerM2(value: number): number {
  return (value * 1000) / 24
}

/**
 * Fraction of days an optical instrument can see the ground through cloud.
 * Linear mapping, clamped to [0, 1]; game tuning, see docs/DATA_PROVENANCE.md.
 */
export function cloudUsableFraction(cloudAmountPct: number): number {
  return Math.min(1, Math.max(0, 1 - cloudAmountPct / 100))
}
