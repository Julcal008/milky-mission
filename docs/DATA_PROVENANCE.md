# Data provenance

Every number in the game must be traceable to a source or explicitly labelled as an
estimate or a game-balance value. This file is the audit trail and the basis for the
"NASA resources" section of the submission.

Legend: **O** official · **D** derived · **E** estimate · **G** game.

Owner: Track C (Data & Content). Add a row in the same PR that changes a catalog value.

---

## 1. NASA datasets

| Dataset / field | Drives | Endpoint or product | Consulted | Conf. |
|---|---|---|---|---|
| DONKI `FLR`, `CME`, `GST` (May 2024) | Scenario timeline, storm events, radiation risk | `https://api.nasa.gov/DONKI/` | 2026-11-14 | O |
| POWER `ALLSKY_SFC_SW_DWN` | Solar array output | `https://power.larc.nasa.gov/api/temporal/climatology/point` | 2026-11-14 | O |
| POWER `CLOUD_AMT` | Optical vs. SAR trade-off | same | 2026-11-14 | O |
| GIBS / Blue Marble imagery | Map base, scenario cards | NASA EOSDIS GIBS / Visible Earth | 2026-11-14 | O |
| JPL CNEOS close approaches | Reserved, not used in v0.1 | `https://ssd-api.jpl.nasa.gov/cad.api` | 2026-11-14 | O |

Attribution is textual. No NASA logo, insignia or flag is used.

---

## 2. Physical constants

| Constant | Value | Source | Conf. |
|---|---|---|---|
| Earth mean radius | 6371 km | IUGG mean radius | O |
| Earth gravitational parameter | 398 600.4418 km³/s² | EGM2008 | O |
| Standard gravity | 9.80665 m/s² | ISO 80000-3 | O |
| Solar constant at 1 AU | 1361 W/m² | NASA/TSI community consensus | O |
| Days per year | 365 | definition | O |

## 3. Launch vehicles

| Value | Source | Conf. | Range / note |
|---|---|---|---|
| Electron 250 kg SSO 500 km, $8M | Rocket Lab public payload user guide and list price | E | Real prices vary; dedicated launch |
| Firefly Alpha 750 kg SSO 500 km, $15M | Firefly public user guide | E | — |
| Vega-C 2 300 kg SSO 500 km, $38M | Arianespace/ESA public performance data | E | SSO 700 km figure needs re-check |
| Falcon 9 9 000 kg SSO 500 km, $67M | SpaceX public payload user guide and list price | E | Reusable vs. expendable changes capacity |
| Rideshare 150 kg to 550 km SSO, $1.2M | Published rideshare pricing | E | Fixed orbit and schedule |
| Interpolation and 15 %/100 km decay above 700 km | Game simplification | G | — |

## 4. Spacecraft and subsystems

| Value | Source | Conf. | Note |
|---|---|---|---|
| Bus classes (12U / 150 kg / 300 kg) | NASA State-of-the-Art Small Spacecraft Technology; CubeSat 101 | E | Representative classes, not a specific product |
| Bus costs $2.5M / $9M / $18M | Parametric estimate | E | Order-of-magnitude for a one-off science mission |
| Bus power 60 / 220 / 450 W | Representative smallsat capability | E | Orbit-average distribution |
| Propulsion mass, Isp, cost | Representative cold-gas/monoprop systems | E | — |
| GaAs 300 W/m² BOL, 3 %/yr degradation | Triple-junction cell data, 30 % efficiency × 1361 W/m² × packing | D | Cell-level value before packing |
| Si 180 W/m² BOL, 5 %/yr | Same method at 18 % efficiency | D | — |
| Battery 120–133 Wh/kg | Typical Li-ion smallsat packs | E | Modern cells reach 150–200 Wh/kg |
| Battery cycle life | Typical Li-ion DoD curves | E | 20 000 @ 20 %, 5 000 @ 50 %, 1 500 @ 80 % |
| Comms bands and rates | Representative UHF/S/X/Ka smallsat terminals | E | Link-limited rate is computed, not tabulated |
| Ground network multipliers 1.0 / 2.2 / 3.5 | Game model of station geometry | G | — |
| Storage capacities and masses | Representative COTS recorders | E | — |

## 5. Instruments

Masses and powers are representative of real instrument classes; data volumes and
science values are game values.

| Instrument | Real analogue | Mass / power source | Conf. |
|---|---|---|---|
| `xrs` | GOES-R XRS | NOAA/NASA GOES-R Series Data Book | E |
| `suvi` | GOES-R SUVI | NOAA/NASA GOES-R Series Data Book | E |
| `mag` | GOES-R magnetometer / smallsat fluxgate | Data Book / vendor specs | E |
| `proton` | GOES-R energetic particle sensor | Data Book / vendor specs | E |
| `gnssro` | Spire/CICERO-class GNSS-RO | Public mission specs | E |
| `msi` | SmallSat multispectral imager | Vendor specs | E |
| `hri` | 2 m-class smallsat optical | Vendor specs | E |
| `sar` | ICEYE-class X-band SAR | Public mission specs | E |
| `ais` | SmallSat AIS receiver | Vendor specs | E |
| `lidar` | SmallSat laser altimeter | Public mission specs | E |
| Data volumes (Gb/day) | — | Game balance | G |
| Science values (0–40) | — | Game balance | G |
| TRL failure rates | NASA TRL definitions + game tuning | G |

## 6. Orbits and environment

| Value | Method | Conf. |
|---|---|---|
| Period, orbits/day | Kepler's third law with μ = 398 600.4418 km³/s² | D |
| Eclipse duration | Cylindrical shadow model, β angle | D |
| Passes/day | Simplified ground-station access model, 10° elevation, 8 min average pass | E |
| Drag 8 / 3 / 60 / 12 m/s·yr | Order-of-magnitude at nominal solar activity | E |
| Dose 3 / 5 / 6 / 4 krad/yr | Behind 3 mm Al, order-of-magnitude | E |
| Revisit model | `targetPassesPerDay × accessFactor` | G |
| Cloud penalty | POWER `CLOUD_AMT` mapped to usable-day fraction | D |

## 7. Game-design values

These are **not** real-world claims and must be presented as game mechanics:

- Requirement thresholds and weights.
- Event probabilities and scripted days.
- Decision effects and token rules.
- Score weights, grade thresholds and difficulty multipliers.
- Scenario budgets and lifetimes.
- Science normalization caps (100 / 110).
- Data volumes and science values per instrument.

## 8. Pending verification (before submission)

| Item | Action |
|---|---|
| GOES-R instrument masses/powers | Confirm in the GOES-R Series Data Book |
| ICEYE SAR mass/power | Confirm from public specifications |
| Vega-C SSO 500/700 km | Confirm in the Arianespace user manual |
| Electron/Firefly capacity curves | Confirm in current user guides |
| Radiation dose by orbit | Check with a published environment tool or leave as estimate |
| Drag at 400/500/550/700 km | Check against a standard atmosphere model or leave as estimate |
| Battery cycle life | Keep as estimate, label clearly |

Until verified, the values stay labelled **E** and the in-app panel says
"engineering estimate".
