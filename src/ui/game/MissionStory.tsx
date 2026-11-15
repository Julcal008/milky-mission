/** Educational event story — Owner: Track A (Report). */
import { decisionOptionFor, decisionOptionsFor } from '@/engine/decisions'
import type { ReportStep } from '@/engine/report'
import { useI18n } from '@/store/ui'
import { Badge } from '@/ui/Badge'
import { Panel } from '@/ui/Panel'
import type { ReportCopy } from '@/app/screens/report-copy.en'

function severityTone(severity: ReportStep['severity']) {
  return severity === 'critical' ? 'danger' : severity === 'warning' ? 'warning' : 'info'
}

export function MissionStory({ steps, copy }: { steps: ReportStep[]; copy: ReportCopy['story'] }) {
  const { t } = useI18n()
  const eventCopy = t.game.event as Record<string, string>
  const challengeCopy = t.game.challenge as Record<string, string>
  const roleCopy = t.game.roles as Record<string, string>
  const decisionCopy = t.game.decisions as Record<string, string>

  const eventTitle = (step: ReportStep): string => {
    if (step.titleKey.startsWith('event.instFail.')) {
      return `${eventCopy.instFail}: ${step.titleKey.split('.').pop()}`
    }
    return eventCopy[step.titleKey.replace('event.', '')] ?? step.titleKey
  }

  const description = (step: ReportStep): string | undefined => {
    if (!step.descriptionKey) return undefined
    return (
      challengeCopy[step.descriptionKey.replace('challenge.', '').replace('.description', '')] ??
      undefined
    )
  }

  return (
    <Panel className="space-y-4 p-5">
      <div className="space-y-1">
        <h2 className="label-caps text-ink-2">{copy.title}</h2>
        <p className="text-[12px] leading-relaxed text-ink-2">{copy.lead}</p>
      </div>
      {steps.length === 0 ? (
        <p className="text-[12px] text-ink-3">{copy.empty}</p>
      ) : (
        <ol className="relative space-y-3 border-l-2 border-border pl-4">
          {steps.map((step) => {
            const title = eventTitle(step)
            const body = description(step)
            const options = step.challengeId ? decisionOptionsFor(step.challengeId) : []
            const chosen = step.optionId ? decisionOptionFor(step.optionId) : null
            const others = options.filter((option) => option.id !== step.optionId)
            const handled = chosen?.effect.handled === true
            const hasOptions = options.length > 0
            const wasCritical = step.severity === 'critical'

            return (
              <li key={step.eventId} className="relative">
                <span
                  aria-hidden="true"
                  className={`absolute -left-[1.32rem] top-2 size-2.5 rounded-full border-2 border-bg ${
                    wasCritical
                      ? 'bg-danger'
                      : step.severity === 'warning'
                        ? 'bg-warning'
                        : 'bg-ion'
                  }`}
                />
                <article className="space-y-2 rounded-lg border border-border bg-surface-2/25 p-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="num text-[11px] text-ink-3">
                      {t.ops.simulate.day} {step.day}
                    </span>
                    <Badge tone={severityTone(step.severity)}>
                      {t.common.severity[step.severity]}
                    </Badge>
                    <span className="text-[11px] text-ink-3">
                      {roleCopy[step.role] ?? step.role}
                    </span>
                  </div>

                  <h3 className="text-[13px] font-medium text-ink">{title}</h3>

                  <dl className="grid gap-2 text-[11px] sm:grid-cols-2">
                    <div>
                      <dt className="label-caps text-ink-3">{copy.whatHappened}</dt>
                      <dd className="mt-0.5 leading-relaxed text-ink-2">{body ?? title}</dd>
                    </div>
                    <div>
                      <dt className="label-caps text-ink-3">{copy.whatYouChose}</dt>
                      <dd className="mt-0.5 leading-relaxed text-ink-2">
                        {chosen
                          ? (decisionCopy[chosen.labelKey] ?? chosen.labelKey)
                          : hasOptions
                            ? copy.noDecision
                            : copy.alertOnly}
                        {chosen ? (
                          <span className="mt-0.5 block text-ink-3">
                            {decisionCopy[chosen.descriptionKey] ?? ''}
                          </span>
                        ) : null}
                      </dd>
                    </div>
                  </dl>

                  <p className="text-[11px] leading-relaxed text-ink-2">
                    <span className="label-caps mr-2 text-ink-3">{copy.whyItMattered}</span>
                    {chosen
                      ? handled
                        ? copy.handled
                        : copy.unhandled
                      : hasOptions
                        ? wasCritical
                          ? copy.criticalNoDecision
                          : copy.noDecision
                        : copy.alertOnly}
                  </p>

                  {others.length > 0 ? (
                    <details className="text-[11px] text-ink-3">
                      <summary className="cursor-pointer select-none hover:text-ink">
                        {copy.otherOptions} ({others.length})
                      </summary>
                      <ul className="mt-1.5 space-y-1.5">
                        {others.map((option) => (
                          <li key={option.id} className="leading-relaxed">
                            <span className="text-ink-2">
                              {decisionCopy[option.labelKey] ?? option.labelKey}
                            </span>
                            {' — '}
                            {decisionCopy[option.descriptionKey] ?? ''}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </article>
              </li>
            )
          })}
        </ol>
      )}
    </Panel>
  )
}
