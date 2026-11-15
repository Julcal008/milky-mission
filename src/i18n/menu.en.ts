/**
 * Menu and entry copy — Owner: Angelica (Track B / UI).
 * Composed into the root dictionary by src/i18n/en.ts.
 */
export const menuEn = {
  brand: {
    name: 'MILKY MISSION',
    tagline: 'Design the mission. Live with the consequences.',
    team: 'by Kessler Syndrome · with Laura',
  },
  nav: {
    home: 'Home',
    brief: 'Brief',
    styleguide: 'Styleguide',
    language: 'Language',
    presentation: 'Presentation mode',
  },
  start: {
    eyebrow: 'NASA Space Apps Challenge 2026 · Neiva',
    cta: 'Start',
    tagline: 'An immersive space adventure experience.',
  },
  brief: {
    eyebrow: 'Mission brief',
    title: 'Choose your mission',
    lead: 'Two scenarios, one launch. Pick the objective, then build the spacecraft that can deliver it.',
    budget: 'Budget',
    duration: 'Duration',
    launchWindow: 'Launch window',
    requirements: 'Requirements',
    days: 'days',
    players: 'Players',
    playersHint: 'One shared screen. Turns pass explicitly.',
    solo: 'Solo',
    selected: 'Selected',
    start: 'Start mission',
    requirementsHint: 'You will choose 3 requirements on the next screen.',
    loadExample: 'Load example mission',
  },
  learn: {
    open: 'Field guide',
    title: 'Field guide',
    lead: 'Understand the mission, the components and the risks before you launch.',
    close: 'Close guide',
    search: 'Search the guide',
    empty: 'No results. Try another word.',
    tabs: {
      basics: 'Basics',
      components: 'Components',
      risks: 'Risks',
      glossary: 'Glossary',
      model: 'Model',
    },
    basics: {
      title: 'Design in five steps',
      intro: 'You can change any choice later. These are the decisions that matter most.',
      steps: [
        {
          title: 'Orbit and launcher',
          why: 'The orbit sets revisit, drag, radiation and the passes you get. The launcher sets the mass you can lift.',
          mistake:
            'Picking a launcher before checking the mass budget, or a low orbit that decays before the mission ends.',
        },
        {
          title: 'Bus and propulsion',
          why: 'The bus carries the payload and provides power and reliability. Propulsion buys the delta-v for drag make-up and lifetime.',
          mistake:
            'Choosing a bus that fits the payload but not the launcher, or skipping propulsion for a long mission.',
        },
        {
          title: 'Power',
          why: 'Arrays generate power in sunlight; the battery covers eclipses. Margins protect you from storms and degradation.',
          mistake:
            'Sizing the array for perfect sunlight, or forgetting battery depth of discharge and degradation.',
        },
        {
          title: 'Communications and data',
          why: 'Instruments generate data. The band, ground network and storage decide how much reaches Earth.',
          mistake:
            'Adding a data-heavy instrument without a faster link or more passes; the buffer fills and science is lost.',
        },
        {
          title: 'Science and requirements',
          why: 'Requirements are the mission promises. Instruments support specific requirements, and you must pick exactly 3.',
          mistake:
            'Choosing requirements no instrument can satisfy, or four instruments that break mass, power or data.',
        },
      ],
    },
    components: {
      title: 'Components and what they do',
      intro:
        'Each choice changes mass, power, data, cost or reliability. Open a catalog entry for its numbers and provenance.',
      use: 'How to use it',
      items: 'Catalog entries',
      categories: {
        orbit: {
          what: 'The path around Earth. Altitude and inclination set revisit, drag, radiation and the ground track.',
          use: 'Pick the orbit that supports your requirements: SSO for daily coverage, lower LEO for resolution, higher orbits for lifetime.',
          risks: [
            'Low orbits decay faster and need more delta-v.',
            'High orbits and high inclination increase radiation dose.',
            'A fixed-orbit launcher cannot target a different orbit.',
          ],
        },
        launcher: {
          what: 'The rocket that lifts the spacecraft. Capacity depends on the target orbit.',
          use: 'Match capacity to your final mass with margin. Check cost, fixed orbit and schedule risk.',
          risks: [
            'Over capacity means the mission cannot launch.',
            'Oversized launchers waste budget.',
            'Rideshare options may fix the orbit for you.',
          ],
        },
        bus: {
          what: 'The chassis, avionics and power distribution. It carries the payload and sets reliability.',
          use: 'Choose the smallest bus that fits payload mass and volume and provides enough bus power, leaving margin.',
          risks: [
            'Payload over capacity blocks the design.',
            'A heavier bus eats launcher capacity.',
            'Lower reliability reduces the mission score.',
          ],
        },
        propulsion: {
          what: 'The engine and propellant that provide delta-v for drag make-up and orbit changes.',
          use: 'Use it when the orbit decays or the mission is long. Compare dry mass, propellant and Isp.',
          risks: [
            'Propellant mass reduces payload capacity.',
            'No propulsion can end the mission early in low orbits.',
            'High-Isp systems may cost more.',
          ],
        },
        array: {
          what: 'Solar cells that convert sunlight into power.',
          use: 'Pick the technology and area that cover the load with margin after incidence, packing and degradation losses.',
          risks: [
            'Too small an array causes power deficits.',
            'More area adds mass and cost.',
            'GaAs is efficient but expensive.',
          ],
        },
        battery: {
          what: 'Stores energy for eclipse and peak loads.',
          use: 'Size it for the longest eclipse and the depth of discharge you allow.',
          risks: [
            'A small battery causes blackouts and lost science.',
            'Bigger batteries add mass.',
            'Deep discharge shortens life.',
          ],
        },
        comms: {
          what: 'The radio band and antenna that downlink data.',
          use: 'Match the band and rate to the data volume and the ground network. Higher bands carry more data but need more power and pointing.',
          risks: [
            'Too slow a link creates a data backlog.',
            'Higher bands cost more and may need a larger antenna.',
            'UHF is only good for TT&C.',
          ],
        },
        network: {
          what: 'The ground stations that receive your passes.',
          use: 'More stations and passes mean more downlink time. Balance cost and coverage.',
          risks: [
            'A single station limits passes.',
            'More stations cost more.',
            'A remote station may have outages.',
          ],
        },
        storage: {
          what: 'Onboard memory that buffers data between passes.',
          use: 'Size it for the gap between passes and the data rate. It protects against short outages.',
          risks: [
            'A full buffer loses science.',
            'More storage adds mass and cost.',
            'Storage cannot fix a link that is always too slow.',
          ],
        },
        instrument: {
          what: 'The science payload. Each instrument measures something and supports specific requirements.',
          use: 'Pick instruments that satisfy your 3 requirements and fit the slots, mass, power and data budget.',
          risks: [
            'No instrument supports a chosen requirement.',
            'Data-heavy instruments overflow the link.',
            'Low TRL instruments are a flight risk.',
          ],
        },
      },
    },
    risks: {
      title: 'Risks and fixes',
      intro:
        'Validation tells you what is blocking the launch. Use these cards to understand why and what to change.',
      what: 'What it means',
      fix: 'How to fix it',
      entries: {
        unknownCatalogId: {
          what: 'A selected component id does not exist in the catalogs.',
          fix: 'Start over or pick a valid component.',
          severity: 'error',
        },
        tooManyInstruments: {
          what: 'More than four instruments are installed.',
          fix: 'Remove instruments; the bus has four payload slots.',
          severity: 'error',
        },
        wrongRequirementCount: {
          what: 'The mission does not have exactly 3 requirements.',
          fix: 'Select or deselect requirements until the counter says 3.',
          severity: 'error',
        },
        unknownRequirement: {
          what: 'A requirement does not belong to this scenario.',
          fix: 'Choose requirements from the selected scenario.',
          severity: 'error',
        },
        duplicateRequirement: {
          what: 'The same requirement is selected twice.',
          fix: 'Remove the duplicate.',
          severity: 'error',
        },
        fixedOrbitMismatch: {
          what: 'This launcher can only fly its fixed orbit.',
          fix: 'Pick the matching orbit or a launcher that can retarget.',
          severity: 'error',
        },
        orbitUnavailable: {
          what: 'The launcher cannot reach the selected orbit.',
          fix: 'Choose a reachable orbit or a more capable launcher.',
          severity: 'error',
        },
        massOverCapacity: {
          what: 'Spacecraft, propellant and margin exceed the launcher capacity.',
          fix: 'Use a lighter bus or instruments, a bigger launcher, or less array and propellant.',
          severity: 'error',
        },
        payloadOverCapacity: {
          what: 'Payload mass exceeds the bus capacity.',
          fix: 'Choose a larger bus or lighter instruments.',
          severity: 'error',
        },
        budgetExceeded: {
          what: 'The design costs more than the scenario budget.',
          fix: 'Cut cost: smaller launcher, bus, instruments or ground network.',
          severity: 'error',
        },
        massMarginLow: {
          what: 'Mass margin is below 20%.',
          fix: 'Leave more margin for growth and propellant.',
          severity: 'warning',
        },
        powerMarginLow: {
          what: 'Power margin is below 15%.',
          fix: 'Add array area or reduce the load.',
          severity: 'warning',
        },
        energyDeficit: {
          what: 'The battery cannot cover the eclipse.',
          fix: 'Use a bigger battery, lower the load, or choose an orbit with shorter eclipses.',
          severity: 'warning',
        },
        dataBacklog: {
          what: 'The downlink cannot keep up with generated data.',
          fix: 'Use a faster band, more passes, more storage, or fewer data-heavy instruments.',
          severity: 'warning',
        },
        lifetimeShort: {
          what: 'The mission life is shorter than the scenario requires.',
          fix: 'Add propellant, choose a higher orbit, or reduce drag.',
          severity: 'warning',
        },
        radiationRisk: {
          what: 'The radiation dose is high for the mission life.',
          fix: 'Choose a lower-radiation orbit or accept the risk with a shorter life.',
          severity: 'warning',
        },
        heavyLauncher: {
          what: 'The launcher is oversized for this spacecraft.',
          fix: 'Use a smaller launcher to save budget.',
          severity: 'info',
        },
        linkTooSlow: {
          what: 'The link is too slow for the science data.',
          fix: 'Use a higher band, a larger antenna, or fewer data-heavy instruments.',
          severity: 'warning',
        },
        requirementUnsupported: {
          what: 'No instrument can satisfy a chosen requirement.',
          fix: 'Add an instrument that supports it or choose another requirement.',
          severity: 'warning',
        },
      },
    },
    glossary: {
      title: 'Glossary',
      intro: 'The terms you will see while designing and flying the mission.',
      terms: [
        {
          term: 'Margin',
          definition:
            'The safety buffer between what you need and what you have. A 20% mass margin means you can add 20% more mass.',
        },
        {
          term: 'Delta-v (Δv)',
          definition:
            'The change in velocity the mission needs. Drag make-up and orbit changes consume it.',
        },
        {
          term: 'Duty cycle',
          definition: 'The fraction of time an instrument is active.',
        },
        {
          term: 'Downlink',
          definition: 'The radio path that sends data from the spacecraft to the ground.',
        },
        {
          term: 'Swath',
          definition: 'The width of the ground strip an instrument sees in one pass.',
        },
        {
          term: 'Revisit',
          definition: 'How often the spacecraft sees the same place.',
        },
        {
          term: 'TRL',
          definition:
            'Technology readiness level, from 1 (idea) to 9 (flight-proven). Low TRL means more risk.',
        },
        {
          term: 'DoD',
          definition: 'Depth of discharge: how much of the battery capacity you use.',
        },
        {
          term: 'Eclipse',
          definition:
            "The part of the orbit in Earth's shadow, when solar power is unavailable.",
        },
        {
          term: 'SSO',
          definition:
            'Sun-synchronous orbit: crosses the same local time each day, useful for daily coverage.',
        },
        {
          term: 'Link budget',
          definition:
            'The accounting of transmitter power, antenna gain, distance and losses that sets the data rate.',
        },
        {
          term: 'Radiation dose',
          definition:
            'The ionizing radiation a spacecraft accumulates; higher orbits and inclination can increase it.',
        },
      ],
    },
    briefCard: {
      title: 'New to mission design?',
      body: 'Open the field guide to learn how each component changes mass, power, data and risk.',
      button: 'Open the field guide',
    },
  },
  home: {
    eyebrow: 'NASA Space Apps Challenge 2026 · Neiva',
    title: 'Mission design, from concept to consequences.',
    lead: 'Pick an objective, build a spacecraft, choose an orbit and a launch vehicle, and simulate a full mission. Every kilogram, watt and dollar you spend changes what the mission can do.',
    primaryCta: 'Mission design opens next',
    secondaryCta: 'View design system',
    statusTitle: 'Foundation status',
    statusLead:
      'The collaboration scaffold is in place. Game logic starts after the contract is frozen.',
    nextTitle: 'Next up',
    nextItems: {
      contract: {
        title: 'Engine contract',
        body: 'Types, units, invariants and fixtures so both tracks can work in parallel.',
      },
      design: {
        title: 'Mission board',
        body: 'Single-screen layout with live resource gauges and validation.',
      },
      simulation: {
        title: 'Mission simulation',
        body: 'Day-by-day timeline, space-weather events and role-based decisions.',
      },
    },
    sourcesTitle: 'Built on real data',
    sourcesBody:
      'Scenarios are driven by NASA DONKI space-weather events and NASA POWER cloud and seasonal insolation data. Every number in the game is labelled official, derived, estimate or game.',
  },
  footer: {
    docs: 'Documentation',
    madeFor: 'Built for the NASA Space Apps Challenge 2026, Neiva, Colombia.',
    credit: 'Team Kessler Syndrome · with Laura',
  },
}
