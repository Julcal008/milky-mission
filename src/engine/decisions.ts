/**
 * DECISION OPTIONS — what each role can do when an event fires.
 * Owner: Track A.
 *
 * The simulator is deterministic: the UI runs a first pass to discover events,
 * lets the player choose options, then re-runs with those choices. This keeps
 * "what if" analysis honest and reproducible.
 *
 * Effects are intentionally simple and game-labelled; see docs/GAME_DESIGN.md.
 */

export interface DecisionChoice {
  eventId: string
  optionId: string
}

export interface DecisionEffect {
  /** One-off cost charged to the mission, $M. */
  costUsdM?: number
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

export const DECISION_OPTIONS: Record<string, DecisionOption[]> = {
  cme_hit: [
    {
      id: 'shelter',
      eventType: 'cme_hit',
      labelKey: 'decision.cme.shelter.label',
      descriptionKey: 'decision.cme.shelter.description',
      effect: { dataFactor: 0.6, handled: true, durationDays: 3 },
    },
    {
      id: 'ride-it-out',
      eventType: 'cme_hit',
      labelKey: 'decision.cme.ride.label',
      descriptionKey: 'decision.cme.ride.description',
      effect: { dataFactor: 1, handled: false, durationDays: 3 },
    },
  ],
  flare_x: [
    {
      id: 'protect-instrument',
      eventType: 'flare_x',
      labelKey: 'decision.flare.protect.label',
      descriptionKey: 'decision.flare.protect.description',
      effect: { dataFactor: 0.5, handled: true, durationDays: 2 },
    },
    {
      id: 'keep-observing',
      eventType: 'flare_x',
      labelKey: 'decision.flare.observe.label',
      descriptionKey: 'decision.flare.observe.description',
      effect: { dataFactor: 1, handled: false, durationDays: 2 },
    },
  ],
  power_deficit: [
    {
      id: 'shed-load',
      eventType: 'power_deficit',
      labelKey: 'decision.power.shed.label',
      descriptionKey: 'decision.power.shed.description',
      effect: { dataFactor: 0.5, powerBonusW: 20, handled: true, durationDays: 2 },
    },
    {
      id: 'safe-mode',
      eventType: 'power_deficit',
      labelKey: 'decision.power.safe.label',
      descriptionKey: 'decision.power.safe.description',
      effect: { dataFactor: 0.2, powerBonusW: 40, costUsdM: 0.1, handled: true, durationDays: 3 },
    },
    {
      id: 'ignore',
      eventType: 'power_deficit',
      labelKey: 'decision.power.ignore.label',
      descriptionKey: 'decision.power.ignore.description',
      effect: { dataFactor: 1, handled: false, durationDays: 1 },
    },
  ],
  inst_fail: [
    {
      id: 'continue',
      eventType: 'inst_fail',
      labelKey: 'decision.fail.continue.label',
      descriptionKey: 'decision.fail.continue.description',
      effect: { scienceFactor: 0.95, handled: true, durationDays: 1 },
    },
    {
      id: 'safe-mode',
      eventType: 'inst_fail',
      labelKey: 'decision.fail.safe.label',
      descriptionKey: 'decision.fail.safe.description',
      effect: { dataFactor: 0.3, costUsdM: 0.2, handled: true, durationDays: 3 },
    },
  ],
  gs_outage: [
    {
      id: 'wait',
      eventType: 'gs_outage',
      labelKey: 'decision.gs.wait.label',
      descriptionKey: 'decision.gs.wait.description',
      effect: { handled: true, durationDays: 2 },
    },
    {
      id: 'backup-station',
      eventType: 'gs_outage',
      labelKey: 'decision.gs.backup.label',
      descriptionKey: 'decision.gs.backup.description',
      effect: { costUsdM: 0.2, handled: true, durationDays: 2 },
    },
  ],
  buffer_full: [
    {
      id: 'prioritize-science',
      eventType: 'buffer_full',
      labelKey: 'decision.buffer.science.label',
      descriptionKey: 'decision.buffer.science.description',
      effect: { dataFactor: 0.8, handled: true, durationDays: 3 },
    },
    {
      id: 'dump-low-value',
      eventType: 'buffer_full',
      labelKey: 'decision.buffer.dump.label',
      descriptionKey: 'decision.buffer.dump.description',
      effect: { scienceFactor: 0.9, handled: true, durationDays: 1 },
    },
    {
      id: 'ignore',
      eventType: 'buffer_full',
      labelKey: 'decision.buffer.ignore.label',
      descriptionKey: 'decision.buffer.ignore.description',
      effect: { handled: false, durationDays: 1 },
    },
  ],
}

export function decisionOptionsFor(eventType: string): DecisionOption[] {
  return DECISION_OPTIONS[eventType] ?? []
}
