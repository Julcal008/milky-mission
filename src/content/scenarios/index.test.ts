import { describe, expect, it } from 'vitest'
import { scenarioContent } from './index'
import type { ScenarioCopy } from './types'

const LOCALES = ['en', 'es'] as const
const SCENARIOS = ['storm-watch', 'andes-flood-watch'] as const

function requirementCopies(copy: ScenarioCopy) {
  return [copy.r1, copy.r2, copy.r3, copy.r4, copy.r5, ...(copy.r6 ? [copy.r6] : [])]
}

describe('scenario content', () => {
  for (const locale of LOCALES) {
    for (const id of SCENARIOS) {
      it(`${locale} ${id} has title, summary, brief and requirements`, () => {
        const copy = scenarioContent[locale][id]
        expect(copy.title.trim().length).toBeGreaterThan(0)
        expect(copy.summary.trim().length).toBeGreaterThan(0)
        expect(copy.brief.trim().length).toBeGreaterThan(0)
        for (const requirement of requirementCopies(copy)) {
          expect(requirement.title.trim().length).toBeGreaterThan(0)
          expect(requirement.description.trim().length).toBeGreaterThan(0)
        }
      })
    }
  }

  it('gives Storm Watch six requirements and Andes five', () => {
    for (const locale of LOCALES) {
      expect(scenarioContent[locale]['storm-watch'].r6).toBeDefined()
      expect(scenarioContent[locale]['andes-flood-watch'].r6).toBeUndefined()
    }
  })

  it('keeps the locales distinct', () => {
    for (const id of SCENARIOS) {
      expect(scenarioContent.en[id].title).not.toBe(scenarioContent.es[id].title)
      expect(scenarioContent.en[id].brief).not.toBe(scenarioContent.es[id].brief)
    }
  })
})
