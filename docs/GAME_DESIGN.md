# Game design — MILKY MISSION

**Pitch.** A cooperative mission design simulator where one to four players spend a real
budget, build a real spacecraft from real NASA data, and then live with the consequences
for a full year of operations.

**Tagline.** Design the mission. Live with the consequences.

**Session length.** 10–15 minutes per mission attempt. Replaying is the point: the game
is about iterating on a design after seeing it fail.

---

## 1. Design pillars

1. **Every decision has a price.** No upgrade is free. Mass, power, data, cost and time
   are coupled by construction.
2. **The simulation is the teacher.** The game never says "wrong"; it shows what
   happened and why.
3. **There is no single perfect mission.** At least three valid architectures can satisfy
   the same objective.
4. **Failure is informative.** A failed mission produces a report worth reading, not a
   game-over screen.
5. **Real data, honest labels.** NASA datasets drive scenarios; every number is marked
   official, derived, estimate or game.

## 2. Players and modes

| Mode | Description |
|---|---|
| **Solo** | One player controls all four roles. Team score is replaced by extra efficiency. |
| **Team (2–4)** | One shared screen. Each player claims a role. Turns pass explicitly. |

There is **no split screen and no networking**. The team plays on one device: the active
role makes the decision, the others watch and negotiate. This keeps the demo reliable
and makes the negotiation visible to judges.

### Roles

| Role | Real-world analogue | Personal objective | Power token |
|---|---|---|---|
| **Mission Director** | Project Manager | Finish within budget and schedule | Reallocate 5 % of the budget |
| **Systems Engineer** | Systems Engineer | Keep mass and power margins ≥ 20 % | Accept a mass waiver |
| **Science Lead** | Principal Investigator | Maximize science return and coverage | Force one observation cycle |
| **Comms & Ops** | Mission Operations | Deliver data with no loss | Request one extra ground pass |

Each role has **2 tokens per mission** (roadmap). The current build implements explicit
role handoff: the active player dock shows who owns each role, and the decision modal
locks until control passes to the role that owns the event. Tokens are not yet active.

## 3. Mission flow

```
BRIEF → CONTRACT → DESIGN → REVIEW → SIMULATE → REPORT → (redesign)
```

### 3.1 Brief
Scenario card with a short English brief, budget, lifetime, launch window and the
historical NASA event that drives the simulation (e.g. the May 2024 G5 storm).

### 3.2 Contract
The team selects **3 of 6 requirements** (5 in the second scenario). Each has a weight.
Harder requirements pay more but constrain the design. This teaches requirement
definition and creates the first negotiation.

### 3.3 Design
Five panels, one shared board:

1. **Orbit & launch** — orbit preset, altitude slider, launch vehicle.
2. **Spacecraft bus** — bus class, propulsion.
3. **Power** — array technology, area, battery.
4. **Communications** — band, ground network, storage.
5. **Science** — up to 4 instruments in slots.

Live budgets update on every change. The UI shows warnings, never blocks (except
physically impossible combinations, which are errors).

### 3.4 Review
A checklist per chosen requirement, with pass / partial / fail and an explanation.
Each role signs off. The Director may accept risks; the report will remember them.

### 3.5 Simulation
365 days compressed into a **~75-second animated timeline** with speeds 1×, 2×, 4× and
a "skip to next event" button. Each event is addressed to a role, who chooses an option.
The others see the consequence immediately.

### 3.6 Report
Score breakdown, grade, badges, requirement results, and a **causal chain**: the ordered
sequence of decisions that led to the outcome. Plus "what would have happened if…"
suggestions (e.g. "S-band could not downlink the UV imager; X-band would have delivered
94 %").

## 4. Resources

| Resource | Shown as | Consequence of running out |
|---|---|---|
| **Mass** | kg vs launcher capacity | Cannot launch |
| **Power** | W generated vs load | Instruments shed, safe mode, missed science |
| **Energy** | Wh in battery vs eclipse demand | Eclipse blackout, lost observations |
| **Budget** | $M vs scenario budget | Cannot afford the design; validation error |
| **Data** | Gb/day generated vs downlinked | Buffer overflow, science lost |
| **Link** | Mbps and passes/day | Limits data delivery |
| **Time** | Days of mission life | Mission ends early |

## 5. Scoring (1000 points)

| Component | Points | What rewards it |
|---|---|---|
| Mission success | 300 | Chosen requirements met (partial credit allowed) |
| Science return | 250 | Instrument value × data delivered × coverage |
| Efficiency | 200 | Mass margin, power margin, cost underrun |
| Robustness | 150 | Reliability and how anomalies were handled |
| Teamwork | 100 | Role objectives and consensus decisions (solo: folded into efficiency) |

Grades: **S** ≥ 900, **A** 800–899, **B** 700–799, **C** 600–699, **D** < 600.
A mission with no primary requirement met is a **failure**, regardless of score.

## 6. Difficulty

| Level | Events | Notes |
|---|---|---|
| Cadet | 3 | Fundamentals, fewer critical events |
| Engineer | 5 | Full role mix, nominal balance |
| Flight Director | 7 | More critical variants and advanced roles |

Difficulty is stored in the mission config and share link. The event scheduler keeps
the real NASA DONKI CME/flare days as anchors but selects role-specific challenge
variants, so two missions with different seeds do not tell the same story.

## 7. Educational layer

- **"Show the math"** on every number: formula, inputs, source and confidence label.
- **"Why?"** cards after each event: one paragraph in plain language.
- **Glossary**: 12 terms (margin, Δv, duty cycle, downlink, swath, revisit, TRL, DoD,
  eclipse, SSO, link budget, radiation dose).
- **Post-mission report** explains causes, not just results.
- No prior space knowledge is assumed: the brief and tooltips teach the minimum needed.

## 8. Presentation and accessibility

- Single screen at 1440×900; usable from 1024 px.
- Keyboard-navigable, visible focus, status never color-only.
- English default, full Spanish toggle.
- Presentation density mode for the live pitch.
- Reduced-motion support; no essential information conveyed by animation.

## 9. Scope

**In:** two scenarios, four roles, deterministic simulation, live validation, causal
report, shareable mission link, EN/ES, offline operation.

**Out:** online multiplayer, accounts, 3D, leaderboards, sound design, planetary defense
scenario, more than ten instruments.

## 10. How the design maps to the judges

| Criterion | Where it shows |
|---|---|
| **Impact** | Local scenario (Magdalena floods) and space-weather awareness; classroom-ready |
| **Creativity** | Role tokens, negotiation under constraints, causal report, real-data scenarios |
| **Validity** | Real physics, cited formulas, provenance labels, validity tests |
| **Relevance** | DONKI and POWER drive mechanics, not decoration |
| **Presentation** | Single-screen demo, 75-second simulation, clear failure narrative |
