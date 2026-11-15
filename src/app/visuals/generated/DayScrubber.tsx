import type { ChangeEvent } from 'react'

export interface DayScrubberProps {
  day: number
  max: number
  label: string
  onChange: (day: number) => void
  className?: string
}

export function DayScrubber({ day, max, label, onChange, className = '' }: DayScrubberProps) {
  const safeMax = Math.max(1, max)
  const clampedDay = Math.min(safeMax, Math.max(1, day))
  const progressPercent = safeMax > 1 ? Math.round(((clampedDay - 1) / (safeMax - 1)) * 100) : 100

  const handleRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextVal = Number(event.target.value)
    if (!Number.isNaN(nextVal)) {
      onChange(Math.min(safeMax, Math.max(1, nextVal)))
    }
  }

  const stepBackward = () => {
    if (clampedDay > 1) {
      onChange(clampedDay - 1)
    }
  }

  const stepForward = () => {
    if (clampedDay < safeMax) {
      onChange(clampedDay + 1)
    }
  }

  return (
    <div
      role="group"
      aria-label={label}
      className={`flex w-full flex-col gap-3 rounded-2xl border border-border bg-surface/90 p-4 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-sans text-sm font-semibold text-ink">{label}</span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={stepBackward}
            disabled={clampedDay <= 1}
            aria-label={`${label} -1`}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface-2 font-mono text-xs text-ink transition-colors duration-150 motion-reduce:transition-none hover:border-ion hover:text-ion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ion disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>

          <span className="min-w-20 rounded-lg border border-ion/40 bg-bg px-3 py-1 text-center font-mono text-xs font-bold text-milk-strong">
            {clampedDay} / {safeMax}
          </span>

          <button
            type="button"
            onClick={stepForward}
            disabled={clampedDay >= safeMax}
            aria-label={`${label} +1`}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface-2 font-mono text-xs text-ink transition-colors duration-150 motion-reduce:transition-none hover:border-ion hover:text-ion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ion disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      <div className="relative flex items-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 h-2 overflow-hidden rounded-full border border-border bg-bg"
        >
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-ion transition-all duration-150 ease-out motion-reduce:transition-none"
          />
        </div>

        <input
          type="range"
          min={1}
          max={safeMax}
          step={1}
          value={clampedDay}
          aria-label={label}
          aria-valuemin={1}
          aria-valuemax={safeMax}
          aria-valuenow={clampedDay}
          onChange={handleRangeChange}
          className="relative z-10 h-6 w-full cursor-pointer appearance-none bg-transparent accent-milk-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ion rounded-lg"
        />
      </div>
    </div>
  )
}
