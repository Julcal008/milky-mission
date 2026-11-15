export interface DecisionOption {
  id: string
  label: string
  description: string
}

import { useId } from 'react'

export interface DecisionPanelProps {
  title: string
  body: string
  options: DecisionOption[]
  onChoose: (id: string) => void
  backgroundSrc?: string
  optionPrefix?: string
  className?: string
}

export function DecisionPanel({
  title,
  body,
  options,
  onChoose,
  backgroundSrc,
  optionPrefix = 'OPT',
  className = '',
}: DecisionPanelProps) {
  const headingId = useId()

  return (
    <section
      aria-labelledby={headingId}
      className={`relative w-full max-w-2xl overflow-hidden rounded-2xl border border-warning/60 bg-surface p-6 shadow-xl ${className}`}
    >
      {backgroundSrc ? (
        <img
          src={backgroundSrc}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
        />
      ) : null}

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-warning bg-warning/20 font-mono text-xs text-warning"
          >
            !
          </span>
          <h2 id={headingId} className="font-sans text-xl font-bold tracking-tight text-ink">
            {title}
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-ink-2">{body}</p>

        <div role="group" aria-label={title} className="mt-2 flex flex-col gap-2.5">
          {options.map((option, idx) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onChoose(option.id)}
              className="group flex w-full flex-col gap-1 rounded-xl border border-border bg-surface-2/90 p-4 text-left transition-all duration-150 motion-reduce:transition-none hover:border-ion hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ion active:scale-[0.98]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-sans text-base font-semibold text-ink group-hover:text-milk-strong">
                  {option.label}
                </span>
                <span className="rounded border border-border bg-bg px-2 py-0.5 font-mono text-xs text-ion">
                  {optionPrefix} {String(idx + 1).padStart(2, '0')} →
                </span>
              </div>
              <span className="text-xs leading-relaxed text-ink-2">{option.description}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
