import { describe, expect, it } from 'vitest'
import type { Confidence } from '@/engine/types'
import { catalogs } from './index'

const TABLE_NAMES = [
  'orbits',
  'launchers',
  'buses',
  'propulsion',
  'arrays',
  'batteries',
  'comms',
  'groundNetworks',
  'storage',
  'instruments',
] as const

type TableName = (typeof TABLE_NAMES)[number]

const EXPECTED_IDS: Record<TableName, string[]> = {
  orbits: ['sso500', 'sso700', 'leo400', 'leo550eq'],
  launchers: ['rideshare', 'electron', 'firefly', 'vegac', 'f9'],
  buses: ['cubesat12u', 'micro', 'small'],
  propulsion: ['none', 'coldgas', 'mono', 'green'],
  arrays: ['si', 'gaas'],
  batteries: ['b300', 'b800', 'b1600'],
  comms: ['uhf', 'sband', 'xband', 'ka'],
  groundNetworks: ['neiva', 'regional', 'dsn'],
  storage: ['s4', 's16', 's64'],
  instruments: ['xrs', 'suvi', 'mag', 'proton', 'gnssro', 'msi', 'hri', 'sar', 'ais', 'lidar'],
}

const CONFIDENCES: Confidence[] = ['official', 'derived', 'estimate', 'game']

interface CatalogEntry {
  id: string
  source: string
  confidence: Confidence
  note?: string
}

function entriesOf(table: TableName): CatalogEntry[] {
  return catalogs[table] as CatalogEntry[]
}

function assertFiniteNonNegative(value: unknown, path: string): void {
  if (typeof value === 'number') {
    expect(Number.isFinite(value), path).toBe(true)
    expect(value, path).toBeGreaterThanOrEqual(0)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertFiniteNonNegative(item, `${path}[${index}]`))
    return
  }
  if (value !== null && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      assertFiniteNonNegative(item, `${path}.${key}`)
    }
  }
}

describe('catalogs', () => {
  it('exposes every table', () => {
    expect(Object.keys(catalogs).sort()).toEqual([...TABLE_NAMES].sort())
  })

  for (const table of TABLE_NAMES) {
    describe(table, () => {
      const entries = entriesOf(table)

      it('has the expected ids', () => {
        expect(entries.map((entry) => entry.id).sort()).toEqual([...EXPECTED_IDS[table]].sort())
      })

      it('has unique ids', () => {
        const ids = entries.map((entry) => entry.id)
        expect(new Set(ids).size).toBe(ids.length)
      })

      it('carries source and confidence on every entry', () => {
        for (const entry of entries) {
          expect(entry.source.trim().length).toBeGreaterThan(0)
          expect(CONFIDENCES).toContain(entry.confidence)
        }
      })

      it('has finite, non-negative numbers', () => {
        for (const entry of entries) {
          assertFiniteNonNegative(entry, `${table}.${entry.id}`)
        }
      })
    })
  }
})

describe('reference values from docs/GAME_DATA.md', () => {
  it('matches the orbit rows', () => {
    expect(catalogs.orbits.find((item) => item.id === 'sso500')).toMatchObject({
      altitudeKm: 500,
      inclinationDeg: 97.4,
      dragMSYear: 8,
      radiationKradYear: 3,
    })
  })

  it('matches the launcher rows', () => {
    expect(catalogs.launchers.find((item) => item.id === 'electron')).toMatchObject({
      capacityKg: { leo400: 300, sso500: 250, sso700: 180 },
      costUsdM: 8,
    })
  })

  it('matches the bus rows', () => {
    expect(catalogs.buses.find((item) => item.id === 'micro')).toMatchObject({
      dryMassKg: 95,
      payloadCapacityKg: 60,
      payloadVolumeM3: 0.6,
      busPowerW: 220,
      costUsdM: 9,
      reliabilityPerYear: 0.94,
    })
  })

  it('matches the propulsion rows', () => {
    expect(catalogs.propulsion.find((item) => item.id === 'mono')).toMatchObject({
      dryMassKg: 14,
      propellantMaxKg: 20,
      ispS: 220,
      costUsdM: 2.5,
    })
  })

  it('matches the power rows', () => {
    expect(catalogs.arrays.find((item) => item.id === 'gaas')).toMatchObject({
      powerWPerM2: 300,
      degradationPerYear: 0.03,
      massKgPerM2: 2,
      costUsdMPerM2: 0.35,
    })
    expect(catalogs.batteries.find((item) => item.id === 'b300')).toMatchObject({
      capacityWh: 300,
      massKg: 2.5,
      costUsdM: 0.4,
      maxDoD: 0.8,
    })
  })

  it('matches the comms and ground rows', () => {
    expect(catalogs.comms.find((item) => item.id === 'sband')).toMatchObject({
      txPowerW: 5,
      antennaGainDbi: 12,
      maxRateMbps: 2,
      massKg: 4,
      costUsdM: 1.2,
    })
    expect(catalogs.groundNetworks.find((item) => item.id === 'dsn')).toMatchObject({
      passesMultiplier: 3.5,
      costUsdM: 8,
    })
    expect(catalogs.storage.find((item) => item.id === 's16')).toMatchObject({
      capacityGb: 16,
      massKg: 2,
      costUsdM: 0.3,
    })
  })

  it('matches the SAR instrument row', () => {
    const sar = catalogs.instruments.find((item) => item.id === 'sar')
    expect(sar).toMatchObject({
      massKg: 85,
      powerW: 300,
      costUsdM: 35,
      dataGbPerDay: 40,
      scienceValue: 35,
      trl: 7,
    })
    expect(sar?.supports).toEqual(expect.arrayContaining(['allweather', 'highres']))
  })
})
