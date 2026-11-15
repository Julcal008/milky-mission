/**
 * Report derivation tests.
 */
import { describe, expect, it } from 'vitest'
import { baselineConfig } from './__fixtures__/baseline'
import { catalogs as catalogFixture } from '@/data/catalogs'
import { scenarioFixtures } from './__fixtures__/scenario-fixture'
import { buildMissionReport } from './report'
import { simulateMission } from './simulator'
import { validateMission } from './validate'

const storm = scenarioFixtures['storm-watch']

describe('buildMissionReport', () => {
  it('summarizes the reference mission', () => {
    const result = simulateMission(baselineConfig, storm, catalogFixture)
    const validation = validateMission(baselineConfig, storm, catalogFixture)
    const report = buildMissionReport(result, storm, validation)

    expect(report.verdict).toBe('success')
    expect(report.total).toBe(result.score.total)
    expect(report.steps.length).toBeGreaterThan(0)
    expect(report.steps[0].eventId).toBeTruthy()
    expect(report.steps[0].challengeId).toBeTruthy()
    expect(report.steps[0].descriptionKey).toBeTruthy()
    expect(report.highlights.length).toBeGreaterThan(0)
    expect(report.criticalEvents).toBeGreaterThan(0)
  })

  it('links a decision to its event step', () => {
    const first = simulateMission(baselineConfig, storm, catalogFixture)
    const cme = first.events.find((event) => event.type === 'cme_hit')!
    const decided = simulateMission(baselineConfig, storm, catalogFixture, 1, [
      { eventId: cme.id, optionId: 'shelter' },
    ])
    const report = buildMissionReport(decided, storm)

    const step = report.steps.find((item) => item.titleKey === 'event.cmeHit')
    expect(step?.optionId).toBe('shelter')
    expect(report.decisionCount).toBe(1)
    expect(report.handledCritical).toBeGreaterThan(0)
  })

  it('suggests fixes for a power-starved design', () => {
    const starved = { ...baselineConfig, arrayAreaM2: 0.1 }
    const result = simulateMission(starved, storm, catalogFixture)
    const validation = validateMission(starved, storm, catalogFixture)
    const report = buildMissionReport(result, storm, validation)

    const codes = report.suggestions.map((suggestion) => suggestion.code)
    expect(codes).toContain('POWER_MARGIN_LOW')
    expect(report.weakestComponent).toBeDefined()
  })

  it('never invents suggestions without validation issues', () => {
    const result = simulateMission(baselineConfig, storm, catalogFixture)
    const report = buildMissionReport(result, storm)
    expect(report.suggestions).toHaveLength(0)
  })
})
