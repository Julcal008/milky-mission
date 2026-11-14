# Contributing — two people, one repository

We are two contributors (plus our AI agents) building this in about 48 hours. Optimize
for **small, reversible, non-overlapping changes**.

## 1. Tracks

| Track | Scope | Owns |
|---|---|---|
| **A — Simulation** | Physics, catalogs, scenarios, scoring, tests | `src/engine/**`, `src/data/**`, `docs/CONTRACT.md`, `docs/GAME_DATA.md`, `docs/NASA_DATA.md` |
| **B — Experience** | Screens, components, tokens, i18n, persistence, submission copy | `src/app/**`, `src/ui/**`, `src/styles/**`, `src/store/**`, `src/i18n/**`, `public/**`, `docs/DESIGN_SYSTEM.md`, `docs/STATE.md`, `docs/SUBMISSION_EN.md` |

`src/engine/types.ts` is owned by A. `docs/STATE.md` is owned by B. `README.md` and
`package.json` are shared: announce before editing.

## 2. Branch and PR flow

```bash
git switch -c b/ui-design-board
# work, commit small
git pull --rebase origin main
git push -u origin b/ui-design-board
gh pr create --fill
```

- Branches live less than a few hours.
- PRs are under 300 changed lines. If it is bigger, split it.
- One approval is required. If the other contributor is not available, self-merge is
  allowed **only** when CI is green and no shared file is touched.
- Squash merge, delete the branch.

## 3. Commit messages

`type(scope): summary` in imperative English.

```
feat(engine): add eclipse fraction model
fix(ui): clamp mass gauge at zero
docs: record decision to drop Ariane 62
test(engine): cover link budget monotonicity
```

## 4. Pull request checklist

The PR template asks for:

1. What changed and why.
2. How to test it (commands or a route).
3. Shared files touched.
4. Screenshot for UI changes.

## 5. Conflict protocol

If both contributors need the same file:

1. Stop.
2. Write one line in `docs/STATE.md` → "Blockers".
3. One person makes the change; the other reviews.
4. The change lands in a dedicated PR before any other work continues.

If a merge conflict happens anyway: resolve it by hand, never by accepting one side
wholesale. Run `npm run typecheck && npm test && npm run build` after resolving.

## 6. Checkpoints

| When | What |
|---|---|
| 11:00 | Contract frozen; UI shell running |
| 12:30 | Engine integrated into the design screen |
| 15:30 | Simulation + review flow working end to end |
| 16:40 | Scope frozen for Sunday |
| Sunday 10:45 | Feature freeze; only fixes |

At each checkpoint: pull `main`, run the full check, update `docs/STATE.md`, agree on
the next two tasks.

## 7. Definition of done

- `npm run typecheck`, `npm test` and `npm run build` pass.
- New engine logic has tests, including at least one validity test.
- Numbers carry units in their names.
- Catalog changes update `docs/DATA_PROVENANCE.md`.
- Contract changes update `docs/CONTRACT.md`.
- No file outside your track changed.
- `docs/STATE.md` is current.

## 8. Data honesty

Every value in a catalog is labelled:

| Label | Meaning |
|---|---|
| `official` | Published by NASA, ESA, a manufacturer or a peer-reviewed source |
| `derived` | Computed from official data with a stated method |
| `estimate` | Engineering estimate with a stated range |
| `game` | Chosen for balance; not a real-world claim |

Never present an estimate as official. The in-game "Show the math" panel and
`docs/DATA_PROVENANCE.md` must agree.

## 9. Content and legal rules (NASA Space Apps)

- Project page, demo and submitted text must be in **English**.
- AI-generated images/videos need a visible watermark and must not include NASA logos,
  flags or mission identifiers.
- Do not include recognizable minors in any media.
- Credit every NASA dataset and image used.
- Re-submit the project after any edit; saving progress is not submitting.
