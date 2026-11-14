/**
 * English dictionary — source of truth for UI copy.
 * Owner: Track B. Every new key must be added to es.ts in the same PR
 * (TypeScript enforces parity through the `satisfies Dictionary` check).
 */
export const en = {
  brand: {
    name: 'MILKY MISSION',
    tagline: 'Design the mission. Live with the consequences.',
    team: 'by Kessler Syndrome · with Laura',
  },
  nav: {
    home: 'Home',
    styleguide: 'Styleguide',
    language: 'Language',
    presentation: 'Presentation mode',
  },
  common: {
    badgePrototype: 'Prototype',
    comingSoon: 'In progress',
    readDocs: 'Read the docs',
  },
  start: {
    cta: 'Start',
    tagline: 'An immersive space adventure experience.',
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
      'Scenarios are driven by NASA DONKI space-weather events, NASA POWER solar and cloud data, and NASA Earth imagery. Every number in the game is labelled official, derived or estimate.',
  },
  footer: {
    docs: 'Documentation',
    madeFor: 'Built for the NASA Space Apps Challenge 2026, Neiva, Colombia.',
    credit: 'Team Kessler Syndrome · with Laura',
  },
  styleguide: {
    title: 'Design system',
    lead: 'Tokens, type, components and states. Build every screen from these pieces.',
    palette: 'Palette',
    base: 'Base',
    brand: 'Brand',
    semantic: 'Semantic',
    roles: 'Player roles',
    resources: 'Mission resources',
    typography: 'Typography',
    components: 'Components',
    states: 'States',
    buttons: 'Buttons',
    badges: 'Badges',
    gauges: 'Resource gauges',
    usage: 'Usage rules',
  },
}
