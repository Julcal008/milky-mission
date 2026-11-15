/**
 * Spacecraft schematic — Owner: Track A (UI sprint).
 * A live blueprint of the draft: bus, arrays, antenna, propulsion and payload.
 * It is illustrative only; sizes are normalized from catalog values.
 */
import { catalogs } from '@/data/catalogs'
import type { MissionDraft } from '@/engine/types'

export function SpacecraftSchematic({ draft }: { draft: MissionDraft }) {
  const bus = draft.busId ? catalogs.buses.find((item) => item.id === draft.busId) : null
  const array = draft.arrayId ? catalogs.arrays.find((item) => item.id === draft.arrayId) : null
  const battery = draft.batteryId
    ? catalogs.batteries.find((item) => item.id === draft.batteryId)
    : null
  const comms = draft.commsId ? catalogs.comms.find((item) => item.id === draft.commsId) : null
  const propulsion = draft.propulsionId
    ? catalogs.propulsion.find((item) => item.id === draft.propulsionId)
    : null
  const orbit = draft.orbitId ? catalogs.orbits.find((item) => item.id === draft.orbitId) : null

  const instruments = draft.instrumentIds
    .map((id) => catalogs.instruments.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  const busWidth = bus ? 40 + Math.min(70, bus.dryMassKg / 2.5) : 76
  const busHeight = bus ? 38 + Math.min(26, bus.dryMassKg / 6) : 58
  const busY = 190 - busHeight / 2
  const panelWidth = draft.arrayAreaM2 ? Math.min(110, 18 + draft.arrayAreaM2 * 28) : 34
  const panelColor = array?.id === 'gaas' ? 'var(--color-ion)' : 'var(--color-ink-3)'
  const antennaRadius = comms ? { uhf: 7, sband: 11, xband: 15, ka: 19 }[comms.id] : 9
  const tankRadius = propulsion ? Math.min(18, 4 + propulsion.propellantMaxKg * 0.6) : 7
  const orbitOffset = orbit ? ((orbit.altitudeKm - 400) / 300) * 18 : 9

  return (
    <svg
      viewBox="0 0 800 300"
      role="img"
      aria-label="Spacecraft schematic of the current draft"
      className="h-auto w-full"
    >
      <defs>
        <radialGradient id="schematic-glow" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="var(--color-ion)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--color-bg)" stopOpacity="0" />
        </radialGradient>
        <pattern id="schematic-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path
            d="M32 0H0V32"
            fill="none"
            stroke="var(--color-border)"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect width="800" height="300" fill="url(#schematic-grid)" opacity="0.5" />
      <rect width="800" height="300" fill="url(#schematic-glow)" />

      {/* Orbit strip */}
      <g>
        <circle cx="82" cy="44" r="24" fill="var(--color-indigo)" opacity="0.18" />
        <circle cx="82" cy="44" r="24" fill="none" stroke="var(--color-ion)" strokeOpacity="0.5" />
        <text x="82" y="82" textAnchor="middle" className="fill-ink-3" fontSize="9">
          EARTH
        </text>
        <path
          d={`M 112 44 Q 430 ${44 - orbitOffset} 748 44`}
          fill="none"
          stroke="var(--color-ion)"
          strokeOpacity="0.55"
          strokeDasharray="4 7"
        />
        <circle cx="560" cy={44 - orbitOffset * 0.85} r="5" fill="var(--color-cream)" />
        <text
          x="640"
          y={30 - orbitOffset * 0.6}
          textAnchor="end"
          className="fill-ink-3"
          fontSize="9"
        >
          {orbit ? `${orbit.altitudeKm} km · ${orbit.inclinationDeg}°` : 'Select an orbit'}
        </text>
      </g>

      {/* Solar arrays */}
      <g>
        <rect
          x={400 - busWidth / 2 - 14 - panelWidth}
          y={190 - 20}
          width={panelWidth}
          height={40}
          rx="4"
          fill={panelColor}
          fillOpacity={array ? 0.55 : 0.12}
          stroke={panelColor}
          strokeOpacity={array ? 0.9 : 0.35}
          strokeDasharray={array ? undefined : '4 4'}
        />
        <rect
          x={400 + busWidth / 2 + 14}
          y={190 - 20}
          width={panelWidth}
          height={40}
          rx="4"
          fill={panelColor}
          fillOpacity={array ? 0.55 : 0.12}
          stroke={panelColor}
          strokeOpacity={array ? 0.9 : 0.35}
          strokeDasharray={array ? undefined : '4 4'}
        />
        <text x="400" y="136" textAnchor="middle" className="fill-ink-3" fontSize="9">
          {array ? `${array.name} · ${draft.arrayAreaM2 ?? 0} m²` : 'SELECT ARRAY'}
        </text>
      </g>

      {/* Antenna */}
      <g>
        <line
          x1={400 + busWidth / 2 - 8}
          y1={190 - busHeight / 2}
          x2={400 + busWidth / 2 + 26}
          y2={190 - busHeight / 2 - 26}
          stroke="var(--color-border-strong)"
        />
        <circle
          cx={400 + busWidth / 2 + 28}
          cy={190 - busHeight / 2 - 28}
          r={antennaRadius}
          fill="var(--color-surface-2)"
          stroke={comms ? 'var(--color-role-comms)' : 'var(--color-border-strong)'}
          strokeDasharray={comms ? undefined : '3 3'}
        />
        <text
          x={400 + busWidth / 2 + 28}
          y={190 - busHeight / 2 - 46}
          textAnchor="middle"
          className="fill-ink-3"
          fontSize="9"
        >
          {comms ? comms.band : 'COMMS'}
        </text>
      </g>

      {/* Bus */}
      <rect
        x={400 - busWidth / 2}
        y={busY}
        width={busWidth}
        height={busHeight}
        rx="10"
        fill="var(--color-surface-2)"
        stroke={bus ? 'var(--color-cream)' : 'var(--color-border-strong)'}
        strokeWidth={bus ? 1.5 : 1}
        strokeDasharray={bus ? undefined : '5 5'}
      />
      <text
        x="400"
        y={busY + busHeight / 2 + 3}
        textAnchor="middle"
        className="fill-ink-2"
        fontSize="10"
      >
        {bus ? bus.name : 'BUS'}
      </text>

      {/* Battery indicator */}
      <g>
        <rect
          x={400 - busWidth / 2 + 6}
          y={busY + busHeight + 8}
          width={Math.max(12, Math.min(26, (battery?.capacityWh ?? 20) / 60))}
          height="10"
          rx="2"
          fill={battery ? 'var(--color-res-power)' : 'none'}
          stroke="var(--color-border-strong)"
          strokeDasharray={battery ? undefined : '3 3'}
        />
        <text
          x={400 - busWidth / 2 + 34}
          y={busY + busHeight + 17}
          className="fill-ink-3"
          fontSize="9"
        >
          {battery ? `${battery.capacityWh} Wh` : 'BATTERY'}
        </text>
      </g>

      {/* Propulsion */}
      <g>
        <circle
          cx={400 - busWidth / 2 - 12}
          cy={190 + busHeight / 2 - 4}
          r={tankRadius}
          fill="var(--color-surface-2)"
          stroke={
            propulsion && propulsion.id !== 'none'
              ? 'var(--color-role-science)'
              : 'var(--color-border-strong)'
          }
          strokeDasharray={propulsion && propulsion.id !== 'none' ? undefined : '3 3'}
        />
        <text
          x={400 - busWidth / 2 - 12}
          y={190 + busHeight / 2 + 22}
          textAnchor="middle"
          className="fill-ink-3"
          fontSize="8"
        >
          {propulsion ? propulsion.name.split(' ')[0] : 'PROP'}
        </text>
      </g>

      {/* Instruments */}
      <g>
        {Array.from({ length: 4 }).map((_, index) => {
          const instrument = instruments[index]
          const x = 400 - 78 + index * 52
          return (
            <g key={index}>
              <rect
                x={x}
                y={262}
                width={40}
                height={24}
                rx="5"
                fill="var(--color-surface-2)"
                stroke={instrument ? 'var(--color-role-science)' : 'var(--color-border-strong)'}
                strokeOpacity={instrument ? 0.9 : 0.6}
                strokeDasharray={instrument ? undefined : '3 3'}
              />
              <text x={x + 20} y={277} textAnchor="middle" className="fill-ink-3" fontSize="7.5">
                {instrument ? instrument.id.toUpperCase() : 'SLOT'}
              </text>
            </g>
          )
        })}
        <text x="400" y="252" textAnchor="middle" className="fill-ink-3" fontSize="9">
          {instruments.length > 0 ? 'PAYLOAD' : 'ADD AN INSTRUMENT'}
        </text>
      </g>

      {/* Dimensions */}
      <text x="24" y="290" className="fill-ink-3" fontSize="8">
        ILLUSTRATIVE SCHEMATIC · SIZES ARE NORMALIZED FROM CATALOG VALUES
      </text>
    </svg>
  )
}
