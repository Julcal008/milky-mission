import { describe, expect, it } from 'vitest'
import donkiRaw from './donki_2024_05.json?raw'
import {
  DONKI_WINDOW_END_ISO,
  DONKI_WINDOW_START_ISO,
  SELECTED_SPACE_WEATHER_EVENTS,
  missionDayFor,
  spaceWeatherDaysFor,
} from './donki'

interface DonkiFlare {
  flrID: string
  beginTime: string
  classType: string
}

interface DonkiGst {
  gstID: string
  startTime: string
  allKpIndex: { kpIndex: number }[]
}

interface DonkiCache {
  source: string
  endpoint: string
  consultedAt: string
  license: string
  fields: Record<string, string[]>
  data: {
    flr: DonkiFlare[]
    cme: unknown[]
    gst: DonkiGst[]
  }
}

const cache = JSON.parse(donkiRaw) as DonkiCache

function flareMagnitude(classType: string): number {
  const match = /^([XMC])(\d+(?:\.\d+)?)$/.exec(classType)
  if (!match) {
    throw new Error(`Unexpected flare class: ${classType}`)
  }
  const [, letter, value] = match
  const offset = letter === 'X' ? 0 : letter === 'M' ? -1 : -2
  return Number(value) + offset
}

function maxKp(gst: DonkiGst): number {
  return Math.max(...gst.allKpIndex.map((entry) => entry.kpIndex))
}

describe('DONKI cache', () => {
  it('carries a complete provenance wrapper', () => {
    expect(cache.source).toBe('NASA CCMC DONKI')
    expect(cache.endpoint).toContain('ccmc.gsfc.nasa.gov/DONKI-API/get/')
    expect(cache.consultedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
    expect(cache.license).toBe('NASA public domain')
    expect(cache.fields.flr.length).toBeGreaterThan(0)
    expect(cache.fields.cme.length).toBeGreaterThan(0)
    expect(cache.fields.gst.length).toBeGreaterThan(0)
  })

  it('contains the raw events used by the timeline', () => {
    expect(cache.data.flr.length).toBeGreaterThan(0)
    expect(cache.data.cme.length).toBeGreaterThan(0)
    expect(cache.data.gst.length).toBe(3)
  })
})

describe('selected space weather events', () => {
  it('uses the three highest-Kp geomagnetic storms', () => {
    const expected = [...cache.data.gst]
      .sort((a, b) => maxKp(b) - maxKp(a))
      .slice(0, 3)
      .map((gst) => gst.gstID)
    const selected = SELECTED_SPACE_WEATHER_EVENTS.filter((event) => event.kind === 'cme').map(
      (event) => event.id,
    )
    expect(selected.sort()).toEqual(expected.sort())
  })

  it('uses the strongest X-class flare in the window', () => {
    const expected = [...cache.data.flr]
      .filter((flare) => flare.classType.startsWith('X'))
      .sort((a, b) => flareMagnitude(b.classType) - flareMagnitude(a.classType))[0]
    const selected = SELECTED_SPACE_WEATHER_EVENTS.find((event) => event.kind === 'flare')
    expect(selected?.id).toBe(expected.flrID)
    expect(expected.classType).toBe('X8.7')
  })

  it('keeps every selected id in the raw cache', () => {
    const ids = new Set([
      ...cache.data.flr.map((event) => event.flrID),
      ...cache.data.gst.map((event) => event.gstID),
    ])
    for (const event of SELECTED_SPACE_WEATHER_EVENTS) {
      expect(ids.has(event.id)).toBe(true)
    }
  })
})

describe('mission day mapping', () => {
  it('maps the window boundaries to the first and last mission day', () => {
    expect(missionDayFor(DONKI_WINDOW_START_ISO, 365)).toBe(1)
    expect(missionDayFor(DONKI_WINDOW_END_ISO, 365)).toBe(365)
  })

  it('clamps events outside the cached window', () => {
    expect(missionDayFor('2024-04-01T00:00:00Z', 365)).toBe(1)
    expect(missionDayFor('2024-06-01T00:00:00Z', 365)).toBe(365)
  })

  it('rejects invalid durations', () => {
    expect(() => missionDayFor(DONKI_WINDOW_START_ISO, 0)).toThrow(RangeError)
    expect(() => missionDayFor(DONKI_WINDOW_START_ISO, 1.5)).toThrow(RangeError)
  })

  it('produces sorted, unique, in-range days for Storm Watch', () => {
    expect(spaceWeatherDaysFor(365)).toEqual({
      cmeDays: [40, 235, 289],
      flareDays: [333],
    })
  })

  it('scales the same sequence to the Andes mission', () => {
    expect(spaceWeatherDaysFor(548)).toEqual({
      cmeDays: [60, 352, 434],
      flareDays: [501],
    })
  })

  it('is deterministic and never emits duplicate days', () => {
    const first = spaceWeatherDaysFor(365)
    const second = spaceWeatherDaysFor(365)
    expect(first).toEqual(second)

    for (const days of [first.cmeDays, first.flareDays]) {
      expect(days).toEqual([...new Set(days)].sort((a, b) => a - b))
      for (const day of days) {
        expect(day).toBeGreaterThanOrEqual(1)
        expect(day).toBeLessThanOrEqual(365)
      }
    }
  })
})
