/**
 * Reliability model tests.
 */
import { describe, expect, it } from 'vitest'
import { baselineConfig } from './__fixtures__/baseline'
import { catalogs as catalogFixture } from '@/data/catalogs'
import { computeReliability, trlFailureProbability } from './reliability'
import type { MissionConfig } from './types'

describe('trlFailureProbability', () => {
  it('punishes lower TRL (validity)', () => {
    expect(trlFailureProbability(9)).toBeLessThan(trlFailureProbability(7))
    expect(trlFailureProbability(7)).toBeLessThan(trlFailureProbability(5))
  })

  it('returns the conservative default for unknown TRL', () => {
    expect(trlFailureProbability(2)).toBe(0.3)
  })
})

describe('computeReliability', () => {
  it('matches the reference mission reliability', () => {
    const reliability = computeReliability(baselineConfig, catalogFixture, 365)
    expect(reliability.busReliability).toBeCloseTo(0.94, 3)
    expect(reliability.overall).toBeCloseTo(0.649, 3)
  })

  it('stays inside [0, 1]', () => {
    const reliability = computeReliability(baselineConfig, catalogFixture, 365)
    expect(reliability.overall).toBeGreaterThanOrEqual(0)
    expect(reliability.overall).toBeLessThanOrEqual(1)
  })

  it('more instruments never increase reliability (validity)', () => {
    const more: MissionConfig = {
      ...baselineConfig,
      instrumentIds: [...baselineConfig.instrumentIds, 'sar'],
    }
    expect(computeReliability(more, catalogFixture).overall).toBeLessThan(
      computeReliability(baselineConfig, catalogFixture).overall,
    )
  })

  it('longer missions are less reliable (validity)', () => {
    expect(computeReliability(baselineConfig, catalogFixture, 730).overall).toBeLessThan(
      computeReliability(baselineConfig, catalogFixture, 365).overall,
    )
  })
})
