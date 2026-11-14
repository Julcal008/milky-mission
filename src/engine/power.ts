/**
 * POWER MODEL — array generation, loads, eclipse energy and battery margin.
 * Owner: Track A.
 *
 * Inputs:  mission configuration, catalogs, mission duration, beta angle, irradiance factor
 * Outputs: beginning/end-of-life array power, orbit-average generation, loads and margins
 * Invariants: more array area never reduces generation; more instruments never increases margin
 * Assumptions: circular orbit, cylindrical shadow, mean incidence 0.75, packing 0.9,
 *              comms bus load = 1.5 x RF power, 10 W of heaters, battery usable = capacity x DoD.
 * Source: solar cell specific power from docs/DATA_PROVENANCE.md; eclipse from orbit.ts.
 */
import { getArray, getBattery, getComms, getInstruments } from './catalog'
import { eclipseMinutes, sunlightFraction } from './orbit'
import type { BusId, Catalogs, MissionConfig } from './types'
import { DAYS_PER_YEAR } from './units'

/** Fraction of the array area that is active cells. */
export const PACKING_FACTOR = 0.9

/** Mean cosine of the Sun incidence angle over an orbit. */
export const MEAN_INCIDENCE = 0.75

/** RF-to-bus power overhead for the communications subsystem. */
export const COMMS_POWER_OVERHEAD = 1.5

/** Average heater load, W. */
export const HEATER_POWER_W = 10

/** Nominal housekeeping load per bus class, W. */
export const HOUSEKEEPING_POWER_W: Record<BusId, number> = {
  cubesat12u: 30,
  micro: 45,
  small: 65,
}

export interface PowerOptions {
  /** Beta angle, degrees. Defaults to 0: the worst case for eclipse duration. */
  betaDeg?: number
  /** Irradiance relative to 1 AU. 1 = nominal; POWER climatology can override. */
  irradianceFactor?: number
}

export interface PowerBreakdown {
  arrayPowerBOLW: number
  arrayPowerEOLW: number
  sunlightFraction: number
  orbitAverageGenerationW: number
  busLoadW: number
  payloadLoadW: number
  commsLoadW: number
  heaterLoadW: number
  totalLoadW: number
  /** Generation minus load, W. Negative means the battery never recovers. */
  marginW: number
  /** Margin divided by load, 0..1+. */
  marginFraction: number
  eclipseMinutes: number
  eclipseEnergyWh: number
  usableBatteryWh: number
  /** Usable battery energy minus eclipse demand, Wh. */
  energyMarginWh: number
}

export function computePowerBreakdown(
  config: MissionConfig,
  catalogs: Catalogs,
  missionDays = 365,
  options: PowerOptions = {},
): PowerBreakdown {
  const orbit = catalogs.orbits.find((item) => item.id === config.orbitId)
  if (!orbit) {
    throw new Error(`Unknown orbit id: ${config.orbitId}`)
  }

  const array = getArray(catalogs, config.arrayId)
  const battery = getBattery(catalogs, config.batteryId)
  const comms = getComms(catalogs, config.commsId)
  const instruments = getInstruments(catalogs, config.instrumentIds)

  const betaDeg = options.betaDeg ?? 0
  const irradianceFactor = options.irradianceFactor ?? 1
  const years = missionDays / DAYS_PER_YEAR

  const arrayPowerBOLW =
    config.arrayAreaM2 * array.powerWPerM2 * PACKING_FACTOR * MEAN_INCIDENCE * irradianceFactor
  const arrayPowerEOLW = arrayPowerBOLW * (1 - array.degradationPerYear) ** years

  const sunFraction = sunlightFraction(orbit.altitudeKm, betaDeg)
  const orbitAverageGenerationW = arrayPowerEOLW * sunFraction

  const busLoadW = HOUSEKEEPING_POWER_W[config.busId]
  const payloadLoadW = instruments.reduce((sum, instrument) => sum + instrument.powerW, 0)
  const commsLoadW = comms.txPowerW * COMMS_POWER_OVERHEAD
  const heaterLoadW = HEATER_POWER_W
  const totalLoadW = busLoadW + payloadLoadW + commsLoadW + heaterLoadW

  const marginW = orbitAverageGenerationW - totalLoadW
  const marginFraction = totalLoadW > 0 ? marginW / totalLoadW : 0

  const eclipseMin = eclipseMinutes(orbit.altitudeKm, betaDeg)
  const eclipseEnergyWh = (totalLoadW * eclipseMin) / 60
  const usableBatteryWh = battery.capacityWh * battery.maxDoD
  const energyMarginWh = usableBatteryWh - eclipseEnergyWh

  return {
    arrayPowerBOLW,
    arrayPowerEOLW,
    sunlightFraction: sunFraction,
    orbitAverageGenerationW,
    busLoadW,
    payloadLoadW,
    commsLoadW,
    heaterLoadW,
    totalLoadW,
    marginW,
    marginFraction,
    eclipseMinutes: eclipseMin,
    eclipseEnergyWh,
    usableBatteryWh,
    energyMarginWh,
  }
}
