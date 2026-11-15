export type ReviewVerdict = 'go' | 'conditional' | 'nogo'
export type ReviewIssueSeverity = 'error' | 'warning' | 'info'

export interface ReviewIssue {
  id: string
  severity: ReviewIssueSeverity
  label: string
  detail?: string
}

export interface ReviewLabels {
  readiness?: string
  go?: string
  conditional?: string
  nogo?: string
  error?: string
  warning?: string
  info?: string
  findings?: string
  launch?: string
}

export interface ReviewSummaryProps {
  verdict: ReviewVerdict
  score?: number
  grade?: string
  max?: number
  issues: ReviewIssue[]
  onLaunch?: () => void
  labels?: ReviewLabels
  className?: string
}

const DEFAULT_LABELS: Required<ReviewLabels> = {
  readiness: 'Flight readiness review',
  go: 'GO',
  conditional: 'CONDITIONAL',
  nogo: 'NO-GO',
  error: 'ERR',
  warning: 'WARN',
  info: 'INFO',
  findings: 'Review findings',
  launch: 'Launch',
}

const VERDICT_CONFIG: Record<
  ReviewVerdict,
  {
    symbol: string
    borderClass: string
    badgeClass: string
    buttonClass: string
  }
> = {
  go: {
    symbol: '●',
    borderClass: 'border-success/60',
    badgeClass: 'border-success/50 bg-success/15 text-success',
    buttonClass:
      'border-success bg-success/20 text-ink hover:bg-success/30 focus-visible:ring-success',
  },
  conditional: {
    symbol: '▲',
    borderClass: 'border-warning/60',
    badgeClass: 'border-warning/50 bg-warning/15 text-warning',
    buttonClass:
      'border-warning bg-warning/20 text-ink hover:bg-warning/30 focus-visible:ring-warning',
  },
  nogo: {
    symbol: '■',
    borderClass: 'border-danger/60',
    badgeClass: 'border-danger/50 bg-danger/15 text-danger',
    buttonClass:
      'border-danger/50 bg-surface-2 text-ink-2 hover:border-danger hover:text-ink focus-visible:ring-danger',
  },
}

const ISSUE_META: Record<
  ReviewIssueSeverity,
  { symbol: string; badgeClass: string; rowClass: string }
> = {
  error: {
    symbol: '■',
    badgeClass: 'border-danger/50 bg-danger/15 text-danger',
    rowClass: 'border-danger/40 bg-surface-2/90',
  },
  warning: {
    symbol: '▲',
    badgeClass: 'border-warning/50 bg-warning/15 text-warning',
    rowClass: 'border-warning/40 bg-surface-2/80',
  },
  info: {
    symbol: '●',
    badgeClass: 'border-ion/50 bg-ion/15 text-ion',
    rowClass: 'border-border bg-surface/90',
  },
}

export function ReviewSummary({
  verdict,
  score,
  grade,
  max = 100,
  issues,
  onLaunch,
  labels,
  className = '',
}: ReviewSummaryProps) {
  const copy = { ...DEFAULT_LABELS, ...labels }
  const cfg = VERDICT_CONFIG[verdict]
  const verdictLabel = copy[verdict]
  const safeMax = max > 0 ? max : 100
  const hasScore = typeof score === 'number' && Number.isFinite(score)
  const clampedScore = hasScore ? Math.min(safeMax, Math.max(0, Math.round(score))) : 0
  const percentage = hasScore ? Math.round((clampedScore / safeMax) * 100) : 0

  return (
    <section
      aria-label={`${copy.readiness}: ${verdictLabel}`}
      className={`flex w-full max-w-2xl flex-col gap-5 rounded-2xl border bg-surface/95 p-5 shadow-lg sm:p-6 ${cfg.borderClass} ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest ${cfg.badgeClass}`}
          >
            <span aria-hidden="true">{cfg.symbol}</span>
            <span>{verdictLabel}</span>
          </span>

          {grade ? (
            <span className="rounded-lg border border-border bg-surface-2 px-3 py-1 font-mono text-sm font-bold text-milk-strong">
              {grade}
            </span>
          ) : null}
        </div>

        {hasScore ? (
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-ink">
              {clampedScore}
            </span>
            <span className="font-mono text-xs uppercase text-ink-2">/ {safeMax}</span>
          </div>
        ) : null}
      </div>

      {hasScore ? (
        <div
          role="meter"
          aria-label={verdictLabel}
          aria-valuenow={clampedScore}
          aria-valuemin={0}
          aria-valuemax={safeMax}
          className="h-2.5 w-full overflow-hidden rounded-full border border-border bg-bg"
        >
          <div
            style={{ width: `${percentage}%` }}
            className={`h-full rounded-full transition-all duration-300 ease-out motion-reduce:transition-none ${
              verdict === 'go'
                ? 'bg-success'
                : verdict === 'conditional'
                  ? 'bg-warning'
                  : 'bg-danger'
            }`}
          />
        </div>
      ) : null}

      {issues.length > 0 ? (
        <ul aria-label={copy.findings} className="flex flex-col gap-2.5">
          {issues.map((issue) => {
            const meta = ISSUE_META[issue.severity]
            return (
              <li
                key={issue.id}
                className={`flex flex-col gap-1 rounded-xl border p-3.5 ${meta.rowClass}`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-xs font-semibold ${meta.badgeClass}`}
                  >
                    <span aria-hidden="true">{meta.symbol}</span>
                    <span>{copy[issue.severity]}</span>
                  </span>
                  <span className="font-sans text-sm font-semibold text-ink">{issue.label}</span>
                </div>
                {issue.detail ? (
                  <p className="pl-14 text-xs leading-relaxed text-ink-2">{issue.detail}</p>
                ) : null}
              </li>
            )
          })}
        </ul>
      ) : null}

      {onLaunch ? (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onLaunch}
            disabled={verdict === 'nogo'}
            aria-disabled={verdict === 'nogo'}
            className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 font-mono text-sm font-semibold uppercase tracking-wider transition-all duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${cfg.buttonClass}`}
          >
            <span aria-hidden="true">↗</span>
            <span>{copy.launch}</span>
          </button>
        </div>
      ) : null}
    </section>
  )
}
