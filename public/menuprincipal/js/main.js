/* =====================================================
   MILKY MISSION · Start menu
   Bilingual (EN/ES), offline font, six-color solarpunk palette.
   Edit CONFIG for missions, roles, materials and costs.
   Missions are fictional and inspired by real programs. Costs are
   educational estimates (USD), not official figures.
   ===================================================== */
(() => {
  'use strict'

  /* ---------- 1. CONFIG (language-neutral) ---------- */
  const CONFIG = {
    budgetStep: 500000, // random budget rounds to this value
    missions: [
      {
        id: 'luna',
        icon: '🌙',
        budgetRange: [45000000, 85000000],
        materials: [
          { id: 'alli', icon: '🛠️', cost: 8000000 },
          { id: 'motor', icon: '🔥', cost: 24000000 },
          { id: 'gaas', icon: '☀️', cost: 10000000 },
          { id: 'mli', icon: '🧊', cost: 6000000 },
          { id: 'lidar', icon: '📡', cost: 14000000 },
          { id: 'bat', icon: '🔋', cost: 8000000 },
        ],
      },
      {
        id: 'orbita',
        icon: '🪐',
        budgetRange: [20000000, 45000000],
        materials: [
          { id: 'agua', icon: '💧', cost: 4500000 },
          { id: 'solar', icon: '☀️', cost: 6000000 },
          { id: 'brazo', icon: '🦾', cost: 9000000 },
          { id: 'metal', icon: '♻️', cost: 2500000 },
          { id: 'bio', icon: '🌿', cost: 3000000 },
          { id: 'cam', icon: '📷', cost: 7000000 },
        ],
      },
    ],
  }

  /* ---------- 2. STRINGS ---------- */
  const STRINGS = {
    en: {
      title: 'MILKY MISSION',
      start: 'Start',
      tagline: 'An immersive space adventure experience.',
      startLabel: 'Start game',
      resourcesLabel: 'Budget and materials',
      missionsTitle: 'Choose a mission',
      rolesTitle: 'Required roles',
      budgetTitle: 'Budget',
      materialsTitle: 'Materials',
      options: 'Options',
      summaryTitle: 'Mission summary',
      back: 'Back',
      launch: 'Launch',
      optionsTitle: 'Options',
      music: 'Music',
      volume: 'Volume',
      motion: 'Background animations',
      done: 'Done',
      language: 'Language',
      missionLabel: 'Mission',
      materialsLabel: 'Materials',
      remainingLabel: 'Remaining budget',
      noneYet: 'none yet',
      selectMaterial: 'Select a material to see its information.',
      budgetAssigned: 'Budget assigned: {amount}',
      notEnough: 'Not enough budget for {name}.',
      spent: 'Spent: {spent} of {budget}',
      disclaimer:
        'Fictional missions inspired by real programs. Costs are educational estimates, not official figures.',
      missions: {
        luna: {
          name: 'Moon Path',
          inspired: "Inspired by: NASA's CLPS program and Artemis",
          info:
            'Selene-1 is a robotic lander that will travel about 4 days to the lunar south pole. ' +
            'Its goal is to measure water ice near permanently shadowed craters and test precision ' +
            'landing technology for future crewed missions. It must survive one lunar day (about 14 ' +
            'Earth days) with temperatures from 120 °C to -170 °C. (Fictional description.)',
          roles: [
            { name: 'Flight Director', desc: 'Makes real-time decisions from mission control.' },
            {
              name: 'Guidance, Navigation and Control Engineer',
              desc: 'Computes the trajectory and the automated descent.',
            },
            { name: 'Propulsion Engineer', desc: 'Monitors engines, propellant and tank pressure.' },
            {
              name: 'Communications Specialist',
              desc: 'Maintains the telemetry link with ground antennas.',
            },
          ],
          materials: {
            alli: {
              name: 'Aluminum-lithium alloy',
              info: 'Lightweight and strong; used in propellant tanks and launch vehicle structures.',
            },
            motor: {
              name: 'Liquid methane engine',
              info: 'Cryogenic descent engine that can throttle to land softly.',
            },
            gaas: {
              name: 'Triple-junction solar panels',
              info: 'Gallium arsenide cells with more than 30% efficiency, common in space missions.',
            },
            mli: {
              name: 'Multilayer thermal insulation',
              info: 'Aluminized polyimide layers that protect equipment from extreme temperature swings.',
            },
            lidar: {
              name: 'Autonomous landing lidar',
              info: 'Measures altitude and avoids rocks and slopes during the final minutes of descent.',
            },
            bat: {
              name: 'Lithium batteries and heaters',
              info: 'Keep systems warm and active during the lunar night.',
            },
          },
        },
        orbita: {
          name: 'Sustainable Orbit',
          inspired: "Inspired by: ESA's ClearSpace-1 and ELSA-d",
          info:
            'Custodian-1 is a space tug that approaches an inactive satellite in low orbit, about ' +
            '600 km up, captures it with a robotic arm and brings it down to re-enter the atmosphere, ' +
            'where it disintegrates. It aims to show that space debris can be reduced by reusing ' +
            'materials and using low-impact propulsion. It lasts about 12 months, from launch to ' +
            'capture. (Fictional description.)',
          roles: [
            {
              name: 'Mission Director',
              desc: 'Coordinates the team and approves each approach maneuver.',
            },
            {
              name: 'Proximity Operations Engineer',
              desc: 'Plans a safe approach to the object without colliding.',
            },
            {
              name: 'Space Robotics Specialist',
              desc: 'Controls the capture arm and its sensors.',
            },
            {
              name: 'Orbital Dynamics Analyst',
              desc: 'Tracks the debris and calculates the controlled re-entry.',
            },
          ],
          materials: {
            agua: {
              name: 'Water thrusters',
              info: 'Electrothermal thrusters that heat water to generate thrust, without toxic propellants.',
            },
            solar: {
              name: 'High-efficiency solar panels',
              info: 'Power the electric thrusters and the capture systems.',
            },
            brazo: {
              name: 'Robotic capture arm',
              info: 'Force-sensing gripper that holds a spinning object without damaging it.',
            },
            metal: {
              name: 'Recycled metals',
              info: 'Recycled aerospace aluminum for the structure; reduces manufacturing energy.',
            },
            bio: {
              name: 'Biocomposites',
              info: 'Bio-based resins for non-critical parts; lighter and less polluting.',
            },
            cam: {
              name: 'Approach cameras and lidar',
              info: "Allow the team to see and measure the target's position and spin during approach.",
            },
          },
        },
      },
    },
    es: {
      title: 'MILKY MISSION',
      start: 'Iniciar',
      tagline: 'Experiencia inmersiva de una aventura espacial.',
      startLabel: 'Iniciar juego',
      resourcesLabel: 'Presupuesto y materiales',
      missionsTitle: 'Elegir misión',
      rolesTitle: 'Roles necesarios',
      budgetTitle: 'Presupuesto',
      materialsTitle: 'Materiales',
      options: 'Opciones',
      summaryTitle: 'Resumen de tu misión',
      back: 'Volver',
      launch: 'Despegar',
      optionsTitle: 'Opciones',
      music: 'Música',
      volume: 'Volumen',
      motion: 'Animaciones de fondo',
      done: 'Listo',
      language: 'Idioma',
      missionLabel: 'Misión',
      materialsLabel: 'Materiales',
      remainingLabel: 'Presupuesto restante',
      noneYet: 'ninguno todavía',
      selectMaterial: 'Selecciona un material para ver su información.',
      budgetAssigned: 'Presupuesto asignado: {amount}',
      notEnough: 'No alcanza el presupuesto para {name}.',
      spent: 'Gastado: {spent} de {budget}',
      disclaimer:
        'Misiones ficticias inspiradas en programas reales. Los costos son estimaciones educativas, no cifras oficiales.',
      missions: {
        luna: {
          name: 'Senda de la Luna',
          inspired: 'Inspirada en: programa CLPS de la NASA y Artemis',
          info:
            'Selene-1 es un aterrizador robótico que viajará unos 4 días hasta el polo sur lunar. ' +
            'Su objetivo es medir hielo de agua cerca de cráteres en sombra permanente y probar ' +
            'tecnología de aterrizaje de precisión para futuras misiones tripuladas. Debe sobrevivir ' +
            'un día lunar (unos 14 días terrestres) con temperaturas desde 120 °C hasta -170 °C. ' +
            '(Descripción ficticia.)',
          roles: [
            {
              name: 'Director de vuelo',
              desc: 'Toma las decisiones en tiempo real desde el control de misión.',
            },
            {
              name: 'Ingeniero de guiado, navegación y control',
              desc: 'Calcula la trayectoria y el descenso automático.',
            },
            {
              name: 'Ingeniero de propulsión',
              desc: 'Vigila motores, combustible y presión de los tanques.',
            },
            {
              name: 'Especialista en comunicaciones',
              desc: 'Mantiene el enlace de telemetría con las antenas en Tierra.',
            },
          ],
          materials: {
            alli: {
              name: 'Aleación aluminio-litio',
              info: 'Ligera y resistente; se usa en tanques y estructura de cohetes como el Orion y el SLS.',
            },
            motor: {
              name: 'Motor de metano líquido',
              info: 'Motor criogénico de descenso con capacidad de regular su empuje para aterrizar con suavidad.',
            },
            gaas: {
              name: 'Paneles solares de triple unión',
              info: 'Celdas de arseniuro de galio con más de 30 % de eficiencia, comunes en misiones espaciales.',
            },
            mli: {
              name: 'Aislamiento térmico multicapa',
              info: 'Capas de poliimida aluminizada que protegen los equipos de los cambios extremos de temperatura.',
            },
            lidar: {
              name: 'Lidar de aterrizaje autónomo',
              info: 'Mide la altura y evita rocas y pendientes durante los últimos minutos del descenso.',
            },
            bat: {
              name: 'Baterías de litio y calentadores',
              info: 'Mantienen los sistemas cálidos y activos durante la noche lunar.',
            },
          },
        },
        orbita: {
          name: 'Órbita Sostenible',
          inspired: 'Inspirada en: ClearSpace-1 (ESA) y ELSA-d',
          info:
            'Custodio-1 es un remolcador espacial que se acerca a un satélite inactivo en órbita baja, ' +
            'a unos 600 km de altura, lo captura con un brazo robótico y lo lleva a reentrar en la ' +
            'atmósfera, donde se desintegra. Busca demostrar que se puede reducir la basura espacial ' +
            'reutilizando materiales y con propulsión de bajo impacto. Dura unos 12 meses, de la ' +
            'puesta en órbita a la captura. (Descripción ficticia.)',
          roles: [
            {
              name: 'Director de misión',
              desc: 'Coordina al equipo y aprueba cada maniobra de acercamiento.',
            },
            {
              name: 'Ingeniero de operaciones de proximidad',
              desc: 'Planifica el acercamiento seguro al objeto sin chocar.',
            },
            {
              name: 'Especialista en robótica espacial',
              desc: 'Controla el brazo de captura y sus sensores.',
            },
            {
              name: 'Analista de dinámica orbital',
              desc: 'Rastrea los desechos y calcula la reentrada controlada.',
            },
          ],
          materials: {
            agua: {
              name: 'Propulsores de agua',
              info: 'Propulsores electrotérmicos que calientan agua para generar empuje, sin combustibles tóxicos.',
            },
            solar: {
              name: 'Paneles solares de alta eficiencia',
              info: 'Alimentan los propulsores eléctricos y los sistemas de captura.',
            },
            brazo: {
              name: 'Brazo robótico de captura',
              info: 'Garra con sensores de fuerza para sujetar un objeto que gira sin dañarlo.',
            },
            metal: {
              name: 'Metales reciclados',
              info: 'Aluminio aeroespacial reciclado para la estructura; reduce la energía de fabricación.',
            },
            bio: {
              name: 'Biocompuestos',
              info: 'Resinas de origen biológico para piezas no críticas; son más ligeras y menos contaminantes.',
            },
            cam: {
              name: 'Cámaras y lidar de acercamiento',
              info: 'Permiten ver y medir la posición y el giro del objetivo durante la aproximación.',
            },
          },
        },
      },
    },
  }

  /* ---------- 3. STATE ---------- */
  const state = { mission: CONFIG.missions[0].id, materials: new Set(), budget: 0, lang: 'en' }
  const current = () => CONFIG.missions.find((mission) => mission.id === state.mission)
  const currentText = () => STRINGS[state.lang].missions[state.mission]

  /* ---------- 4. UTILITIES ---------- */
  const $ = (id) => document.getElementById(id)
  const money = (n) => '$' + n.toLocaleString('en-US')
  const millions = (n) => '$' + (n / 1e6).toFixed(1) + 'M'
  const spent = () =>
    current()
      .materials.filter((material) => state.materials.has(material.id))
      .reduce((sum, material) => sum + material.cost, 0)

  function randomBudget(range) {
    const step = CONFIG.budgetStep
    const steps = Math.floor((range[1] - range[0]) / step)
    return range[0] + Math.floor(Math.random() * (steps + 1)) * step
  }

  function readStoredLang() {
    try {
      const raw = localStorage.getItem('milky-ui')
      const parsed = raw ? JSON.parse(raw) : null
      return parsed?.state?.lang === 'es' ? 'es' : 'en'
    } catch {
      return 'en'
    }
  }

  function persistLang(lang) {
    try {
      const raw = localStorage.getItem('milky-ui')
      const parsed = raw ? JSON.parse(raw) : { state: {}, version: 0 }
      parsed.state = { ...(parsed.state || {}), lang }
      localStorage.setItem('milky-ui', JSON.stringify(parsed))
    } catch {
      /* Storage can be unavailable; the menu still works for this session. */
    }
  }

  let toastTimer
  function toast(message) {
    const el = $('toast')
    el.textContent = message
    el.classList.add('show')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600)
  }

  /* ---------- 5. BACKGROUND: stars + parallax ---------- */
  function buildStars(count = 140) {
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < count; i++) {
      const star = document.createElement('i')
      star.className = 'star'
      const size = (Math.random() * 2.2 + 0.8).toFixed(1) + 'px'
      star.style.cssText =
        `--x:${Math.random() * 100}%;--y:${Math.random() * 100}%;--s:${size};` +
        `--t:${(Math.random() * 4 + 2).toFixed(1)}s;--dl:-${(Math.random() * 6).toFixed(1)}s`
      fragment.appendChild(star)
    }
    $('stars').appendChild(fragment)
  }

  function setupParallax() {
    const space = $('space')
    window.addEventListener(
      'pointermove',
      (event) => {
        space.style.setProperty('--px', ((event.clientX / innerWidth - 0.5) * 40).toFixed(1))
        space.style.setProperty('--py', ((event.clientY / innerHeight - 0.5) * 40).toFixed(1))
      },
      { passive: true },
    )
  }

  /* ---------- 6. MISSIONS, DESCRIPTION AND ROLES ---------- */
  function renderMissions() {
    const text = STRINGS[state.lang]
    const list = $('mission-list')
    list.innerHTML = ''
    CONFIG.missions.forEach((mission) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'mission'
      button.setAttribute('role', 'radio')
      button.setAttribute('aria-checked', String(mission.id === state.mission))
      button.dataset.missionId = mission.id
      button.innerHTML = `<span class="ico" aria-hidden="true">${mission.icon}</span><span>${text.missions[mission.id].name}</span>`
      button.addEventListener('click', () => selectMission(mission.id))
      list.appendChild(button)
    })

    const missionText = currentText()
    $('mission-info').innerHTML =
      `<span class="mission-meta">${missionText.inspired}</span>` +
      `<span class="mission-desc">${missionText.info}</span>`
    $('role-list').innerHTML = missionText.roles
      .map((role) => `<li><strong>${role.name}</strong>${role.desc}</li>`)
      .join('')
  }

  function selectMission(id, silent) {
    if (id === state.mission && state.budget) return
    state.mission = id
    state.materials.clear()
    state.budget = randomBudget(current().budgetRange)
    renderMissions()
    renderMaterials()
    renderBudget()
    if (!silent) {
      toast(STRINGS[state.lang].budgetAssigned.replace('{amount}', money(state.budget)))
      const selected = document.querySelector(`[data-mission-id="${id}"]`)
      if (selected) selected.focus()
    }
  }

  /* ---------- 7. MATERIALS + BUDGET ---------- */
  function renderMaterials() {
    const text = STRINGS[state.lang]
    const missionText = currentText()
    const list = $('material-list')
    list.innerHTML = ''
    current().materials.forEach((material) => {
      const materialText = missionText.materials[material.id]
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'material'
      button.dataset.materialId = material.id
      button.setAttribute('aria-pressed', String(state.materials.has(material.id)))
      button.innerHTML =
        `<span class="ico" aria-hidden="true">${material.icon}</span>` +
        `<span>${materialText.name}</span><small>${millions(material.cost)}</small>`
      button.addEventListener('click', () => toggleMaterial(material))
      list.appendChild(button)
    })
    $('material-info').textContent = text.selectMaterial
  }

  function toggleMaterial(material) {
    const text = currentText()
    if (state.materials.has(material.id)) {
      state.materials.delete(material.id)
    } else {
      if (spent() + material.cost > state.budget) {
        toast(text.notEnough.replace('{name}', text.materials[material.id].name))
        return
      }
      state.materials.add(material.id)
    }
    renderMaterials()
    renderBudget()
    $('material-info').textContent = text.materials[material.id].info
    const button = document.querySelector(`[data-material-id="${material.id}"]`)
    if (button) button.focus()
  }

  function renderBudget() {
    const text = STRINGS[state.lang]
    const used = spent()
    const pct = state.budget ? Math.round((used / state.budget) * 100) : 0
    $('budget-fill').style.width = pct + '%'
    $('budget-bar').setAttribute('aria-valuenow', pct)
    $('budget-bar').classList.toggle('warn', pct >= 85)
    $('budget-amount').textContent = money(state.budget - used)
    $('budget-left').textContent = text.spent
      .replace('{spent}', money(used))
      .replace('{budget}', money(state.budget))
  }

  /* ---------- 8. MODALS ---------- */
  function renderStartSummary() {
    const text = STRINGS[state.lang]
    const missionText = currentText()
    const materials = current().materials.filter((material) => state.materials.has(material.id))
    const names = materials.map((material) => missionText.materials[material.id].name)
    $('start-summary').innerHTML =
      `<p><strong>${text.missionLabel}:</strong> ${missionText.name}</p>` +
      `<p><strong>${text.materialsLabel}:</strong> ${
        names.length ? names.join(', ') : text.noneYet
      }</p>` +
      `<p><strong>${text.remainingLabel}:</strong> ${money(state.budget - spent())}</p>`
  }

  function openStart() {
    renderStartSummary()
    $('dlg-start').showModal()
  }

  function setupDialogs() {
    document.querySelectorAll('dialog').forEach((dialog) => {
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close()
      })
      dialog.querySelectorAll('[data-close]').forEach((button) => {
        button.addEventListener('click', () => dialog.close())
      })
    })
    $('btn-start').addEventListener('click', openStart)
    $('btn-options').addEventListener('click', () => $('dlg-options').showModal())

    // Hands the selection to the React game, then opens the design screen.
    $('btn-confirm').addEventListener('click', () => {
      $('dlg-start').close()
      const data = {
        mission: state.mission,
        materials: [...state.materials],
        budget: state.budget,
        budgetLeft: state.budget - spent(),
      }
      if (typeof window.MilkyMision.onStart === 'function') window.MilkyMision.onStart(data)
    })
  }

  /* ---------- 9. LANGUAGE ---------- */
  function applyLang() {
    const text = STRINGS[state.lang]
    document.documentElement.lang = state.lang
    document.title = text.title

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n
      if (key && text[key]) element.textContent = text[key]
    })
    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
      const key = element.dataset.i18nAria
      if (key && text[key]) element.setAttribute('aria-label', text[key])
    })
    document.querySelectorAll('.lang button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.lang === state.lang))
    })

    renderMissions()
    renderMaterials()
    renderBudget()
    if ($('dlg-start').open) renderStartSummary()
  }

  function setLang(lang) {
    if (lang !== 'en' && lang !== 'es') return
    state.lang = lang
    persistLang(lang)
    applyLang()
  }

  function setupLanguage() {
    document.querySelectorAll('.lang button').forEach((button) => {
      button.addEventListener('click', () => setLang(button.dataset.lang))
    })
  }

  /* ---------- 10. OPTIONS ---------- */
  function setupOptions() {
    $('opt-motion').addEventListener('change', (event) => {
      document.body.classList.toggle('no-motion', !event.target.checked)
    })
    $('opt-music').addEventListener('change', (event) => {
      window.MilkyMision.options.music = event.target.checked
    })
    $('opt-volume').addEventListener('input', (event) => {
      window.MilkyMision.options.volume = Number(event.target.value)
    })
  }

  /* ---------- 11. PUBLIC API + INIT ---------- */
  window.MilkyMision = {
    options: { music: true, volume: 60 },
    onStart: (data) => {
      const payload = { ...data, lang: state.lang }
      try {
        localStorage.setItem('milky-mission-selection', JSON.stringify(payload))
      } catch {
        /* Navigation still works if storage is unavailable. */
      }
      window.location.href = '../index.html#/design'
    },
  }

  state.lang = readStoredLang()
  state.mission = CONFIG.missions[0].id
  state.budget = randomBudget(current().budgetRange)

  buildStars()
  setupParallax()
  setupDialogs()
  setupOptions()
  setupLanguage()
  applyLang()
})()
