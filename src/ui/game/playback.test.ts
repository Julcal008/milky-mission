import { describe, expect, it } from 'vitest'
import { advancePlaybackDay, nextEventDay } from './playback'

describe('playback clock', () => {
  it('advances one day per tick at 1x', () => {
    expect(advancePlaybackDay(1, 1, 365, [])).toBe(2)
  })

  it('advances four days per tick at 4x', () => {
    expect(advancePlaybackDay(1, 4, 365, [])).toBe(5)
  })

  it('stops exactly on an event even when the step would pass it', () => {
    expect(advancePlaybackDay(24, 4, 365, [25])).toBe(25)
    expect(advancePlaybackDay(39, 4, 365, [40, 80])).toBe(40)
  })

  it('does not stop on an event that is behind the clock', () => {
    expect(advancePlaybackDay(41, 4, 365, [25, 40, 80])).toBe(45)
  })

  it('clamps to the mission duration', () => {
    expect(advancePlaybackDay(364, 4, 365, [])).toBe(365)
    expect(advancePlaybackDay(365, 4, 365, [])).toBe(365)
  })

  it('finds the next unresolved event', () => {
    expect(nextEventDay(1, [25, 40, 80])).toBe(25)
    expect(nextEventDay(25, [25, 40, 80])).toBe(40)
    expect(nextEventDay(365, [])).toBeNull()
  })
})
