# MILKY MISSION

> **Design the mission. Live with the consequences.**

A space mission design and simulation game built for the **NASA Space Apps Challenge 2026 — Neiva, Colombia**.

You get an objective, a budget and one launch. You choose the orbit, the launch vehicle, the spacecraft bus, the power system, the communications and up to four scientific instruments. Then you simulate twelve months of mission life, make decisions when things go wrong, and find out what your engineering trade-offs were really worth.

**Team:** Kessler Syndrome · **with Laura**
**Challenge:** [Space Mission Design Game](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/)

---

## Status

**Phase 0 — Foundation.** This repository currently contains the collaboration scaffold: build tooling, design system, engine contract, documentation and CI. Game logic comes next, in this order:

1. Engine contract and fixtures (types are frozen first).
2. Mission design board with live resource validation.
3. Simulation timeline, events and role-based decisions.
4. Score, mission report and sharing.

See [`docs/STATE.md`](docs/STATE.md) for the live status and who owns what.

## Stack

| Layer | Choice |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 + design tokens |
| State | Zustand |
| Tests | Vitest |
| Hosting | GitHub Pages (static, no backend) |

The game is **offline-first**: NASA datasets are cached at build time and fonts are bundled locally. Nothing in the demo depends on live network access.

## Quickstart

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # engine unit tests
npm run typecheck    # TypeScript project references
npm run build        # production build in dist/
```

Internal design system: `http://localhost:5173/#/styleguide`

## Repository map

```
src/
  app/      Shell, routing, screens (Track B)
  ui/       Reusable primitives: Button, Badge, Panel, ResourceBar (Track B)
  styles/   Design tokens and global CSS (Track B)
  store/    UI state only (Track B)
  i18n/     English + Spanish dictionaries
  engine/   Pure TypeScript simulation core (Track A)
  data/     Cached NASA datasets and catalogs (Track A)
docs/       Architecture, contract, design, game data, provenance, submission
```

## Working together

Two people, two AI agents, one repository. Read [`AGENTS.md`](AGENTS.md) before writing code and [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a pull request. The short version:

- **Track A owns `src/engine/` and `src/data/`.** Track B owns `src/app/`, `src/ui/`, `src/styles/` and `src/store/`.
- The engine is pure TypeScript: no React, no DOM.
- The UI never computes physics: it reads engine results.
- Units live in the variable name (`massKg`, `powerW`, `costUsdM`).
- Every catalog value is labelled `official`, `derived`, `estimate` or `game`.

## Documentation

| Document | Purpose |
|---|---|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Layers, data flow, boundaries |
| [CONTRACT.md](docs/CONTRACT.md) | Engine API, units and invariants |
| [GAME_DESIGN.md](docs/GAME_DESIGN.md) | Loop, roles, decisions, scoring |
| [GAME_DATA.md](docs/GAME_DATA.md) | Catalogs, scenarios and balance targets |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Palette, type and components |
| [NASA_DATA.md](docs/NASA_DATA.md) | Datasets, endpoints and caching |
| [DATA_PROVENANCE.md](docs/DATA_PROVENANCE.md) | Source and confidence per value |
| [STATE.md](docs/STATE.md) | Current work, owners and blockers |
| [DECISIONS.md](docs/DECISIONS.md) | Why we chose what we chose |
| [SUBMISSION_EN.md](docs/SUBMISSION_EN.md) | Submission checklist and English copy |

## License

MIT — see [LICENSE](LICENSE). NASA data and imagery are used under their public-domain terms and credited in [docs/DATA_PROVENANCE.md](docs/DATA_PROVENANCE.md). This project is not affiliated with or endorsed by NASA.
