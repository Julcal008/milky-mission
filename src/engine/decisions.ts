/**
 * DECISION TYPES AND LOOKUPS — what each role can do when a challenge fires.
 * Owner: Track A.
 *
 * The concrete options live in `challenges.ts`, one set per challenge variant.
 * The simulator is deterministic: the UI runs a first pass to discover events,
 * lets the player choose options, then re-runs with those choices.
 */

import { CHALLENGES, challengeById, findDecisionOption } from './challenges'

export interface DecisionChoice {
  eventId: string
  optionId: string
}

export interface DecisionEffect {
  /** One-off cost charged to the mission, $M. */
  costUsdM?: number
  /** Budget adjustment: positive costs, negative grants a reserve, $M. */
  budgetUsdM?: number
  /** Multiplier on generated data during the effect window. */
  dataFactor?: number
  /** Extra power available during the effect window, W. */
  powerBonusW?: number
  /** Multiplier on final science value. */
  scienceFactor?: number
  /** Days the effect lasts. Defaults to 3. */
  durationDays?: number
  /** Whether the anomaly counts as handled for the robustness score. */
  handled?: boolean
}

export interface DecisionOption {
  id: string
  eventType: string
  /** i18n keys; the engine never contains user-facing copy. */
  labelKey: string
  descriptionKey: string
  effect: DecisionEffect
}

/** Options for a challenge id (the concrete variant). */
export function decisionOptionsFor(challengeId: string): DecisionOption[] {
  return (
    challengeById(challengeId)?.options ??
    CHALLENGES.find((challenge) => challenge.type === challengeId)?.options ??
    []
  )
}

/** Find an option by its globally unique id (used by the report). */
export function decisionOptionFor(optionId: string): DecisionOption | null {
  return findDecisionOption(optionId)
}
