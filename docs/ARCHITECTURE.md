# Architecture

Milky Mission is a **deterministic simulation** wrapped in a single-screen interface.
The architecture exists to guarantee three things:

1. The physics is testable without a browser.
2. Three people can work in parallel without waiting for each other.
3. The same mission configuration always produces the same result.

---

## 1. Layers

```
┌──────────────────────────────────────────────────────────────┐
│  UI (src/app, src/ui)                                        │
│  Screens, components, i18n, accessibility. No physics.       │
└───────────────▲──────────────────────────────┬───────────────┘
                │ results                      │ actions
┌───────────────┴──────────────────────────────▼───────────────┐
│  STORE (src/store)                                           │
│  Mission config + selectors (A) · UI state (B).              │
└───────────────▲──────────────────────────────┬───────────────┘
                │ derived data                 │ config
┌───────────────┴──────────────────────────────▼───────────────┐
│  ENGINE (src/engine) — pure TypeScript                       │
│  mass · orbit · power · link · data · cost · reliability ·   │
│  score · simulator                                           │
└───────────────▲──────────────────────────────┬───────────────┘
                │ typed catalogs               │
┌───────────────┴──────────────────────────────▼───────────────┐
│  DATA & CONTENT (src/data, src/content)                      │
│  catalogs/*.ts · nasa/*.json (cached) · provenance · copy     │
└──────────────────────────────────────────────────────────────┘
```

**Hard rules**

- `engine` imports only from `engine` and `data` (types/constants). Never React.
- `ui` never imports a formula. It calls a selector or an engine function.
- `data` and `content` are static JSON/TS plus provenance. No runtime network calls.
- The store is the only place that mutates state; it calls the engine, not the UI.
- One owner per directory: A computes, B renders, C supplies.

## 2. Mission lifecycle

```
MissionConfig ──validate──▶ ValidationResult ──simulate──▶ SimulationResult ──▶ Report
      ▲                                                        │
      └──────────────── player edits config ◀──────────────────┘
```

1. **Design:** the player edits `MissionConfig`. The UI recomputes derived budgets on
   every change (mass, power, link, cost) and shows warnings immediately.
2. **Review:** `validateMission()` returns blocking issues (e.g. mass > launcher
   capacity) and warnings (e.g. margin < 20 %). Warnings never block launch: the player
   can accept risk, which is part of the game.
3. **Simulate:** `simulateMission(config, seed)` runs 365 daily steps and returns day
   states, events, requirement results and a score.
4. **Report:** the UI renders the result with the causal chain of failures.

## 3. Determinism

- `MissionConfig` includes `seed`.
- The engine uses a seeded PRNG (xorshift32 or mulberry32) created at the start of the
  simulation. `Math.random()` is forbidden inside `src/engine`.
- Event order is stable: events are sorted by `(day, id)`.
- No Date.now(), no locale-dependent formatting, no floating-point accumulation across
  runs. Rounding happens only at the presentation boundary.
- The share link encodes the full config (including difficulty), seed, decisions and
  player count, so a shared mission reproduces.

## 4. Persistence and sharing

| Need | Mechanism |
|---|---|
| Continue a design after reload | `localStorage` (`milky-design`) |
| Share a mission | base64url JSON in the URL hash (`#/m/<code>`) |
| Export for judges | JSON download + PNG mission card (optional, stretch) |

No backend, no accounts. This is a deliberate scope decision: the demo must work on a
laptop with no network.

## 5. Offline-first data

- NASA datasets are fetched once, during development, and committed as JSON in
  `src/data/nasa/`.
- Each file records `source`, `endpoint`, `consultedAt` and the fields used.
- The base map is a bundled NASA image, not live map tiles.
- If a live endpoint were unavailable at demo time, the game behaves identically.

## 6. Rendering and performance

- Target 60 fps for the orbit map: SVG, no WebGL, no 3D.
- Simulation results are computed once and memoized; scrubbing the timeline only reads
  precomputed `DayState[]`.
- Budget for the demo: first paint < 1.5 s on a mid-range laptop, JS < 400 KB gzipped.
- Charts are rendered only for the visible phase.

## 7. Internationalization

- `src/i18n/en.ts` and `es.ts`, typed by `Dictionary`.
- English is the default and the submission language.
- Spanish is a full translation of UI and scenario copy, not a partial one.
- Numbers use `en-US` formatting in both languages (units are English in the domain).

## 8. Accessibility

- Keyboard reachable; visible focus ring (`--color-ion`).
- Status uses icon + text, never color alone.
- `prefers-reduced-motion` disables timeline and gauge animations.
- Minimum contrast 4.5:1 for body text.
- Presentation mode (`data-density="presentation"`) scales the root font for projectors.

## 9. Testing strategy

| Level | What it proves |
|---|---|
| Unit | Each formula matches a hand-computed case |
| Validity | Monotonicity and bounds: more mass → more cost; more distance → lower rate; score ∈ [0, 1000] |
| Balance | The reference mission scores 800–860; a naive mission scores 500–650 |
| Determinism | Same config + seed → identical JSON output |
| Contract | Fixtures stay valid when types change |

## 10. Delivery

- `main` deploys to GitHub Pages via Actions.
- Build output is static; `base: './'` keeps it portable.
- CI runs typecheck, tests and build on every PR.

## 11. File map

```
src/
  app/        App shell, Home, Styleguide, future screens (Brief, Design, Review, Simulate, Report)
  ui/         Button, Badge, Panel, ResourceBar, LogoMark, future Gauge/Map/Timeline
  styles/     tokens.css, global.css
  store/      ui.ts (Track B), future mission.ts (Track A)
  i18n/       en.ts, es.ts, index.ts (interface copy, Track B)
  engine/     types.ts, units.ts, future mass.ts, orbit.ts, power.ts, link.ts, data.ts,
              cost.ts, reliability.ts, score.ts, simulator.ts, prng.ts (Track A)
  data/       catalogs/*.ts, nasa/*.json, provenance (Track C)
  content/    scenarios, requirements, glossary, report copy in EN/ES (Track C)
docs/
```
