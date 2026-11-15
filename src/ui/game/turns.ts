/** Role assignment and handoff helpers — Owner: Track A (Simulate). */
import type { RoleId } from '@/engine/types'

export interface SeatAssignment {
  seat: number
  roles: RoleId[]
}

const ALL: RoleId[] = ['director', 'systems', 'science', 'comms']

const BY_PLAYERS: Record<number, RoleId[][]> = {
  1: [ALL],
  2: [
    ['director', 'science'],
    ['systems', 'comms'],
  ],
  3: [['director'], ['systems'], ['science', 'comms']],
  4: [['director'], ['systems'], ['science'], ['comms']],
}

export function normalizePlayers(players: number): number {
  return Math.min(4, Math.max(1, Math.round(players)))
}

export function assignmentsForPlayers(players: number): SeatAssignment[] {
  const count = normalizePlayers(players)
  return (BY_PLAYERS[count] ?? BY_PLAYERS[1]).map((roles, seat) => ({ seat, roles }))
}

export function roleOwnerSeat(role: RoleId, players: number): number {
  const owner = assignmentsForPlayers(players).find((assignment) => assignment.roles.includes(role))
  return owner?.seat ?? 0
}
