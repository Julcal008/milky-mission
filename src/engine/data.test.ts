/**
 * Data delivery tests.
 */
import { describe, expect, it } from 'vitest'
import { baselineConfig } from './__fixtures__/baseline'
import { catalogFixture } from './__fixtures__/catalog-fixture'
import { computeDataBreakdown } from './data'
import type { MissionConfig } from './types'

describe('computeDataBreakdown', () => {
  it('generates the sum of instrument data rates', () => {
    const data = computeDataBreakdown(baselineConfig, catalogFixture, 3.41)
    expect(data.generatedGbPerDay).toBeCloseTo(4.056, 3)
  })

  it('delivers about 84 % of the reference mission data', () => {
    const data = computeDataBreakdown(baselineConfig, catalogFixture, 3.41)
    expect(data.deliveredFraction).toBeCloseTo(0.84, 2)
  })

  it('never delivers more than was generated', () => {
    const data = computeDataBreakdown(baselineConfig, catalogFixture, 100)
    expect(data.deliveredFraction).toBe(1)
  })

  it('adding a high-volume instrument reduces delivery (validity)', () => {
    const sar: MissionConfig = {
      ...baselineConfig,
      instrumentIds: [...baselineConfig.instrumentIds, 'sar'],
    }
    const before = computeDataBreakdown(baselineConfig, catalogFixture, 3.41)
    const after = computeDataBreakdown(sar, catalogFixture, 3.41)
    expect(after.generatedGbPerDay).toBeGreaterThan(before.generatedGbPerDay)
    expect(after.deliveredFraction).toBeLessThan(before.deliveredFraction)
  })

  it('reports null buffer fill time when downlink keeps up', () => {
    const data = computeDataBreakdown(baselineConfig, catalogFixture, 10)
    expect(data.daysToFillBuffer).toBeNull()
  })

  it('reports a finite buffer fill time when there is a deficit', () => {
    const data = computeDataBreakdown(baselineConfig, catalogFixture, 1)
    expect(data.daysToFillBuffer).not.toBeNull()
    expect(data.daysToFillBuffer ?? 0).toBeGreaterThan(0)
  })
})
