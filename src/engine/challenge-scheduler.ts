/**
 * CHALLENGE SCHEDULER — picks a deterministic role/difficulty deck.
 * Owner: Track A.
 *
 * Event counts are 3 / 5 / 7 for cadet / engineer / flight director. Real
 * DONKI CME and flare days stay as anchors; variants and operational slots are
 * chosen from the challenge catalog with a dedicated seeded RNG so difficulty
 * changes the story without changing the day-state physics RNG.
 */
import { CHALLENGES, challengeById, challengesForRole, difficultyAllows } from './challenges'
import type { ChallengeSpec } from './challenges'
import type { Difficulty, MissionConfig, ScenarioSpec } from './types'

export interface ScheduledChallenge {
  day: number
  challenge: ChallengeSpec
}

export const EVENT_COUNT_BY_DIFFICULTY: Record<Difficulty, number> = {
  cadet: 3,
  engineer: 5,
  'flight-director': 7,
}

const CME_VARIANTS = ['cme-fast', 'cme-long', 'cme-glancing'] as const

function hashDifficulty(difficulty: Difficulty): number {
  if (difficulty === 'cadet') return 0x1a2b3c4d
  if (difficulty === 'flight-director') return 0x5e6f7a8b
  return 0x9c0d1e2f
}

function nextFreeDay(preferred: number, used: Set<number>, duration: number): number {
  let day = Math.min(duration, Math.max(1, preferred))
  let offset = 1
  while (used.has(day) && offset <= 20) {
    const forward = day + offset
    const backward = day - offset
    if (forward <= duration && !used.has(forward)) {
      return forward
    }
    if (backward >= 1 && !used.has(backward)) {
      return backward
    }
    offset += 1
  }
  return day
}

function pickFromPool(
  role: ChallengeSpec['role'],
  difficulty: Difficulty,
  usedIds: Set<string>,
  rng: { next: () => number },
): ChallengeSpec | null {
  const available = challengesForRole(role, difficulty).filter(
    (challenge) => !usedIds.has(challenge.id),
  )
  if (available.length === 0) {
    return null
  }
  const totalWeight = available.reduce((sum, challenge) => sum + challenge.weight, 0)
  let roll = rng.next() * totalWeight
  for (const challenge of available) {
    roll -= challenge.weight
    if (roll <= 0) {
      return challenge
    }
  }
  return available[available.length - 1]
}

export function buildChallengeSchedule(
  config: MissionConfig,
  scenario: ScenarioSpec,
  cmeDays: readonly number[],
  flareDays: readonly number[],
  powerMarginW: number,
  rng: {
    next: () => number
    int: (maxExclusive: number) => number
    pick: <T>(items: readonly T[]) => T
  },
): ScheduledChallenge[] {
  const difficulty = config.difficulty ?? 'engineer'
  const targetCount = EVENT_COUNT_BY_DIFFICULTY[difficulty]
  const powerRisk = powerMarginW < 0
  const usedDays = new Set<number>()
  const usedIds = new Set<string>()
  const scheduled: ScheduledChallenge[] = []

  const add = (day: number, challenge: ChallengeSpec | null) => {
    if (!challenge || usedIds.has(challenge.id) || scheduled.length >= targetCount) {
      return
    }
    const freeDay = nextFreeDay(day, usedDays, scenario.durationDays)
    usedDays.add(freeDay)
    usedIds.add(challenge.id)
    scheduled.push({ day: freeDay, challenge })
  }

  // Real DONKI anchors. The first CME is always the base variant so the
  // reference mission keeps a stable, familiar entry point.
  const cmeCount =
    difficulty === 'cadet' ? 1 : difficulty === 'flight-director' ? 3 : powerRisk ? 1 : 2
  for (let index = 0; index < Math.min(cmeCount, cmeDays.length); index += 1) {
    const preferred = CME_VARIANTS[Math.min(index, CME_VARIANTS.length - 1)]
    const challenge =
      index === 0
        ? challengeById('cme-fast')
        : (challengeById(preferred) ?? challengeById('cme-fast'))
    add(cmeDays[index], challenge)
  }

  const flareChallenge =
    difficulty === 'flight-director' ? challengeById('flare-x10') : challengeById('flare-x1')
  if (flareDays.length > 0) {
    add(flareDays[0], flareChallenge)
  }

  // Fill the remaining slots with role-specific operations.
  const roleOrder: ChallengeSpec['role'][] = []
  if (powerRisk) roleOrder.push('systems')
  if (difficulty !== 'cadet') roleOrder.push('director')
  roleOrder.push('comms')
  if (difficulty === 'flight-director' && !powerRisk) roleOrder.push('science')

  for (const role of roleOrder) {
    if (scheduled.length >= targetCount) {
      break
    }
    if (role === 'systems') {
      add(150 + rng.int(40), challengeById('power-deficit'))
      continue
    }
    if (role === 'director') {
      add(90 + rng.int(30), pickFromPool('director', difficulty, usedIds, rng))
      continue
    }
    if (role === 'comms') {
      add(180 + rng.int(40), pickFromPool('comms', difficulty, usedIds, rng))
      continue
    }
    const rolePool = CHALLENGES.filter(
      (challenge) =>
        challenge.role === role &&
        difficultyAllows(difficulty, challenge.minDifficulty) &&
        !usedIds.has(challenge.id),
    )
    if (rolePool.length > 0) {
      add(260 + rng.int(60), rng.pick(rolePool))
    }
  }

  // If anchors were shorter than expected, fill with any remaining role.
  while (scheduled.length < targetCount) {
    const fallback = CHALLENGES.find(
      (challenge) =>
        difficultyAllows(difficulty, challenge.minDifficulty) &&
        !usedIds.has(challenge.id) &&
        challenge.role !== 'director',
    )
    if (!fallback) {
      break
    }
    add(120 + rng.int(180), fallback)
  }

  return scheduled.sort((a, b) => a.day - b.day || a.challenge.id.localeCompare(b.challenge.id))
}

export { hashDifficulty }
