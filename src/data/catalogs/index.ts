/**
 * Catalog entry point. Engine and store import `catalogs` from here.
 * Owner: Track C. Values and provenance live in the per-table files.
 */
import type { Catalogs } from '@/engine/types'
import { orbits } from './orbits'
import { launchers } from './launchers'
import { buses } from './buses'
import { propulsion } from './propulsion'
import { arrays } from './arrays'
import { batteries } from './batteries'
import { comms } from './comms'
import { groundNetworks } from './groundNetworks'
import { storage } from './storage'
import { instruments } from './instruments'

export {
  orbits,
  launchers,
  buses,
  propulsion,
  arrays,
  batteries,
  comms,
  groundNetworks,
  storage,
  instruments,
}

export const catalogs: Catalogs = {
  orbits,
  launchers,
  buses,
  propulsion,
  arrays,
  batteries,
  comms,
  groundNetworks,
  storage,
  instruments,
}
