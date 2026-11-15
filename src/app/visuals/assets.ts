/**
 * Visual asset URLs.
 * Owner: Track B. Assets live in `public/visuals/` so they work with the
 * relative Vite base used on GitHub Pages.
 */
export function visualUrl(file: string): string {
  return `${import.meta.env.BASE_URL}visuals/${file.replace(/^\/+/, '')}`
}
