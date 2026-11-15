/**
 * Simulate screen — Owner: Track A (UI sprint).
 * Timeline, events, decisions and re-simulation. No physics here: the engine
 * produces the result and this screen renders it.
 */
import { useEffect, useRef, useState } from 'react'
import { decisionOptionsFor } from '@/engine/decisions'
import type { GameEvent } from '@/engine/types'
import { MaskIcon } from '@/app/visuals/MaskIcon'
import { AiArtBadge } from '@/app/visuals/AiArtBadge'
import { AiBackdrop } from '@/app/visuals/AiBackdrop'
import { visualUrl } from '@/app/visuals/assets'
import { useMissionStore } from '@/store/mission'
import { useI18n } from '@/store/ui'
import { syncShareUrl } from '@/app/share-url'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { format } from '@/ui/game/format'
import { Panel } from '@/ui/Panel'

function severityTone(severity: GameEvent['severity']) {
  return severity === 'critical' ? 'danger' : severity === 'warning' ? 'warning' : 'info'
}

const EVENT_ICON: Record<string, string> = {
  cme_hit: 'icons/events/cme.svg',
  flare_x: 'icons/events/flare.svg',
  inst_fail: 'icons/events/inst-fail.svg',
  bus_fail: 'icons/events/bus-fail.svg',
  gs_outage: 'icons/events/gs-outage.svg',
  power_deficit: 'icons/events/power-deficit.svg',
  buffer_full: 'icons/events/buffer-full.svg',
  budget_cut: 'icons/events/budget-cut.svg',
  launch_delay: 'icons/events/launch-delay.svg',
  wheel_fail: 'icons/events/wheel-fail.svg',
  thermal: 'icons/events/thermal.svg',
  debris: 'icons/events/debris.svg',
}

export function SimulateScreen() {
  const { t } = useI18n()
  const config = useMissionStore((state) => state.config)
  const simulation = useMissionStore((state) => state.simulation)
  const decisions = useMissionStore((state) => state.decisions)
  const simulate = useMissionStore((state) => state.simulate)
  const setDecision = useMissionStore((state) => state.setDecision)

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState(1)
  const autoStarted = useRef(false)

  useEffect(() => {
    if (!autoStarted.current && !simulation && config) {
      autoStarted.current = true
      simulate()
    }
  }, [simulation, simulate, config])

  useEffect(() => {
    if (!simulation || selectedEventId) {
      return
    }
    const first =
      simulation.events.find((event) => event.severity === 'critical') ?? simulation.events[0]
    if (first) {
      setSelectedDay(first.day)
    }
  }, [simulation, selectedEventId])

  const eventCopy = t.game.event as Record<string, string>
  const roleCopy = t.game.roles as Record<string, string>
  const decisionCopy = t.game.decisions as Record<string, string>

  const eventTitle = (event: GameEvent): string => {
    if (event.titleKey.startsWith('event.instFail.')) {
      const instrument = event.titleKey.split('.').pop() ?? ''
      return `${eventCopy.instFail}: ${instrument}`
    }
    const key = event.titleKey.replace('event.', '')
    return eventCopy[key] ?? event.titleKey
  }

  const runMission = () => {
    simulate()
    setSelectedEventId(null)
    setSelectedDay(1)
  }

  if (!config) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <h1 className="font-display text-3xl font-semibold text-ink">{t.ops.simulate.title}</h1>
        <Panel className="space-y-4 p-6">
          <p className="text-[13px] text-ink-2">{t.ops.simulate.completeDesign}</p>
          <Button variant="primary" onClick={() => (window.location.hash = '#/design')}>
            {t.game.design.title}
          </Button>
        </Panel>
      </div>
    )
  }

  if (!simulation) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <header className="space-y-2">
          <p className="label-caps text-ink-3">{config.scenarioId}</p>
          <h1 className="font-display text-3xl font-semibold text-ink">{t.ops.simulate.title}</h1>
          <p className="text-[13px] text-ink-2">{t.ops.simulate.lead}</p>
        </header>
        <Panel className="flex flex-col items-start gap-4 p-6">
          <p className="text-[13px] text-ink-2">{t.ops.simulate.noSimulation}</p>
          <Button variant="primary" onClick={runMission}>
            {t.ops.simulate.run}
          </Button>
        </Panel>
      </div>
    )
  }

  const events = simulation.events
  const defaultEvent = events.find((event) => event.severity === 'critical') ?? events[0] ?? null
  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? defaultEvent
  const options = selectedEvent ? decisionOptionsFor(selectedEvent.type) : []
  const appliedOption = selectedEvent
    ? decisions.find((decision) => decision.eventId === selectedEvent.id)?.optionId
    : undefined

  const duration = simulation.days.length
  const dayIndex = Math.min(Math.max(selectedDay, 1), duration)
  const day = simulation.days[dayIndex - 1]
  const stormActive = events.some(
    (event) => event.type === 'cme_hit' && dayIndex >= event.day && dayIndex <= event.day + 2,
  )

  const applyDecision = (event: GameEvent, optionId: string) => {
    setDecision(event.id, optionId)
    simulate()
    syncShareUrl(useMissionStore.getState().shareCode())
  }

  return (
    <AiBackdrop file="simulate/storm-bg.webp" className="p-0">
      <div className="space-y-5">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="label-caps text-ink-3">{config.scenarioId}</p>
            <h1 className="font-display text-3xl font-semibold text-ink">{t.ops.simulate.title}</h1>
            <p className="text-[13px] text-ink-2">{t.ops.simulate.lead}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {stormActive ? (
              <Badge tone="warning">
                <MaskIcon file="icons/simulate/storm-intensity.svg" className="size-3.5" />
                {t.ops.simulate.storm}
              </Badge>
            ) : null}
            <Badge
              tone={
                simulation.verdict === 'success'
                  ? 'success'
                  : simulation.verdict === 'partial'
                    ? 'warning'
                    : 'danger'
              }
            >
              {t.ops.report[simulation.verdict]}
            </Badge>
            <span className="num text-2xl font-semibold text-ink">{simulation.score.total}</span>
            <span className="label-caps text-ink-3">{simulation.score.grade}</span>
          </div>
        </header>

        <Panel className="space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="label-caps text-ink-2">{t.ops.simulate.event}</h2>
            <span className="text-[11px] text-ink-3">
              {format(t.ops.simulate.counts, { events: events.length, days: duration })}
            </span>
          </div>

          <div className="relative h-8">
            <div className="absolute inset-x-0 top-3 h-1.5 rounded-full bg-surface-2" />
            {events.map((event) => {
              const left = duration > 1 ? ((event.day - 1) / (duration - 1)) * 100 : 0
              const active = selectedEvent?.id === event.id
              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => {
                    setSelectedEventId(event.id)
                    setSelectedDay(event.day)
                  }}
                  title={`${t.ops.simulate.day} ${event.day}: ${eventTitle(event)}`}
                  aria-label={`${t.ops.simulate.day} ${event.day}: ${eventTitle(event)}`}
                  className={[
                    'absolute top-1.5 size-3 -translate-x-1/2 rounded-full border transition-transform',
                    event.severity === 'critical'
                      ? 'border-danger bg-danger'
                      : event.severity === 'warning'
                        ? 'border-warning bg-warning'
                        : 'border-ion bg-ion',
                    active ? 'scale-150' : 'hover:scale-125',
                  ].join(' ')}
                  style={{ left: `${left}%` }}
                />
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={duration}
              value={dayIndex}
              onChange={(event) => setSelectedDay(Number(event.target.value))}
              className="w-full accent-cream"
              aria-label={t.ops.simulate.day}
            />
            <span className="num shrink-0 text-[12px] text-ink-2">
              {t.ops.simulate.day} {dayIndex}
            </span>
          </div>

          {day ? (
            <div className="grid grid-cols-2 gap-3 text-[11px] sm:grid-cols-4">
              <span className="rounded-sm border border-border bg-surface-2/40 p-2">
                <span className="label-caps block text-ink-3">{t.ops.simulate.stat.power}</span>
                <span className="num text-ink">{day.powerGeneratedW} W</span>
              </span>
              <span className="rounded-sm border border-border bg-surface-2/40 p-2">
                <span className="label-caps block text-ink-3">{t.ops.simulate.stat.load}</span>
                <span className="num text-ink">{day.loadW} W</span>
              </span>
              <span className="rounded-sm border border-border bg-surface-2/40 p-2">
                <span className="label-caps block text-ink-3">{t.ops.simulate.stat.battery}</span>
                <span className="num text-ink">{day.batterySocWh} Wh</span>
              </span>
              <span className="rounded-sm border border-border bg-surface-2/40 p-2">
                <span className="label-caps block text-ink-3">{t.ops.simulate.stat.buffer}</span>
                <span className="num text-ink">{day.bufferGb} Gb</span>
              </span>
            </div>
          ) : null}
        </Panel>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Panel className="space-y-3 p-5">
            <h2 className="label-caps text-ink-2">{t.ops.simulate.event}</h2>
            <ul className="space-y-2">
              {events.map((event) => {
                const active = selectedEvent?.id === event.id
                return (
                  <li key={event.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEventId(event.id)
                        setSelectedDay(event.day)
                      }}
                      className={[
                        'flex w-full items-start justify-between gap-3 rounded-md border p-3 text-left transition-colors',
                        active
                          ? 'border-cream/50 bg-surface-2 ring-1 ring-cream/20'
                          : 'border-border bg-surface-2/30 hover:border-border-strong',
                      ].join(' ')}
                    >
                      <span className="space-y-1">
                        <span className="flex items-center gap-2 text-[12px] text-ink">
                          <MaskIcon
                            file={EVENT_ICON[event.type] ?? 'icons/simulate/anomaly.svg'}
                            className="size-4 text-ion"
                          />
                          <span>
                            {t.ops.simulate.day} {event.day} · {eventTitle(event)}
                          </span>
                        </span>
                        <span className="block text-[11px] text-ink-3">
                          {roleCopy[event.role] ?? event.role}
                        </span>
                      </span>
                      <Badge tone={severityTone(event.severity)}>
                        {t.common.severity[event.severity]}
                      </Badge>
                    </button>
                  </li>
                )
              })}
            </ul>
          </Panel>

          <Panel className="relative overflow-hidden space-y-4 p-5">
            <img
              src={visualUrl('simulate/decision-modal-bg.webp')}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
            />
            <AiArtBadge className="absolute right-3 top-3 z-20" />
            <div className="relative z-10 space-y-4">
              <h2 className="label-caps text-ink-2">{t.ops.simulate.decision}</h2>
              {selectedEvent ? (
                <>
                  <div>
                    <p className="text-[13px] font-medium text-ink">{eventTitle(selectedEvent)}</p>
                    <p className="mt-1 text-[11px] text-ink-3">
                      {roleCopy[selectedEvent.role] ?? selectedEvent.role} · {t.ops.simulate.day}{' '}
                      {selectedEvent.day}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {options.map((option) => {
                      const applied = appliedOption === option.id
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => applyDecision(selectedEvent, option.id)}
                          className={[
                            'w-full rounded-md border p-3 text-left transition-colors',
                            applied
                              ? 'border-jade/60 bg-jade/10'
                              : 'border-border bg-surface-2/30 hover:border-border-strong',
                          ].join(' ')}
                        >
                          <span className="flex items-start justify-between gap-2">
                            <span className="text-[12px] font-medium text-ink">
                              {decisionCopy[option.labelKey] ?? option.id}
                            </span>
                            <span className="flex shrink-0 items-center gap-1">
                              {option.effect.costUsdM ? (
                                <Badge tone="warning">${option.effect.costUsdM}M</Badge>
                              ) : null}
                              {applied ? (
                                <Badge tone="success">{t.ops.simulate.applied}</Badge>
                              ) : null}
                            </span>
                          </span>
                          <span className="mt-1 block text-[11px] leading-relaxed text-ink-3">
                            {decisionCopy[option.descriptionKey] ?? ''}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  {appliedOption ? (
                    <p className="text-[11px] text-ink-3">{t.ops.simulate.resimulated}</p>
                  ) : null}
                </>
              ) : (
                <p className="text-[12px] text-ink-3">{t.ops.simulate.noEvents}</p>
              )}
            </div>
          </Panel>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button variant="secondary" onClick={() => (window.location.hash = '#/review')}>
            {t.ops.simulate.back}
          </Button>
          <Button variant="primary" onClick={() => (window.location.hash = '#/report')}>
            {t.ops.simulate.report}
          </Button>
        </div>
      </div>
    </AiBackdrop>
  )
}
