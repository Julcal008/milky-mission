/**
 * SHARE CODEC — encode a mission design into a URL-safe string.
 * Owner: Track A.
 *
 * The code contains the full MissionConfig (including the seed), so a shared
 * mission reproduces exactly. It is versioned: bump `SHARE_VERSION` if the
 * config shape changes in a way old links cannot express.
 */
import type { MissionConfig, ScenarioId } from './types'

export const SHARE_VERSION = 1

interface SharePayload {
  v: number
  c: MissionConfig
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

export function encodeMission(config: MissionConfig): string {
  const payload: SharePayload = { v: SHARE_VERSION, c: config }
  return toBase64Url(JSON.stringify(payload))
}

export function decodeMission(code: string): MissionConfig | null {
  if (!code || code.length > 4096) {
    return null
  }
  try {
    const parsed: unknown = JSON.parse(fromBase64Url(code))
    if (!isSharePayload(parsed)) {
      return null
    }
    return parsed.c
  } catch {
    return null
  }
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
    typeof config.orbitId === 'string' &&
    typeof config.launcherId === 'string' &&
    typeof config.busId === 'string' &&
    typeof config.propulsionId === 'string' &&
    typeof config.arrayId === 'string' &&
    typeof config.arrayAreaM2 === 'number' &&
    typeof config.batteryId === 'string' &&
    typeof config.commsId === 'string' &&
    typeof config.groundNetworkId === 'string' &&
    typeof config.storageId === 'string' &&
    Array.isArray(config.instrumentIds) &&
    Array.isArray(config.requirements)
  )
}
