/**
 * Resource bar — the canonical way to display mass, power, budget, data, link and time.
 * The value is always mono/tabular; the label and unit are always visible.
 * Color comes from the resource token, but the status text is what carries meaning.
 */
import { cx } from './cx'

export type ResourceTone = 'mass' | 'power' | 'budget' | 'data' | 'link' | 'time'

const fills: Record<ResourceTone, string> = {
  mass: 'bg-res-mass',
  power: 'bg-res-power',
  budget: 'bg-res-budget',
  data: 'bg-res-data',
  link: 'bg-res-link',
  time: 'bg-res-time',
}

export function ResourceBar({
  label,
  value,
  max,
  unit,
  tone,
  status,
  statusTone = 'neutral',
}: {
  label: string
  value: number
  max: number
  unit: string
  tone: ResourceTone
  status?: string
  statusTone?: 'neutral' | 'success' | 'warning' | 'danger'
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  const statusColor =
    statusTone === 'success'
      ? 'text-success'
      : statusTone === 'warning'
        ? 'text-warning'
        : statusTone === 'danger'
          ? 'text-danger'
          : 'text-ink-2'

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="label-caps text-ink-2">{label}</span>
        <span className="num text-[12px] text-ink">
          {value.toLocaleString('en-US', { maximumFractionDigits: 1 })}
          <span className="text-ink-3">
            {' '}
            / {max.toLocaleString('en-US')} {unit}
          </span>
        </span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-sm bg-surface-2"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={cx('h-full rounded-sm transition-[width] duration-300', fills[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {status ? <p className={cx('text-[11px]', statusColor)}>{status}</p> : null}
    </div>
  )
}
