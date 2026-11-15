/** Educational score breakdown — Owner: Track A (Report). */
import { format } from '@/ui/game/format'
import { Panel } from '@/ui/Panel'

export interface ScoreExplainerItem {
  key: string
  label: string
  value: number
  max: number
  what: string
  result: string
  formula: string
}

const TONE: Record<string, string> = {
  mission: 'bg-res-budget',
  science: 'bg-res-data',
  efficiency: 'bg-res-link',
  robustness: 'bg-res-power',
  teamwork: 'bg-res-time',
}

export function ScoreExplainer({
  title,
  lead,
  detailsLabel,
  pointsLabel,
  items,
}: {
  title: string
  lead: string
  detailsLabel: string
  pointsLabel: string
  items: ScoreExplainerItem[]
}) {
  return (
    <Panel className="space-y-4 p-5">
      <div className="space-y-1">
        <h2 className="label-caps text-ink-2">{title}</h2>
        <p className="text-[12px] leading-relaxed text-ink-2">{lead}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => {
          const pct = item.max > 0 ? Math.round((item.value / item.max) * 100) : 0
          return (
            <article
              key={item.key}
              className="rounded-lg border border-border bg-surface-2/30 p-3.5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-[13px] font-medium text-ink">{item.label}</h3>
                <span className="num text-[12px] text-ink">
                  {format(pointsLabel, { value: item.value, max: item.max })}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={item.label}
                aria-valuenow={item.value}
                aria-valuemin={0}
                aria-valuemax={item.max}
                className="mt-2 h-1.5 w-full overflow-hidden rounded-sm bg-surface"
              >
                <div
                  className={`h-full rounded-sm ${TONE[item.key] ?? 'bg-milk-strong'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-2">{item.what}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink">{item.result}</p>
              <details className="mt-2 text-[11px] text-ink-3">
                <summary className="cursor-pointer select-none hover:text-ink">
                  {detailsLabel}
                </summary>
                <p className="mt-1 leading-relaxed">{item.formula}</p>
              </details>
            </article>
          )
        })}
      </div>
    </Panel>
  )
}
