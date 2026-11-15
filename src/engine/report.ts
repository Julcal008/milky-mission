/**
 * REPORT MODEL — causal chain, highlights and improvement suggestions.
 * Owner: Track A.
 *
 * The report is derived data only: no new simulation. The UI resolves the i18n keys
 * and renders the steps; the engine never contains user-facing prose.
 */
import type {
  MissionConfig,
  RoleId,
  ScenarioSpec,
  ScoreBreakdown,
  SimulationResult,
  ValidationResult,
} from './types'

export interface ReportStep {
  eventId: string
  day: number
  kind: 'event'
  severity: 'info' | 'warning' | 'critical'
  role: RoleId
  titleKey: string
  /** Concrete challenge variant, when available. */
  challengeId?: string
  /** i18n key for the challenge description. */
  descriptionKey?: string
  /** Present when the player chose an option for this event. */
  optionId?: string
}

export interface ReportSuggestion {
  code: string
  messageKey: string
  params: Record<string, number | string>
}

export type ScoreComponent = 'mission' | 'science' | 'efficiency' | 'robustness' | 'teamwork'

export interface MissionReport {
  verdict: SimulationResult['verdict']
  grade: ScoreBreakdown['grade']
  total: number
  steps: ReportStep[]
  highlights: ReportStep[]
  suggestions: ReportSuggestion[]
  weakestComponent: ScoreComponent
  decisionCount: number
  handledCritical: number
  criticalEvents: number
}

const ISSUE_SUGGESTIONS: Record<string, string> = {
  MASS_OVER_CAPACITY: 'report.suggest.mass',
  MASS_MARGIN_LOW: 'report.suggest.massMargin',
  POWER_MARGIN_LOW: 'report.suggest.power',
  ENERGY_DEFICIT: 'report.suggest.energy',
  DATA_BACKLOG: 'report.suggest.data',
  BUDGET_EXCEEDED: 'report.suggest.budget',
  LIFETIME_SHORT: 'report.suggest.lifetime',
  REQUIREMENT_UNSUPPORTED: 'report.suggest.requirement',
  LINK_TOO_SLOW: 'report.suggest.link',
  RADIATION_RISK: 'report.suggest.radiation',
  FIXED_ORBIT_MISMATCH: 'report.suggest.orbit',
}

export function buildMissionReport(
  result: SimulationResult,
  _scenario: ScenarioSpec,
  validation?: ValidationResult,
): MissionReport {
  const optionByEvent = new Map(
    result.decisions.map((decision) => [decision.eventId, decision.optionId]),
  )

  const steps: ReportStep[] = result.events.map((event) => ({
    eventId: event.id,
    day: event.day,
    kind: 'event',
    severity: event.severity,
    role: event.role,
    titleKey: event.titleKey,
    challengeId: event.challengeId,
    descriptionKey: event.descriptionKey,
    optionId: optionByEvent.get(event.id),
  }))

  const critical = steps.filter((step) => step.severity === 'critical')
  const highlights = (critical.length > 0 ? critical : steps).slice(0, 5)

  const suggestions: ReportSuggestion[] = []
  const seen = new Set<string>()
  for (const issue of validation?.issues ?? []) {
    const messageKey = ISSUE_SUGGESTIONS[issue.code]
    if (!messageKey || seen.has(issue.code)) {
      continue
    }
    seen.add(issue.code)
    suggestions.push({
      code: issue.code,
      messageKey,
      params: issue.detail ?? {},
    })
  }

  const ratios: Array<[ScoreComponent, number]> = [
    ['mission', result.score.missionSuccess / 300],
    ['science', result.score.science / 250],
    ['efficiency', result.score.efficiency / 300],
    ['robustness', result.score.robustness / 150],
  ]
  if (result.score.teamwork > 0) {
    ratios.push(['teamwork', result.score.teamwork / 100])
  }

  const weakestComponent = ratios.reduce((weakest, current) =>
    current[1] < weakest[1] ? current : weakest,
  )[0]

  const handledCritical = steps.filter(
    (step) => step.severity === 'critical' && step.optionId,
  ).length

  return {
    verdict: result.verdict,
    grade: result.score.grade,
    total: result.score.total,
    steps,
    highlights,
    suggestions,
    weakestComponent,
    decisionCount: result.decisions.length,
    handledCritical,
    criticalEvents: critical.length,
  }
}

/** Convenience for the UI: report for a config + result pair. */
export function reportFor(
  result: SimulationResult,
  scenario: ScenarioSpec,
  validation?: ValidationResult,
  _config?: MissionConfig,
): MissionReport {
  return buildMissionReport(result, scenario, validation)
}
