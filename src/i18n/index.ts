/**
 * i18n — minimal, typed, dependency-free.
 * UI copy lives in en.ts / es.ts. English is the default because the
 * submission and the demo must be in English; Spanish is a toggle.
 */
import { en } from './en'
import { es } from './es'

export type Lang = 'en' | 'es'
export type Dictionary = typeof en

export const dictionaries: Record<Lang, Dictionary> = { en, es }

export function isLang(value: string | null): value is Lang {
  return value === 'en' || value === 'es'
}
