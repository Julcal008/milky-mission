/**
 * Tests for the mass model, including validity properties.
 */
import { describe, expect, it } from 'vitest'
import { catalogFixture } from './__fixtures__/catalog-fixture'
import { getLauncher, getOrbit } from './catalog'
import {
  computeMassBreakdown,
  deltaVMps,
  launchCapacityKg,
  massMarginFraction,
  requiredDeltaVMps,
} from './mass'
import type { MissionConfig } from './types'

const baseline: MissionConfig = {
  scenarioId: 'storm-watch',
  seed: 20260514,
  orbitId: 'sso500',
  launcherId: 'electron',
  busId: 'micro',
  propulsionId: 'mono',
  arrayId: 'gaas',
  arrayAreaM2: 1.2,
  batteryId: 'b300',
  commsId: 'sband',
  groundNetworkId: 'neiva',
  storageId: 's16',
  instrumentIds: ['xrs', 'mag', 'gnssro', 'suvi'],
  requirements: ['R1', 'R2', 'R3'],
}

describe('computeMassBreakdown', () => {
  it('matches the reference mission from GAME_DATA.md', () => {
    const breakdown = computeMassBreakdown(baseline, catalogFixture)
    expect(breakdown.subtotalKg).toBeCloseTo(170.9, 5)
    expect(breakdown.totalKg).toBeCloseTo(196.535, 3)
    expect(breakdown.instrumentsKg).toBe(26)
    expect(breakdown.arrayKg).toBeCloseTo(2.4, 5)
  })

  it('adds an instrument and never decreases mass (validity)', () => {
    const heavier: MissionConfig = {
      ...baseline,
      instrumentIds: [...baseline.instrumentIds, 'lidar'],
    }
    const before = computeMassBreakdown(baseline, catalogFixture)
    const after = computeMassBreakdown(heavier, catalogFixture)
    expect(after.totalKg).toBeGreaterThan(before.totalKg)
    // 15 kg instrument plus the 15 % margin.
    expect(after.totalKg - before.totalKg).toBeCloseTo(15 * 1.15, 5)
  })

  it('reduces the margin when mass grows (validity)', () => {
    const heavier: MissionConfig = { ...baseline, instrumentIds: ['xrs', 'suvi', 'sar'] }
    const before = computeMassBreakdown(baseline, catalogFixture)
    const after = computeMassBreakdown(heavier, catalogFixture)
    const capacity = 250
    expect(massMarginFraction(after.totalKg, capacity)).toBeLessThan(
      massMarginFraction(before.totalKg, capacity),
    )
  })

  it('computes the reference margin against Electron SSO 500', () => {
    const breakdown = computeMassBreakdown(baseline, catalogFixture)
    expect(massMarginFraction(breakdown.totalKg, 250)).toBeCloseTo(0.2139, 3)
  })
})

describe('launchCapacityKg', () => {
  it('returns the dedicated capacity for each orbit', () => {
    const electron = getLauncher(catalogFixture, 'electron')
    expect(launchCapacityKg(electron, getOrbit(catalogFixture, 'sso500'))).toBe(250)
    expect(launchCapacityKg(electron, getOrbit(catalogFixture, 'sso700'))).toBe(180)
    expect(launchCapacityKg(electron, getOrbit(catalogFixture, 'leo400'))).toBe(300)
  })

  it('returns zero when the vehicle cannot reach the orbit', () => {
    const rideshare = getLauncher(catalogFixture, 'rideshare')
    expect(launchCapacityKg(rideshare, getOrbit(catalogFixture, 'sso700'))).toBe(0)
  })

  it('interpolates the equatorial orbit capacity', () => {
    const electron = getLauncher(catalogFixture, 'electron')
    expect(launchCapacityKg(electron, getOrbit(catalogFixture, 'leo550eq'))).toBe(275)
  })
})

describe('deltaVMps', () => {
  it('matches the rocket equation for a known case', () => {
    // 220 s, 1000 kg wet, 200 kg propellant -> 220*9.80665*ln(1.25) ~= 481.5 m/s
    expect(deltaVMps(220, 1000, 200)).toBeCloseTo(481.5, 0)
  })

  it('is zero without propulsion or propellant', () => {
    expect(deltaVMps(0, 1000, 200)).toBe(0)
    expect(deltaVMps(220, 1000, 0)).toBe(0)
  })

  it('increases with propellant mass (validity)', () => {
    expect(deltaVMps(220, 1000, 300)).toBeGreaterThan(deltaVMps(220, 1000, 200))
  })

  it('returns the drag budget for the mission duration', () => {
    const orbit = getOrbit(catalogFixture, 'sso500')
    expect(requiredDeltaVMps(orbit, 365)).toBeCloseTo(8, 5)
    expect(requiredDeltaVMps(orbit, 182.5)).toBeCloseTo(4, 5)
  })
})
