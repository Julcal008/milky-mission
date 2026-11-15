/**
 * SHARE CODEC — encode a mission design and its runtime choices into a
 * URL-safe string.
 * Owner: Track A.
 *
 * The code contains the full MissionConfig (including the seed) so a shared
 * mission reproduces exactly. It also carries the decisions and player count
 * when they are not the defaults. The extra fields are optional, so v1 links
 * created before they existed still decode.
 *
 * Decoding is deliberately strict about shapes but does not know the catalogs;
 * `loadShareCode` validates the IDs against the catalogs before the engine sees
 * them.
 */
import type { DecisionChoice } from './decisions'
import type { MissionConfig, ScenarioId } from './types'

export const SHARE_VERSION = 1

interface SharePayload {
  v: number
  c: MissionConfig
  d?: DecisionChoice[]
  p?: number
}

export interface SharedMission {
  config: MissionConfig
  decisions: DecisionChoice[]
  players: number
}

const SCENARIOS: ScenarioId[] = ['storm-watch', 'andes-flood-watch']

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(code: string): string {
  const padded = code.replace(/-/g, '+').replace(/_/g, '/')
  const withPadding = padded + '='.repeat((4 - (padded.length % 4)) % 4)
  const binary = atob(withPadding)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return new TextDecoder().decode(bytes)
}

export function encodeMission(
  config: MissionConfig,
  decisions: DecisionChoice[] = [],
  players = 1,
): string {
  const payload: SharePayload = { v: SHARE_VERSION, c: config }
  const validDecisions = decisions.filter(isDecision)
  if (validDecisions.length > 0) {
    payload.d = validDecisions
  }
  const safePlayers = Math.min(4, Math.max(1, Math.round(players)))
  if (safePlayers !== 1) {
    payload.p = safePlayers
  }
  return toBase64Url(JSON.stringify(payload))
}

export function decodeSharedMission(code: string): SharedMission | null {
  if (!code || code.length > 4096) {
    return null
  }
  try {
    const parsed: unknown = JSON.parse(fromBase64Url(code))
    if (!isSharePayload(parsed)) {
      return null
    }
    const decisions = Array.isArray(parsed.d) ? parsed.d.filter(isDecision) : []
    const rawPlayers = typeof parsed.p === 'number' ? parsed.p : 1
    const players = Number.isFinite(rawPlayers)
      ? Math.min(4, Math.max(1, Math.round(rawPlayers)))
      : 1
    return { config: parsed.c, decisions, players }
  } catch {
    return null
  }
}

/** Backwards-compatible helper for callers that only need the design. */
export function decodeMission(code: string): MissionConfig | null {
  return decodeSharedMission(code)?.config ?? null
}

function isDecision(value: unknown): value is DecisionChoice {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const choice = value as Partial<DecisionChoice>
  return typeof choice.eventId === 'string' && typeof choice.optionId === 'string'
}

function isSharePayload(value: unknown): value is SharePayload {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const payload = value as Partial<SharePayload>
  if (payload.v !== SHARE_VERSION || typeof payload.c !== 'object' || payload.c === null) {
    return false
  }
  const config = payload.c as Partial<MissionConfig>
  return (
    SCENARIOS.includes(config.scenarioId as ScenarioId) &&
    typeof config.seed === 'number' &&
    Number.isFinite(config.seed) &&
    typeof config.orbitId === 'string' &&
    typeof config.launcherId === 'string' &&
    typeof config.busId === 'string' &&
    typeof config.propulsionId === 'string' &&
    typeof config.arrayId === 'string' &&
    typeof config.arrayAreaM2 === 'number' &&
    Number.isFinite(config.arrayAreaM2) &&
    config.arrayAreaM2 > 0 &&
    typeof config.batteryId === 'string' &&
    typeof config.commsId === 'string' &&
    typeof config.groundNetworkId === 'string' &&
    typeof config.storageId === 'string' &&
    Array.isArray(config.instrumentIds) &&
    config.instrumentIds.every((id) => typeof id === 'string') &&
    Array.isArray(config.requirements) &&
    config.requirements.every((id) => typeof id === 'string')
  )
}
