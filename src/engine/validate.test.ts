/**
 * Validation tests: budgets, blocking errors and warnings.
 */
import { describe, expect, it } from 'vitest'
import { baselineConfig } from './__fixtures__/baseline'
import { catalogFixture } from './__fixtures__/catalog-fixture'
import { scenarioFixtures } from './__fixtures__/scenario-fixture'
import { validateMission } from './validate'
import type { MissionConfig } from './types'

const storm = scenarioFixtures['storm-watch']

function codes(config: MissionConfig): string[] {
  return validateMission(config, storm, catalogFixture).issues.map((issue) => issue.code)
}

describe('validateMission — reference mission', () => {
  it('is valid and matches the reference budgets', () => {
    const result = validateMission(baselineConfig, storm, catalogFixture)
    expect(result.ok).toBe(true)
    expect(result.budgets.massKg).toBeCloseTo(196.5, 0)
    expect(result.budgets.massCapacityKg).toBe(250)
    expect(result.budgets.powerMarginW).toBeCloseTo(48.2, 0)
    expect(result.budgets.costUsdM).toBeCloseTo(43.2, 1)
    expect(result.budgets.lifetimeDays).toBe(365)
    expect(result.budgets.reliability).toBeGreaterThan(0.5)
  })

  it('does not report errors for the reference mission', () => {
    const errors = validateMission(baselineConfig, storm, catalogFixture).issues.filter(
      (issue) => issue.severity === 'error',
    )
    expect(errors).toHaveLength(0)
  })
})

describe('validateMission — blocking errors', () => {
  it('rejects more than four instruments', () => {
    const config: MissionConfig = {
      ...baselineConfig,
      instrumentIds: ['xrs', 'mag', 'gnssro', 'suvi', 'ais'],
    }
    expect(codes(config)).toContain('TOO_MANY_INSTRUMENTS')
  })

  it('requires exactly three requirements', () => {
    const config: MissionConfig = { ...baselineConfig, requirements: ['R1'] }
    expect(codes(config)).toContain('WRONG_REQUIREMENT_COUNT')
  })

  it('rejects unknown requirement ids', () => {
    const config: MissionConfig = { ...baselineConfig, requirements: ['R1', 'R2', 'R9'] }
    expect(codes(config)).toContain('UNKNOWN_REQUIREMENT')
  })

  it('rejects duplicate requirements', () => {
    const config: MissionConfig = { ...baselineConfig, requirements: ['R1', 'R1', 'R2'] }
    expect(codes(config)).toContain('DUPLICATE_REQUIREMENT')
  })

  it('rejects a rideshare to a non-fixed orbit', () => {
    const config: MissionConfig = {
      ...baselineConfig,
      launcherId: 'rideshare',
      orbitId: 'sso700',
    }
    expect(codes(config)).toContain('FIXED_ORBIT_MISMATCH')
  })

  it('rejects a spacecraft heavier than the launcher capacity', () => {
    const config: MissionConfig = {
      ...baselineConfig,
      instrumentIds: ['xrs', 'suvi', 'sar', 'hri'],
    }
    expect(codes(config)).toContain('MASS_OVER_CAPACITY')
  })

  it('rejects a mission over budget', () => {
    const andes = scenarioFixtures['andes-flood-watch']
    const overBudget: MissionConfig = {
      scenarioId: 'andes-flood-watch',
      seed: 1,
      orbitId: 'sso700',
      launcherId: 'firefly',
      busId: 'small',
      propulsionId: 'mono',
      arrayId: 'gaas',
      arrayAreaM2: 3.5,
      batteryId: 'b1600',
      commsId: 'ka',
      groundNetworkId: 'dsn',
      storageId: 's64',
      instrumentIds: ['sar', 'hri'],
      requirements: ['R1', 'R2', 'R3'],
    }
    const result = validateMission(overBudget, andes, catalogFixture)
    expect(result.ok).toBe(false)
    expect(result.issues.map((issue) => issue.code)).toContain('BUDGET_EXCEEDED')
  })
})

describe('validateMission — warnings and info', () => {
  it('flags an unsupported chosen requirement', () => {
    const config: MissionConfig = {
      ...baselineConfig,
      instrumentIds: ['xrs', 'suvi', 'gnssro'],
      requirements: ['R1', 'R2', 'R4'],
    }
    expect(codes(config)).toContain('REQUIREMENT_UNSUPPORTED')
  })

  it('warns about a slow UHF link for science data', () => {
    const config: MissionConfig = { ...baselineConfig, commsId: 'uhf' }
    expect(codes(config)).toContain('LINK_TOO_SLOW')
  })

  it('warns about a short lifetime in a low orbit without propulsion', () => {
    const config: MissionConfig = {
      ...baselineConfig,
      orbitId: 'leo400',
      propulsionId: 'none',
      instrumentIds: ['xrs'],
    }
    expect(codes(config)).toContain('LIFETIME_SHORT')
  })

  it('informs about an oversized launcher', () => {
    const config: MissionConfig = { ...baselineConfig, launcherId: 'f9' }
    expect(codes(config)).toContain('HEAVY_LAUNCHER')
  })
})
