import type { ReactNode } from 'react'

export type TimelineSeverity = 'nominal' | 'warning' | 'critical'
export type MissionRole = 'director' | 'systems' | 'science' | 'comms'

export interface TimelineEventItem {
  id: string
  day: number | string
  label: string
  severity: TimelineSeverity
  role: MissionRole
  selected?: boolean
  icon?: ReactNode
}

export interface EventMarkerProps {
  severity: TimelineSeverity
  selected?: boolean
  className?: string
}

export interface EventTimelineLabels {
  aria?: string
  day?: string
  severity?: Partial<Record<TimelineSeverity, string>>
  roles?: Partial<Record<MissionRole, string>>
}

export interface EventTimelineProps {
  events: TimelineEventItem[]
  onSelect?: (id: string) => void
  labels?: EventTimelineLabels
  className?: string
}

const SEVERITY_META: Record<
  TimelineSeverity,
  { symbol: string; tag: string; badgeClass: string; ringClass: string }
> = {
  nominal: {
    symbol: '●',
    tag: 'NOMINAL',
    badgeClass: 'border-success/50 bg-success/15 text-success',
    ringClass: 'border-success text-success',
  },
  warning: {
    symbol: '▲',
    tag: 'WARNING',
    badgeClass: 'border-warning/50 bg-warning/15 text-warning',
    ringClass: 'border-warning text-warning',
  },
  critical: {
    symbol: '◆',
    tag: 'CRITICAL',
    badgeClass: 'border-danger/60 bg-danger/20 text-danger',
    ringClass: 'border-danger text-danger animate-pulse motion-reduce:animate-none',
  },
}

const ROLE_BADGE_CLASS: Record<MissionRole, string> = {
  director: 'border-director/50 bg-director/15 text-director',
  systems: 'border-systems/50 bg-systems/15 text-systems',
  science: 'border-science/50 bg-science/15 text-science',
  comms: 'border-comms/50 bg-comms/15 text-comms',
}

export function EventMarker({ severity, selected = false, className = '' }: EventMarkerProps) {
  const meta = SEVERITY_META[severity]
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 bg-bg font-mono text-xs transition-transform duration-150 motion-reduce:transition-none ${
        meta.ringClass
      } ${selected ? 'scale-110 ring-2 ring-ion' : ''} ${className}`}
    >
      {meta.symbol}
    </span>
  )
}

export function EventTimeline({ events, onSelect, labels, className = '' }: EventTimelineProps) {
  return (
    <ol
      aria-label={labels?.aria ?? 'Mission event timeline'}
      className={`relative flex w-full flex-col gap-3 border-l-2 border-border pl-4 ${className}`}
    >
      {events.map((ev) => {
        const sev = SEVERITY_META[ev.severity]
        const roleClass = ROLE_BADGE_CLASS[ev.role]
        const isSelected = Boolean(ev.selected)

        return (
          <li key={ev.id} className="relative">
            <button
              type="button"
              onClick={() => onSelect?.(ev.id)}
              aria-pressed={isSelected}
              className={`group flex w-full flex-col gap-2 rounded-xl border p-3.5 text-left transition-all duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ion sm:flex-row sm:items-center sm:justify-between ${
                isSelected
                  ? 'border-ion bg-surface-2 ring-1 ring-ion/50'
                  : 'border-border bg-surface/90 hover:border-ion/60 hover:bg-surface-2/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <EventMarker severity={ev.severity} selected={isSelected} />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-milk-strong">
                      {labels?.day ?? 'DAY'} {ev.day}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-xs uppercase ${sev.badgeClass}`}
                    >
                      <span aria-hidden="true">{sev.symbol}</span>
                      <span>{labels?.severity?.[ev.severity] ?? sev.tag}</span>
                    </span>
                    <span
                      className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-xs uppercase ${roleClass}`}
                    >
                      {labels?.roles?.[ev.role] ?? ev.role}
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 font-sans text-sm font-medium text-ink">
                    {ev.icon}
                    {ev.label}
                  </p>
                </div>
              </div>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
