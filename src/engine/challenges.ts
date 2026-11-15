/**
 * CHALLENGE CATALOG — role-specific events and their decision options.
 * Owner: Track A/C (content).
 *
 * The engine only stores i18n keys and numeric effects. User-facing copy lives
 * in `src/i18n/game.*`. A challenge is a concrete variant: the same physical
 * event type can appear with different severity, copy and options.
 *
 * Real NASA DONKI dates remain the anchors; the variants are game content and
 * are labelled as such in the report.
 */
import type { DecisionEffect, DecisionOption } from './decisions'
import type { Difficulty, RoleId } from './types'

export type EventSeverity = 'info' | 'warning' | 'critical'

export interface ChallengeSpec {
  id: string
  /** Event family used for icons and report grouping. */
  type: string
  role: RoleId
  severity: EventSeverity
  minDifficulty: Difficulty
  titleKey: string
  descriptionKey: string
  /** Used by the scheduler; higher means more likely when the pool is sampled. */
  weight: number
  options: DecisionOption[]
}

export const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  cadet: 0,
  engineer: 1,
  'flight-director': 2,
}

export function difficultyAllows(active: Difficulty, minimum: Difficulty): boolean {
  return DIFFICULTY_ORDER[active] >= DIFFICULTY_ORDER[minimum]
}

function option(
  id: string,
  eventType: string,
  labelKey: string,
  descriptionKey: string,
  effect: DecisionEffect,
): DecisionOption {
  return { id, eventType, labelKey, descriptionKey, effect }
}

export const CHALLENGES: ChallengeSpec[] = [
  // Space weather — systems
  {
    id: 'cme-fast',
    type: 'cme_hit',
    role: 'systems',
    severity: 'critical',
    minDifficulty: 'cadet',
    titleKey: 'event.cmeHit',
    descriptionKey: 'challenge.cmeFast.description',
    weight: 4,
    options: [
      option(
        'shelter',
        'cme_hit',
        'decision.cme.shelter.label',
        'decision.cme.shelter.description',
        { dataFactor: 0.6, handled: true, durationDays: 3 },
      ),
      option('ride-it-out', 'cme_hit', 'decision.cme.ride.label', 'decision.cme.ride.description', {
        dataFactor: 1,
        handled: false,
        durationDays: 3,
      }),
      option('cme-split', 'cme_hit', 'decision.cme.split.label', 'decision.cme.split.description', {
        dataFactor: 0.8,
        handled: true,
        durationDays: 3,
        costUsdM: 0.1,
      }),
    ],
  },
  {
    id: 'cme-long',
    type: 'cme_hit',
    role: 'systems',
    severity: 'critical',
    minDifficulty: 'engineer',
    titleKey: 'event.cmeLong',
    descriptionKey: 'challenge.cmeLong.description',
    weight: 3,
    options: [
      option(
        'cme-safe-mode',
        'cme_hit',
        'decision.cme.long.safe.label',
        'decision.cme.long.safe.description',
        { dataFactor: 0.4, handled: true, durationDays: 5, powerBonusW: 10 },
      ),
      option(
        'cme-roll',
        'cme_hit',
        'decision.cme.long.roll.label',
        'decision.cme.long.roll.description',
        { dataFactor: 0.8, handled: true, durationDays: 4 },
      ),
      option(
        'cme-ride-long',
        'cme_hit',
        'decision.cme.long.ride.label',
        'decision.cme.long.ride.description',
        { dataFactor: 1, handled: false, durationDays: 5 },
      ),
    ],
  },
  {
    id: 'cme-glancing',
    type: 'cme_hit',
    role: 'systems',
    severity: 'warning',
    minDifficulty: 'flight-director',
    titleKey: 'event.cmeGlancing',
    descriptionKey: 'challenge.cmeGlancing.description',
    weight: 2,
    options: [
      option(
        'cme-glancing-protect',
        'cme_hit',
        'decision.cme.glancing.protect.label',
        'decision.cme.glancing.protect.description',
        { dataFactor: 0.7, handled: true, durationDays: 2 },
      ),
      option(
        'cme-glancing-observe',
        'cme_hit',
        'decision.cme.glancing.observe.label',
        'decision.cme.glancing.observe.description',
        { dataFactor: 1, handled: false, durationDays: 2 },
      ),
    ],
  },

  // Solar flares — science
  {
    id: 'flare-x1',
    type: 'flare_x',
    role: 'science',
    severity: 'warning',
    minDifficulty: 'cadet',
    titleKey: 'event.flareX',
    descriptionKey: 'challenge.flareX1.description',
    weight: 4,
    options: [
      option(
        'protect-instrument',
        'flare_x',
        'decision.flare.protect.label',
        'decision.flare.protect.description',
        { dataFactor: 0.5, handled: true, durationDays: 2 },
      ),
      option(
        'keep-observing',
        'flare_x',
        'decision.flare.observe.label',
        'decision.flare.observe.description',
        { dataFactor: 1, handled: false, durationDays: 2 },
      ),
      option(
        'flare-filter',
        'flare_x',
        'decision.flare.filter.label',
        'decision.flare.filter.description',
        { dataFactor: 0.7, handled: true, durationDays: 2, costUsdM: 0.1 },
      ),
    ],
  },
  {
    id: 'flare-x10',
    type: 'flare_x',
    role: 'science',
    severity: 'critical',
    minDifficulty: 'flight-director',
    titleKey: 'event.flareX10',
    descriptionKey: 'challenge.flareX10.description',
    weight: 2,
    options: [
      option(
        'flare-x10-safe',
        'flare_x',
        'decision.flare.x10.safe.label',
        'decision.flare.x10.safe.description',
        { dataFactor: 0.3, handled: true, durationDays: 4 },
      ),
      option(
        'flare-x10-filter',
        'flare_x',
        'decision.flare.x10.filter.label',
        'decision.flare.x10.filter.description',
        { dataFactor: 0.6, handled: true, durationDays: 3, costUsdM: 0.2 },
      ),
      option(
        'flare-x10-ride',
        'flare_x',
        'decision.flare.x10.ride.label',
        'decision.flare.x10.ride.description',
        { dataFactor: 1, handled: false, durationDays: 3 },
      ),
    ],
  },

  // Spacecraft systems
  {
    id: 'power-deficit',
    type: 'power_deficit',
    role: 'systems',
    severity: 'critical',
    minDifficulty: 'cadet',
    titleKey: 'event.powerDeficit',
    descriptionKey: 'challenge.powerDeficit.description',
    weight: 5,
    options: [
      option(
        'shed-load',
        'power_deficit',
        'decision.power.shed.label',
        'decision.power.shed.description',
        { dataFactor: 0.5, powerBonusW: 20, handled: true, durationDays: 2 },
      ),
      option(
        'safe-mode',
        'power_deficit',
        'decision.power.safe.label',
        'decision.power.safe.description',
        { dataFactor: 0.2, powerBonusW: 40, costUsdM: 0.1, handled: true, durationDays: 3 },
      ),
      option(
        'ignore',
        'power_deficit',
        'decision.power.ignore.label',
        'decision.power.ignore.description',
        { dataFactor: 1, handled: false, durationDays: 1 },
      ),
    ],
  },
  {
    id: 'thermal-anomaly',
    type: 'thermal',
    role: 'systems',
    severity: 'warning',
    minDifficulty: 'engineer',
    titleKey: 'event.thermal',
    descriptionKey: 'challenge.thermal.description',
    weight: 2,
    options: [
      option(
        'thermal-heater',
        'thermal',
        'decision.thermal.heater.label',
        'decision.thermal.heater.description',
        { dataFactor: 0.7, handled: true, durationDays: 2, costUsdM: 0.1 },
      ),
      option(
        'thermal-power-down',
        'thermal',
        'decision.thermal.down.label',
        'decision.thermal.down.description',
        { dataFactor: 0.5, handled: true, durationDays: 2 },
      ),
      option(
        'thermal-ignore',
        'thermal',
        'decision.thermal.ignore.label',
        'decision.thermal.ignore.description',
        { dataFactor: 1, handled: false, durationDays: 1 },
      ),
    ],
  },
  {
    id: 'wheel-failure',
    type: 'wheel_fail',
    role: 'systems',
    severity: 'critical',
    minDifficulty: 'flight-director',
    titleKey: 'event.wheelFail',
    descriptionKey: 'challenge.wheel.description',
    weight: 2,
    options: [
      option(
        'wheel-redundant',
        'wheel_fail',
        'decision.wheel.redundant.label',
        'decision.wheel.redundant.description',
        { dataFactor: 0.8, handled: true, durationDays: 2, costUsdM: 0.3 },
      ),
      option(
        'wheel-safe',
        'wheel_fail',
        'decision.wheel.safe.label',
        'decision.wheel.safe.description',
        { dataFactor: 0.4, handled: true, durationDays: 3 },
      ),
      option(
        'wheel-continue',
        'wheel_fail',
        'decision.wheel.continue.label',
        'decision.wheel.continue.description',
        { dataFactor: 1, handled: false, durationDays: 1 },
      ),
    ],
  },

  // Science operations
  {
    id: 'calibration-drift',
    type: 'calibration',
    role: 'science',
    severity: 'warning',
    minDifficulty: 'engineer',
    titleKey: 'event.calibration',
    descriptionKey: 'challenge.calibration.description',
    weight: 3,
    options: [
      option(
        'cal-recalibrate',
        'calibration',
        'decision.calibration.recalibrate.label',
        'decision.calibration.recalibrate.description',
        { dataFactor: 0.8, handled: true, durationDays: 2 },
      ),
      option(
        'cal-backup',
        'calibration',
        'decision.calibration.backup.label',
        'decision.calibration.backup.description',
        { dataFactor: 0.9, handled: true, durationDays: 2, costUsdM: 0.1 },
      ),
      option(
        'cal-accept',
        'calibration',
        'decision.calibration.accept.label',
        'decision.calibration.accept.description',
        { scienceFactor: 0.9, handled: false, durationDays: 1 },
      ),
    ],
  },
  {
    id: 'data-gap',
    type: 'data_gap',
    role: 'science',
    severity: 'warning',
    minDifficulty: 'engineer',
    titleKey: 'event.dataGap',
    descriptionKey: 'challenge.dataGap.description',
    weight: 2,
    options: [
      option(
        'gap-replay',
        'data_gap',
        'decision.gap.replay.label',
        'decision.gap.replay.description',
        { dataFactor: 0.8, handled: true, durationDays: 1, costUsdM: 0.1 },
      ),
      option('gap-pass', 'data_gap', 'decision.gap.pass.label', 'decision.gap.pass.description', {
        handled: true,
        durationDays: 1,
        costUsdM: 0.2,
      }),
      option(
        'gap-accept',
        'data_gap',
        'decision.gap.accept.label',
        'decision.gap.accept.description',
        { dataFactor: 1, handled: false, durationDays: 1 },
      ),
    ],
  },
  {
    id: 'aurora-opportunity',
    type: 'aurora',
    role: 'science',
    severity: 'info',
    minDifficulty: 'flight-director',
    titleKey: 'event.aurora',
    descriptionKey: 'challenge.aurora.description',
    weight: 1,
    options: [
      option(
        'aurora-retarget',
        'aurora',
        'decision.aurora.retarget.label',
        'decision.aurora.retarget.description',
        { dataFactor: 0.8, scienceFactor: 1.05, handled: true, durationDays: 2 },
      ),
      option(
        'aurora-keep',
        'aurora',
        'decision.aurora.keep.label',
        'decision.aurora.keep.description',
        { handled: true, durationDays: 1 },
      ),
    ],
  },

  // Communications
  {
    id: 'buffer-full',
    type: 'buffer_full',
    role: 'comms',
    severity: 'warning',
    minDifficulty: 'cadet',
    titleKey: 'event.bufferFull',
    descriptionKey: 'challenge.bufferFull.description',
    weight: 4,
    options: [
      option(
        'prioritize-science',
        'buffer_full',
        'decision.buffer.science.label',
        'decision.buffer.science.description',
        { dataFactor: 0.8, handled: true, durationDays: 3 },
      ),
      option(
        'dump-low-value',
        'buffer_full',
        'decision.buffer.dump.label',
        'decision.buffer.dump.description',
        { scienceFactor: 0.9, handled: true, durationDays: 1 },
      ),
      option(
        'buffer-ignore',
        'buffer_full',
        'decision.buffer.ignore.label',
        'decision.buffer.ignore.description',
        { handled: false, durationDays: 1 },
      ),
    ],
  },
  {
    id: 'gs-outage',
    type: 'gs_outage',
    role: 'comms',
    severity: 'warning',
    minDifficulty: 'cadet',
    titleKey: 'event.gsOutage',
    descriptionKey: 'challenge.gsOutage.description',
    weight: 3,
    options: [
      option('wait', 'gs_outage', 'decision.gs.wait.label', 'decision.gs.wait.description', {
        handled: true,
        durationDays: 2,
      }),
      option(
        'backup-station',
        'gs_outage',
        'decision.gs.backup.label',
        'decision.gs.backup.description',
        { handled: true, durationDays: 2, costUsdM: 0.2 },
      ),
    ],
  },
  {
    id: 'rf-interference',
    type: 'rf',
    role: 'comms',
    severity: 'warning',
    minDifficulty: 'engineer',
    titleKey: 'event.rfInterference',
    descriptionKey: 'challenge.rf.description',
    weight: 3,
    options: [
      option('rf-change-band', 'rf', 'decision.rf.change.label', 'decision.rf.change.description', {
        dataFactor: 0.8,
        handled: true,
        durationDays: 2,
        costUsdM: 0.1,
      }),
      option('rf-wait', 'rf', 'decision.rf.wait.label', 'decision.rf.wait.description', {
        dataFactor: 0.6,
        handled: true,
        durationDays: 2,
      }),
      option('rf-boost', 'rf', 'decision.rf.boost.label', 'decision.rf.boost.description', {
        handled: true,
        durationDays: 1,
        costUsdM: 0.2,
      }),
    ],
  },
  {
    id: 'antenna-fault',
    type: 'antenna',
    role: 'comms',
    severity: 'critical',
    minDifficulty: 'flight-director',
    titleKey: 'event.antennaFault',
    descriptionKey: 'challenge.antenna.description',
    weight: 2,
    options: [
      option(
        'antenna-backup',
        'antenna',
        'decision.antenna.backup.label',
        'decision.antenna.backup.description',
        { handled: true, durationDays: 2, costUsdM: 0.3 },
      ),
      option(
        'antenna-safe',
        'antenna',
        'decision.antenna.safe.label',
        'decision.antenna.safe.description',
        { dataFactor: 0.4, handled: true, durationDays: 3 },
      ),
      option(
        'antenna-continue',
        'antenna',
        'decision.antenna.continue.label',
        'decision.antenna.continue.description',
        { handled: false, durationDays: 1 },
      ),
    ],
  },

  // Mission director — budget, schedule and stakeholders
  {
    id: 'budget-review',
    type: 'budget',
    role: 'director',
    severity: 'warning',
    minDifficulty: 'cadet',
    titleKey: 'event.budgetReview',
    descriptionKey: 'challenge.budget.description',
    weight: 3,
    options: [
      option(
        'budget-rebalance',
        'budget',
        'decision.budget.rebalance.label',
        'decision.budget.rebalance.description',
        { budgetUsdM: -0.5, handled: true, durationDays: 1 },
      ),
      option(
        'budget-descope',
        'budget',
        'decision.budget.descope.label',
        'decision.budget.descope.description',
        { scienceFactor: 0.9, handled: true, durationDays: 1 },
      ),
      option(
        'budget-absorb',
        'budget',
        'decision.budget.absorb.label',
        'decision.budget.absorb.description',
        { budgetUsdM: 0.5, handled: false, durationDays: 1 },
      ),
    ],
  },
  {
    id: 'launch-slip',
    type: 'schedule',
    role: 'director',
    severity: 'warning',
    minDifficulty: 'engineer',
    titleKey: 'event.launchSlip',
    descriptionKey: 'challenge.launchSlip.description',
    weight: 2,
    options: [
      option(
        'schedule-accept',
        'schedule',
        'decision.schedule.accept.label',
        'decision.schedule.accept.description',
        { scienceFactor: 0.95, handled: true, durationDays: 1 },
      ),
      option(
        'schedule-compress',
        'schedule',
        'decision.schedule.compress.label',
        'decision.schedule.compress.description',
        { dataFactor: 0.9, handled: true, durationDays: 2, costUsdM: 0.2 },
      ),
      option(
        'schedule-descope',
        'schedule',
        'decision.schedule.descope.label',
        'decision.schedule.descope.description',
        { scienceFactor: 0.85, handled: false, durationDays: 1 },
      ),
    ],
  },
  {
    id: 'partner-request',
    type: 'partner',
    role: 'director',
    severity: 'info',
    minDifficulty: 'flight-director',
    titleKey: 'event.partnerRequest',
    descriptionKey: 'challenge.partner.description',
    weight: 1,
    options: [
      option(
        'partner-share',
        'partner',
        'decision.partner.share.label',
        'decision.partner.share.description',
        { dataFactor: 0.9, scienceFactor: 1.02, handled: true, durationDays: 2 },
      ),
      option(
        'partner-decline',
        'partner',
        'decision.partner.decline.label',
        'decision.partner.decline.description',
        { handled: false, durationDays: 1 },
      ),
    ],
  },
]

export const CHALLENGE_BY_ID = new Map(CHALLENGES.map((challenge) => [challenge.id, challenge]))

export function challengeById(id: string | undefined): ChallengeSpec | null {
  if (!id) {
    return null
  }
  return CHALLENGE_BY_ID.get(id) ?? null
}

export function challengesForRole(role: RoleId, activeDifficulty: Difficulty): ChallengeSpec[] {
  return CHALLENGES.filter(
    (challenge) =>
      challenge.role === role && difficultyAllows(activeDifficulty, challenge.minDifficulty),
  )
}

export function findDecisionOption(optionId: string): DecisionOption | null {
  for (const challenge of CHALLENGES) {
    const option = challenge.options.find((item) => item.id === optionId)
    if (option) {
      return option
    }
  }
  return null
}

export function allDecisionOptions(): DecisionOption[] {
  return CHALLENGES.flatMap((challenge) => challenge.options)
}
