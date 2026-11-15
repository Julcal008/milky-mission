/**
 * Share codec tests: round-trip, URL safety and rejection of malformed codes.
 */
import { describe, expect, it } from 'vitest'
import { baselineConfig } from './__fixtures__/baseline'
import { decodeMission, decodeSharedMission, encodeMission } from './share'

describe('share codec', () => {
  it('round-trips the full mission configuration', () => {
    const code = encodeMission(baselineConfig)
    expect(decodeMission(code)).toEqual(baselineConfig)
  })

  it('produces a URL-safe string without padding', () => {
    const code = encodeMission(baselineConfig)
    expect(code).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(code).not.toContain('=')
    expect(code).not.toContain('+')
    expect(code).not.toContain('/')
  })

  it('preserves the seed so the mission replays identically', () => {
    const code = encodeMission({ ...baselineConfig, seed: 123456 })
    expect(decodeMission(code)?.seed).toBe(123456)
  })

  it('round-trips decisions and player count', () => {
    const decisions = [
      { eventId: 'event-1', optionId: 'shelter' },
      { eventId: 'event-2', optionId: 'ride-it-out' },
    ]
    const code = encodeMission(baselineConfig, decisions, 4)
    expect(decodeSharedMission(code)).toEqual({
      config: baselineConfig,
      decisions,
      players: 4,
    })
  })

  it('defaults older payloads to solo play with no decisions', () => {
    const code = encodeMission(baselineConfig)
    expect(decodeSharedMission(code)).toEqual({
      config: baselineConfig,
      decisions: [],
      players: 1,
    })
  })

  it('round-trips the selected difficulty', () => {
    const code = encodeMission({ ...baselineConfig, difficulty: 'flight-director' })
    expect(decodeSharedMission(code)?.config.difficulty).toBe('flight-director')
  })

  it('rejects garbage, empty and oversized codes', () => {
    expect(decodeMission('')).toBeNull()
    expect(decodeMission('not-a-mission')).toBeNull()
    expect(decodeMission('x'.repeat(5000))).toBeNull()
  })

  it('rejects a payload with the wrong version', () => {
    const payload = { v: 999, c: baselineConfig }
    const code = btoa(JSON.stringify(payload))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    expect(decodeMission(code)).toBeNull()
  })
})
