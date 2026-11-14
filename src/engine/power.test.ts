/**
 * Power model tests, including validity properties.
 */
import { describe, expect, it } from 'vitest'
import { baselineConfig } from './__fixtures__/baseline'
import { catalogFixture } from './__fixtures__/catalog-fixture'
import { computePowerBreakdown } from './power'
import type { MissionConfig } from './types'

describe('computePowerBreakdown', () => {
  it('matches the reference mission values', () => {
    const power = computePowerBreakdown(baselineConfig, catalogFixture, 365)
    expect(power.totalLoadW).toBeCloseTo(98.5, 5)
    expect(power.orbitAverageGenerationW).toBeCloseTo(146.7, 0)
    expect(power.marginW).toBeCloseTo(48.2, 0)
    expect(power.eclipseEnergyWh).toBeCloseTo(58.6, 0)
    expect(power.energyMarginWh).toBeCloseTo(181.4, 0)
  })

  it('doubling the array area roughly doubles generation (validity)', () => {
    const bigger: MissionConfig = { ...baselineConfig, arrayAreaM2: 2.4 }
    const small = computePowerBreakdown(baselineConfig, catalogFixture)
    const large = computePowerBreakdown(bigger, catalogFixture)
    expect(large.arrayPowerBOLW / small.arrayPowerBOLW).toBeCloseTo(2, 5)
  })

  it('adding an instrument never increases the margin (validity)', () => {
    const heavier: MissionConfig = {
      ...baselineConfig,
      instrumentIds: [...baselineConfig.instrumentIds, 'sar'],
    }
    const before = computePowerBreakdown(baselineConfig, catalogFixture)
    const after = computePowerBreakdown(heavier, catalogFixture)
    expect(after.marginW).toBeLessThan(before.marginW)
  })

  it('uses a better cell technology to produce more power (validity)', () => {
    const silicon: MissionConfig = { ...baselineConfig, arrayId: 'si' }
    expect(computePowerBreakdown(silicon, catalogFixture).arrayPowerBOLW).toBeLessThan(
      computePowerBreakdown(baselineConfig, catalogFixture).arrayPowerBOLW,
    )
  })

  it('has no eclipse at beta = 90 degrees', () => {
    const power = computePowerBreakdown(baselineConfig, catalogFixture, 365, { betaDeg: 90 })
    expect(power.sunlightFraction).toBe(1)
    expect(power.orbitAverageGenerationW).toBeCloseTo(power.arrayPowerEOLW, 5)
    expect(power.energyMarginWh).toBeCloseTo(power.usableBatteryWh, 5)
  })

  it('degrades the array over the mission', () => {
    const oneYear = computePowerBreakdown(baselineConfig, catalogFixture, 365)
    const fiveYears = computePowerBreakdown(baselineConfig, catalogFixture, 365 * 5)
    expect(fiveYears.arrayPowerEOLW).toBeLessThan(oneYear.arrayPowerEOLW)
  })
})
