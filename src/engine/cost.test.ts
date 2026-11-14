/**
 * Cost model tests.
 */
import { describe, expect, it } from 'vitest'
import { baselineConfig } from './__fixtures__/baseline'
import { catalogs as catalogFixture } from '@/data/catalogs'
import { computeCostBreakdown } from './cost'
import type { MissionConfig } from './types'

describe('computeCostBreakdown', () => {
  it('matches the reference mission total', () => {
    const cost = computeCostBreakdown(baselineConfig, catalogFixture, 365)
    expect(cost.hardwareUsdM).toBeCloseTo(25.42, 2)
    expect(cost.marginUsdM).toBeCloseTo(3.813, 2)
    expect(cost.operationsUsdM).toBeCloseTo(6, 1)
    expect(cost.totalUsdM).toBeCloseTo(43.23, 1)
  })

  it('adding an instrument never reduces cost (validity)', () => {
    const more: MissionConfig = {
      ...baselineConfig,
      instrumentIds: [...baselineConfig.instrumentIds, 'sar'],
    }
    expect(computeCostBreakdown(more, catalogFixture).totalUsdM).toBeGreaterThan(
      computeCostBreakdown(baselineConfig, catalogFixture).totalUsdM,
    )
  })

  it('a heavier launcher costs more', () => {
    const falcon: MissionConfig = { ...baselineConfig, launcherId: 'f9' }
    expect(computeCostBreakdown(falcon, catalogFixture).totalUsdM).toBeGreaterThan(
      computeCostBreakdown(baselineConfig, catalogFixture).totalUsdM,
    )
  })

  it('longer missions cost more in operations (validity)', () => {
    const short = computeCostBreakdown(baselineConfig, catalogFixture, 180)
    const long = computeCostBreakdown(baselineConfig, catalogFixture, 548)
    expect(long.operationsUsdM).toBeGreaterThan(short.operationsUsdM)
  })
})
