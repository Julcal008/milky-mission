/**
 * Mission store — the only bridge between the UI and the engine.
 * Owner: Track A.
 *
 * The store holds an incomplete `draft`. Every choice starts empty and the engine
 * only runs when the draft can be turned into a complete `MissionConfig`.
 */
import { create } from 'zustand'
import { catalogs } from '@/data/catalogs'
import { baselineConfig } from '@/engine/__fixtures__/baseline'
import { scenarioFixtures } from '@/engine/__fixtures__/scenario-fixture'
import type { DecisionChoice } from '@/engine/decisions'
import { buildMissionReport } from '@/engine/report'
import type { MissionReport } from '@/engine/report'
import { decodeSharedMission, encodeMission } from '@/engine/share'
import { simulateMission } from '@/engine/simulator'
import type {
  Difficulty,
  MissionConfig,
  MissionDraft,
  ScenarioId,
  SimulationResult,
  ValidationResult,
} from '@/engine/types'
import { validateMission } from '@/engine/validate'

export type MissingKey =
  | 'scenario'
  | 'orbit'
  | 'launcher'
  | 'bus'
  | 'propulsion'
  | 'array'
  | 'area'
  | 'battery'
  | 'comms'
  | 'network'
  | 'storage'
  | 'instruments'
  | 'requirements'

interface MissionState {
  draft: MissionDraft
  config: MissionConfig | null
  validation: ValidationResult | null
  missing: MissingKey[]
  players: number
  decisions: DecisionChoice[]
  simulation: SimulationResult | null
  report: MissionReport | null

  setDraft: (patch: Partial<MissionDraft>) => void
  startScenario: (scenarioId: ScenarioId, difficulty?: Difficulty) => void
  setPlayers: (players: number) => void
  setDecision: (eventId: string, optionId: string) => void
  applyDecision: (eventId: string, optionId: string) => SimulationResult | null
  restartSimulation: () => SimulationResult | null
  simulate: () => SimulationResult | null
  shareCode: () => string | null
  loadShareCode: (code: string) => boolean
  loadExample: (difficulty?: Difficulty) => void
  reset: () => void
}

function createEmptyDraft(): MissionDraft {
  return {
    difficulty: 'engineer',
    seed: Math.floor(Math.random() * 1_000_000_000),
    instrumentIds: [],
    requirements: [],
  }
}

export function missingFields(draft: MissionDraft): MissingKey[] {
  const missing: MissingKey[] = []
  if (!draft.scenarioId) missing.push('scenario')
  if (!draft.orbitId) missing.push('orbit')
  if (!draft.launcherId) missing.push('launcher')
  if (!draft.busId) missing.push('bus')
  if (!draft.propulsionId) missing.push('propulsion')
  if (!draft.arrayId) missing.push('array')
  if (!draft.arrayAreaM2) missing.push('area')
  if (!draft.batteryId) missing.push('battery')
  if (!draft.commsId) missing.push('comms')
  if (!draft.groundNetworkId) missing.push('network')
  if (!draft.storageId) missing.push('storage')
  if (draft.instrumentIds.length === 0) missing.push('instruments')
  if (draft.requirements.length !== 3) missing.push('requirements')
  return missing
}

function hasId(items: readonly { id: string }[], id: string): boolean {
  return items.some((item) => item.id === id)
}

/**
 * Shared links are untrusted input: every catalog and requirement ID must exist
 * before the engine sees the config. Otherwise an edited link can crash the
 * simulation with "Unknown instrument id".
 */
function isMissionConfigValid(config: MissionConfig): boolean {
  const requirementIds = scenarioFixtures[config.scenarioId].requirements.map((item) => item.id)
  return (
    hasId(catalogs.orbits, config.orbitId) &&
    hasId(catalogs.launchers, config.launcherId) &&
    hasId(catalogs.buses, config.busId) &&
    hasId(catalogs.propulsion, config.propulsionId) &&
    hasId(catalogs.arrays, config.arrayId) &&
    hasId(catalogs.batteries, config.batteryId) &&
    hasId(catalogs.comms, config.commsId) &&
    hasId(catalogs.groundNetworks, config.groundNetworkId) &&
    hasId(catalogs.storage, config.storageId) &&
    config.instrumentIds.every((id) => hasId(catalogs.instruments, id)) &&
    config.requirements.every((id) => requirementIds.includes(id))
  )
}

function buildConfig(draft: MissionDraft): MissionConfig | null {
  if (missingFields(draft).length > 0) {
    return null
  }
  return {
    scenarioId: draft.scenarioId!,
    difficulty: draft.difficulty ?? 'engineer',
    seed: draft.seed,
    orbitId: draft.orbitId!,
    launcherId: draft.launcherId!,
    busId: draft.busId!,
    propulsionId: draft.propulsionId!,
    arrayId: draft.arrayId!,
    arrayAreaM2: draft.arrayAreaM2!,
    batteryId: draft.batteryId!,
    commsId: draft.commsId!,
    groundNetworkId: draft.groundNetworkId!,
    storageId: draft.storageId!,
    instrumentIds: draft.instrumentIds,
    requirements: draft.requirements,
  }
}

function draftFromConfig(config: MissionConfig): MissionDraft {
  return {
    ...config,
    instrumentIds: [...config.instrumentIds],
    requirements: [...config.requirements],
  }
}

function evaluate(draft: MissionDraft): {
  config: MissionConfig | null
  validation: ValidationResult | null
  missing: MissingKey[]
} {
  const missing = missingFields(draft)
  const config = buildConfig(draft)
  const validation = config
    ? validateMission(config, scenarioFixtures[config.scenarioId], catalogs)
    : null
  return { config, validation, missing }
}

const initialDraft = createEmptyDraft()
const initial = evaluate(initialDraft)

export const useMissionStore = create<MissionState>((set, get) => ({
  draft: initialDraft,
  config: initial.config,
  validation: initial.validation,
  missing: initial.missing,
  players: 1,
  decisions: [],
  simulation: null,
  report: null,

  setDraft: (patch) => {
    const current = get().draft
    const next: MissionDraft = { ...current, ...patch }
    if (patch.scenarioId && patch.scenarioId !== current.scenarioId) {
      next.requirements = []
    }
    const result = evaluate(next)
    set({
      draft: next,
      ...result,
      simulation: null,
      report: null,
      decisions: [],
    })
  },

  setPlayers: (players) => set({ players: Math.min(4, Math.max(1, Math.round(players))) }),

  startScenario: (scenarioId, difficulty = 'engineer') => {
    const draft: MissionDraft = { ...createEmptyDraft(), scenarioId, difficulty }
    const result = evaluate(draft)
    set({
      draft,
      ...result,
      decisions: [],
      simulation: null,
      report: null,
    })
  },

  setDecision: (eventId, optionId) => {
    const others = get().decisions.filter((choice) => choice.eventId !== eventId)
    set({
      decisions: [...others, { eventId, optionId }],
      simulation: null,
      report: null,
    })
  },

  /**
   * Apply a decision and recompute in one store update. The playback modal must
   * not see a transient `simulation: null` between the decision and the re-run.
   */
  applyDecision: (eventId, optionId) => {
    const { config, validation, players } = get()
    if (!config || !validation) {
      return null
    }
    const decisions = [
      ...get().decisions.filter((choice) => choice.eventId !== eventId),
      { eventId, optionId },
    ]
    const scenario = scenarioFixtures[config.scenarioId]
    const simulation = simulateMission(config, scenario, catalogs, players, decisions)
    const report = buildMissionReport(simulation, scenario, validation)
    set({ decisions, simulation, report })
    return simulation
  },

  restartSimulation: () => {
    const { config, validation, players } = get()
    if (!config || !validation) {
      return null
    }
    const scenario = scenarioFixtures[config.scenarioId]
    const simulation = simulateMission(config, scenario, catalogs, players, [])
    const report = buildMissionReport(simulation, scenario, validation)
    set({ decisions: [], simulation, report })
    return simulation
  },

  simulate: () => {
    const { config, validation, players, decisions } = get()
    if (!config || !validation) {
      return null
    }
    const scenario = scenarioFixtures[config.scenarioId]
    const simulation = simulateMission(config, scenario, catalogs, players, decisions)
    set({
      simulation,
      report: buildMissionReport(simulation, scenario, validation),
    })
    return simulation
  },

  shareCode: () => {
    const { config, decisions, players } = get()
    return config ? encodeMission(config, decisions, players) : null
  },

  loadShareCode: (code) => {
    const shared = decodeSharedMission(code)
    if (!shared || !isMissionConfigValid(shared.config)) {
      return false
    }
    const draft = draftFromConfig(shared.config)
    const result = evaluate(draft)
    set({
      draft,
      ...result,
      players: shared.players,
      decisions: shared.decisions,
      simulation: null,
      report: null,
    })
    return true
  },

  loadExample: (difficulty = 'engineer') => {
    const draft: MissionDraft = { ...draftFromConfig(baselineConfig), difficulty }
    const result = evaluate(draft)
    set({
      draft,
      ...result,
      simulation: null,
      report: null,
      decisions: [],
    })
  },

  reset: () => {
    const draft = createEmptyDraft()
    const result = evaluate(draft)
    set({
      draft,
      ...result,
      players: 1,
      decisions: [],
      simulation: null,
      report: null,
    })
  },
}))
