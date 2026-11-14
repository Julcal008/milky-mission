/**
 * Link budget tests.
 */
import { describe, expect, it } from 'vitest'
import { baselineConfig } from './__fixtures__/baseline'
import { catalogFixture } from './__fixtures__/catalog-fixture'
import { computeLinkBreakdown, pathLossDb, slantRangeKm, BAND_FREQUENCY_HZ } from './link'
import type { MissionConfig } from './types'

describe('slantRangeKm', () => {
  it('is around 1700 km at 500 km altitude and 10 deg elevation', () => {
    const range = slantRangeKm(500)
    expect(range).toBeGreaterThan(1600)
    expect(range).toBeLessThan(1800)
  })

  it('increases with altitude (validity)', () => {
    expect(slantRangeKm(700)).toBeGreaterThan(slantRangeKm(500))
  })
})

describe('pathLossDb', () => {
  it('increases with frequency (validity)', () => {
    const uhf = pathLossDb(1000, BAND_FREQUENCY_HZ.uhf)
    const sband = pathLossDb(1000, BAND_FREQUENCY_HZ.sband)
    const xband = pathLossDb(1000, BAND_FREQUENCY_HZ.xband)
    expect(sband).toBeGreaterThan(uhf)
    expect(xband).toBeGreaterThan(sband)
  })

  it('increases with range (validity)', () => {
    expect(pathLossDb(2000, BAND_FREQUENCY_HZ.sband)).toBeGreaterThan(
      pathLossDb(1000, BAND_FREQUENCY_HZ.sband),
    )
  })
})

describe('computeLinkBreakdown', () => {
  it('caps the effective rate at the terminal maximum', () => {
    const link = computeLinkBreakdown(baselineConfig, catalogFixture)
    expect(link.effectiveRateMbps).toBeLessThanOrEqual(2)
    expect(link.effectiveRateMbps).toBeGreaterThan(0)
  })

  it('produces the reference downlink volume', () => {
    const link = computeLinkBreakdown(baselineConfig, catalogFixture)
    expect(link.passesPerDay).toBeCloseTo(6.07, 1)
    expect(link.downlinkGbPerDay).toBeCloseTo(3.41, 1)
  })

  it('a regional network never reduces downlink (validity)', () => {
    const regional: MissionConfig = { ...baselineConfig, groundNetworkId: 'regional' }
    expect(computeLinkBreakdown(regional, catalogFixture).downlinkGbPerDay).toBeGreaterThan(
      computeLinkBreakdown(baselineConfig, catalogFixture).downlinkGbPerDay,
    )
  })

  it('X-band delivers more volume than S-band', () => {
    const xband: MissionConfig = { ...baselineConfig, commsId: 'xband' }
    expect(computeLinkBreakdown(xband, catalogFixture).downlinkGbPerDay).toBeGreaterThan(
      computeLinkBreakdown(baselineConfig, catalogFixture).downlinkGbPerDay,
    )
  })
})
