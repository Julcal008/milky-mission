/**
 * Mission store behaviour: empty draft, scenario reset and completeness.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { baselineConfig } from '@/engine/__fixtures__/baseline'
import { encodeMission } from '@/engine/share'
import type { OrbitId } from '@/engine/types'
import { useMissionStore } from './mission'

describe('mission store', () => {
  beforeEach(() => {
    useMissionStore.getState().reset()
  })

  it('starts with an empty draft and a full missing checklist', () => {
    const state = useMissionStore.getState()
    expect(state.config).toBeNull()
    expect(state.validation).toBeNull()
    expect(state.draft.instrumentIds).toEqual([])
    expect(state.draft.requirements).toEqual([])
    expect(state.missing).toContain('scenario')
    expect(state.missing).toContain('orbit')
    expect(state.missing).toContain('instruments')
    expect(state.missing).toContain('requirements')
  })

  it('clears every previous choice when starting a new scenario', () => {
    const state = useMissionStore.getState()
    state.setDraft({
      orbitId: 'sso500',
      launcherId: 'electron',
      busId: 'micro',
      arrayId: 'gaas',
      arrayAreaM2: 1.2,
      instrumentIds: ['xrs'],
      requirements: ['R1'],
    })
    useMissionStore.getState().startScenario('andes-flood-watch')

    const next = useMissionStore.getState()
    expect(next.draft.scenarioId).toBe('andes-flood-watch')
    expect(next.draft.orbitId).toBeUndefined()
    expect(next.draft.launcherId).toBeUndefined()
    expect(next.draft.instrumentIds).toEqual([])
    expect(next.draft.requirements).toEqual([])
    expect(next.config).toBeNull()
    expect(next.missing).toContain('bus')
  })

  it('keeps the selected player count across a new scenario', () => {
    const state = useMissionStore.getState()
    state.setPlayers(4)
    useMissionStore.getState().startScenario('storm-watch')
    expect(useMissionStore.getState().players).toBe(4)
  })

  it('loads the reference example as a complete design', () => {
    useMissionStore.getState().loadExample()
    const state = useMissionStore.getState()
    expect(state.config).not.toBeNull()
    expect(state.validation?.ok).toBe(true)
    expect(state.draft.instrumentIds.length).toBe(4)
  })

  it('rejects share codes with unknown catalog ids', () => {
    const code = encodeMission({ ...baselineConfig, orbitId: 'bogus' as OrbitId })
    expect(useMissionStore.getState().loadShareCode(code)).toBe(false)
    expect(useMissionStore.getState().config).toBeNull()
  })

  it('restores decisions and players from a share code', () => {
    const decisions = [{ eventId: 'event-1', optionId: 'shelter' }]
    const code = encodeMission(baselineConfig, decisions, 3)
    expect(useMissionStore.getState().loadShareCode(code)).toBe(true)
    const state = useMissionStore.getState()
    expect(state.decisions).toEqual(decisions)
    expect(state.players).toBe(3)
  })

  it('applies a decision atomically and can restart the simulation', () => {
    const store = useMissionStore.getState()
    store.loadExample()
    const first = store.simulate()
    expect(first).not.toBeNull()
    const cme = first?.events.find((event) => event.type === 'cme_hit')
    expect(cme).toBeDefined()
    if (!first || !cme) {
      return
    }

    const improved = useMissionStore.getState().applyDecision(cme.id, 'shelter')
    expect(improved).not.toBeNull()
    expect(useMissionStore.getState().decisions).toHaveLength(1)
    expect(useMissionStore.getState().simulation).not.toBeNull()
    expect(improved?.score.total).toBeGreaterThanOrEqual(first.score.total)

    const restarted = useMissionStore.getState().restartSimulation()
    expect(restarted).not.toBeNull()
    expect(useMissionStore.getState().decisions).toEqual([])
    expect(useMissionStore.getState().simulation?.score.total).toBe(first.score.total)
  })
})
