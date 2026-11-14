/**
 * Simulator tests: determinism, bounds and the reference mission outcome.
 */
import { describe, expect, it } from 'vitest'
import { baselineConfig } from './__fixtures__/baseline'
import { catalogFixture } from './__fixtures__/catalog-fixture'
import { scenarioFixtures } from './__fixtures__/scenario-fixture'
import { simulateMission } from './simulator'

const storm = scenarioFixtures['storm-watch']

describe('simulateMission', () => {
  it('produces one day state per mission day', () => {
    const result = simulateMission(baselineConfig, storm, catalogFixture)
    expect(result.days).toHaveLength(storm.durationDays)
    expect(result.days[0].day).toBe(1)
    expect(result.days[result.days.length - 1].day).toBe(storm.durationDays)
  })

  it('is deterministic: same config and seed produce identical results', () => {
    const first = simulateMission(baselineConfig, storm, catalogFixture)
    const second = simulateMission(baselineConfig, storm, catalogFixture)
    expect(JSON.stringify(first)).toBe(JSON.stringify(second))
  })

  it('produces different day states with a different seed', () => {
    const first = simulateMission(baselineConfig, storm, catalogFixture)
    const second = simulateMission(
      { ...baselineConfig, seed: baselineConfig.seed + 1 },
      storm,
      catalogFixture,
    )
    expect(JSON.stringify(first.days)).not.toBe(JSON.stringify(second.days))
  })

  it('keeps the score inside [0, 1000] and equal to the sum of components', () => {
    const { score } = simulateMission(baselineConfig, storm, catalogFixture)
    const sum =
      score.missionSuccess + score.science + score.efficiency + score.robustness + score.teamwork
    expect(score.total).toBe(sum)
    expect(score.total).toBeGreaterThanOrEqual(0)
    expect(score.total).toBeLessThanOrEqual(1000)
  })

  it('meets the reference mission requirements', () => {
    const result = simulateMission(baselineConfig, storm, catalogFixture)
    for (const id of baselineConfig.requirements) {
      const requirement = result.requirements.find((item) => item.id === id)
      expect(requirement?.fraction, `requirement ${id}`).toBeGreaterThanOrEqual(0.99)
    }
    expect(result.verdict).toBe('success')
  })

  it('scores the reference mission between 700 and 950', () => {
    const { score } = simulateMission(baselineConfig, storm, catalogFixture)
    expect(score.total).toBeGreaterThanOrEqual(700)
    expect(score.total).toBeLessThanOrEqual(950)
  })

  it('includes the scripted space-weather events', () => {
    const result = simulateMission(baselineConfig, storm, catalogFixture)
    const types = new Set(result.events.map((event) => event.type))
    expect(types.has('cme_hit')).toBe(true)
    expect(types.has('flare_x')).toBe(true)
  })

  it('never produces a negative battery state', () => {
    const result = simulateMission(baselineConfig, storm, catalogFixture)
    for (const day of result.days) {
      expect(day.batterySocWh).toBeGreaterThanOrEqual(0)
    }
  })

  it('does not declare success when the power budget is negative (validity)', () => {
    const starved = { ...baselineConfig, arrayAreaM2: 0.1 }
    const result = simulateMission(starved, storm, catalogFixture)
    expect(result.budgets.powerMarginW).toBeLessThan(0)
    expect(result.verdict).not.toBe('success')
  })

  it('fails a mission with a blocking design error', () => {
    const andes = scenarioFixtures['andes-flood-watch']
    const overBudget = {
      ...baselineConfig,
      scenarioId: 'andes-flood-watch' as const,
      orbitId: 'sso700' as const,
      launcherId: 'firefly' as const,
      busId: 'small' as const,
      arrayAreaM2: 3.5,
      batteryId: 'b1600' as const,
      commsId: 'ka' as const,
      groundNetworkId: 'dsn' as const,
      storageId: 's64' as const,
      instrumentIds: ['sar', 'hri'] as const,
      requirements: ['R1', 'R2', 'R3'],
    }
    const result = simulateMission(
      { ...overBudget, instrumentIds: [...overBudget.instrumentIds] },
      andes,
      catalogFixture,
    )
    expect(result.verdict).toBe('failure')
  })
})
