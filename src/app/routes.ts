/**
 * Route table — Owner: Angelica (Track B).
 * Screens are added once; other contributors only fill the screen files.
 */
export type Route =
  | 'home'
  | 'brief'
  | 'styleguide'
  | 'design'
  | 'review'
  | 'simulate'
  | 'report'

export function routeFromHash(hash: string): Route {
  if (hash.startsWith('#/brief')) return 'brief'
  if (hash.startsWith('#/design')) return 'design'
  if (hash.startsWith('#/review')) return 'review'
  if (hash.startsWith('#/simulate')) return 'simulate'
  if (hash.startsWith('#/report')) return 'report'
  if (hash.startsWith('#/styleguide')) return 'styleguide'
  return 'home'
}
