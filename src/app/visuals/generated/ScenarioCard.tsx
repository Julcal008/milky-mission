import type { KeyboardEvent } from 'react'

export interface ScenarioStat {
  label: string
  value: string
}

export interface ScenarioCardProps {
  title: string
  summary: string
  stats: ScenarioStat[]
  selected: boolean
  backgroundSrc?: string
  onSelect: () => void
  activeLabel?: string
  readyLabel?: string
  className?: string
}

export function ScenarioCard({
  title,
  summary,
  stats,
  selected,
  backgroundSrc,
  onSelect,
  activeLabel = 'ACTIVE',
  readyLabel = 'READY',
  className = '',
}: ScenarioCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect()
    }
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      aria-pressed={selected}
      className={`group relative flex w-full max-w-xl flex-col justify-between overflow-hidden rounded-2xl border p-5 text-left transition-all duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ion active:scale-[0.98] ${
        selected
          ? 'border-success bg-surface-2 shadow-lg ring-1 ring-success/60'
          : 'border-border bg-surface/90 hover:border-ion/70 hover:bg-surface-2/80'
      } ${className}`}
    >
      {backgroundSrc ? (
        <img
          src={backgroundSrc}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35 transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : null}

      <div className="relative z-10 flex w-full items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-mono ${
              selected
                ? 'border-success bg-success/20 text-success'
                : 'border-border bg-surface text-ink-2 group-hover:border-ion group-hover:text-ion'
            }`}
          >
            {selected ? '✓' : '○'}
          </span>
          <h3 className="font-sans text-lg font-semibold tracking-tight text-ink">{title}</h3>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-xs uppercase tracking-wider ${
            selected
              ? 'border-success/50 bg-success/15 text-success'
              : 'border-border bg-surface/80 text-ink-2'
          }`}
        >
          {selected ? activeLabel : readyLabel}
        </span>
      </div>

      <p className="relative z-10 mt-3 text-sm leading-relaxed text-ink-2">{summary}</p>

      {stats.length > 0 ? (
        <dl className="relative z-10 mt-5 grid w-full grid-cols-2 gap-2.5 border-t border-border/80 pt-3.5 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border/60 bg-bg/60 px-3 py-2">
              <dt className="font-mono text-xs uppercase tracking-wider text-ink-2">
                {stat.label}
              </dt>
              <dd className="mt-0.5 font-mono text-sm font-semibold text-milk-strong">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </button>
  )
}
