/**
 * Share codec tests: round-trip, URL safety and rejection of malformed codes.
 */
import { describe, expect, it } from 'vitest'
import { baselineConfig } from './__fixtures__/baseline'
import { decodeMission, encodeMission } from './share'

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
