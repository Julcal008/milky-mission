# AGENTS.md — instructions for AI collaborators

Read this file **before** writing a line of code. It is the shared contract between
the two human contributors and their AI agents. If something here conflicts with a
request, stop and ask the human.

Project: **MILKY MISSION** — space mission design simulator.
Team: Kessler Syndrome · with Laura.
Deadline: NASA Space Apps Challenge submission closes **Sunday 15 Nov 2026, 23:59**.

---

## 1. Read order (every session)

1. `docs/STATE.md` — what is being worked on right now, by whom, and what is blocked.
2. `docs/CONTRACT.md` — engine API, units, invariants.
3. The document for your area:
   - Engine work → `docs/GAME_DATA.md` + `docs/NASA_DATA.md`
   - UI work → `docs/DESIGN_SYSTEM.md`
   - Any work → `docs/GAME_DESIGN.md`
4. If you are about to change a shared file, re-read section 3 below.

## 2. Ownership — hard boundaries

| Track | Owner | Write access |
|---|---|---|
| **A — Simulation** | human A | `src/engine/**`, `src/data/**`, `src/**/*.test.ts`, `docs/GAME_DESIGN.md`, `docs/GAME_DATA.md`, `docs/NASA_DATA.md`, `docs/CONTRACT.md` |
| **B — Experience** | human B | `src/app/**`, `src/ui/**`, `src/styles/**`, `src/store/**`, `src/i18n/**`, `public/**`, `docs/DESIGN_SYSTEM.md`, `docs/STATE.md`, `docs/SUBMISSION_EN.md` |
| **Shared, owner-only** | | `src/engine/types.ts` → A · `src/styles/tokens.css` → B · `package.json` + `package-lock.json` → B · `README.md` → both, announce first |

**Do not edit files outside your track.** If you believe a change is required outside
your track, write it in `docs/STATE.md` under "Blockers" and open a PR that only
touches documentation, so the other human can decide.

## 3. Shared-file protocol

1. Announce the change in `docs/STATE.md` (one line, with the file name).
2. Open a small PR and tag the other contributor.
3. Wait for review if the other track is actively editing it.

Never run a repository-wide formatter (`prettier --write .`) on a branch that is not
yours: it rewrites files you do not own and creates conflicts.

## 4. Non-negotiable rules

1. **The engine is pure TypeScript.** No React, no DOM, no `localStorage`, no `fetch`.
   Everything the engine needs is passed in as an argument.
2. **The UI never computes physics.** It calls engine functions (or reads their
   results from the store) and renders them.
3. **Units in names.** `massKg`, `powerW`, `energyWh`, `dataGbPerDay`, `rateMbps`,
   `costUsdM`, `altitudeKm`, `deltaVmS`. No bare numbers with ambiguous units.
4. **No magic numbers in components.** Catalog values come from `src/data/catalogs/`.
5. **Determinism.** The simulation receives a `seed` and must produce identical
   results for identical inputs. Never use `Math.random()` inside the engine; use the
   seeded PRNG.
6. **Every catalog value carries provenance** (`source` + `confidence`). If a value is
   invented for balance, label it `game`. Never present an estimate as official.
7. **English in code and docs.** Comments, identifiers, commit messages, documentation,
   and UI copy in `en.ts` are English. Spanish lives only in `es.ts` and team chat.
8. **No NASA branding.** Do not use NASA logos, insignia, flags or mission identifiers
   in the product or in generated assets. Data attribution is text, not logos.
9. **Accessibility.** Status is never color-only. Interactive elements are reachable by
   keyboard. Respect `prefers-reduced-motion`.
10. **Do not add dependencies casually.** Ask first. The offline demo must stay small
    and buildable.

## 5. Code style

- TypeScript strict, `verbatimModuleSyntax`: use `import type` for types.
- Functional components, named exports, one component per file.
- Prettier config is authoritative (no semicolons, single quotes, 100 columns).
- Comments explain **why**, not what. Formulas cite their source and assumptions.
- File header for engine modules:

```ts
/**
 * POWER MODEL — solar generation, eclipse and battery state.
 * Owner: Track A
 * Inputs:  orbit, array, load profile
 * Outputs: power generated/consumed per day, state of charge
 * Invariants: SoC ∈ [0, capacityWh]; deficits are reported, never clipped silently
 * Source: [citation or "simplified model, see docs/GAME_DATA.md"]
 */
```

- Markers: `TODO(@owner)`, `FIXME`, `NOTE`, `HACK` (with justification). A `TODO`
  without an owner is not allowed on `main`.

## 6. Definition of done (every PR)

- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] New engine behavior has a test (including a validity test: monotonicity,
      bounds or conservation).
- [ ] Units are explicit in every new number.
- [ ] If a catalog value was added or changed, `docs/DATA_PROVENANCE.md` is updated.
- [ ] If a shared type changed, `docs/CONTRACT.md` and fixtures are updated.
- [ ] `docs/STATE.md` updated (done / in progress / next).
- [ ] No file outside your track was modified.

## 7. Commit and PR conventions

- Branches: `a/<topic>`, `b/<topic>`, or `docs/<topic>`.
- Commits: `feat(engine): link budget`, `fix(ui): gauge overflow`, `docs: decisions`.
- PR under 300 changed lines. Description: what changed, why, how to test, shared files touched.
- Squash merge. `main` must always build.

## 8. Checkpoints

Merge and sync at **11:00, 12:30, 15:30, 16:40** (Saturday) and **10:45** (Sunday).
At each checkpoint: pull, run typecheck + tests + build, update `docs/STATE.md`,
and confirm the next two tasks with the other human.
