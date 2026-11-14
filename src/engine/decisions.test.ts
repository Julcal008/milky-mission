/**
 * Decision tests: recording, effects, cost and reproducibility.
 */
import { describe, expect, it } from 'vitest'
import { baselineConfig } from './__fixtures__/baseline'
import { catalogs as catalogFixture } from '@/data/catalogs'
import { scenarioFixtures } from './__fixtures__/scenario-fixture'
import { simulateMission } from './simulator'

const storm = scenarioFixtures['storm-watch']

describe('decisions', () => {
  it('records a decision for a scripted CME', () => {
    const first = simulateMission(baselineConfig, storm, catalogFixture)
    const cme = first.events.find((event) => event.type === 'cme_hit')
    expect(cme).toBeDefined()

    const decided = simulateMission(baselineConfig, storm, catalogFixture, 1, [
      { eventId: cme!.id, optionId: 'shelter' },
    ])

    expect(decided.decisions).toHaveLength(1)
    expect(decided.decisions[0].optionId).toBe('shelter')
    expect(decided.decisions[0].costUsdM).toBe(0)
  })

  it('sheltering during a CME reduces data on that day', () => {
    const first = simulateMission(baselineConfig, storm, catalogFixture)
    const cme = first.events.find((event) => event.type === 'cme_hit')!
    const decided = simulateMission(baselineConfig, storm, catalogFixture, 1, [
      { eventId: cme.id, optionId: 'shelter' },
    ])

    const baselineDay = first.days[cme.day - 1]
    const decidedDay = decided.days[cme.day - 1]
    expect(decidedDay.dataGeneratedGb).toBeLessThan(baselineDay.dataGeneratedGb)
  })

  it('is deterministic with decisions', () => {
    const first = simulateMission(baselineConfig, storm, catalogFixture)
    const cme = first.events.find((event) => event.type === 'cme_hit')!
    const decisions = [{ eventId: cme.id, optionId: 'shelter' }]
    const a = simulateMission(baselineConfig, storm, catalogFixture, 1, decisions)
    const b = simulateMission(baselineConfig, storm, catalogFixture, 1, decisions)
    expect(JSON.stringify(a)).toBe(JSON.stringify(b))
  })

  it('charges the cost of a paid decision to the mission', () => {
    // A tiny array forces a power deficit, which has a paid safe-mode option.
    const starved = { ...baselineConfig, arrayAreaM2: 0.1 }
    const first = simulateMission(starved, storm, catalogFixture)
    const deficit = first.events.find((event) => event.type === 'power_deficit')
    expect(deficit).toBeDefined()

    const decided = simulateMission(starved, storm, catalogFixture, 1, [
      { eventId: deficit!.id, optionId: 'safe-mode' },
    ])

    expect(decided.decisions[0].costUsdM).toBeCloseTo(0.1, 5)
    expect(decided.budgets.costUsdM).toBeCloseTo(first.budgets.costUsdM + 0.1, 5)
  })

  it('handling an anomaly improves robustness (validity)', () => {
    const starved = { ...baselineConfig, arrayAreaM2: 0.1 }
    const first = simulateMission(starved, storm, catalogFixture)
    const deficit = first.events.find((event) => event.type === 'power_deficit')!
    const decided = simulateMission(starved, storm, catalogFixture, 1, [
      { eventId: deficit.id, optionId: 'shed-load' },
    ])
    expect(decided.score.robustness).toBeGreaterThan(first.score.robustness)
  })

  it('ignores an unknown decision id', () => {
    const result = simulateMission(baselineConfig, storm, catalogFixture, 1, [
      { eventId: 'does-not-exist', optionId: 'shelter' },
    ])
    expect(result.decisions).toHaveLength(0)
  })
})
