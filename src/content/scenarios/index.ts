/**
 * Scenario content entry point.
 * Owner: Track C. Track B merges `scenarioContent[lang]` into `scenario` in src/i18n.
 */
import type { ScenarioId } from '@/engine/types'
import { andesFloodWatchEn } from './andes-flood-watch.en'
import { andesFloodWatchEs } from './andes-flood-watch.es'
import { stormWatchEn } from './storm-watch.en'
import { stormWatchEs } from './storm-watch.es'
import type { ScenarioCopy } from './types'

export type { ScenarioCopy, ScenarioRequirementCopy } from './types'
export { andesFloodWatchEn, andesFloodWatchEs, stormWatchEn, stormWatchEs }

export const scenarioContent = {
  en: {
    'storm-watch': stormWatchEn,
    'andes-flood-watch': andesFloodWatchEn,
  },
  es: {
    'storm-watch': stormWatchEs,
    'andes-flood-watch': andesFloodWatchEs,
  },
} satisfies Record<'en' | 'es', Record<ScenarioId, ScenarioCopy>>
