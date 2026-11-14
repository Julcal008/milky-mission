/**
 * Spanish dictionary — composition root.
 * Must mirror en.ts exactly; `satisfies Dictionary` fails the build if a key is missing.
 */
import type { Dictionary } from './index'
import { gameEs } from './game.es'
import { menuEs } from './menu.es'
import { opsEs } from './ops.es'

export const es = {
  ...menuEs,
  common: {
    badgePrototype: 'Prototipo',
    comingSoon: 'En desarrollo',
    readDocs: 'Ver documentación',
  },
  styleguide: {
    title: 'Sistema de diseño',
    lead: 'Tokens, tipografía, componentes y estados. Toda pantalla se construye con estas piezas.',
    palette: 'Paleta',
    base: 'Base',
    brand: 'Marca',
    semantic: 'Semánticos',
    roles: 'Roles de jugador',
    resources: 'Recursos de misión',
    typography: 'Tipografía',
    components: 'Componentes',
    states: 'Estados',
    buttons: 'Botones',
    badges: 'Insignias',
    gauges: 'Gauges de recursos',
    usage: 'Reglas de uso',
  },
  game: gameEs,
  ops: opsEs,
} satisfies Dictionary
