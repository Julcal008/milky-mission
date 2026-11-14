/**
 * Andes Flood Watch — Spanish domain copy.
 * Owner: Track C. Keys mirror `scenario.andes.rN.*` in `src/i18n`.
 */
import type { ScenarioCopy } from './types'

export const andesFloodWatchEs: ScenarioCopy = {
  title: 'Vigilancia de inundaciones en los Andes',
  summary:
    'Observa la cuenca del Magdalena todos los días, a través de las nubes y de noche, y ' +
    'entrega alertas de inundación a tiempo.',
  brief:
    'Cada temporada de lluvias, el río Magdalena inunda pueblos que tienen 12 horas para ' +
    'evacuar. Construye una misión que vea la cuenca todos los días —a través de las nubes, ' +
    'de día y de noche— y que entregue los datos a tiempo para que sirvan.',
  r1: {
    title: 'Revisitar la cuenca todos los días',
    description:
      'Observa la cuenca al menos cada 24 horas. Depende de las pasadas por día, el ancho de ' +
      'barrido y el apuntamiento.',
  },
  r2: {
    title: 'Ver a través de nubes y de noche',
    description: 'Lleva un SAR u otro instrumento de microondas que funcione sin luz solar.',
  },
  r3: {
    title: 'Resolver 100 metros',
    description: 'Usa un HRI o un SAR para alcanzar una resolución en tierra de 100 m o mejor.',
  },
  r4: {
    title: 'Entregar los datos',
    description: 'Descarga al menos el 60% de los datos que genera la misión.',
  },
  r5: {
    title: 'Operar durante 18 meses',
    description:
      'Lleva suficiente delta-v para compensar el arrastre y ten en cuenta la degradación ' +
      'durante 548 días.',
  },
}
