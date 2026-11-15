export interface RequirementCardProps {
  id: string
  title: string
  description: string
  weight: number | string
  selected: boolean
  disabled?: boolean
  onToggle: (id: string) => void
  weightLabel?: string
  className?: string
}

export function RequirementCard({
  id,
  title,
  description,
  weight,
  selected,
  disabled = false,
  onToggle,
  weightLabel = 'W:',
  className = '',
}: RequirementCardProps) {
  const handleClick = () => {
    if (!disabled) {
      onToggle(id)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-disabled={disabled}
      className={`group relative flex w-full flex-col justify-between rounded-xl border p-4 text-left transition-all duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ion ${
        disabled
          ? 'cursor-not-allowed border-border/50 bg-surface/40 opacity-55'
          : selected
            ? 'border-ion bg-surface-2 ring-1 ring-ion/50 active:scale-[0.98]'
            : 'border-border bg-surface hover:border-milk/60 hover:bg-surface-2/70 active:scale-[0.98]'
      } ${className}`}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border font-mono text-xs ${
              disabled
                ? 'border-border text-ink-2'
                : selected
                  ? 'border-ion bg-ion/20 text-ion'
                  : 'border-border bg-bg text-ink-2 group-hover:border-milk group-hover:text-milk'
            }`}
          >
            {disabled ? '×' : selected ? '✓' : '+'}
          </span>
          <h4 className="font-sans text-base font-semibold text-ink">{title}</h4>
        </div>

        <span
          className={`shrink-0 rounded-md border px-2 py-0.5 font-mono text-xs font-medium ${
            selected
              ? 'border-milk-strong/60 bg-milk/15 text-milk-strong'
              : 'border-border bg-bg/80 text-ink-2'
          }`}
        >
          {weightLabel} {weight}
        </span>
      </div>

      <p className="mt-2.5 pl-7 text-sm leading-relaxed text-ink-2">{description}</p>
    </button>
  )
}
