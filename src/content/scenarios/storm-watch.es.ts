/**
 * Storm Watch — Spanish domain copy.
 * Owner: Track C. Keys mirror `scenario.storm.rN.*` in `src/i18n`.
 */
import type { ScenarioCopy } from './types'

export const stormWatchEs: ScenarioCopy = {
  title: 'Vigilancia de tormentas',
  summary: 'Vigila el Sol y la ionosfera durante la próxima tormenta solar.',
  brief:
    'Una tormenta geomagnética G5 acaba de golpear la Tierra. Las aerolíneas desviaron vuelos ' +
    'polares, el GPS falló durante horas y nadie la vio venir a tiempo. Tu misión: poner un ' +
    'pequeño satélite en órbita que vigile el Sol y la ionosfera, y que siga funcionando cuando ' +
    'llegue la próxima tormenta. Tienes 12 meses, 50 millones de dólares y un solo lanzamiento.',
  r1: {
    title: 'Rastrear fulguraciones clase X',
    description:
      'Detecta al menos el 90% de las fulguraciones clase X en menos de 4 horas. Requiere un ' +
      'XRS, un ciclo de trabajo de al menos 80% y 70% de los datos entregados.',
  },
  r2: {
    title: 'Imagen del óvalo auroral',
    description:
      'Captura el óvalo auroral al menos cada 12 horas. Requiere un SUVI, inclinación de al ' +
      'menos 80°, revisita de 12 horas o menos y 60% de los datos entregados.',
  },
  r3: {
    title: 'Medir la ionosfera sobre Colombia',
    description:
      'Consigue al menos cuatro pasadas GNSS-RO por día sobre Colombia y entrega el 60% de ' +
      'los datos.',
  },
  r4: {
    title: 'Sobrevivir a una tormenta G4+',
    description:
      'Lleva un magnetómetro o un detector de protones, mantén la dosis total por debajo de ' +
      '20 krad y conserva un margen de potencia de al menos 15%.',
  },
  r5: {
    title: 'Entregar los datos',
    description: 'Descarga al menos el 70% de los datos que genera la misión.',
  },
  r6: {
    title: 'Operar durante 12 meses',
    description:
      'Lleva suficiente delta-v para compensar el arrastre y ten en cuenta la degradación de ' +
      'paneles y baterías durante un año.',
  },
}
