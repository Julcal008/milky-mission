export interface StatBlockProps {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'milk' | 'ion' | 'success' | 'warning' | 'danger'
  className?: string
}

const STAT_TONE_CLASS: Record<NonNullable<StatBlockProps['tone']>, string> = {
  default: 'text-ink',
  milk: 'text-milk-strong',
  ion: 'text-ion',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
}

export function StatBlock({ label, value, hint, tone = 'milk', className = '' }: StatBlockProps) {
  return (
    <div
      className={`flex flex-col justify-between rounded-xl border border-border bg-surface/90 p-4 ${className}`}
    >
      <span className="font-mono text-xs uppercase tracking-wider text-ink-2">{label}</span>
      <span className={`mt-1 font-mono text-2xl font-bold tracking-tight ${STAT_TONE_CLASS[tone]}`}>
        {value}
      </span>
      {hint ? <span className="mt-1 text-xs text-ink-2">{hint}</span> : null}
    </div>
  )
}
