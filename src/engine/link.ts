/**
 * LINK MODEL — free-space path loss, C/N0, link-limited rate and downlink volume.
 * Owner: Track A.
 *
 * Inputs:  comms terminal, ground network, orbit altitude
 * Outputs: slant range, path loss, C/N0, effective rate, passes/day, Gb/day
 * Invariants: link-limited rate never increases with range; effective rate <= terminal max
 * Assumptions: 10 deg minimum elevation, 480 s average pass, 65 % average pass utilization,
 *              3 dB implementation loss, 13 dB required Eb/N0 (10 dB + 3 dB margin).
 * Source: Friis / link-budget equations; see docs/GAME_DATA.md for the band table.
 */
import { getComms, getGroundNetwork, getOrbit } from './catalog'
import { nominalPassesPerDay } from './orbit'
import type { Catalogs, CommsId, MissionConfig } from './types'
import { EARTH_RADIUS_KM, degToRad } from './units'

/** Average pass duration, seconds. */
export const PASS_DURATION_S = 480

/** Fraction of a pass usable at the effective rate (elevation profile, handover). */
export const PASS_UTILIZATION = 0.65

/** Downlink protocol and coding efficiency. */
export const DOWNLINK_EFFICIENCY = 0.9

/** Implementation, pointing and atmospheric loss, dB. */
export const SYSTEM_LOSS_DB = 3

/** Required Eb/N0 with margin, dB. */
export const EB_N0_REQUIRED_DB = 13

/** Minimum ground-station elevation, degrees. */
export const MIN_ELEVATION_DEG = 10

export const BAND_FREQUENCY_HZ: Record<CommsId, number> = {
  uhf: 437e6,
  sband: 2.2e9,
  xband: 8.2e9,
  ka: 26e9,
}

/** Ground-station antenna gain, dBi, for the representative station of each band. */
export const GROUND_GAIN_DBI: Record<CommsId, number> = {
  uhf: 12,
  sband: 30,
  xband: 46,
  ka: 55,
}

/** System noise temperature, K. */
export const SYSTEM_NOISE_K: Record<CommsId, number> = {
  uhf: 800,
  sband: 500,
  xband: 300,
  ka: 400,
}

export interface LinkBreakdown {
  slantRangeKm: number
  pathLossDb: number
  receivedPowerDbm: number
  cn0DbHz: number
  /** Rate the link can support at maximum range, Mbps. */
  linkLimitedMbps: number
  /** min(terminal maximum, link-limited rate), Mbps. */
  effectiveRateMbps: number
  passesPerDay: number
  downlinkGbPerDay: number
}

/** Slant range to the ground station at a given elevation, km. */
export function slantRangeKm(altitudeKm: number, elevationDeg = MIN_ELEVATION_DEG): number {
  const elevation = degToRad(elevationDeg)
  const sinElevation = Math.sin(elevation)
  const term =
    EARTH_RADIUS_KM * EARTH_RADIUS_KM * sinElevation * sinElevation +
    altitudeKm * altitudeKm +
    2 * EARTH_RADIUS_KM * altitudeKm
  return Math.sqrt(term) - EARTH_RADIUS_KM * sinElevation
}

/** Free-space path loss, dB. */
export function pathLossDb(rangeKm: number, frequencyHz: number): number {
  const rangeM = rangeKm * 1000
  return 20 * Math.log10(rangeM) + 20 * Math.log10(frequencyHz) - 147.55
}

export function computeLinkBreakdown(config: MissionConfig, catalogs: Catalogs): LinkBreakdown {
  const orbit = getOrbit(catalogs, config.orbitId)
  const comms = getComms(catalogs, config.commsId)
  const network = getGroundNetwork(catalogs, config.groundNetworkId)

  const frequencyHz = BAND_FREQUENCY_HZ[config.commsId]
  const groundGainDbi = GROUND_GAIN_DBI[config.commsId]
  const noiseK = SYSTEM_NOISE_K[config.commsId]

  const rangeKm = slantRangeKm(orbit.altitudeKm)
  const fsplDb = pathLossDb(rangeKm, frequencyHz)

  const txPowerDbm = 10 * Math.log10(comms.txPowerW * 1000)
  const receivedPowerDbm =
    txPowerDbm + comms.antennaGainDbi + groundGainDbi - fsplDb - SYSTEM_LOSS_DB

  // N0 (dBm/Hz) = -198.6 + 10*log10(T/K) at 290 K reference for dBm.
  const n0DbmPerHz = -198.6 + 10 * Math.log10(noiseK)
  const cn0DbHz = receivedPowerDbm - n0DbmPerHz

  const linkLimitedMbps = 10 ** ((cn0DbHz - EB_N0_REQUIRED_DB) / 10) / 1e6
  const effectiveRateMbps = Math.min(comms.maxRateMbps, linkLimitedMbps)

  const passesPerDay = nominalPassesPerDay(orbit.altitudeKm, 1) * network.passesMultiplier

  const downlinkGbPerDay =
    (passesPerDay * PASS_DURATION_S * effectiveRateMbps * PASS_UTILIZATION * DOWNLINK_EFFICIENCY) /
    1000

  return {
    slantRangeKm: rangeKm,
    pathLossDb: fsplDb,
    receivedPowerDbm,
    cn0DbHz,
    linkLimitedMbps,
    effectiveRateMbps,
    passesPerDay,
    downlinkGbPerDay,
  }
}
