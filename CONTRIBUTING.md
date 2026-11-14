# Contributing — three tracks, one repository

Three contributors (plus their AI agents) are building this in about 48 hours. Optimize
for **small, reversible, non-overlapping changes**.

> **Windows contributors:** follow [`docs/SETUP_WINDOWS.md`](SETUP_WINDOWS.md) first.

## 0. One-time setup in your clone

Declare your track and enable the guard hook:

```bash
git config --local milky.track core          # Track A
git config --local milky.track experience    # Track B
git config --local milky.track data          # Track C
git config --local milky.track all           # integrator only
git config --local core.hooksPath .githooks
```

From that moment, **every commit is checked**: the hook rejects files outside your track
and prints the allowed paths. This is enforcement, not advice.

## 1. Tracks and ownership

| Track | Owner | Scope | Owns |
|---|---|---|---|
| **A — Core & Simulation** | @Julcal008 | Physics, catalogs consumer, scoring, determinism, fixtures | `src/engine/**`, `src/store/mission.ts`, `docs/CONTRACT.md` |
| **B — Experience & Visual** | @AngelicaHueje707-glitch | Shell, screens, components, map, charts, i18n, accessibility | `src/app/**`, `src/ui/**`, `src/styles/**`, `src/store/ui.ts`, `src/i18n/**`, `public/**`, `docs/DESIGN_SYSTEM.md` |
| **C — Data & Content** | @Metsus-S | NASA data, catalogs, scenarios, educational copy, provenance, submission text | `src/data/**`, `src/content/**`, `docs/GAME_DATA.md`, `docs/NASA_DATA.md`, `docs/DATA_PROVENANCE.md`, `docs/SUBMISSION_EN.md` |
| **Integrator** | @Julcal008 | Repo plumbing, CI/Pages, merges, dependencies, shared docs | `.github/**`, `package.json`, lockfile, `AGENTS.md`, `README.md`, `docs/STATE.md`, `docs/DECISIONS.md`, `docs/ARCHITECTURE.md` |

One sentence: **Core computes, Experience renders, Data supplies.**

`src/engine/types.ts` is owned by A. `src/styles/tokens.css` by B. `package.json` by the
integrator. Announce before editing any shared file.

## 2. Branch and PR flow

```bash
git switch -c exp/design-board
# work, commit small
git pull --rebase origin main
git push -u origin exp/design-board
gh pr create --fill
```

- Branch prefixes: `core/`, `exp/`, `data/`, `docs/`.
- Branches live less than a few hours.
- PRs under 300 changed lines. Bigger work is split.
- One approval from a **different track** is required, plus green CI.
- Squash merge and delete the branch.

### Review matrix

| Change touches | Required reviewer |
|---|---|
| `types.ts`, engine API, invariants | A |
| Components, tokens, layouts, i18n | B |
| Catalogs, scenarios, NASA data, provenance | C |
| CI, dependencies, repo settings | Integrator (A) |

If the required reviewer is unavailable, the integrator may review, but the contract
owner must be tagged.

## 3. Commit messages

`type(scope): summary` in imperative English.

```
feat(engine): add eclipse fraction model
fix(ui): clamp mass gauge at zero
data: cache DONKI May 2024 events
docs: record decision to drop Ariane 62
test(engine): cover link budget monotonicity
```

## 4. Merge order at every checkpoint

**core → data → experience.**

1. Core lands contract/type changes first.
2. Data lands catalogs and scenarios against the new contract.
3. Experience lands UI against the freshest contract and data.

This order prevents the UI from building against stale shapes.

## 5. Conflict protocol

If two tracks need the same file:

1. Stop.
2. Write it in your `docs/state/*.md` → "Blockers" (with the file name).
3. The file's owner makes the change; the requester reviews.
4. The change lands in a dedicated PR before other work continues.

Merge conflicts are resolved by hand, never by accepting one side wholesale. Run
`npm run typecheck && npm test && npm run build` afterwards.

## 6. State files (no conflicts)

Each track has its own live status file:

- `docs/state/core.md` → Track A
- `docs/state/experience.md` → Track B
- `docs/state/data.md` → Track C

Only the owner edits their file. The integrator maintains `docs/STATE.md` as a checkpoint
snapshot. During work, use the state file; at checkpoints, the snapshot.

## 7. Checkpoints

| When | Goal |
|---|---|
| Sat 11:00 | Contract + base catalogs frozen |
| Sat 12:30 | Engine integrated into the design screen |
| Sat 15:30 | Full flow working end to end |
| Sat 16:40 | Scope frozen for Sunday |
| Sun 10:45 | Feature freeze; fixes only |
| Sun 14:00 | Project submitted |

At each checkpoint: pull `main`, run the full check, 2 minutes per track, update state,
agree on the next two tasks.

## 8. Definition of done

- `npm run typecheck`, `npm test` and `npm run build` pass.
- New engine logic has tests, including at least one validity test.
- Numbers carry units in their names.
- Catalog changes update `docs/DATA_PROVENANCE.md`.
- Contract changes update `docs/CONTRACT.md` and fixtures.
- No file outside your track changed (the hook enforces it).
- Your state file is current.

## 9. Git safety

- **Never** force-push (`--force`, `-f`, `--force-with-lease`) to `main`, to another
  person's branch, or to a branch you did not create.
- **Never** delete remote branches you do not own.
- **Never** `git reset --hard`, `git clean -fdx`, `git checkout -- .` or `git branch -D`
  on shared history. Ask first.
- Never commit `node_modules`, `dist`, `.env`, tokens or credentials.
- A rejected push means `git pull --rebase origin main` on your own branch. Never force.
- `git commit --no-verify` requires explicit human approval.
- OpenCode blocks force-push, mirror, branch deletion, `reset --hard`, `clean -f` and
  `rm -rf` at the permission layer. If a command is refused, do not try to bypass it.

## 9. Data honesty

Every catalog value is labelled:

| Label | Meaning |
|---|---|
| `official` | Published by NASA, ESA, a manufacturer or a peer-reviewed source |
| `derived` | Computed from official data with a stated method |
| `estimate` | Engineering estimate with a stated range |
| `game` | Chosen for balance; not a real-world claim |

Never present an estimate as official. The in-game "Show the math" panel and
`docs/DATA_PROVENANCE.md` must agree.

## 10. Content and legal rules (NASA Space Apps)

- Project page, demo and submitted text in **English**.
- AI-generated images/videos need a visible watermark and must not include NASA logos,
  flags or mission identifiers.
- Do not include recognizable minors in any media.
- Credit every NASA dataset and image used.
- Re-submit the project after any edit; saving progress is not submitting.
