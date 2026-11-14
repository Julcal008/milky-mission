/**
 * Catalog guard-rail tests: the engine must tolerate sparse instrument arrays
 * produced by older UI code without crashing the simulation.
 */
import { describe, expect, it } from 'vitest'
import { catalogs } from '@/data/catalogs'
import { getInstruments } from './catalog'

describe('getInstruments', () => {
  it('filters empty and undefined ids', () => {
    const ids = ['xrs', undefined, '', 'mag'] as unknown as string[]
    expect(getInstruments(catalogs, ids).map((instrument) => instrument.id)).toEqual(['xrs', 'mag'])
  })
})
