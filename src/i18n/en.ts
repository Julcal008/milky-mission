/**
 * English dictionary — composition root.
 * Owners: menu (Track B), game (Track A), ops (Track C). Shared keys live here.
 * Every new key must be added to the matching module in es.ts.
 */
import { gameEn } from './game.en'
import { menuEn } from './menu.en'
import { opsEn } from './ops.en'

export const en = {
  ...menuEn,
  common: {
    badgePrototype: 'Prototype',
    comingSoon: 'In progress',
    readDocs: 'Read the docs',
    severity: {
      error: 'Error',
      warning: 'Warning',
      info: 'Info',
      critical: 'Critical',
    },
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
  game: gameEn,
  ops: opsEn,
}
