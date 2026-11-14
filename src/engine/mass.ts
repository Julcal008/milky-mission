/**
 * MASS MODEL — component budget, margin, launch capacity and delta-v.
 * Owner: Track A.
 *
 * Inputs:  mission configuration + catalogs
 * Outputs: mass breakdown, total with margin, launch capacity, available/required delta-v
 * Invariants: adding a component never decreases mass; margin decreases when mass grows
 * Assumptions: 15 % project margin; full propellant tank; adapter 5 kg.
 * Source: Tsiolkovsky rocket equation; margin policy from NASA systems engineering practice.
 */
import {
  getArray,
  getBattery,
  getBus,
  getComms,
  getInstruments,
  getPropulsion,
  getStorage,
} from './catalog'
import type { Catalogs, LauncherSpec, MissionConfig, OrbitSpec } from './types'
import { DAYS_PER_YEAR, G0_M_S2 } from './units'

/** Launch adapter and separation system, kg. */
export const ADAPTER_MASS_KG = 5

/** Project mass margin applied on top of the component subtotal. */
export const MASS_MARGIN_FRACTION = 0.15

export interface MassBreakdown {
  busKg: number
  propulsionDryKg: number
  propellantKg: number
  instrumentsKg: number
  arrayKg: number
  batteryKg: number
  commsKg: number
  storageKg: number
  adapterKg: number
  /** Sum of all components before margin. */
  subtotalKg: number
  marginKg: number
  /** Subtotal plus margin: the mass compared against launcher capacity. */
  totalKg: number
}

export function computeMassBreakdown(config: MissionConfig, catalogs: Catalogs): MassBreakdown {
  const bus = getBus(catalogs, config.busId)
  const propulsion = getPropulsion(catalogs, config.propulsionId)
  const instruments = getInstruments(catalogs, config.instrumentIds)
  const array = getArray(catalogs, config.arrayId)
  const battery = getBattery(catalogs, config.batteryId)
  const comms = getComms(catalogs, config.commsId)
  const storage = getStorage(catalogs, config.storageId)

  const busKg = bus.dryMassKg
  const propulsionDryKg = propulsion.dryMassKg
  const propellantKg = propulsion.propellantMaxKg
  const instrumentsKg = instruments.reduce((sum, instrument) => sum + instrument.massKg, 0)
  const arrayKg = array.massKgPerM2 * config.arrayAreaM2
  const batteryKg = battery.massKg
  const commsKg = comms.massKg
  const storageKg = storage.massKg

  const subtotalKg =
    busKg +
    propulsionDryKg +
    propellantKg +
    instrumentsKg +
    arrayKg +
    batteryKg +
    commsKg +
    storageKg +
    ADAPTER_MASS_KG
  const marginKg = subtotalKg * MASS_MARGIN_FRACTION

  return {
    busKg,
    propulsionDryKg,
    propellantKg,
    instrumentsKg,
    arrayKg,
    batteryKg,
    commsKg,
    storageKg,
    adapterKg: ADAPTER_MASS_KG,
    subtotalKg,
    marginKg,
    totalKg: subtotalKg + marginKg,
  }
}

/** Launch capacity for the selected orbit, kg. 0 means "not available". */
export function launchCapacityKg(launcher: LauncherSpec, orbit: OrbitSpec): number {
  switch (orbit.id) {
    case 'leo400':
      return launcher.capacityKg.leo400
    case 'sso500':
      return launcher.capacityKg.sso500
    case 'sso700':
      return launcher.capacityKg.sso700
    case 'leo550eq':
      // No dedicated column: average of the two LEO figures, documented simplification.
      return (launcher.capacityKg.leo400 + launcher.capacityKg.sso500) / 2
  }
}

/** Mass margin as a fraction of capacity. Negative values mean the launch is impossible. */
export function massMarginFraction(totalMassKg: number, capacityKg: number): number {
  if (capacityKg <= 0) {
    return -1
  }
  return (capacityKg - totalMassKg) / capacityKg
}

/** Tsiolkovsky: delta-v available from a given propellant load, m/s. */
export function deltaVMps(ispS: number, wetMassKg: number, propellantKg: number): number {
  if (ispS <= 0 || propellantKg <= 0) {
    return 0
  }
  const finalMassKg = wetMassKg - propellantKg
  if (finalMassKg <= 0) {
    return 0
  }
  return ispS * G0_M_S2 * Math.log(wetMassKg / finalMassKg)
}

/** Delta-v required to counter atmospheric drag for a mission duration. */
export function requiredDeltaVMps(orbit: OrbitSpec, missionDays: number): number {
  return orbit.dragMSYear * (missionDays / DAYS_PER_YEAR)
}
