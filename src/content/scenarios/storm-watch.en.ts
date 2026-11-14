/**
 * Storm Watch — English domain copy.
 * Owner: Track C. Keys mirror `scenario.storm.rN.*` in `src/i18n`.
 */
import type { ScenarioCopy } from './types'

export const stormWatchEn: ScenarioCopy = {
  title: 'Storm Watch',
  summary: 'Watch the Sun and the ionosphere through the next solar storm.',
  brief:
    'A G5 geomagnetic storm just hit Earth. Airlines rerouted polar flights, GPS drifted for ' +
    'hours, and nobody saw it coming in time. Your job: put a small satellite in orbit that ' +
    'watches the Sun and the ionosphere — and keeps working when the next storm arrives. ' +
    'You have 12 months, $50M, and one launch.',
  r1: {
    title: 'Track X-class flares',
    description:
      'Detect at least 90% of X-class flares within 4 hours. Requires an XRS, a duty cycle ' +
      'of at least 80% and 70% of the data delivered.',
  },
  r2: {
    title: 'Image the auroral oval',
    description:
      'Capture the auroral oval at least every 12 hours. Requires a SUVI, inclination of at ' +
      'least 80°, revisit of 12 hours or less and 60% of the data delivered.',
  },
  r3: {
    title: 'Measure the ionosphere over Colombia',
    description:
      'Get at least four GNSS-RO passes per day over Colombia and deliver 60% of the data.',
  },
  r4: {
    title: 'Survive a G4+ storm',
    description:
      'Fly a magnetometer or a proton detector, keep the total dose below 20 krad and hold a ' +
      'power margin of at least 15%.',
  },
  r5: {
    title: 'Deliver the data',
    description: 'Downlink at least 70% of the data the mission generates.',
  },
  r6: {
    title: 'Operate for 12 months',
    description:
      'Carry enough delta-v for drag make-up and account for array and battery degradation ' +
      'over one year.',
  },
}
