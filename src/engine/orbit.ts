/**
 * ORBIT MODEL — period, eclipse, passes and revisit.
 * Owner: Track A.
 *
 * Inputs:  altitude, beta angle, swath, pointing capability
 * Outputs: period, orbits/day, eclipse fraction and minutes, passes/day, revisit
 * Invariants: eclipse fraction ∈ [0, 0.5]; period increases with altitude
 * Assumptions: circular orbit, spherical Earth, cylindrical shadow, one ground
 *              station at ~3°N with 10° minimum elevation, 8-minute average pass.
 * Source: Kepler's third law; eclipse geometry from Vallado (simplified).
 */
import { clamp, EARTH_MU_KM3_S2, EARTH_RADIUS_KM, degToRad } from './units'

/** Orbital period of a circular orbit, seconds. */
export function orbitalPeriodS(altitudeKm: number): number {
  const semiMajorKm = EARTH_RADIUS_KM + altitudeKm
  return 2 * Math.PI * Math.sqrt((semiMajorKm * semiMajorKm * semiMajorKm) / EARTH_MU_KM3_S2)
}

/** Number of revolutions per day. */
export function orbitsPerDay(altitudeKm: number): number {
  return 86_400 / orbitalPeriodS(altitudeKm)
}

/**
 * Fraction of the orbit spent in Earth's shadow (cylindrical model).
 * Returns 0 when the orbit plane misses the shadow cylinder entirely.
 */
export function eclipseFraction(altitudeKm: number, betaDeg: number): number {
  const radiusKm = EARTH_RADIUS_KM + altitudeKm
  const shadowHalfAngle = Math.asin(clamp(EARTH_RADIUS_KM / radiusKm, -1, 1))
  const betaRad = Math.abs(degToRad(betaDeg))

  if (betaRad >= shadowHalfAngle) {
    return 0
  }

  const numerator = Math.sqrt(radiusKm * radiusKm - EARTH_RADIUS_KM * EARTH_RADIUS_KM)
  const denominator = radiusKm * Math.cos(betaRad)
  const argument = clamp(numerator / denominator, -1, 1)
  return Math.acos(argument) / Math.PI
}

/** Eclipse duration in minutes. */
export function eclipseMinutes(altitudeKm: number, betaDeg: number): number {
  return (eclipseFraction(altitudeKm, betaDeg) * orbitalPeriodS(altitudeKm)) / 60
}

/** Fraction of the orbit in sunlight. */
export function sunlightFraction(altitudeKm: number, betaDeg: number): number {
  return 1 - eclipseFraction(altitudeKm, betaDeg)
}

/**
 * Nominal passes per day over a single ground station.
 * `VISIBILITY_FACTOR` is a game simplification: roughly 40 % of revolutions
 * bring the satellite inside a useful elevation cone at mid-latitude.
 */
export const VISIBILITY_FACTOR = 0.4

export function nominalPassesPerDay(altitudeKm: number, stations = 1): number {
  return orbitsPerDay(altitudeKm) * VISIBILITY_FACTOR * stations
}

/**
 * Simplified revisit time over a target, hours.
 * Agile pointing (HRI, SAR) multiplies the effective number of looks by 1.5.
 */
export function revisitHours(swathKm: number, passesPerDay: number, agilePointing = false): number {
  const accessFactor = clamp(swathKm / 100, 0.3, 1.2) * (agilePointing ? 1.5 : 1)
  const targetPasses = passesPerDay * accessFactor
  return 24 / Math.max(targetPasses, 0.1)
}
