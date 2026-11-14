/**
 * Validity and unit tests for the orbit model.
 * Every new formula must prove at least one monotonicity or bound property.
 */
import { describe, expect, it } from 'vitest'
import {
  eclipseFraction,
  eclipseMinutes,
  nominalPassesPerDay,
  orbitalPeriodS,
  orbitsPerDay,
  revisitHours,
  sunlightFraction,
} from './orbit'

describe('orbitalPeriodS', () => {
  it('matches the known period of a 500 km circular orbit', () => {
    // T = 2*pi*sqrt(a^3/mu) with a = 6871 km -> about 5677 s (94.6 min)
    expect(orbitalPeriodS(500)).toBeGreaterThan(5650)
    expect(orbitalPeriodS(500)).toBeLessThan(5700)
  })

  it('increases with altitude (validity)', () => {
    expect(orbitalPeriodS(700)).toBeGreaterThan(orbitalPeriodS(500))
    expect(orbitalPeriodS(500)).toBeGreaterThan(orbitalPeriodS(400))
  })

  it('gives about 15.2 orbits per day at 500 km', () => {
    expect(orbitsPerDay(500)).toBeGreaterThan(15)
    expect(orbitsPerDay(500)).toBeLessThan(15.4)
  })
})

describe('eclipseFraction', () => {
  it('is about 0.38 for an equatorial-plane orbit at 500 km', () => {
    expect(eclipseFraction(500, 0)).toBeCloseTo(0.378, 2)
  })

  it('is zero when the orbit plane misses the shadow (beta = 90 deg)', () => {
    expect(eclipseFraction(500, 90)).toBe(0)
  })

  it('is zero beyond the shadow half-angle', () => {
    // asin(6371/6871) ~= 68 deg; 80 deg must be fully sunlit.
    expect(eclipseFraction(500, 80)).toBe(0)
  })

  it('never exceeds half the orbit', () => {
    for (const altitude of [300, 400, 500, 700, 1000]) {
      for (const beta of [0, 15, 30, 45, 60, 70]) {
        const fraction = eclipseFraction(altitude, beta)
        expect(fraction).toBeGreaterThanOrEqual(0)
        expect(fraction).toBeLessThanOrEqual(0.5)
      }
    }
  })

  it('complements sunlightFraction', () => {
    expect(eclipseFraction(500, 20) + sunlightFraction(500, 20)).toBeCloseTo(1, 10)
  })

  it('eclipse minutes stay inside the orbital period', () => {
    expect(eclipseMinutes(500, 0)).toBeLessThan(orbitalPeriodS(500) / 60)
    expect(eclipseMinutes(500, 0)).toBeGreaterThan(30)
  })
})

describe('passes and revisit', () => {
  it('produces a plausible number of passes per day', () => {
    expect(nominalPassesPerDay(500)).toBeGreaterThan(5)
    expect(nominalPassesPerDay(500)).toBeLessThan(7)
  })

  it('more stations never reduce passes (validity)', () => {
    expect(nominalPassesPerDay(500, 3)).toBeGreaterThan(nominalPassesPerDay(500, 1))
  })

  it('a wider swath reduces revisit time (validity)', () => {
    const narrow = revisitHours(25, 6)
    const wide = revisitHours(100, 6)
    expect(wide).toBeLessThan(narrow)
  })

  it('agile pointing reduces revisit time (validity)', () => {
    expect(revisitHours(50, 6, true)).toBeLessThan(revisitHours(50, 6, false))
  })
})
