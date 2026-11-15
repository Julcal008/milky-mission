/**
 * App shell — header, hash-based routing and footer.
 * Owner: Track B (Experience).
 *
 * Routing is intentionally trivial: the game is a single-page flow driven by
 * the mission phase. The hash is only used for internal tools (styleguide).
 */
import { useEffect, useState } from 'react'
import { Brief } from '@/app/Brief'
import { Home } from '@/app/Home'
import { routeFromHash } from '@/app/routes'
import { DesignScreen } from '@/app/screens/Design'
import { MapScreen } from '@/app/screens/Map'
import { ReportScreen } from '@/app/screens/Report'
import { ReviewScreen } from '@/app/screens/Review'
import { SimulateScreen } from '@/app/screens/Simulate'
import { Styleguide } from '@/app/Styleguide'
import { useI18n, useUiStore } from '@/store/ui'
import { cx } from '@/ui/cx'
import { LogoMark } from '@/ui/LogoMark'

export function App() {
  const [route, setRoute] = useState(() => routeFromHash(window.location.hash))
  const { t, lang, setLang } = useI18n()
  const density = useUiStore((state) => state.density)
  const setDensity = useUiStore((state) => state.setDensity)

  useEffect(() => {
    const onHashChange = () => setRoute(routeFromHash(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.density = density
  }, [density])

  return (
    <div className="space-bg flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#/" className="group flex items-center gap-3" aria-label={t.brand.name}>
            <LogoMark />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[13px] font-semibold tracking-[0.2em] text-ink">
                {t.brand.name}
              </span>
              <span className="mt-1 text-[10px] tracking-wide text-ink-3">Kessler Syndrome</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 sm:flex" aria-label="Main">
            <a
              href="#/"
              className={cx(
                'rounded-sm px-3 py-1.5 text-[13px] transition-colors',
                route === 'home' ? 'bg-white/5 text-ink' : 'text-ink-2 hover:text-ink',
              )}
            >
              {t.nav.home}
            </a>
            <a
              href="#/brief"
              className={cx(
                'rounded-sm px-3 py-1.5 text-[13px] transition-colors',
                route === 'brief' ? 'bg-white/5 text-ink' : 'text-ink-2 hover:text-ink',
              )}
            >
              {t.nav.brief}
            </a>
            <a
              href="#/styleguide"
              className={cx(
                'rounded-sm px-3 py-1.5 text-[13px] transition-colors',
                route === 'styleguide' ? 'bg-white/5 text-ink' : 'text-ink-2 hover:text-ink',
              )}
            >
              {t.nav.styleguide}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <div
              className="flex items-center rounded-md border border-border bg-surface p-0.5"
              role="group"
              aria-label={t.nav.language}
            >
              {(['en', 'es'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={cx(
                    'rounded-sm px-2 py-1 text-[11px] font-semibold tracking-wider transition-colors',
                    lang === code ? 'bg-milk text-[#141013]' : 'text-ink-3 hover:text-ink',
                  )}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setDensity(density === 'compact' ? 'presentation' : 'compact')}
              aria-pressed={density === 'presentation'}
              title={t.nav.presentation}
              className={cx(
                'hidden h-8 items-center rounded-md border px-2.5 text-[11px] font-medium tracking-wide transition-colors sm:flex',
                density === 'presentation'
                  ? 'border-ion/50 bg-ion/10 text-ion'
                  : 'border-border bg-surface text-ink-3 hover:text-ink',
              )}
            >
              Aa
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
        {route === 'brief' ? (
          <Brief />
        ) : route === 'design' ? (
          <DesignScreen />
        ) : route === 'review' ? (
          <ReviewScreen />
        ) : route === 'simulate' ? (
          <SimulateScreen />
        ) : route === 'report' ? (
          <ReportScreen />
        ) : route === 'map' ? (
          <MapScreen />
        ) : route === 'styleguide' ? (
          <Styleguide />
        ) : (
          <Home />
        )}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-6 text-[11px] text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>{t.footer.madeFor}</span>
          <span className="flex items-center gap-2">
            <span className="text-ink-2">{t.footer.credit}</span>
            <span aria-hidden="true">·</span>
            <a href="#/styleguide" className="hover:text-ink">
              {t.footer.docs}
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
