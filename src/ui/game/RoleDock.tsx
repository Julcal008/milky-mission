/** Active player and handoff dock — Owner: Track A (Simulate). */
import type { RoleId } from '@/engine/types'
import { useI18n } from '@/store/ui'
import { Badge } from '@/ui/Badge'
import { format } from '@/ui/game/format'
import type { TurnCopy } from './turn-copy.en'
import { assignmentsForPlayers } from './turns'

function roleNames(roles: RoleId[], labels: Record<string, string>): string {
  return roles.map((role) => labels[role] ?? role).join(' + ')
}

export function RoleDock({
  players,
  activeSeat,
  onSelect,
  copy,
}: {
  players: number
  activeSeat: number
  onSelect: (seat: number) => void
  copy: TurnCopy
}) {
  const { t } = useI18n()
  const roles = t.game.roles as Record<string, string>
  const assignments = assignmentsForPlayers(players)

  if (players <= 1) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface-2/30 p-3">
        <span className="label-caps text-ink-3">{copy.solo}</span>
        <span className="text-[12px] text-ink-2">
          {roleNames(assignments[0]?.roles ?? [], roles)}
        </span>
      </div>
    )
  }

  return (
    <div
      role="group"
      aria-label={copy.handoff}
      className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
    >
      {assignments.map((assignment) => {
        const active = assignment.seat === activeSeat
        return (
          <button
            key={assignment.seat}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(assignment.seat)}
            className={[
              'rounded-lg border p-3 text-left transition-colors',
              active
                ? 'border-cream/70 bg-cream/10'
                : 'border-border bg-surface-2/30 hover:border-border-strong',
            ].join(' ')}
          >
            <span className="flex items-start justify-between gap-2">
              <span className="label-caps text-ink-2">
                {format(copy.player, { n: assignment.seat + 1 })}
              </span>
              {active ? <Badge tone="success">{copy.active}</Badge> : null}
            </span>
            <span className="mt-1 block text-[12px] leading-relaxed text-ink-2">
              {roleNames(assignment.roles, roles)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
