/**
 * Report screen — Owner: Track A (UI sprint).
 * Renders the derived MissionReport: score, requirements, causal chain and
 * suggestions. No physics here.
 */
import { useEffect, useRef, useState } from 'react'
import { MissionCard } from '@/app/visuals/generated/MissionCard'
import { AiBackdrop } from '@/app/visuals/AiBackdrop'
import { ReportFrame } from '@/app/visuals/ReportFrame'
import { ScoreRing } from '@/app/visuals/ScoreRing'
import { visualUrl } from '@/app/visuals/assets'
import { scenarioContent } from '@/content/scenarios'
import { catalogs } from '@/data/catalogs'
import { decisionOptionFor } from '@/engine/decisions'
import type { ReportStep } from '@/engine/report'
import { scenarioFixtures } from '@/engine/__fixtures__/scenario-fixture'
import { REQUIREMENT_TAGS } from '@/engine/validate'
import { useMissionStore } from '@/store/mission'
import { useI18n } from '@/store/ui'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { format } from '@/ui/game/format'
import { ModelPanel } from '@/ui/game/ModelPanel'
import { Panel } from '@/ui/Panel'
import { ResourceBar } from '@/ui/ResourceBar'

function eventTypeFromTitle(titleKey: string): string {
  if (titleKey.startsWith('event.instFail.')) return 'inst_fail'
  const key = titleKey.replace('event.', '')
  const map: Record<string, string> = {
    cmeHit: 'cme_hit',
    cmeLong: 'cme_hit',
    cmeGlancing: 'cme_hit',
    flareX: 'flare_x',
    flareX10: 'flare_x',
    powerDeficit: 'power_deficit',
    gsOutage: 'gs_outage',
    bufferFull: 'buffer_full',
    thermal: 'thermal',
    wheelFail: 'wheel_fail',
    calibration: 'calibration',
    dataGap: 'data_gap',
    aurora: 'aurora',
    rfInterference: 'rf',
    antennaFault: 'antenna',
    budgetReview: 'budget',
    launchSlip: 'schedule',
    partnerRequest: 'partner',
    instFail: 'inst_fail',
  }
  return map[key] ?? ''
}

export function ReportScreen() {
  const { t, lang } = useI18n()
  const config = useMissionStore((state) => state.config)
  const simulation = useMissionStore((state) => state.simulation)
  const report = useMissionStore((state) => state.report)
  const simulate = useMissionStore((state) => state.simulate)
  const shareCode = useMissionStore((state) => state.shareCode)
  const [copied, setCopied] = useState(false)
  const autoStarted = useRef(false)

  useEffect(() => {
    if (!autoStarted.current && !simulation && config) {
      autoStarted.current = true
      simulate()
    }
  }, [simulation, simulate, config])

  if (!config) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="font-display text-3xl font-semibold text-ink">{t.ops.report.title}</h1>
        <Panel className="space-y-4 p-6">
          <p className="text-[13px] text-ink-2">{t.ops.simulate.completeDesign}</p>
          <Button variant="primary" onClick={() => (window.location.hash = '#/design')}>
            {t.game.design.title}
          </Button>
        </Panel>
      </div>
    )
  }

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

  const copy = scenarioContent[lang][config.scenarioId]
  const difficultyLabel =
    config.difficulty === 'cadet'
      ? t.brief.cadet
      : config.difficulty === 'flight-director'
        ? t.brief.flightDirector
        : t.brief.engineer
  const chosen = simulation.requirements.filter((requirement) =>
    config.requirements.includes(requirement.id),
  )
  const teamMode = simulation.score.teamwork > 0
  const efficiencyMax = teamMode ? 200 : 300

  const budgets = simulation.budgets
  const duration = scenarioFixtures[config.scenarioId].durationDays
  const delivered =
    budgets.dataGbPerDay > 0 ? Math.min(1, budgets.downlinkGbPerDay / budgets.dataGbPerDay) : 1
  const installed = new Set(config.instrumentIds)
  const supports = (tag: string) =>
    catalogs.instruments.some(
      (instrument) => installed.has(instrument.id) && instrument.supports.includes(tag),
    )
  const orbit = catalogs.orbits.find((item) => item.id === config.orbitId)
  const diagnosisCopy = t.ops.report.diagnosis as Record<string, string>

  type DiagnosisCause = { key: string; params: Record<string, string | number> }

  const causes: DiagnosisCause[] = chosen
    .filter((requirement) => requirement.fraction < 0.99)
    .map((requirement): DiagnosisCause => {
      const tags = REQUIREMENT_TAGS[config.scenarioId]?.[requirement.id] ?? []
      if (tags.length > 0 && !tags.some((tag) => supports(tag))) {
        return { key: 'noCapability', params: {} }
      }
      if (
        config.scenarioId === 'storm-watch' &&
        requirement.id === 'R2' &&
        (orbit?.inclinationDeg ?? 0) < 80
      ) {
        return {
          key: 'lowInclination',
          params: { inclination: orbit?.inclinationDeg ?? 0 },
        }
      }
      if (config.scenarioId === 'storm-watch' && requirement.id === 'R4' && !supports('storm')) {
        return { key: 'noStormSensor', params: {} }
      }
      if (
        config.scenarioId === 'andes-flood-watch' &&
        requirement.id === 'R2' &&
        !supports('allweather')
      ) {
        return { key: 'noAllWeather', params: {} }
      }
      if (
        config.scenarioId === 'andes-flood-watch' &&
        requirement.id === 'R3' &&
        !supports('highres')
      ) {
        return { key: 'noResolution', params: {} }
      }
      const lifetimeId = config.scenarioId === 'storm-watch' ? 'R6' : 'R5'
      if (requirement.id === lifetimeId && budgets.lifetimeDays < duration) {
        return {
          key: 'shortLife',
          params: { lifetime: budgets.lifetimeDays, required: duration },
        }
      }
      const dataRequirement =
        (config.scenarioId === 'storm-watch' &&
          ['R1', 'R2', 'R3', 'R5'].includes(requirement.id)) ||
        (config.scenarioId === 'andes-flood-watch' && requirement.id === 'R4')
      const threshold = requirement.id === 'R1' ? 0.7 : 0.6
      if (dataRequirement && delivered < threshold) {
        return {
          key: 'lowData',
          params: {
            delivered: Math.round(delivered * 100),
            required: Math.round(threshold * 100),
          },
        }
      }
      if (budgets.powerMarginW < 0) {
        return { key: 'lowPower', params: { margin: budgets.powerMarginW.toFixed(1) } }
      }
      return { key: 'partial', params: { fraction: Math.round(requirement.fraction * 100) } }
    })

  const stepLabel = (step: ReportStep): string => {
    if (step.titleKey.startsWith('event.instFail.')) {
      return `${eventCopy.instFail}: ${step.titleKey.split('.').pop()}`
    }
    return eventCopy[step.titleKey.replace('event.', '')] ?? step.titleKey
  }

  const decisionLabel = (step: ReportStep): string | null => {
    if (!step.optionId) return null
    const option = decisionOptionFor(step.optionId)
    return option ? (decisionCopy[option.labelKey] ?? step.optionId) : step.optionId
  }

  const seenTypes = new Set<string>()
  const causalSteps = report.steps.filter((step) => {
    if (step.optionId) {
      return true
    }
    const type = eventTypeFromTitle(step.titleKey)
    if (seenTypes.has(type)) {
      return false
    }
    seenTypes.add(type)
    return true
  })
  const visibleSteps = causalSteps.slice(0, 8)
  const hiddenSteps = report.steps.length - visibleSteps.length

  const share = async () => {
    const code = shareCode()
    if (!code) {
      return
    }
    const url = `${window.location.origin}${window.location.pathname}?m=${code}#/report`
    let didCopy = false
    try {
      await navigator.clipboard.writeText(url)
      didCopy = true
    } catch {
      didCopy = window.prompt(t.ops.report.copyPrompt, url) !== null
    }
    if (didCopy) {
      setCopied(true)
    }
  }

  return (
    <ReportFrame>
      <AiBackdrop file="report/hero-bg.webp" className="p-0">
        <div className="space-y-5">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="label-caps text-ink-3">
                {config.scenarioId} · {difficultyLabel}
              </p>
              <h1 className="font-display text-3xl font-semibold text-ink">{t.ops.report.title}</h1>
              <p className="text-[13px] text-ink-2">{t.ops.report.lead}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
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
              <ScoreRing
                total={report.total}
                grade={report.grade}
                labels={{ total: t.ops.report.score, grade: t.ops.report.grade }}
              />
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
                        ? t.ops.report.requirementMet
                        : requirement.fraction > 0
                          ? t.ops.report.requirementPartial
                          : t.ops.report.requirementFailed}
                    </Badge>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel className="space-y-3 p-5">
            <h2 className="label-caps text-ink-2">{t.ops.report.diagnosis.title}</h2>
            {causes.length === 0 ? (
              <p className="text-[12px] text-ink-3">{t.ops.report.diagnosis.allMet}</p>
            ) : (
              <ul className="space-y-2">
                {causes.map((cause, index) => (
                  <li
                    key={`${cause.key}-${index}`}
                    className="flex items-start gap-2 text-[12px] text-ink-2"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-danger"
                    />
                    <span>{format(diagnosisCopy[cause.key] ?? cause.key, cause.params)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel className="space-y-3 p-5">
            <h2 className="label-caps text-ink-2">{t.ops.report.causalChain}</h2>
            <ol className="space-y-2">
              {visibleSteps.map((step) => {
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
                    <span className="text-[11px] text-ink-3">
                      · {roleCopy[step.role] ?? step.role}
                    </span>
                    <Badge
                      tone={
                        step.severity === 'critical'
                          ? 'danger'
                          : step.severity === 'warning'
                            ? 'warning'
                            : 'info'
                      }
                    >
                      {t.common.severity[step.severity]}
                    </Badge>
                    {decision ? <span className="text-[11px] text-jade">→ {decision}</span> : null}
                  </li>
                )
              })}
            </ol>
            {hiddenSteps > 0 ? (
              <p className="text-[11px] text-ink-3">
                {format(t.ops.report.moreEvents, { count: hiddenSteps })}
              </p>
            ) : null}
          </Panel>

          <Panel className="space-y-3 p-5">
            <h2 className="label-caps text-ink-2">{t.ops.report.suggestions}</h2>
            {report.suggestions.length === 0 ? (
              <div className="space-y-1">
                <p className="text-[12px] text-ink-2">{t.ops.report.noBlocking}</p>
                <p className="text-[11px] text-ink-3">
                  {t.ops.report.weakestHints[report.weakestComponent]}
                </p>
              </div>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {report.suggestions.map((suggestion) => (
                  <li
                    key={suggestion.code}
                    className="flex items-start gap-2 text-[12px] text-ink-2"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ion"
                    />
                    <span>{suggestionCopy[suggestion.code] ?? suggestion.messageKey}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <section className="space-y-3">
            <div>
              <h2 className="label-caps text-ink-2">{t.ops.report.missionCard}</h2>
              <p className="text-[12px] text-ink-3">{t.ops.report.missionCardLead}</p>
            </div>
            <MissionCard
              title={copy.title}
              subtitle={copy.summary}
              score={report.total}
              grade={report.grade}
              max={1000}
              telemetryLabel={t.ops.report.missionCardTelemetry}
              backgroundSrc={visualUrl('share/mission-card-bg.webp')}
            />
          </section>

          <ModelPanel />

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => (window.location.hash = '#/simulate')}>
                {t.ops.report.back}
              </Button>
              <Button variant="ghost" onClick={() => (window.location.hash = '#/map')}>
                {t.ops.map.open}
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
      </AiBackdrop>
    </ReportFrame>
  )
}
