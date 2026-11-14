/**
 * Spanish dictionary.
 * Must mirror en.ts exactly; `satisfies Dictionary` fails the build if a key is missing.
 */
import type { Dictionary } from './index'

export const es = {
  brand: {
    name: 'MILKY MISSION',
    tagline: 'Diseña la misión. Vive las consecuencias.',
    team: 'por Kessler Syndrome · con Laura',
  },
  nav: {
    home: 'Inicio',
    styleguide: 'Guía de estilo',
    language: 'Idioma',
    presentation: 'Modo presentación',
  },
  common: {
    badgePrototype: 'Prototipo',
    comingSoon: 'En desarrollo',
    readDocs: 'Ver documentación',
  },
  home: {
    eyebrow: 'NASA Space Apps Challenge 2026 · Neiva',
    title: 'Diseño de misiones, del concepto a las consecuencias.',
    lead: 'Elige un objetivo, construye una nave, selecciona órbita y lanzador, y simula la misión completa. Cada kilogramo, vatio y dólar cambia lo que la misión puede hacer.',
    primaryCta: 'El diseño de misión abre pronto',
    secondaryCta: 'Ver sistema de diseño',
    statusTitle: 'Estado de la base',
    statusLead:
      'El esqueleto de colaboración está listo. La lógica del juego empieza al congelar el contrato.',
    nextTitle: 'Siguiente',
    nextItems: {
      contract: {
        title: 'Contrato del motor',
        body: 'Tipos, unidades, invariantes y fixtures para trabajar en paralelo.',
      },
      design: {
        title: 'Tablero de misión',
        body: 'Una sola pantalla con gauges de recursos y validación en vivo.',
      },
      simulation: {
        title: 'Simulación de misión',
        body: 'Línea de tiempo diaria, eventos de clima espacial y decisiones por rol.',
      },
    },
    sourcesTitle: 'Construido con datos reales',
    sourcesBody:
      'Los escenarios se alimentan de eventos de clima espacial de NASA DONKI, datos solares y de nubosidad de NASA POWER, e imágenes de NASA. Cada número del juego está etiquetado como oficial, derivado o estimado.',
  },
  footer: {
    docs: 'Documentación',
    madeFor: 'Hecho para el NASA Space Apps Challenge 2026, Neiva, Colombia.',
    credit: 'Equipo Kessler Syndrome · con Laura',
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
} satisfies Dictionary
