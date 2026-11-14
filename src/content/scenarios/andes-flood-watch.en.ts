/**
 * Andes Flood Watch — English domain copy.
 * Owner: Track C. Keys mirror `scenario.andes.rN.*` in `src/i18n`.
 */
import type { ScenarioCopy } from './types'

export const andesFloodWatchEn: ScenarioCopy = {
  title: 'Andes Flood Watch',
  summary:
    'See the Magdalena basin every day, through clouds and at night, and deliver flood ' +
    'warnings in time.',
  brief:
    'Every rainy season the Magdalena River floods towns that have 12 hours to evacuate. ' +
    'Build a mission that sees the basin every day — through clouds, day and night — and gets ' +
    'the data to the ground in time to matter.',
  r1: {
    title: 'Revisit the basin every day',
    description:
      'See the basin at least every 24 hours. Depends on passes per day, swath width and ' +
      'pointing.',
  },
  r2: {
    title: 'See through clouds and at night',
    description: 'Fly a SAR or another microwave instrument that works regardless of sunlight.',
  },
  r3: {
    title: 'Resolve 100 metres',
    description: 'Use an HRI or a SAR to reach a ground resolution of 100 m or better.',
  },
  r4: {
    title: 'Deliver the data',
    description: 'Downlink at least 60% of the data the mission generates.',
  },
  r5: {
    title: 'Operate for 18 months',
    description: 'Carry enough delta-v for drag make-up and account for degradation over 548 days.',
  },
}
