/**
 * Playback clock for the simulation screen.
 * Owner: Track A (UI sprint).
 *
 * Pure helpers so the day-advance rules are testable without React. The UI
 * ticks every 100 ms; one tick advances `PLAYBACK_DAYS_PER_TICK * speed` days,
 * but never past the next unresolved event.
 */

export type PlaybackSpeed = 1 | 2 | 4

export const PLAYBACK_TICK_MS = 100
export const PLAYBACK_DAYS_PER_TICK = 1
export const PLAYBACK_SPEEDS: PlaybackSpeed[] = [1, 2, 4]

/**
 * Advance at most one event boundary. `eventDays` must contain unresolved
 * events only; returning the event day is what lets the UI open its modal
 * instead of skipping the decision.
 */
export function advancePlaybackDay(
  currentDay: number,
  speed: PlaybackSpeed,
  duration: number,
  eventDays: readonly number[],
): number {
  if (currentDay >= duration) {
    return duration
  }
  const target = Math.min(duration, currentDay + PLAYBACK_DAYS_PER_TICK * speed)
  const nextEvent = eventDays
    .filter((day) => day > currentDay && day <= target)
    .sort((a, b) => a - b)[0]
  return nextEvent ?? target
}

/** First unresolved event strictly after `currentDay`, if any. */
export function nextEventDay(currentDay: number, eventDays: readonly number[]): number | null {
  const next = eventDays.filter((day) => day > currentDay).sort((a, b) => a - b)[0]
  return next ?? null
}
