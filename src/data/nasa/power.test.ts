import { describe, expect, it } from 'vitest'
import magdalenaRaw from './power_magdalena.json'
import neivaRaw from './power_neiva.json'
import { CLIMATOLOGY_MONTHS, POWER_SITES, cloudUsableFraction, kwhPerM2DayToWPerM2 } from './power'

describe('POWER cache wrappers', () => {
  it('record source, endpoint, date and license', () => {
    for (const cache of [neivaRaw, magdalenaRaw]) {
      expect(cache.source).toBe('NASA LaRC POWER')
      expect(cache.endpoint).toContain('power.larc.nasa.gov/api/temporal/climatology/point')
      expect(cache.consultedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
      expect(cache.license).toBe('NASA public domain')
      expect(cache.parameters).toEqual(['ALLSKY_SFC_SW_DWN', 'CLOUD_AMT', 'TOA_SW_DWN'])
    }
  })

  it('keeps all twelve months plus the annual mean', () => {
    for (const cache of [neivaRaw, magdalenaRaw]) {
      for (const parameter of Object.values(cache.data.properties.parameter)) {
        for (const month of CLIMATOLOGY_MONTHS) {
          expect(typeof parameter[month]).toBe('number')
        }
        expect(typeof parameter.ANN).toBe('number')
      }
    }
  })
})

describe('POWER site climatology', () => {
  it('mirrors the cached Neiva values', () => {
    const params = neivaRaw.data.properties.parameter
    const site = POWER_SITES.neiva
    expect(site.name).toBe('Neiva, Colombia')
    expect(site.toaKwhPerM2Day.JAN).toBe(params.TOA_SW_DWN.JAN)
    expect(site.surfaceKwhPerM2Day.MAY).toBe(params.ALLSKY_SFC_SW_DWN.MAY)
    expect(site.cloudAmountPct.DEC).toBe(params.CLOUD_AMT.DEC)
    expect(site.annual.toaKwhPerM2Day).toBe(params.TOA_SW_DWN.ANN)
    expect(site.annual.cloudAmountPct).toBe(params.CLOUD_AMT.ANN)
  })

  it('mirrors the cached Magdalena values', () => {
    const params = magdalenaRaw.data.properties.parameter
    const site = POWER_SITES.magdalena
    expect(site.name).toBe('Magdalena basin centroid, Colombia')
    expect(site.toaKwhPerM2Day.JUL).toBe(params.TOA_SW_DWN.JUL)
    expect(site.surfaceKwhPerM2Day.OCT).toBe(params.ALLSKY_SFC_SW_DWN.OCT)
    expect(site.cloudAmountPct.FEB).toBe(params.CLOUD_AMT.FEB)
  })

  it('stays within physical ranges and attenuates surface below TOA', () => {
    for (const site of Object.values(POWER_SITES)) {
      for (const month of CLIMATOLOGY_MONTHS) {
        const toa = site.toaKwhPerM2Day[month]
        const surface = site.surfaceKwhPerM2Day[month]
        const cloud = site.cloudAmountPct[month]
        expect(toa).toBeGreaterThan(0)
        expect(toa).toBeLessThan(12)
        expect(surface).toBeGreaterThan(0)
        expect(surface).toBeLessThanOrEqual(toa)
        expect(cloud).toBeGreaterThanOrEqual(0)
        expect(cloud).toBeLessThanOrEqual(100)
      }
    }
  })
})

describe('unit conversions', () => {
  it('converts kWh/m2/day to a 24-hour mean flux', () => {
    expect(kwhPerM2DayToWPerM2(4.2456)).toBeCloseTo(176.9, 1)
    expect(kwhPerM2DayToWPerM2(0)).toBe(0)
  })

  it('maps cloud amount to a clamped usable fraction', () => {
    expect(cloudUsableFraction(0)).toBe(1)
    expect(cloudUsableFraction(50)).toBe(0.5)
    expect(cloudUsableFraction(100)).toBe(0)
    expect(cloudUsableFraction(-10)).toBe(1)
    expect(cloudUsableFraction(120)).toBe(0)
  })
})
