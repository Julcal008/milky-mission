/**
 * Guard-rail tests for the shared unit helpers.
 * Pattern: every engine module ships with tests in the same folder.
 */
import { describe, expect, it } from 'vitest'
import {
  clamp,
  clamp01,
  degToRad,
  EARTH_MU_KM3_S2,
  EARTH_RADIUS_KM,
  G0_M_S2,
  radToDeg,
  roundTo,
  SOLAR_CONSTANT_W_M2,
} from './units'

describe('physical constants', () => {
  it('uses SI-consistent reference values', () => {
    expect(EARTH_RADIUS_KM).toBe(6371)
    expect(EARTH_MU_KM3_S2).toBeCloseTo(398_600.4418, 4)
    expect(G0_M_S2).toBe(9.80665)
    expect(SOLAR_CONSTANT_W_M2).toBe(1361)
  })
})

describe('angle conversion', () => {
  it('round-trips degrees and radians', () => {
    for (const deg of [0, 5, 45, 90, 97.4, 180]) {
      expect(radToDeg(degToRad(deg))).toBeCloseTo(deg, 10)
    }
  })

  it('converts a full turn', () => {
    expect(degToRad(360)).toBeCloseTo(Math.PI * 2, 12)
  })
})

describe('clamp', () => {
  it('bounds values and preserves values inside the range', () => {
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(clamp(11, 0, 10)).toBe(10)
    expect(clamp(4.2, 0, 10)).toBe(4.2)
  })

  it('clamp01 is the unit-interval shortcut', () => {
    expect(clamp01(-0.3)).toBe(0)
    expect(clamp01(0.3)).toBe(0.3)
    expect(clamp01(1.7)).toBe(1)
  })
})

describe('roundTo', () => {
  it('rounds to the requested number of decimals', () => {
    expect(roundTo(3.14159, 2)).toBe(3.14)
    expect(roundTo(198.4, 0)).toBe(198)
    expect(roundTo(-0.04, 1)).toBe(-0)
  })
})
