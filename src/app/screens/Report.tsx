/**
 * Report screen — Owner: Track A (UI sprint).
 * Renders the derived MissionReport as an educational story. No physics here.
 */
import { useEffect, useRef, useState } from 'react'
import { AiBackdrop } from '@/app/visuals/AiBackdrop'
import { MissionCard } from '@/app/visuals/generated/MissionCard'
import { ReportFrame } from '@/app/visuals/ReportFrame'
import { ScoreRing } from '@/app/visuals/ScoreRing'
import { visualUrl } from '@/app/visuals/assets'
import { reportCopyEn } from '@/app/screens/report-copy.en'
import { reportCopyEs } from '@/app/screens/report-copy.es'
import { scenarioContent } from '@/content/scenarios'
import { catalogs } from '@/data/catalogs'
import { scenarioFixtures } from '@/engine/__fixtures__/scenario-fixture'
import { REQUIREMENT_TAGS } from '@/engine/validate'
import { useMissionStore } from '@/store/mission'
import { useI18n } from '@/store/ui'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { format } from '@/ui/game/format'
import { Glossary } from '@/ui/game/Glossary'
import { MissionStory } from '@/ui/game/MissionStory'
import { ModelPanel } from '@/ui/game/ModelPanel'
import { ScoreExplainer, type ScoreExplainerItem } from '@/ui/game/ScoreExplainer'
import { StatBlock } from '@/app/visuals/generated/StatBlock'
import { Panel } from '@/ui/Panel'

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
  const edu = lang === 'es' ? reportCopyEs : reportCopyEn
  const difficultyLabel =
    config.difficulty === 'cadet'
      ? t.brief.cadet
      : config.difficulty === 'flight-director'
        ? t.brief.flightDirector
        : t.brief.engineer
  const scenario = scenarioFixtures[config.scenarioId]
  const duration = scenario.durationDays
  const chosen = simulation.requirements.filter((requirement) =>
    config.requirements.includes(requirement.id),
  )
  const teamMode = simulation.score.teamwork > 0
  const efficiencyMax = teamMode ? 200 : 300

  const budgets = simulation.budgets
  const delivered =
    budgets.dataGbPerDay > 0 ? Math.min(1, budgets.downlinkGbPerDay / budgets.dataGbPerDay) : 1
  const deliveredPct = Math.round(delivered * 100)
  const met = chosen.filter((requirement) => requirement.fraction >= 0.99).length
  const massMarginPct =
    budgets.massCapacityKg > 0
      ? ((budgets.massCapacityKg - budgets.massKg) / budgets.massCapacityKg) * 100
      : 0
  const weakestLabel = t.ops.report.components[report.weakestComponent]
  const weakestHint = t.ops.report.weakestHints[report.weakestComponent]
  const orbit = catalogs.orbits.find((item) => item.id === config.orbitId)
  const launcher = catalogs.launchers.find((item) => item.id === config.launcherId)
  const bus = catalogs.buses.find((item) => item.id === config.busId)
  const array = catalogs.arrays.find((item) => item.id === config.arrayId)
  const battery = catalogs.batteries.find((item) => item.id === config.batteryId)
  const comms = catalogs.comms.find((item) => item.id === config.commsId)
  const network = catalogs.groundNetworks.find((item) => item.id === config.groundNetworkId)
  const instruments = config.instrumentIds
    .map((id) => catalogs.instruments.find((item) => item.id === id)?.name ?? id)
    .join(', ')

  const installed = new Set(config.instrumentIds)
  const supports = (tag: string) =>
    catalogs.instruments.some(
      (instrument) => installed.has(instrument.id) && instrument.supports.includes(tag),
    )
  const requirementCopyFor = (id: string) =>
    (copy as unknown as Record<string, { title: string; description: string } | undefined>)[
      id.toLowerCase()
    ]
  const diagnosisCopy = t.ops.report.diagnosis as Record<string, string>
  const suggestionCopy = t.ops.report.suggest as Record<string, string>

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

  const summaryLines = [
    format(edu.summary.design, {
      mass: budgets.massKg.toFixed(1),
      instruments: config.instrumentIds.length,
      cost: budgets.costUsdM.toFixed(1),
    }),
    format(edu.summary.events, {
      days: duration,
      events: simulation.events.length,
      handled: report.handledCritical,
      critical: report.criticalEvents,
    }),
    format(edu.summary.result, {
      grade: report.grade,
      total: report.total,
      weakest: weakestLabel,
    }),
  ]

  const scoreItems: ScoreExplainerItem[] = [
    {
      key: 'mission',
      label: t.ops.report.components.mission,
      value: simulation.score.missionSuccess,
      max: 300,
      what: edu.score.components.mission.what,
      result: format(edu.score.components.mission.result, {
        met,
        chosen: chosen.length,
      }),
      formula: edu.score.components.mission.formula,
    },
    {
      key: 'science',
      label: t.ops.report.components.science,
      value: simulation.score.science,
      max: 250,
      what: edu.score.components.science.what,
      result: format(edu.score.components.science.result, { delivered: deliveredPct }),
      formula: edu.score.components.science.formula,
    },
    {
      key: 'efficiency',
      label: t.ops.report.components.efficiency,
      value: simulation.score.efficiency,
      max: efficiencyMax,
      what: edu.score.components.efficiency.what,
      result: format(edu.score.components.efficiency.result, {
        mass: massMarginPct.toFixed(0),
        power: budgets.powerMarginW.toFixed(1),
        cost: budgets.costUsdM.toFixed(1),
      }),
      formula: edu.score.components.efficiency.formula,
    },
    {
      key: 'robustness',
      label: t.ops.report.components.robustness,
      value: simulation.score.robustness,
      max: 150,
      what: edu.score.components.robustness.what,
      result: format(edu.score.components.robustness.result, {
        handled: report.handledCritical,
        critical: report.criticalEvents,
      }),
      formula: edu.score.components.robustness.formula,
    },
  ]
  if (teamMode) {
    scoreItems.push({
      key: 'teamwork',
      label: t.ops.report.components.teamwork,
      value: simulation.score.teamwork,
      max: 100,
      what: edu.score.components.teamwork.what,
      result: format(edu.score.components.teamwork.result, {
        value: simulation.score.teamwork,
      }),
      formula: edu.score.components.teamwork.formula,
    })
  }

  const massTone = massMarginPct >= 20 ? 'success' : massMarginPct >= 0 ? 'warning' : 'danger'
  const powerTone =
    budgets.powerMarginW >= 0 ? (budgets.powerMarginW >= 15 ? 'success' : 'warning') : 'danger'
  const budgetTone =
    budgets.costUsdM <= scenario.budgetUsdM
      ? budgets.costUsdM <= scenario.budgetUsdM * 0.9
        ? 'success'
        : 'warning'
      : 'danger'

  const snapshotRows = [
    {
      label: edu.snapshot.orbit,
      value: orbit
        ? `${orbit.name} · ${orbit.altitudeKm} km · ${orbit.inclinationDeg}°`
        : config.orbitId,
    },
    {
      label: edu.snapshot.launcher,
      value: launcher ? `${launcher.name} · $${launcher.costUsdM}M` : config.launcherId,
    },
    { label: edu.snapshot.bus, value: bus?.name ?? config.busId },
    {
      label: edu.snapshot.powerSystem,
      value: array
        ? `${array.name} · ${config.arrayAreaM2} m² · ${battery?.name ?? config.batteryId}`
        : config.arrayId,
    },
    {
      label: edu.snapshot.comms,
      value: `${comms?.name ?? config.commsId} · ${network?.name ?? config.groundNetworkId}`,
    },
    { label: edu.snapshot.payload, value: instruments },
  ]

  const lessons: string[] = []
  if (report.criticalEvents > report.handledCritical) {
    lessons.push(
      format(edu.lessons.critical, {
        count: report.criticalEvents - report.handledCritical,
      }),
    )
  }
  if (massMarginPct < 20) {
    lessons.push(format(edu.lessons.mass, { margin: massMarginPct.toFixed(0) }))
  }
  if (budgets.powerMarginW < 0) {
    lessons.push(format(edu.lessons.power, { margin: budgets.powerMarginW.toFixed(1) }))
  }
  if (deliveredPct < 70) {
    lessons.push(format(edu.lessons.data, { delivered: deliveredPct }))
  }
  if (met < chosen.length) {
    lessons.push(format(edu.lessons.requirements, { met, chosen: chosen.length }))
  }
  if (lessons.length === 0) {
    lessons.push(edu.lessons.success)
  }

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

  const printReport = () => {
    document.querySelectorAll('details').forEach((detail) => {
      detail.open = true
    })
    window.print()
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

          <Panel className="space-y-3 border-l-2 border-l-cream/70 p-5">
            <h2 className="label-caps text-ink-2">{edu.summary.title}</h2>
            <p className="text-[12px] text-ink-3">{edu.summary.lead}</p>
            <ul className="space-y-2">
              {summaryLines.map((line, index) => (
                <li key={index} className="flex items-start gap-2 text-[13px] leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cream"
                  />
                  <span className="text-ink-2">{line}</span>
                </li>
              ))}
            </ul>
            <p className="text-[12px] leading-relaxed text-ink">
              {format(edu.summary.learning, { lesson: weakestHint })}
            </p>
          </Panel>

          <ScoreExplainer
            title={edu.score.title}
            lead={edu.score.lead}
            detailsLabel={edu.score.details}
            pointsLabel={edu.score.points}
            items={scoreItems}
          />

          <Panel className="space-y-3 p-5">
            <h2 className="label-caps text-ink-2">{t.ops.report.requirements}</h2>
            <p className="text-[12px] leading-relaxed text-ink-2">{edu.requirementsLead}</p>
            <ul className="space-y-2">
              {chosen.map((requirement) => {
                const requirementCopy = requirementCopyFor(requirement.id)
                return (
                  <li
                    key={requirement.id}
                    className="flex items-start justify-between gap-3 rounded-sm border border-border bg-surface-2/30 p-2.5"
                  >
                    <div>
                      <p className="text-[12px] font-medium text-ink">
                        {requirementCopy?.title ?? requirement.detail}
                      </p>
                      {requirementCopy?.description ? (
                        <p className="mt-1 text-[10px] leading-relaxed text-ink-2">
                          {requirementCopy.description}
                        </p>
                      ) : null}
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
                )
              })}
            </ul>
          </Panel>

          <Panel className="space-y-4 p-5">
            <div className="space-y-1">
              <h2 className="label-caps text-ink-2">{edu.snapshot.title}</h2>
              <p className="text-[12px] leading-relaxed text-ink-2">{edu.snapshot.lead}</p>
            </div>
            <dl className="grid gap-2 sm:grid-cols-2">
              {snapshotRows.map((row) => (
                <div
                  key={row.label}
                  className="rounded-md border border-border bg-surface-2/30 p-2.5"
                >
                  <dt className="label-caps text-ink-3">{row.label}</dt>
                  <dd className="mt-0.5 text-[12px] leading-relaxed text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <StatBlock
                label={edu.snapshot.mass}
                value={`${budgets.massKg.toFixed(1)} / ${budgets.massCapacityKg.toFixed(0)} kg`}
                hint={`${massMarginPct.toFixed(0)}%`}
                tone={massTone}
              />
              <StatBlock
                label={edu.snapshot.powerMargin}
                value={`${budgets.powerMarginW.toFixed(1)} W`}
                tone={powerTone}
              />
              <StatBlock
                label={edu.snapshot.budget}
                value={`$${budgets.costUsdM.toFixed(1)}M / $${scenario.budgetUsdM}M`}
                tone={budgetTone}
              />
              <StatBlock
                label={edu.snapshot.lifetime}
                value={`${budgets.lifetimeDays} / ${duration}`}
                tone={budgets.lifetimeDays >= duration ? 'success' : 'danger'}
              />
              <StatBlock
                label={edu.snapshot.data}
                value={`${deliveredPct}%`}
                tone={deliveredPct >= 70 ? 'success' : deliveredPct > 0 ? 'warning' : 'danger'}
              />
            </div>
            <details className="text-[11px] text-ink-3">
              <summary className="cursor-pointer select-none hover:text-ink">
                {edu.snapshot.whyTitle}
              </summary>
              <p className="mt-1 leading-relaxed">{edu.snapshot.why}</p>
            </details>
          </Panel>

          <Panel className="space-y-3 p-5">
            <h2 className="label-caps text-ink-2">
              {report.verdict === 'success'
                ? edu.diagnosisSuccessTitle
                : t.ops.report.diagnosis.title}
            </h2>
            <p className="text-[12px] leading-relaxed text-ink-2">{edu.diagnosisLead}</p>
            {causes.length === 0 ? (
              <p className="text-[12px] text-ink-3">
                {report.verdict === 'success'
                  ? edu.diagnosisSuccessLead
                  : t.ops.report.diagnosis.allMet}
              </p>
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

          <MissionStory steps={report.steps} copy={edu.story} />

          <Panel className="space-y-3 p-5">
            <div className="space-y-1">
              <h2 className="label-caps text-ink-2">{edu.lessons.title}</h2>
              <p className="text-[12px] leading-relaxed text-ink-2">{edu.lessons.lead}</p>
            </div>
            <ul className="space-y-2">
              {lessons.slice(0, 3).map((lesson, index) => (
                <li
                  key={`${index}-${lesson}`}
                  className="flex items-start gap-2 text-[12px] text-ink-2"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-jade"
                  />
                  <span>{lesson}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-ink-3">{edu.lessons.next}</p>
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

          <Glossary copy={edu.glossary} />

          <Panel className="space-y-3 p-5">
            <h2 className="label-caps text-ink-2">{edu.data.title}</h2>
            <p className="text-[12px] leading-relaxed text-ink-2">{edu.data.lead}</p>
            <ul className="space-y-2 text-[12px] leading-relaxed text-ink-2">
              <li>{edu.data.donki}</li>
              <li>{edu.data.power}</li>
              <li>{edu.data.hardware}</li>
              <li>{edu.data.challenges}</li>
            </ul>
            <details className="text-[11px] text-ink-3">
              <summary className="cursor-pointer select-none hover:text-ink">
                {edu.data.model}
              </summary>
              <p className="mt-1">{edu.data.modelLead}</p>
              <div className="mt-3">
                <ModelPanel />
              </div>
            </details>
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

          <div className="no-print flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
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
              <Button variant="ghost" onClick={printReport}>
                {edu.print}
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
