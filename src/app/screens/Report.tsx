/**
 * Report screen — Owner: Track A (UI sprint).
 * Renders the derived MissionReport: score, requirements, causal chain and
 * suggestions. No physics here.
 */
import { useEffect, useRef, useState } from 'react'
import { decisionOptionsFor } from '@/engine/decisions'
import type { ReportStep } from '@/engine/report'
import { useMissionStore } from '@/store/mission'
import { useI18n } from '@/store/ui'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { Panel } from '@/ui/Panel'
import { ResourceBar } from '@/ui/ResourceBar'

function eventTypeFromTitle(titleKey: string): string {
  if (titleKey.startsWith('event.instFail.')) return 'inst_fail'
  const key = titleKey.replace('event.', '')
  const map: Record<string, string> = {
    cmeHit: 'cme_hit',
    flareX: 'flare_x',
    powerDeficit: 'power_deficit',
    gsOutage: 'gs_outage',
    bufferFull: 'buffer_full',
  }
  return map[key] ?? ''
}

export function ReportScreen() {
  const { t } = useI18n()
  const config = useMissionStore((state) => state.config)
  const simulation = useMissionStore((state) => state.simulation)
  const report = useMissionStore((state) => state.report)
  const simulate = useMissionStore((state) => state.simulate)
  const shareCode = useMissionStore((state) => state.shareCode)
  const [copied, setCopied] = useState(false)
  const autoStarted = useRef(false)

  useEffect(() => {
    if (!autoStarted.current && !simulation) {
      autoStarted.current = true
      simulate()
    }
  }, [simulation, simulate])

  const eventCopy = t.game.event as Record<string, string>
  const roleCopy = t.game.roles as Record<string, string>
  const decisionCopy = t.game.decisions as Record<string, string>
  const suggestionCopy = t.ops.report.suggest as Record<string, string>

  if (!report || !simulation) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="font-display text-3xl font-semibold text-ink">{t.ops.report.title}</h1>
        <Panel className="space-y-4 p-6">
          <p className="text-[13px] text-ink-2">{t.ops.report.noReport}</p>
          <Button variant="primary" onClick={() => simulate()}>
            {t.ops.simulate.run}
          </Button>
        </Panel>
      </div>
    )
  }

  const chosen = simulation.requirements.filter((requirement) =>
    config.requirements.includes(requirement.id),
  )
  const teamMode = simulation.score.teamwork > 0
  const efficiencyMax = teamMode ? 200 : 300

  const stepLabel = (step: ReportStep): string => {
    if (step.titleKey.startsWith('event.instFail.')) {
      return `${eventCopy.instFail}: ${step.titleKey.split('.').pop()}`
    }
    return eventCopy[step.titleKey.replace('event.', '')] ?? step.titleKey
  }

  const decisionLabel = (step: ReportStep): string | null => {
    if (!step.optionId) return null
    const type = eventTypeFromTitle(step.titleKey)
    const option = decisionOptionsFor(type).find((item) => item.id === step.optionId)
    return option ? (decisionCopy[option.labelKey] ?? step.optionId) : step.optionId
  }

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}?m=${shareCode()}#/report`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      window.prompt('Copy this link', url)
    }
    setCopied(true)
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="label-caps text-ink-3">{config.scenarioId}</p>
          <h1 className="font-display text-3xl font-semibold text-ink">{t.ops.report.title}</h1>
          <p className="text-[13px] text-ink-2">{t.ops.report.lead}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            tone={
              report.verdict === 'success'
                ? 'success'
                : report.verdict === 'partial'
                  ? 'warning'
                  : 'danger'
            }
          >
            {t.ops.report[report.verdict]}
          </Badge>
          <div className="text-right">
            <p className="num text-4xl font-semibold leading-none text-ink">{report.total}</p>
            <p className="label-caps mt-1 text-ink-3">
              {t.ops.report.score} · {report.grade}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel className="space-y-4 p-5">
          <h2 className="label-caps text-ink-2">{t.ops.report.breakdown}</h2>
          <ResourceBar
            label={t.ops.report.components.mission}
            value={simulation.score.missionSuccess}
            max={300}
            unit="pts"
            tone="budget"
            status={t.ops.report.components.mission}
          />
          <ResourceBar
            label={t.ops.report.components.science}
            value={simulation.score.science}
            max={250}
            unit="pts"
            tone="data"
            status={t.ops.report.components.science}
          />
          <ResourceBar
            label={t.ops.report.components.efficiency}
            value={simulation.score.efficiency}
            max={efficiencyMax}
            unit="pts"
            tone="link"
            status={t.ops.report.components.efficiency}
          />
          <ResourceBar
            label={t.ops.report.components.robustness}
            value={simulation.score.robustness}
            max={150}
            unit="pts"
            tone="power"
            status={t.ops.report.components.robustness}
          />
          {teamMode ? (
            <ResourceBar
              label={t.ops.report.components.teamwork}
              value={simulation.score.teamwork}
              max={100}
              unit="pts"
              tone="time"
              status={t.ops.report.components.teamwork}
            />
          ) : null}
          <div className="flex items-center justify-between gap-2 border-t border-border pt-3 text-[12px]">
            <span className="text-ink-3">{t.ops.report.weakest}</span>
            <span className="text-ink">{t.ops.report.components[report.weakestComponent]}</span>
          </div>
        </Panel>

        <Panel className="space-y-3 p-5">
          <h2 className="label-caps text-ink-2">{t.ops.report.requirements}</h2>
          <ul className="space-y-2">
            {chosen.map((requirement) => (
              <li
                key={requirement.id}
                className="flex items-start justify-between gap-3 rounded-sm border border-border bg-surface-2/30 p-2.5"
              >
                <div>
                  <p className="text-[12px] font-medium text-ink">{requirement.detail}</p>
                  <p className="num mt-0.5 text-[10px] text-ink-3">
                    {(requirement.fraction * 100).toFixed(0)} %
                  </p>
                </div>
                <Badge
                  tone={
                    requirement.fraction >= 0.99
                      ? 'success'
                      : requirement.fraction > 0
                        ? 'warning'
                        : 'danger'
                  }
                >
                  {requirement.fraction >= 0.99
                    ? 'met'
                    : requirement.fraction > 0
                      ? 'partial'
                      : 'failed'}
                </Badge>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel className="space-y-3 p-5">
        <h2 className="label-caps text-ink-2">{t.ops.report.causalChain}</h2>
        <ol className="space-y-2">
          {report.steps.map((step) => {
            const decision = decisionLabel(step)
            return (
              <li
                key={`${step.day}-${step.titleKey}`}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-l-2 border-border pl-3"
              >
                <span className="num text-[11px] text-ink-3">
                  {t.ops.simulate.day} {step.day}
                </span>
                <span className="text-[12px] text-ink">{stepLabel(step)}</span>
                <span className="text-[11px] text-ink-3">· {roleCopy[step.role] ?? step.role}</span>
                <Badge
                  tone={
                    step.severity === 'critical'
                      ? 'danger'
                      : step.severity === 'warning'
                        ? 'warning'
                        : 'info'
                  }
                >
                  {step.severity}
                </Badge>
                {decision ? <span className="text-[11px] text-jade">→ {decision}</span> : null}
              </li>
            )
          })}
        </ol>
      </Panel>

      <Panel className="space-y-3 p-5">
        <h2 className="label-caps text-ink-2">{t.ops.report.suggestions}</h2>
        {report.suggestions.length === 0 ? (
          <p className="text-[12px] text-ink-3">{t.game.review.noIssues}</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {report.suggestions.map((suggestion) => (
              <li key={suggestion.code} className="flex items-start gap-2 text-[12px] text-ink-2">
                <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ion" />
                <span>{suggestionCopy[suggestion.code] ?? suggestion.messageKey}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => (window.location.hash = '#/simulate')}>
            {t.ops.report.back}
          </Button>
          <Button variant="ghost" onClick={() => (window.location.hash = '#/brief')}>
            {t.ops.report.designAgain}
          </Button>
        </div>
        <Button variant="primary" onClick={share}>
          {copied ? t.ops.report.copied : t.ops.report.share}
        </Button>
      </div>
    </div>
  )
}
