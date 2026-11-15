import { describe, expect, it } from 'vitest'
import { en } from '@/i18n/en'
import { es } from '@/i18n/es'
import { CHALLENGES } from './challenges'

function gameCopy(dictionary: typeof en) {
  return dictionary.game as unknown as {
    decisions: Record<string, string>
    event: Record<string, string>
    challenge: Record<string, string>
  }
}

describe('challenge catalog', () => {
  it('has unique challenge and option ids', () => {
    const challengeIds = CHALLENGES.map((challenge) => challenge.id)
    const optionIds = CHALLENGES.flatMap((challenge) =>
      challenge.options.map((option) => option.id),
    )
    expect(new Set(challengeIds).size).toBe(challengeIds.length)
    expect(new Set(optionIds).size).toBe(optionIds.length)
  })

  it('has every English and Spanish copy key', () => {
    for (const dictionary of [gameCopy(en), gameCopy(es)]) {
      for (const challenge of CHALLENGES) {
        const titleKey = challenge.titleKey.replace('event.', '')
        const descriptionKey = challenge.descriptionKey
          .replace('challenge.', '')
          .replace('.description', '')
        expect(dictionary.event[titleKey], challenge.titleKey).toBeTruthy()
        expect(dictionary.challenge[descriptionKey], challenge.descriptionKey).toBeTruthy()
        for (const option of challenge.options) {
          expect(dictionary.decisions[option.labelKey], option.labelKey).toBeTruthy()
          expect(dictionary.decisions[option.descriptionKey], option.descriptionKey).toBeTruthy()
        }
      }
    }
  })
})
