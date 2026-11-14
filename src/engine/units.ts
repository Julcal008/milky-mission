/**
 * Physical constants and unit helpers.
 * Owner: Track A (Simulation). No React, no DOM, no side effects.
 *
 * Every constant carries its unit in the name. When a value is an
 * approximation, the comment says so; the UI surfaces these assumptions.
 */

/** Mean Earth radius, km (IUGG). */
export const EARTH_RADIUS_KM = 6371

/** Earth gravitational parameter, km³/s² (EGM2008). */
export const EARTH_MU_KM3_S2 = 398_600.4418

/** Standard gravity, m/s². */
export const G0_M_S2 = 9.80665

/** Solar irradiance at 1 AU, W/m². */
export const SOLAR_CONSTANT_W_M2 = 1361

export const SECONDS_PER_DAY = 86_400
export const DAYS_PER_YEAR = 365

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI
}

/** Clamp a value into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Clamp into [0, 1] — convenient for fractions and normalized scores. */
export function clamp01(value: number): number {
  return clamp(value, 0, 1)
}

/** Round to a fixed number of decimals (keeps UI numbers stable). */
export function roundTo(value: number, decimals = 0): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}
