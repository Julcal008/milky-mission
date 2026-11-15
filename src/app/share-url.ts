/**
 * URL sync for shared missions. Owner: Track B.
 *
 * The `?m=` parameter is the only persistence for a mission today. Keeping it
 * current means a reload restores what the player is actually working on, and
 * starting/resetting a mission cannot silently resurrect an older share link.
 */
export function syncShareUrl(code: string | null): void {
  if (typeof window === 'undefined') {
    return
  }
  const url = new URL(window.location.href)
  if (code) {
    url.searchParams.set('m', code)
  } else {
    url.searchParams.delete('m')
  }
  window.history.replaceState(null, '', url)
}
