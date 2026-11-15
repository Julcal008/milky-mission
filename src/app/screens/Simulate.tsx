/**
 * Simulate screen — Owner: Track A (UI sprint).
 * Timeline, auto-play, event modals, decisions and re-simulation. No physics
 * here: the engine produces the result and this screen renders it.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { decisionOptionFor, decisionOptionsFor } from '@/engine/decisions'
import type { GameEvent } from '@/engine/types'
import { MaskIcon } from '@/app/visuals/MaskIcon'
import { AiBackdrop } from '@/app/visuals/AiBackdrop'
import { useMissionStore } from '@/store/mission'
import { useI18n } from '@/store/ui'
import { syncShareUrl } from '@/app/share-url'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { DecisionModal } from '@/ui/game/DecisionModal'
import { RoleDock } from '@/ui/game/RoleDock'
import { format } from '@/ui/game/format'
import {
  advancePlaybackDay,
  PLAYBACK_SPEEDS,
  PLAYBACK_TICK_MS,
  type PlaybackSpeed,
} from '@/ui/game/playback'
import { turnCopyEn } from '@/ui/game/turn-copy.en'
import { turnCopyEs } from '@/ui/game/turn-copy.es'
import { assignmentsForPlayers, roleOwnerSeat } from '@/ui/game/turns'
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
  calibration: 'icons/events/inst-fail.svg',
  data_gap: 'icons/events/buffer-full.svg',
  aurora: 'icons/events/flare.svg',
  rf: 'icons/events/gs-outage.svg',
  antenna: 'icons/events/gs-outage.svg',
  budget: 'icons/events/budget-cut.svg',
  schedule: 'icons/events/launch-delay.svg',
  partner: 'icons/events/buffer-full.svg',
}

export function SimulateScreen() {
  const { t, lang } = useI18n()
  const config = useMissionStore((state) => state.config)
  const simulation = useMissionStore((state) => state.simulation)
  const decisions = useMissionStore((state) => state.decisions)
  const players = useMissionStore((state) => state.players)
  const simulate = useMissionStore((state) => state.simulate)
  const applyDecision = useMissionStore((state) => state.applyDecision)
  const restartSimulation = useMissionStore((state) => state.restartSimulation)
  const turnCopy = lang === 'es' ? turnCopyEs : turnCopyEn

  const [currentDay, setCurrentDay] = useState(1)
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState<PlaybackSpeed>(1)
  const [pendingEventId, setPendingEventId] = useState<string | null>(null)
  const [acknowledged, setAcknowledged] = useState<Set<string>>(() => new Set())
  const [activeSeat, setActiveSeat] = useState(0)
  const autoStarted = useRef(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (activeSeat >= players) {
      setActiveSeat(0)
    }
  }, [activeSeat, players])

  useEffect(() => {
    if (!autoStarted.current && !simulation && config) {
      autoStarted.current = true
      simulate()
    }
  }, [simulation, simulate, config])

  useEffect(() => {
    if (!simulation || initialized.current) {
      return
    }
    initialized.current = true
    setCurrentDay(1)
    setPlaying(true)
    setPendingEventId(null)
    setAcknowledged(new Set())
    setActiveSeat(0)
  }, [simulation])

  const duration = simulation?.days.length ?? 0
  const resolvedEventIds = useMemo(
    () => new Set([...decisions.map((choice) => choice.eventId), ...acknowledged]),
    [decisions, acknowledged],
  )
  const unresolvedEventDays = useMemo(
    () =>
      simulation
        ? simulation.events
            .filter((event) => !resolvedEventIds.has(event.id))
            .map((event) => event.day)
            .sort((a, b) => a - b)
        : [],
    [simulation, resolvedEventIds],
  )

  useEffect(() => {
    if (!simulation || !playing || pendingEventId) {
      return
    }
    const timer = window.setInterval(() => {
      setCurrentDay((day) => advancePlaybackDay(day, speed, duration, unresolvedEventDays))
    }, PLAYBACK_TICK_MS)
    return () => window.clearInterval(timer)
  }, [simulation, playing, pendingEventId, speed, duration, unresolvedEventDays])

  useEffect(() => {
    if (duration > 0 && currentDay >= duration) {
      setPlaying(false)
    }
  }, [currentDay, duration])

  useEffect(() => {
    if (!simulation || pendingEventId) {
      return
    }
    const event = simulation.events.find(
      (item) => item.day === currentDay && !resolvedEventIds.has(item.id),
    )
    if (event) {
      setPendingEventId(event.id)
      setPlaying(false)
    }
  }, [currentDay, simulation, pendingEventId, resolvedEventIds])

  const eventCopy = t.game.event as Record<string, string>
  const challengeCopy = t.game.challenge as Record<string, string>
  const roleCopy = t.game.roles as Record<string, string>
  const decisionCopy = t.game.decisions as Record<string, string>
  const difficultyLabel =
    (config?.difficulty ?? 'engineer') === 'cadet'
      ? t.brief.cadet
      : config?.difficulty === 'flight-director'
        ? t.brief.flightDirector
        : t.brief.engineer

  const eventTitle = (event: GameEvent): string => {
    if (event.titleKey.startsWith('event.instFail.')) {
      const instrument = event.titleKey.split('.').pop() ?? ''
      return `${eventCopy.instFail}: ${instrument}`
    }
    const key = event.titleKey.replace('event.', '')
    return eventCopy[key] ?? event.titleKey
  }

  const eventDescription = (event: GameEvent): string | undefined => {
    if (!event.descriptionKey) {
      return undefined
    }
    return (
      challengeCopy[event.descriptionKey.replace('challenge.', '').replace('.description', '')] ??
      undefined
    )
  }

  const restart = () => {
    restartSimulation()
    setCurrentDay(1)
    setAcknowledged(new Set())
    setPendingEventId(null)
    setPlaying(true)
    setActiveSeat(0)
    syncShareUrl(useMissionStore.getState().shareCode())
  }

  const togglePlay = () => {
    if (!simulation) {
      return
    }
    if (currentDay >= duration) {
      restart()
      return
    }
    if (!playing) {
      const atCurrentDay = simulation.events.find(
        (event) => event.day === currentDay && !resolvedEventIds.has(event.id),
      )
      if (atCurrentDay) {
        setPendingEventId(atCurrentDay.id)
        setPlaying(false)
        return
      }
    }
    setPlaying((value) => !value)
  }

  const seek = (day: number) => {
    setPlaying(false)
    setCurrentDay(Math.min(Math.max(day, 1), duration || 1))
  }

  const openEvent = (event: GameEvent) => {
    setPlaying(false)
    setCurrentDay(event.day)
    setPendingEventId(event.id)
  }

  const runMission = () => {
    simulate()
    setCurrentDay(1)
    setAcknowledged(new Set())
    setPendingEventId(null)
    setPlaying(true)
    setActiveSeat(0)
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
  const pendingEvent = events.find((event) => event.id === pendingEventId) ?? null
  const assignments = assignmentsForPlayers(players)
  const playerLabel = (seat: number) => format(turnCopy.player, { n: seat + 1 })
  const rolesLabel = (seat: number) =>
    (assignments[seat]?.roles ?? []).map((role) => roleCopy[role] ?? role).join(' + ')
  const activeTurnLabel = format(turnCopy.turn, {
    player: playerLabel(activeSeat),
    roles: rolesLabel(activeSeat),
  })
  const ownerSeat = pendingEvent ? roleOwnerSeat(pendingEvent.role, players) : 0
  const locked = Boolean(pendingEvent) && players > 1 && activeSeat !== ownerSeat
  const waitingLabel = format(turnCopy.waiting, { player: playerLabel(ownerSeat) })
  const passLabel = format(turnCopy.pass, { player: playerLabel(ownerSeat) })
  const turn =
    players > 1
      ? {
          label: activeTurnLabel,
          waiting: locked ? waitingLabel : undefined,
          passLabel: locked ? passLabel : undefined,
          locked,
          onPass: locked ? () => setActiveSeat(ownerSeat) : undefined,
        }
      : undefined
  const pendingOptions = pendingEvent
    ? decisionOptionsFor(pendingEvent.challengeId ?? pendingEvent.type)
    : []
  const pendingDecision = pendingEvent
    ? decisions.find((decision) => decision.eventId === pendingEvent.id)?.optionId
    : undefined
  const dayIndex = Math.min(Math.max(currentDay, 1), duration)
  const day = simulation.days[dayIndex - 1]
  const stormActive = events.some(
    (event) => event.type === 'cme_hit' && dayIndex >= event.day && dayIndex <= event.day + 2,
  )
  const nextEvent =
    events
      .filter((event) => !resolvedEventIds.has(event.id) && event.day > dayIndex)
      .sort((a, b) => a.day - b.day)[0] ?? null
  const complete = currentDay >= duration

  const chooseDecision = (optionId: string) => {
    if (!pendingEvent || locked) {
      return
    }
    applyDecision(pendingEvent.id, optionId)
    setPendingEventId(null)
    setPlaying(true)
    syncShareUrl(useMissionStore.getState().shareCode())
  }

  const continueAlert = () => {
    if (!pendingEvent || locked) {
      return
    }
    setAcknowledged((current) => new Set(current).add(pendingEvent.id))
    setPendingEventId(null)
    setPlaying(true)
  }

  return (
    <AiBackdrop file="simulate/storm-bg.webp" className="p-0">
      <div className="space-y-5">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="label-caps text-ink-3">
              {config.scenarioId} · {difficultyLabel}
            </p>
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

        <Panel className="space-y-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="label-caps text-ink-2">{turnCopy.handoff}</h2>
            <span className="text-[11px] text-ink-2">
              {players > 1 ? activeTurnLabel : turnCopy.solo}
            </span>
          </div>
          <RoleDock
            players={players}
            activeSeat={activeSeat}
            onSelect={setActiveSeat}
            copy={turnCopy}
          />
        </Panel>

        <Panel className="space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant={playing ? 'secondary' : 'primary'}
                onClick={togglePlay}
                aria-label={playing ? t.ops.simulate.pause : t.ops.simulate.play}
              >
                {playing ? t.ops.simulate.pause : t.ops.simulate.play}
              </Button>
              <div
                role="group"
                aria-label={t.ops.simulate.speedLabel}
                className="flex items-center gap-1"
              >
                {PLAYBACK_SPEEDS.map((value) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={speed === value ? 'primary' : 'ghost'}
                    aria-pressed={speed === value}
                    onClick={() => setSpeed(value)}
                  >
                    {value}×
                  </Button>
                ))}
              </div>
              <Button size="sm" variant="ghost" onClick={restart}>
                {t.ops.simulate.restart}
              </Button>
            </div>
            <span className="num text-[12px] text-ink-2">
              {format(t.ops.simulate.dayProgress, { day: dayIndex, days: duration })}
            </span>
          </div>

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
              const active = pendingEvent?.id === event.id
              const resolved = resolvedEventIds.has(event.id)
              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => openEvent(event)}
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
                    resolved ? 'opacity-50' : '',
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
              onChange={(event) => seek(Number(event.target.value))}
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
                const active = pendingEvent?.id === event.id
                const choice = decisions.find((decision) => decision.eventId === event.id)
                const chosen = choice ? decisionOptionFor(choice.optionId) : null
                const chosenLabel = chosen ? (decisionCopy[chosen.labelKey] ?? chosen.id) : null
                return (
                  <li key={event.id}>
                    <button
                      type="button"
                      onClick={() => openEvent(event)}
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
                        {chosenLabel ? (
                          <span className="block text-[11px] text-jade">
                            {t.ops.simulate.applied}: {chosenLabel}
                          </span>
                        ) : null}
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

          <Panel className="space-y-4 p-5">
            <div>
              <h2 className="label-caps text-ink-2">{t.ops.simulate.playback}</h2>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-2">
                {complete ? t.ops.simulate.completeLead : t.ops.simulate.autoLead}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border border-border bg-surface-2/40 p-3">
                <span className="label-caps block text-ink-3">{t.ops.simulate.day}</span>
                <span className="num text-xl text-ink">{dayIndex}</span>
                <span className="text-[11px] text-ink-3"> / {duration}</span>
              </div>
              <div className="rounded-md border border-border bg-surface-2/40 p-3">
                <span className="label-caps block text-ink-3">{t.ops.simulate.history}</span>
                <span className="num text-xl text-ink">{decisions.length}</span>
              </div>
            </div>

            <div className="rounded-md border border-border bg-surface-2/40 p-3">
              <span className="label-caps block text-ink-3">{t.ops.simulate.nextStop}</span>
              {complete ? (
                <span className="mt-1 inline-flex items-center gap-2 text-[12px] text-success">
                  <MaskIcon file="shared/icon-severity-success.svg" className="size-4" />
                  {t.ops.simulate.complete}
                </span>
              ) : nextEvent ? (
                <span className="mt-1 block text-[12px] text-ink">
                  {t.ops.simulate.day} {nextEvent.day} · {eventTitle(nextEvent)}
                </span>
              ) : (
                <span className="mt-1 block text-[12px] text-ink-2">{t.ops.simulate.noEvents}</span>
              )}
            </div>

            <div>
              <span className="label-caps block text-ink-3">{t.ops.simulate.history}</span>
              {decisions.length > 0 ? (
                <ul className="mt-2 space-y-1.5">
                  {decisions.map((choice) => {
                    const event = events.find((item) => item.id === choice.eventId)
                    const option = decisionOptionFor(choice.optionId)
                    return (
                      <li
                        key={`${choice.eventId}-${choice.optionId}`}
                        className="flex items-start justify-between gap-2 text-[11px]"
                      >
                        <span className="text-ink-2">
                          {event ? eventTitle(event) : choice.eventId}
                        </span>
                        <span className="text-jade">
                          {option ? (decisionCopy[option.labelKey] ?? option.id) : choice.optionId}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="mt-1 text-[11px] text-ink-3">{t.ops.simulate.noDecisions}</p>
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

      {pendingEvent ? (
        <DecisionModal
          dayLabel={`${t.ops.simulate.day} ${pendingEvent.day}`}
          eventTitle={eventTitle(pendingEvent)}
          description={eventDescription(pendingEvent)}
          roleLabel={roleCopy[pendingEvent.role] ?? pendingEvent.role}
          severityLabel={t.common.severity[pendingEvent.severity]}
          tone={severityTone(pendingEvent.severity)}
          options={pendingOptions.map((option) => ({
            id: option.id,
            label: decisionCopy[option.labelKey] ?? option.id,
            description: decisionCopy[option.descriptionKey] ?? '',
            costUsdM: option.effect.costUsdM,
            budgetUsdM: option.effect.budgetUsdM,
          }))}
          appliedOptionId={pendingDecision}
          turn={turn}
          labels={{
            title: pendingOptions.length ? t.ops.simulate.decisionRequired : t.ops.simulate.alert,
            paused: t.ops.simulate.paused,
            continueLabel: t.ops.simulate.continue,
            applied: t.ops.simulate.applied,
          }}
          onChoose={chooseDecision}
          onContinue={continueAlert}
        />
      ) : null}
    </AiBackdrop>
  )
}
