/**
 * Catalog lookups.
 * Owner: Track A.
 *
 * The engine must never silently fall back to a default when an id is unknown:
 * that hides design errors. Lookups throw, validation catches them by checking
 * ids first and returning a ValidationIssue instead.
 */
import type {
  ArraySpec,
  BatterySpec,
  BusSpec,
  Catalogs,
  CommsSpec,
  GroundNetworkSpec,
  InstrumentSpec,
  LauncherSpec,
  OrbitSpec,
  PropulsionSpec,
  StorageSpec,
} from './types'

function requireById<T extends { id: string }>(items: readonly T[], id: string, kind: string): T {
  const found = items.find((item) => item.id === id)
  if (!found) {
    throw new Error(`Unknown ${kind} id: ${id}`)
  }
  return found
}

export function getOrbit(catalogs: Catalogs, id: string): OrbitSpec {
  return requireById(catalogs.orbits, id, 'orbit')
}

export function getLauncher(catalogs: Catalogs, id: string): LauncherSpec {
  return requireById(catalogs.launchers, id, 'launcher')
}

export function getBus(catalogs: Catalogs, id: string): BusSpec {
  return requireById(catalogs.buses, id, 'bus')
}

export function getPropulsion(catalogs: Catalogs, id: string): PropulsionSpec {
  return requireById(catalogs.propulsion, id, 'propulsion')
}

export function getArray(catalogs: Catalogs, id: string): ArraySpec {
  return requireById(catalogs.arrays, id, 'array')
}

export function getBattery(catalogs: Catalogs, id: string): BatterySpec {
  return requireById(catalogs.batteries, id, 'battery')
}

export function getComms(catalogs: Catalogs, id: string): CommsSpec {
  return requireById(catalogs.comms, id, 'comms')
}

export function getGroundNetwork(catalogs: Catalogs, id: string): GroundNetworkSpec {
  return requireById(catalogs.groundNetworks, id, 'ground network')
}

export function getStorage(catalogs: Catalogs, id: string): StorageSpec {
  return requireById(catalogs.storage, id, 'storage')
}

export function getInstrument(catalogs: Catalogs, id: string): InstrumentSpec {
  return requireById(catalogs.instruments, id, 'instrument')
}

export function getInstruments(catalogs: Catalogs, ids: readonly string[]): InstrumentSpec[] {
  return ids
    .filter((id): id is string => typeof id === 'string' && id.length > 0)
    .map((id) => getInstrument(catalogs, id))
}
