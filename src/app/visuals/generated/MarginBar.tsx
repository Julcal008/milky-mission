export type MarginStatus = 'nominal' | 'warning' | 'critical'
export type MarginTone = 'success' | 'warning' | 'danger' | 'ion' | 'milk'

export interface MarginBarProps {
  label: string
  value: number
  max: number
  unit: string
  status?: MarginStatus
  tone?: MarginTone
  statusLabels?: Partial<Record<MarginStatus, string>>
  className?: string
}

const STATUS_BADGE: Record<
  MarginStatus,
  { symbol: string; text: string; classes: string; barClass: string }
> = {
  nominal: {
    symbol: '●',
    text: 'NOMINAL',
    classes: 'border-success/50 bg-success/15 text-success',
    barClass: 'bg-success',
  },
  warning: {
    symbol: '▲',
    text: 'CAUTION',
    classes: 'border-warning/50 bg-warning/15 text-warning',
    barClass: 'bg-warning',
  },
  critical: {
    symbol: '■',
    text: 'CRITICAL',
    classes: 'border-danger/50 bg-danger/15 text-danger',
    barClass: 'bg-danger',
  },
}

const TONE_BAR_CLASS: Record<MarginTone, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  ion: 'bg-ion',
  milk: 'bg-milk-strong',
}

export function MarginBar({
  label,
  value,
  max,
  unit,
  status = 'nominal',
  tone,
  statusLabels,
  className = '',
}: MarginBarProps) {
  const safeMax = max > 0 ? max : 100
  const clampedRatio = Math.min(1, Math.max(0, value / safeMax))
  const percentage = Math.round(clampedRatio * 100)
  const statusInfo = STATUS_BADGE[status]
  const statusText = statusLabels?.[status] ?? statusInfo.text
  const fillClass = tone ? TONE_BAR_CLASS[tone] : statusInfo.barClass

  return (
    <div
      className={`flex w-full flex-col gap-2 rounded-xl border border-border bg-surface/90 p-3.5 ${className}`}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <span className="font-sans text-sm font-medium text-ink">{label}</span>

        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-milk-strong">
            {value} / {max} {unit}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-xs ${statusInfo.classes}`}
          >
            <span aria-hidden="true">{statusInfo.symbol}</span>
            <span>{statusText}</span>
          </span>
        </div>
      </div>

      <div
        role="meter"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={`${value} ${unit} (${statusText})`}
        className="relative h-3 w-full overflow-hidden rounded-full border border-border bg-bg"
      >
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full rounded-full transition-all duration-300 ease-out motion-reduce:transition-none ${fillClass}`}
        />
      </div>
    </div>
  )
}

export const ResourceGauge = MarginBar
