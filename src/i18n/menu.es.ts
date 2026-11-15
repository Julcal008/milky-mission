/**
 * Menu and entry copy, Spanish — Owner: Angelica (Track B / UI).
 */
export const menuEs = {
  brand: {
    name: 'MILKY MISSION',
    tagline: 'Diseña la misión. Vive las consecuencias.',
    team: 'por Kessler Syndrome · con Laura',
  },
  nav: {
    home: 'Inicio',
    brief: 'Resumen',
    styleguide: 'Guía de estilo',
    language: 'Idioma',
    presentation: 'Modo presentación',
  },
  start: {
    eyebrow: 'NASA Space Apps Challenge 2026 · Neiva',
    cta: 'Inicio',
    tagline: 'Experiencia inmersiva de una aventura espacial.',
  },
  brief: {
    eyebrow: 'Resumen de misión',
    title: 'Elige tu misión',
    lead: 'Dos escenarios, un lanzamiento. Elige el objetivo y construye la nave que pueda cumplirlo.',
    budget: 'Presupuesto',
    duration: 'Duración',
    launchWindow: 'Ventana de lanzamiento',
    requirements: 'Requisitos',
    days: 'días',
    players: 'Jugadores',
    playersHint: 'Una sola pantalla. Los turnos pasan de forma explícita.',
    solo: 'Solo',
    selected: 'Seleccionada',
    start: 'Iniciar misión',
    requirementsHint: 'Elegirás 3 requisitos en la siguiente pantalla.',
    loadExample: 'Cargar misión de ejemplo',
  },
  learn: {
    open: 'Guía de campo',
    title: 'Guía de campo',
    lead: 'Entiende la misión, los componentes y los riesgos antes de lanzar.',
    close: 'Cerrar guía',
    search: 'Buscar en la guía',
    empty: 'Sin resultados. Prueba otra palabra.',
    tabs: {
      basics: 'Básicos',
      components: 'Componentes',
      risks: 'Riesgos',
      glossary: 'Glosario',
      model: 'Modelo',
    },
    basics: {
      title: 'Diseña en cinco pasos',
      intro: 'Puedes cambiar cualquier elección después. Estas son las decisiones que más importan.',
      steps: [
        {
          title: 'Órbita y lanzador',
          why: 'La órbita define revisit, arrastre, radiación y pasadas. El lanzador define la masa que puedes subir.',
          mistake:
            'Elegir el lanzador antes de revisar la masa, o una órbita baja que decae antes de terminar la misión.',
        },
        {
          title: 'Bus y propulsión',
          why: 'El bus lleva el payload y aporta energía y fiabilidad. La propulsión compra el delta-v para compensar el arrastre y durar.',
          mistake:
            'Elegir un bus que cabe con el payload pero no con el lanzador, u omitir propulsión en una misión larga.',
        },
        {
          title: 'Energía',
          why: 'Los paneles generan energía al sol; la batería cubre los eclipses. Los márgenes te protegen de tormentas y degradación.',
          mistake:
            'Dimensionar el panel para sol perfecto, u olvidar la profundidad de descarga y la degradación de la batería.',
        },
        {
          title: 'Comunicaciones y datos',
          why: 'Los instrumentos generan datos. La banda, la red de tierra y el almacenamiento deciden cuánto llega a Tierra.',
          mistake:
            'Añadir un instrumento con muchos datos sin un enlace más rápido ni más pasadas; el buffer se llena y se pierde ciencia.',
        },
        {
          title: 'Ciencia y requisitos',
          why: 'Los requisitos son las promesas de la misión. Cada instrumento apoya requisitos concretos y debes elegir exactamente 3.',
          mistake:
            'Elegir requisitos que ningún instrumento puede cumplir, o cuatro instrumentos que rompen masa, energía o datos.',
        },
      ],
    },
    components: {
      title: 'Componentes y qué hacen',
      intro:
        'Cada elección cambia masa, energía, datos, costo o fiabilidad. Abre una entrada del catálogo para ver sus números y procedencia.',
      use: 'Cómo usarlo',
      items: 'Entradas del catálogo',
      categories: {
        orbit: {
          what: 'El camino alrededor de la Tierra. Altitud e inclinación definen revisit, arrastre, radiación y traza terrestre.',
          use: 'Elige la órbita que apoye tus requisitos: SSO para cobertura diaria, LEO baja para resolución, órbitas altas para durar.',
          risks: [
            'Las órbitas bajas decaen más rápido y piden más delta-v.',
            'Las órbitas altas y la inclinación alta aumentan la dosis de radiación.',
            'Un lanzador de órbita fija no puede apuntar a otra órbita.',
          ],
        },
        launcher: {
          what: 'El cohete que sube la nave. La capacidad depende de la órbita objetivo.',
          use: 'Ajusta la capacidad a tu masa final con margen. Revisa costo, órbita fija y riesgo de calendario.',
          risks: [
            'Pasarse de capacidad impide el lanzamiento.',
            'Un lanzador sobredimensionado desperdicia presupuesto.',
            'El rideshare puede fijarte la órbita.',
          ],
        },
        bus: {
          what: 'El chasis, la aviónica y la distribución de energía. Lleva el payload y define la fiabilidad.',
          use: 'Elige el bus más pequeño que quepa en masa y volumen del payload y dé suficiente energía, con margen.',
          risks: [
            'El payload sobre capacidad bloquea el diseño.',
            'Un bus más pesado se come la capacidad del lanzador.',
            'Menor fiabilidad reduce el puntaje.',
          ],
        },
        propulsion: {
          what: 'El motor y el propergol que dan delta-v para compensar arrastre y cambiar de órbita.',
          use: 'Úsala si la órbita decae o la misión es larga. Compara masa seca, propergol e Isp.',
          risks: [
            'La masa de propergol reduce la capacidad de payload.',
            'Sin propulsión, una órbita baja puede terminar la misión antes.',
            'Los sistemas de Isp alto pueden costar más.',
          ],
        },
        array: {
          what: 'Celdas solares que convierten la luz del Sol en energía.',
          use: 'Elige tecnología y área que cubran la carga con margen tras incidencia, empaquetado y degradación.',
          risks: [
            'Un panel pequeño causa déficit de energía.',
            'Más área añade masa y costo.',
            'GaAs es eficiente pero caro.',
          ],
        },
        battery: {
          what: 'Guarda energía para el eclipse y los picos de carga.',
          use: 'Dimensiónala para el eclipse más largo y la profundidad de descarga que permitas.',
          risks: [
            'Una batería pequeña causa apagones y pérdida de ciencia.',
            'Baterías más grandes añaden masa.',
            'La descarga profunda acorta la vida.',
          ],
        },
        comms: {
          what: 'La banda de radio y la antena que bajan los datos.',
          use: 'Ajusta banda y tasa al volumen de datos y a la red de tierra. Bandas altas llevan más datos pero piden más energía y apuntamiento.',
          risks: [
            'Un enlace lento crea backlog de datos.',
            'Las bandas altas cuestan más y pueden pedir antena mayor.',
            'UHF solo sirve para TT&C.',
          ],
        },
        network: {
          what: 'Las estaciones de tierra que reciben tus pasadas.',
          use: 'Más estaciones y pasadas significan más tiempo de bajada. Equilibra costo y cobertura.',
          risks: [
            'Una sola estación limita las pasadas.',
            'Más estaciones cuestan más.',
            'Una estación remota puede tener cortes.',
          ],
        },
        storage: {
          what: 'Memoria a bordo que guarda datos entre pasadas.',
          use: 'Dimensiónala para el hueco entre pasadas y la tasa de datos. Protege ante cortes cortos.',
          risks: [
            'Un buffer lleno pierde ciencia.',
            'Más almacenamiento añade masa y costo.',
            'El almacenamiento no arregla un enlace siempre lento.',
          ],
        },
        instrument: {
          what: 'El payload científico. Cada instrumento mide algo y apoya requisitos concretos.',
          use: 'Elige instrumentos que cumplan tus 3 requisitos y quepan en slots, masa, energía y datos.',
          risks: [
            'Ningún instrumento apoya un requisito elegido.',
            'Los instrumentos con muchos datos desbordan el enlace.',
            'Un TRL bajo es riesgo de vuelo.',
          ],
        },
      },
    },
    risks: {
      title: 'Riesgos y arreglos',
      intro:
        'La validación te dice qué bloquea el lanzamiento. Usa estas tarjetas para entender por qué y qué cambiar.',
      what: 'Qué significa',
      fix: 'Cómo arreglarlo',
      entries: {
        unknownCatalogId: {
          what: 'Un id de componente seleccionado no existe en los catálogos.',
          fix: 'Empieza de nuevo o elige un componente válido.',
          severity: 'error',
        },
        tooManyInstruments: {
          what: 'Hay más de cuatro instrumentos instalados.',
          fix: 'Quita instrumentos; el bus tiene cuatro slots de payload.',
          severity: 'error',
        },
        wrongRequirementCount: {
          what: 'La misión no tiene exactamente 3 requisitos.',
          fix: 'Selecciona o deselecciona requisitos hasta que el contador marque 3.',
          severity: 'error',
        },
        unknownRequirement: {
          what: 'Un requisito no pertenece a este escenario.',
          fix: 'Elige requisitos del escenario seleccionado.',
          severity: 'error',
        },
        duplicateRequirement: {
          what: 'El mismo requisito está seleccionado dos veces.',
          fix: 'Quita el duplicado.',
          severity: 'error',
        },
        fixedOrbitMismatch: {
          what: 'Este lanzador solo puede volar su órbita fija.',
          fix: 'Elige la órbita que coincide o un lanzador que pueda re-apuntar.',
          severity: 'error',
        },
        orbitUnavailable: {
          what: 'El lanzador no puede alcanzar la órbita elegida.',
          fix: 'Elige una órbita alcanzable o un lanzador más capaz.',
          severity: 'error',
        },
        massOverCapacity: {
          what: 'La nave, el propergol y el margen superan la capacidad del lanzador.',
          fix: 'Usa un bus o instrumentos más ligeros, un lanzador mayor, o menos panel y propergol.',
          severity: 'error',
        },
        payloadOverCapacity: {
          what: 'La masa del payload supera la capacidad del bus.',
          fix: 'Elige un bus mayor o instrumentos más ligeros.',
          severity: 'error',
        },
        budgetExceeded: {
          what: 'El diseño cuesta más que el presupuesto del escenario.',
          fix: 'Baja el costo: lanzador, bus, instrumentos o red de tierra más pequeños.',
          severity: 'error',
        },
        massMarginLow: {
          what: 'El margen de masa está por debajo del 20%.',
          fix: 'Deja más margen para crecimiento y propergol.',
          severity: 'warning',
        },
        powerMarginLow: {
          what: 'El margen de energía está por debajo del 15%.',
          fix: 'Añade área de panel o reduce la carga.',
          severity: 'warning',
        },
        energyDeficit: {
          what: 'La batería no cubre el eclipse.',
          fix: 'Usa una batería mayor, baja la carga o elige una órbita con eclipses más cortos.',
          severity: 'warning',
        },
        dataBacklog: {
          what: 'La bajada no puede seguir el ritmo de los datos generados.',
          fix: 'Usa una banda más rápida, más pasadas, más almacenamiento o menos instrumentos con muchos datos.',
          severity: 'warning',
        },
        lifetimeShort: {
          what: 'La vida de la misión es más corta de lo que pide el escenario.',
          fix: 'Añade propergol, elige una órbita más alta o reduce el arrastre.',
          severity: 'warning',
        },
        radiationRisk: {
          what: 'La dosis de radiación es alta para la vida de la misión.',
          fix: 'Elige una órbita con menos radiación o acepta el riesgo con una vida más corta.',
          severity: 'warning',
        },
        heavyLauncher: {
          what: 'El lanzador está sobredimensionado para esta nave.',
          fix: 'Usa un lanzador más pequeño para ahorrar presupuesto.',
          severity: 'info',
        },
        linkTooSlow: {
          what: 'El enlace es demasiado lento para los datos de ciencia.',
          fix: 'Usa una banda más alta, una antena mayor o menos instrumentos con muchos datos.',
          severity: 'warning',
        },
        requirementUnsupported: {
          what: 'Ningún instrumento puede cumplir un requisito elegido.',
          fix: 'Añade un instrumento que lo apoye o elige otro requisito.',
          severity: 'warning',
        },
      },
    },
    glossary: {
      title: 'Glosario',
      intro: 'Los términos que verás mientras diseñas y vuelas la misión.',
      terms: [
        {
          term: 'Margen',
          definition:
            'El colchón de seguridad entre lo que necesitas y lo que tienes. Un margen de masa del 20% significa que puedes añadir 20% más de masa.',
        },
        {
          term: 'Delta-v (Δv)',
          definition:
            'El cambio de velocidad que necesita la misión. Compensar el arrastre y cambiar de órbita lo consumen.',
        },
        {
          term: 'Ciclo de trabajo',
          definition: 'La fracción de tiempo que un instrumento está activo.',
        },
        {
          term: 'Bajada (downlink)',
          definition: 'El camino de radio que envía datos de la nave a Tierra.',
        },
        {
          term: 'Franja (swath)',
          definition: 'El ancho de la franja terrestre que ve un instrumento en una pasada.',
        },
        {
          term: 'Revisit',
          definition: 'Cada cuánto tiempo la nave ve el mismo lugar.',
        },
        {
          term: 'TRL',
          definition:
            'Nivel de madurez tecnológica, de 1 (idea) a 9 (probado en vuelo). Un TRL bajo implica más riesgo.',
        },
        {
          term: 'DoD',
          definition: 'Profundidad de descarga: cuánto de la capacidad de la batería usas.',
        },
        {
          term: 'Eclipse',
          definition: 'La parte de la órbita en la sombra de la Tierra, cuando no hay energía solar.',
        },
        {
          term: 'SSO',
          definition:
            'Órbita heliosincrónica: cruza la misma hora local cada día, útil para cobertura diaria.',
        },
        {
          term: 'Presupuesto de enlace',
          definition:
            'La contabilidad de potencia, ganancia de antena, distancia y pérdidas que fija la tasa de datos.',
        },
        {
          term: 'Dosis de radiación',
          definition:
            'La radiación ionizante que acumula la nave; órbitas altas y mayor inclinación pueden aumentarla.',
        },
      ],
    },
    briefCard: {
      title: '¿Nuevo en diseño de misiones?',
      body: 'Abre la guía de campo para entender cómo cada componente cambia masa, energía, datos y riesgo.',
      button: 'Abrir la guía de campo',
    },
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
      'Los escenarios se alimentan de eventos de clima espacial de NASA DONKI y de datos de nubosidad e insolación estacional de NASA POWER. Cada número está etiquetado como oficial, derivado, estimado o de juego.',
  },
  footer: {
    docs: 'Documentación',
    madeFor: 'Hecho para el NASA Space Apps Challenge 2026, Neiva, Colombia.',
    credit: 'Equipo Kessler Syndrome · con Laura',
  },
}
