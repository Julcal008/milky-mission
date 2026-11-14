/**
 * Scenario fixtures — v0.1 values from docs/GAME_DATA.md.
 * Owner: Track A (temporary). Track C will replace these with content-driven data.
 */
import type { ScenarioId, ScenarioSpec } from '../types'

export const scenarioFixtures: Record<ScenarioId, ScenarioSpec> = {
  'storm-watch': {
    id: 'storm-watch',
    budgetUsdM: 50,
    durationDays: 365,
    launchWindowDays: 90,
    instrumentSlots: 4,
    scienceNormalization: 100,
    requirements: [
      {
        id: 'R1',
        weight: 120,
        titleKey: 'scenario.storm.r1.title',
        descriptionKey: 'scenario.storm.r1.description',
      },
      {
        id: 'R2',
        weight: 90,
        titleKey: 'scenario.storm.r2.title',
        descriptionKey: 'scenario.storm.r2.description',
      },
      {
        id: 'R3',
        weight: 90,
        titleKey: 'scenario.storm.r3.title',
        descriptionKey: 'scenario.storm.r3.description',
      },
      {
        id: 'R4',
        weight: 60,
        titleKey: 'scenario.storm.r4.title',
        descriptionKey: 'scenario.storm.r4.description',
      },
      {
        id: 'R5',
        weight: 60,
        titleKey: 'scenario.storm.r5.title',
        descriptionKey: 'scenario.storm.r5.description',
      },
      {
        id: 'R6',
        weight: 30,
        titleKey: 'scenario.storm.r6.title',
        descriptionKey: 'scenario.storm.r6.description',
      },
    ],
  },
  'andes-flood-watch': {
    id: 'andes-flood-watch',
    budgetUsdM: 60,
    durationDays: 548,
    launchWindowDays: 120,
    instrumentSlots: 4,
    scienceNormalization: 110,
    requirements: [
      {
        id: 'R1',
        weight: 120,
        titleKey: 'scenario.andes.r1.title',
        descriptionKey: 'scenario.andes.r1.description',
      },
      {
        id: 'R2',
        weight: 100,
        titleKey: 'scenario.andes.r2.title',
        descriptionKey: 'scenario.andes.r2.description',
      },
      {
        id: 'R3',
        weight: 80,
        titleKey: 'scenario.andes.r3.title',
        descriptionKey: 'scenario.andes.r3.description',
      },
      {
        id: 'R4',
        weight: 60,
        titleKey: 'scenario.andes.r4.title',
        descriptionKey: 'scenario.andes.r4.description',
      },
      {
        id: 'R5',
        weight: 40,
        titleKey: 'scenario.andes.r5.title',
        descriptionKey: 'scenario.andes.r5.description',
      },
    ],
  },
}
