import { describe, expect, it } from 'vitest'
import { assignmentsForPlayers, normalizePlayers, roleOwnerSeat } from './turns'

describe('role turns', () => {
  it('normalizes player counts into 1..4', () => {
    expect(normalizePlayers(0)).toBe(1)
    expect(normalizePlayers(2.4)).toBe(2)
    expect(normalizePlayers(9)).toBe(4)
  })

  it('assigns every role to solo play', () => {
    const [solo] = assignmentsForPlayers(1)
    expect(solo.roles).toEqual(['director', 'systems', 'science', 'comms'])
  })

  it('pairs director/science and systems/comms for two players', () => {
    expect(assignmentsForPlayers(2)).toEqual([
      { seat: 0, roles: ['director', 'science'] },
      { seat: 1, roles: ['systems', 'comms'] },
    ])
  })

  it('gives every role exactly one owner in four-player mode', () => {
    for (const role of ['director', 'systems', 'science', 'comms'] as const) {
      expect(roleOwnerSeat(role, 4)).toBe({ director: 0, systems: 1, science: 2, comms: 3 }[role])
    }
  })

  it('finds the owner for shared two-player roles', () => {
    expect(roleOwnerSeat('director', 2)).toBe(0)
    expect(roleOwnerSeat('science', 2)).toBe(0)
    expect(roleOwnerSeat('systems', 2)).toBe(1)
    expect(roleOwnerSeat('comms', 2)).toBe(1)
  })
})
