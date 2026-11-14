/**
 * Seeded PRNG (mulberry32).
 * Owner: Track A.
 *
 * Determinism is an engine invariant: the same mission and seed must produce
 * byte-identical results. Never use Math.random() inside src/engine.
 *
 * Do not change the algorithm after missions are shared: the share link only
 * carries the seed, so a different generator would replay a different mission.
 */

export interface Rng {
  /** Uniform float in [0, 1). */
  next: () => number
  /** Uniform integer in [0, maxExclusive). */
  int: (maxExclusive: number) => number
  /** Uniform float in [min, max). */
  range: (min: number, max: number) => number
  /** True with probability p (0..1). */
  chance: (p: number) => boolean
  /** Uniform element of a non-empty array. */
  pick: <T>(items: readonly T[]) => T
}

export function createRng(seed: number): Rng {
  // Force the seed into uint32 so callers can pass any integer.
  let state = seed >>> 0

  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
  }

  const int = (maxExclusive: number): number => Math.floor(next() * maxExclusive)

  return {
    next,
    int,
    range: (min, max) => min + next() * (max - min),
    chance: (p) => next() < p,
    pick: (items) => items[int(items.length)],
  }
}
