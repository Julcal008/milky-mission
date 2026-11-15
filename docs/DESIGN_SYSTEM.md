# Design system — "Mission Control Dark"

Owner: Track B (Experience & Visual).

One dark theme, one warm accent, dense data, no decoration without meaning. The UI
should feel like a mission control console at 3 a.m., not a sci-fi movie.

**Brand:** MILKY MISSION · *Design the mission. Live with the consequences.*
**Team:** Kessler Syndrome · with Laura

Implementation: [`src/styles/tokens.css`](../src/styles/tokens.css) and
[`src/styles/global.css`](../src/styles/global.css). Live reference: `#/styleguide`.

---

## 1. Palette

### Base

| Token | Hex | Usage |
|---|---|---|
| `bg` | `#070A12` | Page background |
| `surface` | `#0D1320` | Cards and panels |
| `surface-2` | `#131B2C` | Nested surfaces, hover |
| `border` | `#223049` | 1 px borders and dividers |
| `border-strong` | `#2F4263` | Hover borders, selected outlines |
| `ink` | `#E9EEF8` | Primary text (≈15:1 on bg) |
| `ink-2` | `#A7B3C9` | Secondary text (≈7:1) |
| `ink-3` | `#7B8AA3` | Metadata, placeholders (≈5.3:1 on surface) |

### Brand

| Token | Hex | Usage |
|---|---|---|
| `milk` | `#F4E3C1` | Primary action, logo accent, selection |
| `milk-strong` | `#FFD79A` | Primary hover / active |
| `ion` | `#6EA8FF` | Data, links, focus ring |

### Semantic

| Token | Hex | Usage |
|---|---|---|
| `success` | `#3DDC97` | Requirement met, healthy margin |
| `warning` | `#FFC857` | Margin below threshold, partial |
| `danger` | `#FF6B6B` | Blocking error, mission failure |
| `info` | `#6EA8FF` | Neutral informational state |

### Player roles

| Role | Hex |
|---|---|
| Mission Director | `#F5B84C` |
| Systems Engineer | `#6EA8FF` |
| Science Lead | `#C084FC` |
| Comms & Ops | `#2DD4BF` |

### Mission resources

| Resource | Hex |
|---|---|
| Mass | `#FF8A5B` |
| Power | `#FFD166` |
| Budget | `#3DDC97` |
| Data | `#6EA8FF` |
| Link | `#2DD4BF` |
| Time | `#C084FC` |

Resource colors and role colors overlap intentionally: context (gauge vs. avatar)
disambiguates them, and every element carries a text label.

### Solarpunk accent palette (additive)

The start menu introduces the user-provided palette. Tokens are additive: existing
semantic tokens keep their values until the full remap lands.

| Token | Hex | Usage |
|---|---|---|
| `jade` | `#529D7B` | Growth, success, orbital accents |
| `indigo` | `#3D5588` | Night sky, orbital arcs, structure |
| `plum` | `#5B3365` | Depth, science accents |
| `mauve` | `#B4567C` | Warm secondary accent |
| `coral` | `#EC816B` | Primary hover, warning, energy |
| `cream` | `#F4D08B` | Sunlight, primary action, wordmark |
| `on-primary` | `#141013` | Text on cream/coral surfaces |

Contrast on `bg`: cream 13.4:1, coral 7.5:1, jade 6.1:1, mauve 4.3:1, indigo 2.7:1,
plum 2.0:1. Use indigo and plum for fills and lines, never for body text.

---

## 2. Typography

| Role | Family | Weight | Size |
|---|---|---|---|
| Display | Space Grotesk Variable | 600–700 | 32–48 px |
| Headings | Space Grotesk Variable | 600 | 24–32 px |
| Body | Inter Variable | 400–500 | 15 px |
| Small | Inter Variable | 400 | 13 px |
| Label caps | Space Grotesk Variable | 600 | 11 px, +0.12em, uppercase |
| Numbers | JetBrains Mono Variable | 500 | 11–14 px, tabular |

Rules:

- Numbers are **always** `.num` (tabular figures) with their unit visible.
- Never center long paragraphs; max 70 characters per line.
- Letter-spacing is only applied to display and label-caps text.

---

## 3. Space and shape

| Token | Value |
|---|---|
| Spacing base | 4 px |
| Scale | 4, 8, 12, 16, 24, 32, 48, 64 |
| Radius sm | 4 px (chips, badges) |
| Radius md | 8 px (inputs, buttons) |
| Radius lg | 12 px (panels) |
| Radius xl | 16 px (modals) |
| Border | 1 px solid `border` |
| Focus ring | 2 px `ion`, 2 px offset |

Shadows: only modals and dropdowns, `0 8px 24px rgba(0,0,0,0.35)`. No glows on text.

Background: two very low-opacity radial gradients (`.space-bg`), blue top-left, violet
bottom-right, ≤10 % opacity. A 4 % grid (`.grid-bg`) is allowed only in map and
visualization areas.

---

## 4. Components

### Buttons

| Variant | Use | Appearance |
|---|---|---|
| Primary | One per screen | Milk background, dark text |
| Secondary | Most actions | Surface-2, 1 px border |
| Ghost | Tertiary / cancel | Text only |
| Danger | Destructive / abort | Danger tint, danger border |

Heights: 32 px (sm) and 40 px (md). Disabled: 40 % opacity, no pointer events.

### Badges

Neutral, success, warning, danger, info. Always with text. Never the only indicator of
status — pair with an icon in the app shell.

### Panels

Surface background, 1 px border, radius 12 px, 24 px padding. A panel is the only card
container. No nested cards beyond one level.

### Resource bars

Label (caps), value/max in mono, 6 px track, resource-colored fill, optional status line.
The bar is `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.

### Role dock

Four role chips at the bottom of the mission board. Active role: role-colored border,
role-colored dot, role name in `ink`. Inactive: `ink-3`. Handoff is an explicit button,
never an automatic switch.

### Gauges and charts

- Gauges show one value against a maximum; the maximum is always visible.
- Charts use the resource colors, a 1 px baseline, no grid lines except a faint
  horizontal at 0 % and 100 %.
- Tooltips follow the pointer, never cover the value.

### Map

- Bundled NASA base image, darkened to match the theme.
- Ground track: 1.5 px `ion`, dashed.
- Swath: `ion` at 18 % fill, 1 px border.
- Target region: `warning` outline, 2 px.
- Ground station: `comms` dot with a 10° elevation cone, dashed.
- Graticule: 1 px white at 4 %.

### Start screen

- Landscape and desktop: primary action on the left, wordmark on the right.
- Portrait: wordmark, primary action and tagline stack automatically.
- Above the wordmark: a small caps eyebrow with the event context
  (`NASA Space Apps Challenge 2026 · Neiva`).
- Wordmark: Fredoka 700, moving pink → yellow → cyan → violet gradient (8 s), soft
  blue glow. Reduced motion stops the shine.
- Backdrop: ported solarpunk scene (deterministic starfield, moon, six planets, two
  satellites and Earth). Decorative only: `aria-hidden`, `pointer-events-none`, and
  animations disabled under reduced motion.
- One primary action only; it opens the Brief screen (`#/brief`).

### Brief

- Two scenario cards from `src/content/scenarios`: Storm Watch and Andes Flood Watch.
- Cards stretch to equal height; the stat row sits on the card baseline.
- Rounded menu pass: scenario cards and the bottom panel use `rounded-3xl`; the selected
  badge is a pill; the player selector uses 40 px circles (`size-10 rounded-full`).
- Selected card: jade border/tint plus a visible check and “Selected” label, never color
  alone.
- Stats: budget, duration, launch window and requirement count from the scenario spec.
- Players 1–4; one shared screen, turns pass explicitly.
- One primary action: “Start mission”. Full width on mobile, auto on desktop. It writes
  the scenario and player count to the mission store, then opens the design screen.
- No fictional materials or roles here: design choices happen on the board.

---

## 5. Logo

Planet + orbit + one warm point at apogee. Always with the wordmark in the header.
Minimum size 24 px. Never place the logo on a light photographic background. Never use
NASA logos, insignia or flags.

---

## 6. Motion

| Element | Duration | Easing |
|---|---|---|
| Hover / focus | 150 ms | ease-out |
| Panels and modals | 200 ms | `cubic-bezier(.2,.8,.2,1)` |
| Gauges | 400 ms | ease-out |
| Timeline playhead | 1 day per tick | linear |

Respect `prefers-reduced-motion`: durations collapse to 0.01 ms, timeline jumps to the
next event instead of animating.

---

## 7. Accessibility

- Body contrast ≥4.5:1; large text ≥3:1.
- Focus visible on every interactive element.
- Status always icon + text.
- Hit targets ≥32×32 px.
- Language toggle updates `<html lang>`.
- Charts expose a text summary for screen readers.
- No information conveyed by color alone, including role and resource colors.

---

## 8. Do / don't

| Do | Don't |
|---|---|
| Use one primary action per screen | Put two milk buttons side by side |
| Show units next to every number | Write `412` without `kg` |
| Use dashed borders for empty slots | Use a disabled-looking filled box |
| Explain a failure in words | Show a red X with no reason |
| Keep panels flat | Stack shadows and gradients |
| Use caps labels sparingly | Turn every heading into caps |

---

## 9. Files

| File | Purpose |
|---|---|
| `src/styles/tokens.css` | `@theme` tokens; single source of color, type, radius |
| `src/styles/global.css` | Imports, base styles, utilities, reduced motion |
| `src/styles/fonts/fredoka-latin.woff2` | Fredoka wordmark font (OFL) |
| `src/ui/Button.tsx` | Variants and sizes |
| `src/ui/Badge.tsx` | Status tones |
| `src/ui/Panel.tsx` | Card container |
| `src/ui/ResourceBar.tsx` | Canonical resource display |
| `src/app/Home.tsx` | Start screen (solarpunk) |
| `src/ui/menu/MenuBackground.tsx` | Animated menu backdrop |
| `src/ui/menu/MenuPanel.tsx` | 3xl menu panel |
| `src/app/Brief.tsx` | Real scenario menu |
| `src/app/Styleguide.tsx` | Live reference (route `#/styleguide`) |

Change the tokens, not the components, when adjusting the visual language.
