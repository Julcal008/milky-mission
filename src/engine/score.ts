/**
 * SCORE MODEL — 1000 points across mission success, science, efficiency, robustness and teamwork.
 * Owner: Track A.
 *
 * Invariants: any component is within its maximum; total is within [0, 1000];
 *             total equals the sum of the components.
 * Source of weights: docs/GAME_DESIGN.md and docs/GAME_DATA.md (confidence: game).
 */
import type { BudgetSnapshot, RequirementResult, ScenarioSpec, ScoreBreakdown } from './types'

export interface ScoreInputs {
  requirements: RequirementResult[]
  /** Raw science value before normalization. */
  scienceValue: number
  budgets: BudgetSnapshot
  massMarginFraction: number
  powerMarginFraction: number
  /** Fraction of critical events that were handled explicitly, 0..1. */
  anomalyHandling: number
  /** 1 = solo; 2..4 = team. */
  players: number
}

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value))

export function scoreMission(scenario: ScenarioSpec, inputs: ScoreInputs): ScoreBreakdown {
  const weights = new Map(scenario.requirements.map((item) => [item.id, item.weight]))
  const missionSuccess = Math.min(
    300,
    inputs.requirements.reduce(
      (sum, requirement) =>
        sum + (weights.get(requirement.id) ?? 0) * clamp01(requirement.fraction),
      0,
    ),
  )

  const science = Math.min(
    250,
    250 * clamp01(inputs.scienceValue / Math.max(1, scenario.scienceNormalization)),
  )

  const massScore = clamp01(inputs.massMarginFraction / 0.3)
  const powerScore = clamp01(inputs.powerMarginFraction / 0.25)
  const costUnderrun =
    inputs.budgets.budgetUsdM > 0
      ? (inputs.budgets.budgetUsdM - inputs.budgets.costUsdM) / (0.1 * inputs.budgets.budgetUsdM)
      : 0
  const costScore = clamp01(costUnderrun)

  const baseEfficiency = 80 * massScore + 60 * powerScore + 60 * costScore
  const solo = inputs.players <= 1
  const efficiency = Math.min(300, solo ? baseEfficiency * 1.5 : baseEfficiency)

  const robustness = 90 * clamp01(inputs.budgets.reliability) + 60 * clamp01(inputs.anomalyHandling)

  const teamwork = solo ? 0 : 100 * clamp01(inputs.anomalyHandling)

  const total = Math.round(missionSuccess + science + efficiency + robustness + teamwork)
  const grade: ScoreBreakdown['grade'] =
    total >= 900 ? 'S' : total >= 800 ? 'A' : total >= 700 ? 'B' : total >= 600 ? 'C' : 'D'

  return {
    missionSuccess: Math.round(missionSuccess),
    science: Math.round(science),
    efficiency: Math.round(efficiency),
    robustness: Math.round(robustness),
    teamwork: Math.round(teamwork),
    total,
    grade,
  }
}
