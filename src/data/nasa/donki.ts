/**
 * DONKI SPACE WEATHER TIMELINE
 * Owner: Track C
 * Source: NASA CCMC DONKI, cached in ./donki_2024_05.json (see docs/NASA_DATA.md).
 * Inputs:  mission duration in days
 * Outputs: mission days for cme_hit and flare_x events
 * Invariants: days are unique, sorted and within [1, durationDays]
 * Assumptions: the 2024-05-01..15 reference window is scaled linearly onto the
 *              mission; GST onset is used as the Earth-impact storm date, not
 *              every CME in the catalogue.
 *
 * Selection is deliberate, not exhaustive: the raw cache contains 148 flares and
 * 69 CMEs, which would overwhelm the game. We keep the three geomagnetic storms
 * (highest Kp) and the strongest X-class flare. Track C owns the selection;
 * Track A consumes spaceWeatherDaysFor().
 */

export interface SpaceWeatherDays {
  cmeDays: number[]
  flareDays: number[]
}

export interface SelectedSpaceWeatherEvent {
  /** DONKI activity id, traceable to donki_2024_05.json. */
  id: string
  kind: 'cme' | 'flare'
  /** Event onset in UTC (ISO-8601). */
  referenceTime: string
  /** Why this event was selected, e.g. "GST max Kp 9". */
  significance: string
}

/** First day of the cached DONKI window. */
export const DONKI_WINDOW_START_ISO = '2024-05-01T00:00:00Z'
/** Exclusive end of the cached DONKI window. */
export const DONKI_WINDOW_END_ISO = '2024-05-16T00:00:00Z'

const WINDOW_START_MS = Date.parse(DONKI_WINDOW_START_ISO)
const WINDOW_END_MS = Date.parse(DONKI_WINDOW_END_ISO)

/**
 * Official DONKI records chosen for the game timeline.
 * CME entries are GST (geomagnetic storm) onsets: they mark actual Earth impact.
 */
export const SELECTED_SPACE_WEATHER_EVENTS: readonly SelectedSpaceWeatherEvent[] = [
  {
    id: '2024-05-02T15:00:00-GST-001',
    kind: 'cme',
    referenceTime: '2024-05-02T15:00Z',
    significance: 'GST max Kp 6.67',
  },
  {
    id: '2024-05-10T15:00:00-GST-001',
    kind: 'cme',
    referenceTime: '2024-05-10T15:00Z',
    significance: 'GST max Kp 9 (G5)',
  },
  {
    id: '2024-05-12T21:00:00-GST-001',
    kind: 'cme',
    referenceTime: '2024-05-12T21:00Z',
    significance: 'GST max Kp 6.33',
  },
  {
    id: '2024-05-14T16:46:00-FLR-001',
    kind: 'flare',
    referenceTime: '2024-05-14T16:46Z',
    significance: 'X8.7 flare (strongest in window)',
  },
]

function uniqueSorted(days: number[]): number[] {
  return [...new Set(days)].sort((a, b) => a - b)
}

/**
 * Maps a real DONKI timestamp onto a mission day using the cached window.
 * Day 1 corresponds to 2024-05-01T00:00Z and the last day to 2024-05-16T00:00Z.
 * Out-of-window timestamps are clamped instead of throwing, so a future cache
 * update cannot silently shift events outside the mission.
 */
export function missionDayFor(referenceTime: string, durationDays: number): number {
  if (!Number.isInteger(durationDays) || durationDays < 1) {
    throw new RangeError(`durationDays must be a positive integer, received ${durationDays}`)
  }

  const timeMs = Date.parse(referenceTime)
  if (Number.isNaN(timeMs)) {
    throw new RangeError(`referenceTime is not a valid ISO-8601 timestamp: ${referenceTime}`)
  }

  const fraction = (timeMs - WINDOW_START_MS) / (WINDOW_END_MS - WINDOW_START_MS)
  const day = Math.round(1 + fraction * (durationDays - 1))
  return Math.min(durationDays, Math.max(1, day))
}

/** Returns the DONKI-derived event days for a mission of `durationDays`. */
export function spaceWeatherDaysFor(durationDays: number): SpaceWeatherDays {
  const cmeDays: number[] = []
  const flareDays: number[] = []

  for (const event of SELECTED_SPACE_WEATHER_EVENTS) {
    const day = missionDayFor(event.referenceTime, durationDays)
    if (event.kind === 'cme') {
      cmeDays.push(day)
    } else {
      flareDays.push(day)
    }
  }

  return { cmeDays: uniqueSorted(cmeDays), flareDays: uniqueSorted(flareDays) }
}
