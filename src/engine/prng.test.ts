/**
 * Guard-rail tests for the seeded PRNG.
 * Determinism is a contract invariant, not a nice-to-have.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from './prng'

describe('createRng', () => {
  it('produces the same sequence for the same seed', () => {
    const a = createRng(20260514)
    const b = createRng(20260514)
    const seqA = Array.from({ length: 50 }, () => a.next())
    const seqB = Array.from({ length: 50 }, () => b.next())
    expect(seqA).toEqual(seqB)
  })

  it('produces different sequences for different seeds', () => {
    const a = createRng(1)
    const b = createRng(2)
    expect(a.next()).not.toBe(b.next())
  })

  it('keeps values inside [0, 1)', () => {
    const rng = createRng(42)
    for (let i = 0; i < 1_000; i += 1) {
      const value = rng.next()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })

  it('bounds integers and never reaches the exclusive maximum', () => {
    const rng = createRng(7)
    for (let i = 0; i < 1_000; i += 1) {
      const value = rng.int(10)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(10)
    }
  })

  it('chance(0) never fires and chance(1) always fires', () => {
    const rng = createRng(99)
    for (let i = 0; i < 100; i += 1) {
      expect(rng.chance(0)).toBe(false)
      expect(rng.chance(1)).toBe(true)
    }
  })

  it('pick returns an element of the array', () => {
    const rng = createRng(3)
    const items = ['a', 'b', 'c'] as const
    for (let i = 0; i < 100; i += 1) {
      expect(items).toContain(rng.pick(items))
    }
  })
})
