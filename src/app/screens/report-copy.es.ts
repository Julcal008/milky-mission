/** Educational report copy, Spanish. Owner: Track A (Report). */
import type { ReportCopy } from './report-copy.en'

export const reportCopyEs: ReportCopy = {
  summary: {
    title: 'En un minuto',
    lead: 'La versión corta, antes de los detalles.',
    design: 'Diseñaste una nave de {mass} kg con {instruments} instrumentos por ${cost}M.',
    events:
      'Durante {days} días ocurrieron {events} eventos; manejaste {handled} de {critical} eventos críticos.',
    result: 'Terminaste con grado {grade} ({total}/1000). Tu área más débil fue {weakest}.',
    learning: 'Aprendizaje principal: {lesson}',
  },
  score: {
    title: 'Cómo se calculó tu puntaje',
    lead: 'Cada parte responde una pregunta distinta. Los detalles son opcionales.',
    points: '{value} / {max} pts',
    details: '¿Cómo se calcula?',
    components: {
      mission: {
        what: '¿Cumpliste los objetivos de misión que elegiste?',
        result: 'Cumpliste {met} de {chosen} requisitos elegidos.',
        formula: 'Fracción de cada requisito × su peso, con un máximo de 300 puntos.',
      },
      science: {
        what: '¿Los datos científicos llegaron realmente al suelo?',
        result: 'El {delivered}% de los datos generados llegó al suelo.',
        formula: 'Valor del instrumento × datos entregados × cobertura × salud del instrumento.',
      },
      efficiency: {
        what: '¿Usaste bien la masa, la potencia y el presupuesto?',
        result: 'Margen de masa {mass}%, margen de potencia {power} W, coste ${cost}M.',
        formula: 'Margen de masa + margen de potencia + ahorro de presupuesto.',
      },
      robustness: {
        what: '¿La nave resistió y manejaste los eventos críticos?',
        result: 'Manejaste {handled} de {critical} eventos críticos.',
        formula: 'Confiabilidad más la proporción de eventos críticos con decisión.',
      },
      teamwork: {
        what: '¿El equipo coordinó roles y decisiones?',
        result: 'Puntaje de equipo {value}/100.',
        formula: 'Objetivos de rol más decisiones por consenso.',
      },
    },
  },
  requirementsLead:
    'Cada requisito elegido es una promesa para la misión. Se puede obtener crédito parcial.',
  diagnosisLead: 'Estas son las razones por las que algunos requisitos no se cumplieron.',
  diagnosisSuccessTitle: 'Qué te frenó',
  diagnosisSuccessLead:
    'Se cumplieron todos los requisitos elegidos. Los puntos restantes vinieron de eficiencia y robustez.',
  snapshot: {
    title: 'Tu misión de un vistazo',
    lead: 'El hardware que lanzaste, los recursos que usó y qué significan los números.',
    orbit: 'Órbita',
    launcher: 'Lanzador',
    bus: 'Bus de la nave',
    powerSystem: 'Sistema de potencia',
    comms: 'Comunicaciones',
    payload: 'Carga útil',
    mass: 'Masa',
    powerMargin: 'Margen de potencia',
    budget: 'Presupuesto',
    lifetime: 'Vida útil',
    data: 'Datos entregados',
    instruments: 'Instrumentos',
    whyTitle: 'Por qué importan estos números',
    why: 'El margen de masa es tu espacio para crecer. El margen de potencia mantiene vivos los instrumentos en eclipse. Los datos entregados son la ciencia que realmente llegó al suelo. Un diseño holgado es más fácil de operar bajo presión.',
  },
  story: {
    title: 'Qué pasó, paso a paso',
    lead: 'Cada evento, la decisión que tomaste y por qué cambió la misión.',
    whatHappened: 'Qué pasó',
    whatYouChose: 'Qué elegiste',
    whyItMattered: 'Por qué importó',
    noDecision: 'No se registró una decisión para este evento.',
    criticalNoDecision:
      'No se registró una decisión. Esta anomalía crítica contó como no atendida.',
    handled: 'Atendida. La anomalía se contuvo y ayudó a la robustez.',
    unhandled: 'No atendida. La anomalía quedó abierta y redujo la robustez.',
    otherOptions: 'Otras opciones que tenías',
    alertOnly: 'Fue una alerta; no hacía falta una decisión.',
    empty: 'No se registraron eventos en esta misión.',
  },
  lessons: {
    title: 'Qué aprender de esta misión',
    lead: 'Conclusiones prácticas para tu próximo diseño.',
    next: 'Prueba esto la próxima vez',
    mass: 'Tu margen de masa fue {margin}%. Prueba una carga más ligera o un lanzador mayor.',
    power:
      'Tu margen de potencia fue {margin} W. Añade área de panel, reduce la carga o aumenta la batería.',
    data: 'Solo el {delivered}% de los datos llegó al suelo. Mejora el enlace, la estación o el almacenamiento.',
    critical:
      '{count} evento(s) crítico(s) quedaron sin decisión. En cada modal, elige una opción para proteger la robustez.',
    requirements:
      'Cumpliste {met} de {chosen} requisitos. Revisa la cadena de instrumento y datos del que faltó.',
    success:
      'Se cumplieron todos los requisitos elegidos. Prueba una dificultad mayor o requisitos más ambiciosos.',
  },
  glossary: {
    title: 'Glosario',
    lead: 'Los términos de este informe, en lenguaje sencillo.',
    terms: {
      cme: {
        term: 'CME',
        definition:
          'Una enorme nube de partículas cargadas del Sol. Puede alterar satélites, radio y redes eléctricas.',
      },
      flare: {
        term: 'Fulgor solar',
        definition:
          'Una explosión repentina de radiación solar. Puede saturar sensores ópticos y cambiar la atmósfera alta.',
      },
      sso: {
        term: 'Órbita heliosincrónica (SSO)',
        definition:
          'Una órbita que cruza la misma hora local cada día. Útil para comparar imágenes con luz similar.',
      },
      massMargin: {
        term: 'Margen de masa',
        definition:
          'Cuánta capacidad de lanzamiento queda después de tu nave. Más margen significa espacio para crecer y menos riesgo.',
      },
      powerMargin: {
        term: 'Margen de potencia',
        definition:
          'Generación menos carga. Si es negativo, la batería no alcanza y puede que haya que apagar instrumentos.',
      },
      downlink: {
        term: 'Enlace descendente',
        definition: 'El enlace de radio que envía datos de la nave a una estación terrena.',
      },
      buffer: {
        term: 'Buffer',
        definition: 'Almacenamiento a bordo que guarda datos hasta que un pase los descarga.',
      },
      dutyCycle: {
        term: 'Ciclo de trabajo',
        definition:
          'La fracción de tiempo que un instrumento observa de verdad, en vez de calibrar, cargar o estar en seguro.',
      },
      trl: {
        term: 'TRL',
        definition:
          'Nivel de madurez tecnológica. Un TRL bajo significa hardware menos probado y más probable que falle.',
      },
      sar: {
        term: 'SAR',
        definition:
          'Radar de apertura sintética. Ve a través de nubes y de noche, a diferencia de una cámara óptica.',
      },
      requirement: {
        term: 'Requisito',
        definition:
          'Un objetivo de misión que elegiste. Cumplirlo da puntos; fallarlo baja el puntaje de misión.',
      },
      anomaly: {
        term: 'Anomalía',
        definition:
          'Un evento inesperado que requiere una decisión: tormenta, falla, hueco de datos o problema de presupuesto.',
      },
    },
  },
  data: {
    title: 'Datos reales vs. contenido de juego',
    lead: 'Este informe mezcla datos reales de NASA con reglas de juego. Esta es la frontera.',
    donki: 'NASA DONKI — fechas reales de CME y fulgores. Datos oficiales.',
    power: 'NASA POWER — nubosidad e insolación reales. Datos oficiales.',
    hardware: 'Catálogos de naves — estimaciones representativas, no hardware oficial de NASA.',
    challenges:
      'Variantes de desafíos, roles y efectos de decisiones — contenido de juego sobre las fechas reales.',
    model: 'Modelo técnico y supuestos',
    modelLead: 'Abre esto si quieres las fórmulas, fuentes y simplificaciones.',
  },
  print: 'Imprimir / Guardar PDF',
}
