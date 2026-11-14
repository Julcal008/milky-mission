/**
 * COST MODEL — hardware, margin, launch and operations.
 * Owner: Track A.
 *
 * Invariants: adding a component never reduces cost; longer missions never reduce ops cost.
 * Assumptions: 15 % hardware margin, $0.3M adapter, $0.5M per month of operations.
 * Source: parametric estimates documented in docs/DATA_PROVENANCE.md (confidence: estimate).
 */
import {
  getArray,
  getBattery,
  getBus,
  getComms,
  getGroundNetwork,
  getInstruments,
  getLauncher,
  getPropulsion,
  getStorage,
} from './catalog'
import type { Catalogs, MissionConfig } from './types'

/** Launch adapter and separation system, $M. */
export const ADAPTER_COST_USD_M = 0.3

/** Hardware cost margin. */
export const COST_MARGIN_FRACTION = 0.15

/** Operations cost per month, $M. */
export const OPS_COST_USD_M_PER_MONTH = 0.5

export const DAYS_PER_MONTH = 30.44

export interface CostBreakdown {
  busUsdM: number
  propulsionUsdM: number
  instrumentsUsdM: number
  arrayUsdM: number
  batteryUsdM: number
  commsUsdM: number
  groundNetworkUsdM: number
  storageUsdM: number
  adapterUsdM: number
  hardwareUsdM: number
  marginUsdM: number
  launchUsdM: number
  operationsUsdM: number
  totalUsdM: number
}

export function computeCostBreakdown(
  config: MissionConfig,
  catalogs: Catalogs,
  missionDays = 365,
): CostBreakdown {
  const bus = getBus(catalogs, config.busId)
  const propulsion = getPropulsion(catalogs, config.propulsionId)
  const instruments = getInstruments(catalogs, config.instrumentIds)
  const array = getArray(catalogs, config.arrayId)
  const battery = getBattery(catalogs, config.batteryId)
  const comms = getComms(catalogs, config.commsId)
  const network = getGroundNetwork(catalogs, config.groundNetworkId)
  const storage = getStorage(catalogs, config.storageId)
  const launcher = getLauncher(catalogs, config.launcherId)

  const busUsdM = bus.costUsdM
  const propulsionUsdM = propulsion.costUsdM
  const instrumentsUsdM = instruments.reduce((sum, instrument) => sum + instrument.costUsdM, 0)
  const arrayUsdM = array.costUsdMPerM2 * config.arrayAreaM2
  const batteryUsdM = battery.costUsdM
  const commsUsdM = comms.costUsdM
  const groundNetworkUsdM = network.costUsdM
  const storageUsdM = storage.costUsdM
  const adapterUsdM = ADAPTER_COST_USD_M

  const hardwareUsdM =
    busUsdM +
    propulsionUsdM +
    instrumentsUsdM +
    arrayUsdM +
    batteryUsdM +
    commsUsdM +
    groundNetworkUsdM +
    storageUsdM +
    adapterUsdM

  const marginUsdM = hardwareUsdM * COST_MARGIN_FRACTION
  const launchUsdM = launcher.costUsdM
  const operationsUsdM = (missionDays / DAYS_PER_MONTH) * OPS_COST_USD_M_PER_MONTH

  return {
    busUsdM,
    propulsionUsdM,
    instrumentsUsdM,
    arrayUsdM,
    batteryUsdM,
    commsUsdM,
    groundNetworkUsdM,
    storageUsdM,
    adapterUsdM,
    hardwareUsdM,
    marginUsdM,
    launchUsdM,
    operationsUsdM,
    totalUsdM: hardwareUsdM + marginUsdM + launchUsdM + operationsUsdM,
  }
}
