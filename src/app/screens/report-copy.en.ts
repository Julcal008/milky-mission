/** Educational report copy, English. Owner: Track A (Report). */
export const reportCopyEn = {
  summary: {
    title: 'In one minute',
    lead: 'The short version, before the details.',
    design: 'You designed a {mass} kg spacecraft with {instruments} instruments for ${cost}M.',
    events:
      'During {days} days, {events} events occurred; you handled {handled} of {critical} critical events.',
    result: 'You finished with grade {grade} ({total}/1000). Your weakest area was {weakest}.',
    learning: 'Main lesson: {lesson}',
  },
  score: {
    title: 'How your score was calculated',
    lead: 'Each part answers a different question. The details are optional.',
    points: '{value} / {max} pts',
    details: 'How is this calculated?',
    components: {
      mission: {
        what: 'Did you meet the mission objectives you chose?',
        result: 'You met {met} of {chosen} chosen requirements.',
        formula: 'Requirement fractions × weights, capped at 300 points.',
      },
      science: {
        what: 'Did the science data actually reach the ground?',
        result: '{delivered}% of the generated data reached the ground.',
        formula: 'Instrument value × delivered data × coverage × instrument health.',
      },
      efficiency: {
        what: 'Did you use mass, power and budget well?',
        result: 'Mass margin {mass}%, power margin {power} W, cost ${cost}M.',
        formula: 'Mass margin + power margin + cost underrun.',
      },
      robustness: {
        what: 'Did the spacecraft resist, and did you handle critical events?',
        result: '{handled} of {critical} critical events were handled.',
        formula: 'Reliability plus the share of critical events with a decision.',
      },
      teamwork: {
        what: 'Did the team coordinate roles and decisions?',
        result: 'Teamwork score {value}/100.',
        formula: 'Role objectives plus consensus decisions.',
      },
    },
  },
  requirementsLead:
    'Each chosen requirement is a promise to the mission. Partial credit is possible.',
  diagnosisLead: 'These are the reasons some requirements fell short.',
  diagnosisSuccessTitle: 'What held you back',
  diagnosisSuccessLead:
    'All chosen requirements were met. The remaining points came from efficiency and robustness.',
  snapshot: {
    title: 'Your mission at a glance',
    lead: 'The hardware you launched, the resources it used, and what the numbers mean.',
    orbit: 'Orbit',
    launcher: 'Launcher',
    bus: 'Spacecraft bus',
    powerSystem: 'Power system',
    comms: 'Communications',
    payload: 'Payload',
    mass: 'Mass',
    powerMargin: 'Power margin',
    budget: 'Budget',
    lifetime: 'Lifetime',
    data: 'Data delivered',
    instruments: 'Instruments',
    whyTitle: 'Why these numbers matter',
    why: 'Mass margin is your room to grow. Power margin keeps instruments alive during eclipses. Data delivered is the science that actually reached the ground. A comfortable design is easier to operate under stress.',
  },
  story: {
    title: 'What happened, step by step',
    lead: 'Each event, the choice you made, and why it changed the mission.',
    whatHappened: 'What happened',
    whatYouChose: 'What you chose',
    whyItMattered: 'Why it mattered',
    noDecision: 'No decision was recorded for this event.',
    criticalNoDecision: 'No decision was recorded. This critical anomaly counted as unhandled.',
    handled: 'Handled. The anomaly was contained and helped robustness.',
    unhandled: 'Not handled. The anomaly stayed open and reduced robustness.',
    otherOptions: 'Other options you had',
    alertOnly: 'This was an alert; no decision was required.',
    empty: 'No events were recorded in this mission.',
  },
  lessons: {
    title: 'What to learn from this mission',
    lead: 'Practical takeaways for your next design.',
    next: 'Try this next time',
    mass: 'Your mass margin was {margin}%. Try a lighter payload or a larger launcher next time.',
    power:
      'Your power margin was {margin} W. Add array area, reduce instrument load or increase the battery.',
    data: 'Only {delivered}% of the data reached the ground. Improve the link, the ground network or the storage.',
    critical:
      '{count} critical event(s) had no decision. At each modal, choose an option to protect robustness.',
    requirements:
      'You met {met} of {chosen} chosen requirements. Check the instrument and data chain for the missing one.',
    success:
      'All chosen requirements were met. Try a harder difficulty or a more ambitious requirement set.',
  },
  glossary: {
    title: 'Glossary',
    lead: 'The terms used in this report, in plain language.',
    terms: {
      cme: {
        term: 'CME',
        definition:
          'A huge cloud of charged particles from the Sun. It can disturb satellites, radio and power grids.',
      },
      flare: {
        term: 'Solar flare',
        definition:
          'A sudden burst of radiation from the Sun. It can saturate optical sensors and change the upper atmosphere.',
      },
      sso: {
        term: 'Sun-synchronous orbit (SSO)',
        definition:
          'An orbit that crosses the same local time each day. Useful for comparing images under similar light.',
      },
      massMargin: {
        term: 'Mass margin',
        definition:
          'How much launch capacity is left after your spacecraft. More margin means room for growth and less risk.',
      },
      powerMargin: {
        term: 'Power margin',
        definition:
          'Generation minus load. If it is negative, the battery cannot keep up and instruments may be shed.',
      },
      downlink: {
        term: 'Downlink',
        definition: 'The radio link that sends data from the spacecraft to a ground station.',
      },
      buffer: {
        term: 'Buffer',
        definition: 'Onboard storage that holds data until a ground pass can download it.',
      },
      dutyCycle: {
        term: 'Duty cycle',
        definition:
          'The fraction of time an instrument is actually observing instead of calibrating, charging or safe.',
      },
      trl: {
        term: 'TRL',
        definition:
          'Technology readiness level. A lower TRL means the hardware is less proven and more likely to fail.',
      },
      sar: {
        term: 'SAR',
        definition:
          'Synthetic aperture radar. It images through clouds and at night, unlike optical cameras.',
      },
      requirement: {
        term: 'Requirement',
        definition:
          'A mission objective you chose. Meeting it earns points; missing it lowers the mission score.',
      },
      anomaly: {
        term: 'Anomaly',
        definition:
          'An unexpected event that needs a decision: a storm, a failure, a data gap or a budget issue.',
      },
    },
  },
  data: {
    title: 'Real data vs. game content',
    lead: 'This report mixes real NASA data with game rules. Here is the boundary.',
    donki: 'NASA DONKI — real CME and flare dates. Official data.',
    power: 'NASA POWER — real cloud and insolation climatology. Official data.',
    hardware: 'Spacecraft catalogs — representative estimates, not official NASA hardware data.',
    challenges:
      'Challenge variants, roles and decision effects — game content built on top of the real dates.',
    model: 'Technical model and assumptions',
    modelLead: 'Open this if you want the formulas, sources and simplifications.',
  },
  print: 'Print / Save PDF',
}

export type ReportCopy = typeof reportCopyEn
