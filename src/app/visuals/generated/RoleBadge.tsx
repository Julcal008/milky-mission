import type { ReactNode } from 'react'

export type CrewRole = 'director' | 'systems' | 'science' | 'comms'

export interface RoleBadgeProps {
  role: CrewRole
  label: string
  active?: boolean
  icon?: ReactNode
  className?: string
}

const ROLE_STYLES: Record<
  CrewRole,
  { symbol: string; activeClasses: string; idleClasses: string }
> = {
  director: {
    symbol: '★',
    activeClasses: 'border-director bg-director/20 text-director ring-1 ring-director/50',
    idleClasses: 'border-border bg-surface text-ink-2 hover:border-director/60',
  },
  systems: {
    symbol: '⊞',
    activeClasses: 'border-systems bg-systems/20 text-systems ring-1 ring-systems/50',
    idleClasses: 'border-border bg-surface text-ink-2 hover:border-systems/60',
  },
  science: {
    symbol: '◎',
    activeClasses: 'border-science bg-science/20 text-science ring-1 ring-science/50',
    idleClasses: 'border-border bg-surface text-ink-2 hover:border-science/60',
  },
  comms: {
    symbol: '◈',
    activeClasses: 'border-comms bg-comms/20 text-comms ring-1 ring-comms/50',
    idleClasses: 'border-border bg-surface text-ink-2 hover:border-comms/60',
  },
}

export function RoleBadge({ role, label, active = false, icon, className = '' }: RoleBadgeProps) {
  const cfg = ROLE_STYLES[role]

  return (
    <span
      data-role={role}
      data-active={active ? 'true' : 'false'}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs font-semibold tracking-wide transition-colors duration-150 motion-reduce:transition-none ${
        active ? cfg.activeClasses : cfg.idleClasses
      } ${className}`}
    >
      {icon ?? (
        <span aria-hidden="true" className="text-sm leading-none">
          {cfg.symbol}
        </span>
      )}
      <span>{label}</span>
      {active ? (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-current"
        />
      ) : null}
    </span>
  )
}
