# AGENTS.md — instructions for AI collaborators

Read this file **before** writing a line of code. It is the shared contract between the
three human contributors and their AI agents. If something here conflicts with a request,
stop and ask the human.

Project: **MILKY MISSION** — space mission design simulator.
Team: Kessler Syndrome · with Laura.
Deadline: NASA Space Apps submission closes **Sunday 15 Nov 2026, 23:59**.

---

## 1. Read order (every session)

1. `docs/STATE.md` — checkpoint snapshot (updated by the integrator).
2. `docs/state/core.md`, `docs/state/experience.md` or `docs/state/data.md` — the live
   status of **your** track. Edit only yours.
3. `docs/CONTRACT.md` — engine API, units, invariants.
4. The document for your area:
   - Core → `docs/GAME_DATA.md` + `docs/NASA_DATA.md`
   - Experience → `docs/DESIGN_SYSTEM.md` + `docs/UI_TASKS.md`
   - Data & Content → `docs/GAME_DATA.md` + `docs/DATA_PROVENANCE.md`
   - Everyone → `docs/GAME_DESIGN.md`
5. If you are about to change a shared file, read section 3.

## 2. Ownership — hard boundaries

| Track | Owner | Write access |
|---|---|---|
| **A — Core & Simulation** | @Julcal008 | `src/engine/**`, `src/store/mission.ts`, `src/engine/__fixtures__/**`, engine tests, `docs/CONTRACT.md` |
| **B — Experience & Visual** | @AngelicaHueje707-glitch | `src/app/**`, `src/ui/**`, `src/styles/**`, `src/store/ui.ts`, `src/i18n/**`, `public/**`, `docs/DESIGN_SYSTEM.md` |
| **C — Data & Content** | @Metsus-S | `src/data/**`, `src/content/**`, `docs/GAME_DATA.md`, `docs/NASA_DATA.md`, `docs/DATA_PROVENANCE.md`, `docs/SUBMISSION_EN.md` |
| **Integrator** | @Julcal008 | `.github/**`, `package.json`, `package-lock.json`, `AGENTS.md`, `README.md`, `docs/STATE.md`, `docs/DECISIONS.md`, `docs/ARCHITECTURE.md` |

**Do not edit files outside your track.** If a change is required outside your track,
write it in your `docs/state/*.md` under "Blockers" and open a documentation-only PR so
the owner can act.

Track boundaries in one sentence: **Core computes, Experience renders, Data supplies.**

### UI sprint split (see `docs/UI_TASKS.md`)

For the final sprint, Track B is split by screen and file. Last match wins in CODEOWNERS.

| Owner | Files |
|---|---|
| @AngelicaHueje707-glitch | `App.tsx`, `Home.tsx`, `Brief.tsx`, `routes.ts`, `src/ui/menu/*`, `src/i18n/menu.*` |
| @Julcal008 | `screens/Design.tsx`, `screens/Review.tsx`, `src/ui/game/*`, `src/i18n/game.*`, `src/i18n/en.ts`, `src/i18n/es.ts` |
| @Metsus-S | `screens/Simulate.tsx`, `screens/Report.tsx`, `src/ui/ops/*`, `src/i18n/ops.*` |

`App.tsx` and `routes.ts` are Angelica's. Nobody edits another owner's screen or
i18n module. Shared primitives are frozen; create new components in your folder.

## 3. Shared-file protocol

| Shared file | Owner | Rule |
|---|---|---|
| `src/engine/types.ts` | A | Contract change: dedicated PR, fixtures updated, version bumped |
| `src/styles/tokens.css` | B | Announce in `docs/state/experience.md`; update `DESIGN_SYSTEM.md` |
| `src/store/mission.ts` | A | The only bridge between UI and physics |
| `package.json`, lockfile | Integrator | Ask before adding a dependency |
| `.github/**` | Integrator | CI, Pages, templates |
| `AGENTS.md`, `README.md` | Integrator | Announce first |
| `docs/STATE.md` | Integrator | Only the integrator edits it |

Never run a repository-wide formatter (`prettier --write .`) on a branch that is not
yours: it rewrites files you do not own and creates conflicts.

## 4. Git safety (non-negotiable)

These rules protect three people working in parallel. Breaking them can destroy work.

- **NEVER** run `git push --force`, `git push -f`, `git push --force-with-lease`,
  `git push --mirror`, `git push --delete` or any refspec with `+` or `:`.
  Force-pushing is blocked by repository protection on `main` and by OpenCode permissions.
- **NEVER** force-push to another contributor's branch or to any branch you did not create.
- **NEVER** delete a remote branch you do not own.
- **NEVER** run `git reset --hard`, `git clean -fdx`, `git checkout -- .`,
  `git restore --source` or `git branch -D` on shared history. Ask first.
- **NEVER** commit `node_modules`, `dist`, `.env`, tokens, credentials or personal keys.
- If a push is rejected, run `git pull --rebase origin main` **on your own branch**.
  Never "fix" a rejected push with force.
- If history must be rewritten for any reason, stop and ask the human.
- `git commit --no-verify` is forbidden without explicit human approval.

## 5. Track enforcement

Each clone declares its track once:

```bash
git config --local milky.track core                 # Track A
git config --local milky.track experience           # Track B
git config --local milky.track data                 # Track C
git config --local milky.track data,experience      # UI sprint (Track C helping B)
git config --local milky.track all                  # integrator only
git config --local core.hooksPath .githooks
```

`milky.track` accepts a comma-separated list. The hook combines the allowed paths
and rejects anything outside them.

The pre-commit hook (`scripts/check-track.mjs`) rejects any commit that touches a file
outside the configured track, with a message listing the allowed paths. This is not
advisory: it runs before every commit.

OpenCode additionally exposes three primary agents (`core`, `experience`, `data`) whose
edit permissions are restricted to their own paths. Select your track agent at the start
of the session. If the agent refuses an edit, that is correct: the file belongs to
another track. Do not work around it with shell commands.

## 6. Non-negotiable rules

1. **The engine is pure TypeScript.** No React, no DOM, no `localStorage`, no `fetch`.
2. **The UI never computes physics.** It reads `src/store/mission.ts` selectors or engine
   results.
3. **Units in names.** `massKg`, `powerW`, `energyWh`, `dataGbPerDay`, `rateMbps`,
   `costUsdM`, `altitudeKm`, `deltaVmS`.
4. **No magic numbers in components or engine.** Values come from `src/data/catalogs/`.
5. **Determinism.** The simulation receives a `seed`; never use `Math.random()` in the
   engine. Use the seeded PRNG.
6. **Every catalog value carries provenance** (`source` + `confidence`).
7. **English in code and docs.** Spanish lives only in `es.ts` and `content/**/es.ts`.
8. **No NASA branding.** No logos, insignia, flags or mission identifiers.
9. **Accessibility.** Status never color-only; keyboard reachable; reduced motion honored.
10. **Do not add dependencies casually.** Ask the integrator first.

## 7. Code style

- TypeScript strict, `verbatimModuleSyntax`: use `import type`.
- Functional components, named exports, one component per file.
- Prettier config is authoritative (no semicolons, single quotes, 100 columns).
- Comments explain **why**, not what. Formulas cite source and assumptions.
- Engine module header:

```ts
/**
 * POWER MODEL — solar generation, eclipse and battery state.
 * Owner: Track A
 * Inputs:  orbit, array, load profile
 * Outputs: power generated/consumed per day, state of charge
 * Invariants: SoC ∈ [0, capacityWh]; deficits reported, never clipped silently
 * Source: [citation or "simplified model, see docs/GAME_DATA.md"]
 */
```

- Markers: `TODO(@owner)`, `FIXME`, `NOTE`, `HACK` (with justification). No unowned TODOs
  on `main`.

## 8. Definition of done (every PR)

- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.
- [ ] New engine behavior has a test, including a validity test.
- [ ] Units explicit in every new number.
- [ ] Catalog changes update `docs/DATA_PROVENANCE.md`.
- [ ] Contract changes update `docs/CONTRACT.md` and fixtures.
- [ ] Your `docs/state/*.md` is current.
- [ ] No file outside your track was modified.
- [ ] English in code, comments and docs.

## 9. Branches, reviews, merge order

- Branches: `core/<topic>`, `exp/<topic>`, `data/<topic>`, `docs/<topic>`.
- Commits: `feat(engine): link budget`, `fix(ui): gauge overflow`, `data: shortlist launchers`.
- PR under 300 changed lines. One approval from another track + green CI.
- Review matrix: contract → A · components/tokens → B · catalogs/scenarios → C.
- **Merge order at every checkpoint: core → data → experience.** The UI must always see
  the freshest contract and data.
- Squash merge. `main` must always build.

## 10. Checkpoints

Merge and sync at **11:00, 12:30, 15:30, 16:40** (Saturday) and **10:45** (Sunday).
At each checkpoint:

1. Pull `main`, run typecheck + tests + build.
2. Two minutes per track: what landed, what is next.
3. Update your `docs/state/*.md`; the integrator updates `docs/STATE.md`.
4. Agree on the next two tasks per track.

If a track is blocked, say so in its state file immediately. Do not wait for the
checkpoint.
