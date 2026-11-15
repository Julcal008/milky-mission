import { describe, expect, it } from 'vitest'
import { createRng } from './prng'
import { buildChallengeSchedule, EVENT_COUNT_BY_DIFFICULTY } from './challenge-scheduler'
import { baselineConfig } from './__fixtures__/baseline'
import { scenarioFixtures } from './__fixtures__/scenario-fixture'
import { spaceWeatherDaysFor } from '../data/nasa/donki'
import { simulateMission } from './simulator'
import { catalogs } from '@/data/catalogs'
import type { Difficulty } from './types'

const storm = scenarioFixtures['storm-watch']
const { cmeDays, flareDays } = spaceWeatherDaysFor(storm.durationDays)

function scheduleFor(difficulty: Difficulty, powerMarginW = 100, seed = 42) {
  return buildChallengeSchedule(
    { ...baselineConfig, difficulty },
    storm,
    cmeDays,
    flareDays,
    powerMarginW,
    createRng(seed),
  )
}

describe('challenge scheduler', () => {
  it('uses 3 / 5 / 7 events by difficulty', () => {
    expect(scheduleFor('cadet')).toHaveLength(EVENT_COUNT_BY_DIFFICULTY.cadet)
    expect(scheduleFor('engineer')).toHaveLength(EVENT_COUNT_BY_DIFFICULTY.engineer)
    expect(scheduleFor('flight-director')).toHaveLength(
      EVENT_COUNT_BY_DIFFICULTY['flight-director'],
    )
  })

  it('is deterministic for the same seed and difficulty', () => {
    expect(scheduleFor('engineer')).toEqual(scheduleFor('engineer'))
  })

  it('changes the deck when difficulty changes', () => {
    const engineer = scheduleFor('engineer').map((item) => item.challenge.id)
    const director = scheduleFor('flight-director').map((item) => item.challenge.id)
    expect(engineer).not.toEqual(director)
  })

  it('changes the deck when the seed changes', () => {
    const first = scheduleFor('engineer', 100, 42).map((item) => item.challenge.id)
    const second = scheduleFor('engineer', 100, 43).map((item) => item.challenge.id)
    expect(first).not.toEqual(second)
  })

  it('covers every role at engineer and flight director', () => {
    for (const difficulty of ['engineer', 'flight-director'] as const) {
      const roles = new Set(scheduleFor(difficulty).map((item) => item.challenge.role))
      expect(roles).toEqual(new Set(['systems', 'science', 'comms', 'director']))
    }
  })

  it('never repeats a challenge in one mission', () => {
    for (const difficulty of ['cadet', 'engineer', 'flight-director'] as const) {
      const ids = scheduleFor(difficulty).map((item) => item.challenge.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('forces a power challenge when the power margin is negative', () => {
    const schedule = scheduleFor('engineer', -20)
    expect(schedule.some((item) => item.challenge.id === 'power-deficit')).toBe(true)
    expect(schedule).toHaveLength(EVENT_COUNT_BY_DIFFICULTY.engineer)
  })

  it('keeps the simulated reference mission within the balance band', () => {
    const result = simulateMission({ ...baselineConfig, difficulty: 'engineer' }, storm, catalogs)
    expect(result.events).toHaveLength(EVENT_COUNT_BY_DIFFICULTY.engineer)
    expect(result.score.total).toBeGreaterThanOrEqual(700)
    expect(result.score.total).toBeLessThanOrEqual(950)
  })
})
