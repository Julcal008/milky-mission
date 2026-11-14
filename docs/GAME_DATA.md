# Game data v0.1 — catalogs, scenarios and balance

Owner: Track C (Data & Content). Consumed by Track A (engine) and rendered by Track B.

Single source of truth for numbers. The engine implements these tables; the UI never
hardcodes them. **Every value is labelled:**

| Label | Meaning |
|---|---|
| **O** official | Published by NASA, ESA, a manufacturer or a peer-reviewed source |
| **D** derived | Computed from official data with a stated method |
| **E** estimate | Engineering estimate with a plausible range |
| **G** game | Chosen for balance; not a real-world claim |

If a value has no label, it is a bug. Update `docs/DATA_PROVENANCE.md` with every change.

---

## 1. Scenarios

### 1.1 Storm Watch

| Field | Value | Conf. |
|---|---|---|
| Budget | $50M | G |
| Mission life | 365 days | G |
| Launch window | 90 days | G |
| Instrument slots | 4 | G |
| Historical driver | May 2024 G5 storm (DONKI) | O |
| Science normalization cap | 100 points | G |

**Brief (EN):**
> A G5 geomagnetic storm just hit Earth. Airlines rerouted polar flights, GPS drifted for
> hours, and nobody saw it coming in time. Your job: put a small satellite in orbit that
> watches the Sun and the ionosphere — and keeps working when the next storm arrives.
> You have 12 months, $50M, and one launch.

**Requirements — choose 3 of 6**

| ID | Requirement | Weight | Verification |
|---|---|---|---|
| R1 | Detect ≥90 % of X-class flares in <4 h | 120 | XRS installed; duty ≥80 %; delivered ≥70 % |
| R2 | Image the auroral oval every ≤12 h | 90 | SUVI; inclination ≥80°; revisit ≤12 h; delivered ≥60 % |
| R3 | Measure the ionosphere over Colombia ≥4 passes/day | 90 | GNSS-RO; target passes ≥4; delivered ≥60 % |
| R4 | Survive a G4+ storm | 60 | Magnetometer or proton detector; dose <20 krad; power margin ≥15 % |
| R5 | Deliver ≥70 % of generated data | 60 | buffer + downlink |
| R6 | Operate for 12 months | 30 | Δv covers drag; degradation accounted |

### 1.2 Andes Flood Watch

| Field | Value | Conf. |
|---|---|---|
| Budget | $60M | G |
| Mission life | 548 days (18 months) | G |
| Launch window | 120 days | G |
| Instrument slots | 4 | G |
| Target region | Magdalena basin, lat 2–11°N, lon 75–73°W | O |
| Science normalization cap | 110 points | G |

**Brief (EN):**
> Every rainy season the Magdalena River floods towns that have 12 hours to evacuate.
> Build a mission that sees the basin every day — through clouds, day and night — and gets
> the data to the ground in time to matter.

**Requirements — choose 3 of 5**

| ID | Requirement | Weight | Verification |
|---|---|---|---|
| R1 | Revisit the basin every ≤24 h | 120 | target passes/day + swath + pointing |
| R2 | See through clouds and at night | 100 | SAR or microwave instrument |
| R3 | Resolution ≤100 m | 80 | HRI or SAR |
| R4 | Deliver ≥60 % of generated data | 60 | downlink vs volume |
| R5 | Operate for 18 months | 40 | Δv + degradation |

---

## 2. Orbits

Conf.: **D** (Keplerian values computed from altitude and inclination).

| ID | Altitude | Inclination | Period | Orbits/day | Eclipse | Passes/day¹ | Max latitude | Drag² | Dose³ |
|---|---|---|---|---|---|---|---|---|---|
| `sso500` | 500 km | 97.4° | 94.6 min | 15.2 | ~35 min | 6 | 82.6° | 8 m/s·yr | 3 krad/yr |
| `sso700` | 700 km | 98.2° | 98.8 min | 14.6 | ~36 min | 5 | 81.8° | 3 m/s·yr | 5 krad/yr |
| `leo400` | 400 km | 51.6° | 92.4 min | 15.6 | ~35 min | 5 | 51.6° | 60 m/s·yr | 6 krad/yr |
| `leo550eq` | 550 km | 5.0° | 95.5 min | 15.1 | ~34 min | 7 | 5.0° | 12 m/s·yr | 4 krad/yr |

¹ Single ground station at Neiva (2.93°N, 75.28°W), elevation ≥10°, average pass 8 min.
² At nominal solar activity, order of magnitude; LEO 400 km is deliberately punishing.
³ Total ionizing dose behind 3 mm aluminium, order of magnitude.

**Design consequences**

- `leo550eq` cannot see the Magdalena basin north of 5°N → fails Andes R1.
- `leo400` without propulsion loses ~6 months of life.
- `sso500` is the default all-rounder; `sso700` buys life at the cost of radiation and
  a smaller launcher capacity.

**Revisit model (simplified, labelled E/G)**

```
targetPassesPerDay = passesPerDay × accessFactor
accessFactor = clamp(swathKm / 100, 0.3, 1.2) × (agilePointing ? 1.5 : 1.0)
revisitHours = 24 / max(targetPassesPerDay, 0.1)
```

`agilePointing` is available for HRI and SAR only, and adds 10 % to the power load.

---

## 3. Launch vehicles

Conf.: **E** (public payload user guides and list prices, rounded; real mission prices
vary with orbit, schedule and rideshare arrangements).

| ID | Name | LEO 400 | SSO 500 | SSO 700 | Fairing | Cost | Notes |
|---|---|---|---|---|---|---|---|
| `rideshare` | Rideshare (SSO) | — | 150 kg | — | 1.0 m³ | $1.2M | fixed 550 km SSO; schedule risk +25 % |
| `electron` | Electron | 300 kg | 250 kg | 180 kg | 1.5 m³ | $8.0M | dedicated |
| `firefly` | Firefly Alpha | 900 kg | 750 kg | 550 kg | 6 m³ | $15.0M | dedicated |
| `vegac` | Vega-C | 2 800 kg | 2 300 kg | 2 000 kg | 12 m³ | $38.0M | dedicated |
| `f9` | Falcon 9 | 12 000 kg | 9 000 kg | 7 000 kg | 60 m³ | $67.0M | dedicated or rideshare |

Interpolation between columns; above 700 km, capacity decreases 15 % per additional
100 km. Rideshare rejects any orbit other than 550 km SSO.

---

## 4. Spacecraft buses

Conf.: **E** (representative smallsat classes; costs are parametric estimates).

| ID | Class | Dry mass | Payload capacity | Payload volume | Bus power¹ | Cost | Reliability/yr |
|---|---|---|---|---|---|---|---|
| `cubesat12u` | 12U | 24 kg | 8 kg | 0.02 m³ | 60 W | $2.5M | 0.90 |
| `micro` | MicroSat 150 | 95 kg | 60 kg | 0.6 m³ | 220 W | $9.0M | 0.94 |
| `small` | SmallSat 300 | 180 kg | 120 kg | 1.2 m³ | 450 W | $18.0M | 0.96 |

¹ Orbit-average power the bus can distribute, including its own housekeeping load.
Includes structure, ADCS, C&DH, thermal and harness. Excludes propulsion, power
generation, communications and payload.

**Baseline housekeeping loads (G):** 30 W (12U), 45 W (micro), 65 W (small); +10 W
heaters during eclipse; 20 W safe mode.

---

## 5. Propulsion

Conf.: **E**.

| ID | Type | Dry mass | Max propellant | Isp | Cost |
|---|---|---|---|---|---|
| `none` | None | 0 | 0 | — | $0 |
| `coldgas` | Cold gas | 6 kg | 8 kg | 60 s | $0.8M |
| `mono` | Monopropellant | 14 kg | 20 kg | 220 s | $2.5M |
| `green` | Green monopropellant | 16 kg | 25 kg | 250 s | $3.5M |

```
deltaVmS = ispS × 9.80665 × ln(m0 / m1)
m0 = dry + propellant + payload + everything else
m1 = m0 − propellant
```

Drag make-up requirement: `orbit.dragMSYear × years`. Unused propellant is wasted mass —
a real trade-off.

---

## 6. Power

### Arrays — conf. **D/E**

| ID | Cell | W/m² BOL¹ | Degradation | Mass/m² | Cost/m² |
|---|---|---|---|---|---|
| `si` | Silicon | 180 | 5 %/yr | 2.5 kg | $0.15M |
| `gaas` | GaAs triple junction | 300 | 3 %/yr | 2.0 kg | $0.35M |

¹ At normal incidence, beginning of life. Available areas: 0.6, 1.2, 2.0, 3.5 m².
Packing factor 0.90; mean incidence factor 0.75.

```
P_sunlight = areaM2 × WPerM2 × 0.90 × 0.75 × (1 − degradation)^years × (irradiance / 1361)
P_orbitAverage = P_sunlight × (1 − eclipseFraction)
```

Irradiance comes from NASA POWER monthly climatology for the target region (O).

### Batteries — conf. **E**

| ID | Capacity | Mass | Cost | DoD max |
|---|---|---|---|---|
| `b300` | 300 Wh | 2.5 kg | $0.4M | 80 % |
| `b800` | 800 Wh | 6 kg | $0.9M | 80 % |
| `b1600` | 1 600 Wh | 12 kg | $1.7M | 80 % |

Charge efficiency 90 %. Cycle life: 20 000 cycles at 20 % DoD, 5 000 at 50 %, 1 500 at
80 % (G, derived from typical Li-ion curves).

---

## 7. Communications

Conf.: **E** (representative bands and terminals; link performance computed by the engine).

| ID | Band | Tx power | Antenna gain | Max rate | Mass | Cost |
|---|---|---|---|---|---|---|
| `uhf` | UHF 437 MHz | 1 W | 3 dBi | 9.6 kbps | 1.5 kg | $0.3M |
| `sband` | S 2.2 GHz | 5 W | 12 dBi | 2 Mbps | 4 kg | $1.2M |
| `xband` | X 8.2 GHz | 10 W | 28 dBi | 50 Mbps | 9 kg | $4.0M |
| `ka` | Ka 26 GHz | 20 W | 34 dBi | 200 Mbps | 12 kg | $6.0M |

### Ground networks — conf. **G**

| ID | Stations | Passes multiplier | Cost |
|---|---|---|---|
| `neiva` | 1 | 1.0 | included |
| `regional` | 3 | 2.2 | $2.0M |
| `dsn` | DSN | 3.5 | $8.0M |

### Storage — conf. **G**

| ID | Capacity | Mass | Cost |
|---|---|---|---|
| `s4` | 4 GB | 1 kg | $0.1M |
| `s16` | 16 GB | 2 kg | $0.3M |
| `s64` | 64 GB | 4 kg | $0.6M |

```
downlinkGbPerDay = passesPerDay × passDurationS × effectiveRateMbps / 1000 × 0.90
effectiveRateMbps = min(comms.maxRateMbps, linkLimitedRate)
```

Link budget at maximum slant range with a 3 dB margin. UHF cannot carry science data;
it is TT&C only.

---

## 8. Instruments

Conf.: masses/powers are **E** based on representative real instruments (GOES-R XRS,
GOES-R SUVI, smallsat GNSS-RO receivers, ICEYE-class X-band SAR). Data volumes and
science values are **G**.

| ID | Instrument | Mass | Power | Cost | Data Gb/day | Science | TRL | Supports |
|---|---|---|---|---|---|---|---|---|
| `xrs` | X-ray flux monitor | 3 kg | 3 W | $1.2M | 0.005 | 30 | 9 | flare |
| `suvi` | UV/EUV imager | 18 kg | 25 W | $8.0M | 4.0 | 30 | 7 | aurora |
| `mag` | Magnetometer | 2 kg | 2 W | $0.6M | 0.001 | 15 | 9 | storm |
| `proton` | Energetic particle detector | 4 kg | 5 W | $2.0M | 0.002 | 20 | 8 | storm |
| `gnssro` | GNSS-RO receiver | 3 kg | 6 W | $1.5M | 0.05 | 20 | 8 | ionosphere |
| `msi` | Multispectral imager | 12 kg | 15 W | $6.0M | 6.0 | 25 | 9 | optical |
| `hri` | High-resolution optical | 40 kg | 45 W | $18.0M | 20.0 | 30 | 8 | optical, highres |
| `sar` | X-band SAR | 85 kg | 300 W | $35.0M | 40.0 | 35 | 7 | allweather, highres |
| `ais` | AIS receiver | 2 kg | 4 W | $0.8M | 0.005 | 10 | 9 | maritime |
| `lidar` | Laser altimeter | 15 kg | 20 W | $5.0M | 0.5 | 20 | 7 | topography |

**TRL failure probability per year (G):** TRL 9 → 5 %, TRL 8 → 10 %, TRL 7 → 15 %,
TRL 5 → 30 %.

**Swath (G):** MSI 100 km, HRI 25 km, SAR 50 km, SUVI full disk (not applicable),
others point measurements.

**Duty cycle (G):** default 90 % of the mission; reduced by power deficits, eclipses for
optical sensors, and safe-mode days.

---

## 9. Requirement evaluation

Conf.: **G** (rules designed for the game; physical inputs are computed).

**Storm Watch**

```
R1 = xrs ? min(duty/0.80, delivered/0.70, 1) : 0
R2 = (suvi && inclination >= 80 && revisitH <= 12) ? min(delivered/0.60, 1) : 0
R3 = (gnssro && targetPasses >= 4) ? min(delivered/0.60, 1) : 0
R4 = (mag || proton) && dose < 20 krad && powerMargin >= 0.15 ? 1 :
     (two of the three conditions ? 0.5 : 0)
R5 = min(delivered/0.70, 1)
R6 = lifetimeDays >= 365 ? 1 : lifetimeDays/365
```

**Andes Flood Watch**

```
R1 = min(24 / revisitH, 1)
R2 = sar ? 1 : 0
R3 = (hri || sar) ? 1 : 0
R4 = min(delivered/0.60, 1)
R5 = lifetimeDays >= 548 ? 1 : lifetimeDays/548
```

`delivered = min(1, downlinkGbPerDay / generatedGbPerDay)` after buffer losses.

---

## 10. Events

Conf.: **G**, except the CME/flare timeline which is **O** (DONKI dates).

| ID | Trigger | Annual rate | Role | Effect |
|---|---|---|---|---|
| `cme_hit` | Scripted (DONKI) | 2–3 per mission | Systems | Dose +30 %, SEU risk ×2 for 3 days |
| `flare_x` | Scripted (DONKI) | 1–2 | Science | Optical/UV instrument saturated for 2 days |
| `inst_fail` | TRL-based | see TRL table | Science | Instrument offline for the rest of the mission |
| `bus_fail` | Random | 3 % | Systems | −30 % power or degraded attitude |
| `gs_outage` | Random | 2 %/month | Comms | No downlink for 2 days |
| `buffer_full` | Deterministic | — | Comms | Science lost while buffer >95 % |
| `budget_cut` | Day 120 and 240 | 10 % each | Director | −8 % of remaining budget |
| `launch_delay` | Pre-launch | 15 % | Director | +30 days, +$1M |
| `wheel_fail` | Random | 4 % | Systems | Attitude degraded until recovery |
| `thermal` | Power margin <10 % | 10 %/month | Systems | Extra heater load |
| `debris` | Random | 5 % | Director | Maneuver costs 5 m/s |

Random rates are stored per year and converted to per-day:
`p_day = 1 − (1 − p_year)^(1/365)`.

---

## 11. Decisions

Conf.: **G**.

| Role | Option | Cost | Effect |
|---|---|---|---|
| Systems | Shed load | 0 | Instrument off 2 days; +power margin |
| Systems | Reduce heater | 0 | +power; thermal risk ×2 for 10 days |
| Systems | Safe mode | 0 | 3 days of mission lost |
| Comms | Prioritize science | 0 | −10 % data quality, +effective volume |
| Comms | Prioritize housekeeping | 0 | Telemetry safe, −science that day |
| Comms | Buy extra pass | $0.2M | +1 pass that day |
| Science | Increase duty cycle | 0 | +science, −power margin for 7 days |
| Science | Calibrate | 0 | −1 day data, +10 % quality permanently |
| Science | Repoint | 0 | −data, +coverage for the target |
| Director | Reallocate budget | 0 | +10 % to one subsystem, −10 % to another |
| Director | Descope instrument | 0 | Recover mass/power/cost, lose requirement |
| Director | Accept risk | 0 | No action; the event runs its course |

Token use: 2 per role. Consensus required for launch, budget reallocation and critical
anomaly response.

---

## 12. Score

Conf.: **G**.

```
missionSuccess = Σ weight_i × fraction_i                    (max 300)
science = 250 × min(1, Σ scienceValue_i × delivered_i × coverage_i / normalizationCap)
efficiency = 80 × clamp(massMargin / 0.30, 0, 1)
           + 60 × clamp(powerMargin / 0.25, 0, 1)
           + 60 × clamp((budget − cost) / (0.10 × budget), 0, 1)
robustness = 90 × reliability + 60 × anomalyHandling          (max 150)
teamwork = 25 × roleObjectivesMet                              (max 100; solo → efficiency)
```

- Margins: mass ≥30 % gives full credit; 0 % gives zero. Negative margin is already a
  validation error.
- `anomalyHandling` = fraction of critical events that received an explicit decision.
- Grade: S ≥900, A 800–899, B 700–799, C 600–699, D <600.
- `verdict = failure` if no chosen requirement reaches 1.0.

**Difficulty multipliers**

| Level | Budget | Event rate | Extra |
|---|---|---|---|
| Cadet | ×1.30 | ×0.50 | all tooltips open |
| Engineer | ×1.00 | ×1.00 | contextual tooltips |
| Flight Director | ×0.85 | ×1.50 | hidden requirement revealed on day 90 |

---

## 13. Reference mission (balance test)

**Storm Watch baseline — target score 800–860**

| Item | Selection | Mass | Cost |
|---|---|---|---|
| Bus | `micro` | 95.0 kg | $9.00M |
| Propulsion | `mono`, full 20 kg | 34.0 kg | $2.50M |
| Payload | `xrs` + `mag` + `gnssro` + `suvi` | 26.0 kg | $11.30M |
| Array | `gaas`, 1.2 m² | 2.4 kg | $0.42M |
| Battery | `b300` | 2.5 kg | $0.40M |
| Comms | `sband` | 4.0 kg | $1.20M |
| Storage | `s16` | 2.0 kg | $0.30M |
| Adapter | — | 5.0 kg | $0.30M |
| **Subtotal** | | **170.9 kg** | **$25.42M** |
| 15 % margin | | 196.5 kg | $29.23M |
| Launch | `electron` | | $8.00M |
| Operations | 12 × $0.5M | | $6.00M |
| **Total** | | **197 kg vs 250 kg** | **$43.2M vs $50M** |

Expected outputs:

| Metric | Value |
|---|---|
| Mass margin | 21.2 % |
| Power: generated / load | 153 W / 99 W → 35 % margin |
| Data: generated / downlink | 4.06 / 3.46 Gb/day → 85 % delivered |
| Eclipse energy | 58 Wh vs 240 Wh usable |
| Δv available / required | ~260 m/s vs 8 m/s per year |
| Dose | 3 krad/year |
| Requirements | R1, R2, R3 met (weights 120 + 90 + 90) |

**Naive mission — target score 500–650:** `micro` + `xrs` + `sband` + `b300` +
0.6 m² Si array + `rideshare`, chooses R1, R5, R6. Passes on mass but fails margins and
data delivery, and loses points on robustness.

**Over-budget mission — validation error:** `small` + `sar` + `ka` + `dsn` on
`andes-flood-watch`: mass is fine, cost exceeds $60M.

---

## 14. NASA data used

| Source | Field | Used by | Conf. |
|---|---|---|---|
| NASA POWER `ALLSKY_SFC_SW_DWN` | monthly irradiance, kWh/m²/day | power generation | O |
| NASA POWER `CLOUD_AMT` | monthly cloud amount, % | optical vs SAR trade-off | O |
| NASA DONKI `FLR`, `CME`, `GST` | event dates and classes | simulation timeline | O |
| NASA GIBS / Blue Marble | base imagery | map and scenario cards | O |
| NASA/JPL CNEOS | NEO close approaches | reserved (not in scope) | O |

---

## 15. Open items

1. Revisit model needs a sanity check against a real SSO mission before balance freeze.
2. SAR duty cycle: confirm that 40 Gb/day is only achievable at reduced duty; it is
   intended to force Ka-band or DSN.
3. Andes baseline mission not yet defined; target score 700–800.
4. Cycle-life penalty for batteries above 50 % DoD needs a test.
5. Launch vehicle numbers must be re-checked against the latest public user guides.
