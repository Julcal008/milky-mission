/**
 * Mission store — the only bridge between the UI and the engine.
 * Owner: Track A.
 *
 * The UI never computes physics: it reads `config`, `validation` and `simulation`
 * from here and dispatches patches or decisions. Running the simulation is an
 * explicit action so the player can design first and fly later.
 */
import { create } from 'zustand'
import { baselineConfig } from '@/engine/__fixtures__/baseline'
import { catalogFixture } from '@/engine/__fixtures__/catalog-fixture'
import { scenarioFixtures } from '@/engine/__fixtures__/scenario-fixture'
import type { DecisionChoice } from '@/engine/decisions'
import { simulateMission } from '@/engine/simulator'
import type { MissionConfig, SimulationResult, ValidationResult } from '@/engine/types'
import { validateMission } from '@/engine/validate'

interface MissionState {
  config: MissionConfig
  validation: ValidationResult
  players: number
  decisions: DecisionChoice[]
  simulation: SimulationResult | null
  setConfig: (patch: Partial<MissionConfig>) => void
  setPlayers: (players: number) => void
  setDecision: (eventId: string, optionId: string) => void
  simulate: () => SimulationResult
  reset: () => void
}

function validate(config: MissionConfig): ValidationResult {
  return validateMission(config, scenarioFixtures[config.scenarioId], catalogFixture)
}

export const useMissionStore = create<MissionState>((set, get) => ({
  config: baselineConfig,
  validation: validate(baselineConfig),
  players: 1,
  decisions: [],
  simulation: null,

  setConfig: (patch) => {
    const config = { ...get().config, ...patch }
    set({ config, validation: validate(config), simulation: null, decisions: [] })
  },

  setPlayers: (players) => set({ players: Math.min(4, Math.max(1, Math.round(players))) }),

  setDecision: (eventId, optionId) => {
    const others = get().decisions.filter((choice) => choice.eventId !== eventId)
    set({ decisions: [...others, { eventId, optionId }], simulation: null })
  },

  simulate: () => {
    const { config, players, decisions } = get()
    const simulation = simulateMission(
      config,
      scenarioFixtures[config.scenarioId],
      catalogFixture,
      players,
      decisions,
    )
    set({ simulation })
    return simulation
  },

  reset: () =>
    set({
      config: baselineConfig,
      validation: validate(baselineConfig),
      players: 1,
      decisions: [],
      simulation: null,
    }),
}))
