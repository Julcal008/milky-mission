/**
 * Mission store — the only bridge between the UI and the engine.
 * Owner: Track A.
 *
 * The UI never computes physics: it reads `config` and `validation` from here and
 * dispatches patches. Track C will replace the fixture catalogs/scenarios with the
 * real data; the store API stays the same.
 */
import { create } from 'zustand'
import { baselineConfig } from '@/engine/__fixtures__/baseline'
import { catalogFixture } from '@/engine/__fixtures__/catalog-fixture'
import { scenarioFixtures } from '@/engine/__fixtures__/scenario-fixture'
import type { MissionConfig, ValidationResult } from '@/engine/types'
import { validateMission } from '@/engine/validate'

interface MissionState {
  config: MissionConfig
  validation: ValidationResult
  setConfig: (patch: Partial<MissionConfig>) => void
  reset: () => void
}

function validate(config: MissionConfig): ValidationResult {
  return validateMission(config, scenarioFixtures[config.scenarioId], catalogFixture)
}

export const useMissionStore = create<MissionState>((set, get) => ({
  config: baselineConfig,
  validation: validate(baselineConfig),
  setConfig: (patch) => {
    const config = { ...get().config, ...patch }
    set({ config, validation: validate(config) })
  },
  reset: () => set({ config: baselineConfig, validation: validate(baselineConfig) }),
}))
