/**
 * Field guide drawer — Owner: Track B.
 *
 * Learns the player without leaving the mission: design steps, catalog components,
 * validation risks, glossary and the model assumptions. It reads catalogs and the
 * shared dictionaries; it never computes physics.
 */
import { useEffect, useRef } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { catalogs } from '@/data/catalogs'
import { useGuideStore, useI18n } from '@/store/ui'
import type { GuideTab } from '@/store/ui'
import { Badge } from '@/ui/Badge'
import { cx } from '@/ui/cx'
import { ComponentMeta } from '@/ui/game/ComponentMeta'
import type { MetaKind } from '@/ui/game/ComponentMeta'

type MetaItem = Parameters<typeof ComponentMeta>[0]['item']

const kindOrder: MetaKind[] = [
  'orbit',
  'launcher',
  'bus',
  'propulsion',
  'array',
  'battery',
  'comms',
  'network',
  'storage',
  'instrument',
]

const catalogByKind: Record<MetaKind, MetaItem[]> = {
  orbit: catalogs.orbits,
  launcher: catalogs.launchers,
  bus: catalogs.buses,
  propulsion: catalogs.propulsion,
  array: catalogs.arrays,
  battery: catalogs.batteries,
  comms: catalogs.comms,
  network: catalogs.groundNetworks,
  storage: catalogs.storage,
  instrument: catalogs.instruments,
}

const tabs: GuideTab[] = ['basics', 'components', 'risks', 'glossary', 'model']

type RiskEntry = {
  what: string
  fix: string
  severity: 'error' | 'warning' | 'info'
}

function severityTone(severity: RiskEntry['severity']): 'danger' | 'warning' | 'info' {
  return severity === 'error' ? 'danger' : severity === 'warning' ? 'warning' : 'info'
}

export function FieldGuide() {
  const { t } = useI18n()
  const open = useGuideStore((state) => state.open)
  const tab = useGuideStore((state) => state.tab)
  const query = useGuideStore((state) => state.query)
  const closeGuide = useGuideStore((state) => state.closeGuide)
  const setGuideTab = useGuideStore((state) => state.setGuideTab)
  const setGuideQuery = useGuideStore((state) => state.setGuideQuery)
  const panelRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeGuide()
        return
      }
      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, summary, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      previous?.focus()
    }
  }, [open, closeGuide])

  const q = query.trim().toLowerCase()
  const matches = (value: string) => !q || value.toLowerCase().includes(q)

  const designLabels: Record<MetaKind, string> = {
    orbit: t.game.design.orbit,
    launcher: t.game.design.launcher,
    bus: t.game.design.bus,
    propulsion: t.game.design.propulsion,
    array: t.game.design.array,
    battery: t.game.design.battery,
    comms: t.game.design.comms,
    network: t.game.design.groundNetwork,
    storage: t.game.design.storage,
    instrument: t.game.design.instruments,
  }

  const basicSteps = t.learn.basics.steps.filter(
    (step) => matches(step.title) || matches(step.why) || matches(step.mistake),
  )

  const componentSections = kindOrder
    .map((kind) => {
      const category = t.learn.components.categories[kind]
      const label = designLabels[kind]
      const items = catalogByKind[kind]
      const categoryHit =
        matches(label) ||
        matches(category.what) ||
        matches(category.use) ||
        category.risks.some(matches)
      const visibleItems = categoryHit ? items : items.filter((item) => matches(item.name))
      return {
        kind,
        label,
        category,
        items: visibleItems,
        visible: !q || categoryHit || visibleItems.length > 0,
      }
    })
    .filter((section) => section.visible)

  const riskEntries = Object.entries(t.learn.risks.entries).map(([code, entry]) => ({
    code,
    what: entry.what,
    fix: entry.fix,
    severity: entry.severity as RiskEntry['severity'],
  }))
  const validationCopy = t.game.validation as Record<string, string>
  const visibleRisks = riskEntries.filter(
    (entry) =>
      matches(entry.code) ||
      matches(validationCopy[entry.code] ?? entry.code) ||
      matches(entry.what) ||
      matches(entry.fix),
  )

  const terms = t.learn.glossary.terms.filter(
    (item) => matches(item.term) || matches(item.definition),
  )

  const modelLines = [
    t.game.model.mass,
    t.game.model.power,
    t.game.model.link,
    t.game.model.data,
    t.game.model.events,
    t.game.model.limits,
  ].filter(matches)

  const hasResults =
    tab === 'basics'
      ? basicSteps.length > 0
      : tab === 'components'
        ? componentSections.length > 0
        : tab === 'risks'
          ? visibleRisks.length > 0
          : tab === 'glossary'
            ? terms.length > 0
            : modelLines.length > 0

  function onTabKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const delta = event.key === 'ArrowRight' ? 1 : -1
    const next = (index + delta + tabs.length) % tabs.length
    setGuideTab(tabs[next])
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]',
    )
    buttons?.[next]?.focus()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <div
        className="absolute inset-0 bg-bg/75 backdrop-blur-sm"
        onClick={closeGuide}
        aria-hidden="true"
      />

      <aside
        ref={panelRef}
        id="field-guide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="field-guide-title"
        className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-2xl"
      >
        <header className="border-b border-border p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="field-guide-title" className="font-display text-xl font-semibold text-ink">
                {t.learn.title}
              </h2>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-2">{t.learn.lead}</p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={closeGuide}
              aria-label={t.learn.close}
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-ink-2 transition-colors hover:border-border-strong hover:text-ink"
            >
              ×
            </button>
          </div>

          <label className="mt-4 block">
            <span className="sr-only">{t.learn.search}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setGuideQuery(event.target.value)}
              placeholder={t.learn.search}
              className="h-9 w-full rounded-md border border-border bg-bg/60 px-3 text-[13px] text-ink placeholder:text-ink-3 focus:border-border-strong focus:outline-none"
            />
          </label>

          <div role="tablist" aria-label={t.learn.title} className="mt-4 flex gap-1 overflow-x-auto">
            {tabs.map((item, index) => (
              <button
                key={item}
                id={`guide-tab-${item}`}
                type="button"
                role="tab"
                aria-selected={tab === item}
                aria-controls="guide-panel"
                onClick={() => setGuideTab(item)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                className={cx(
                  'shrink-0 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors',
                  tab === item
                    ? 'bg-cream text-bg'
                    : 'text-ink-3 hover:bg-surface-2 hover:text-ink',
                )}
              >
                {t.learn.tabs[item]}
              </button>
            ))}
          </div>
        </header>

        <div
          id="guide-panel"
          role="tabpanel"
          aria-labelledby={`guide-tab-${tab}`}
          tabIndex={0}
          className="flex-1 overflow-y-auto p-5"
        >
          {!hasResults ? <p className="text-[12px] text-ink-3">{t.learn.empty}</p> : null}

          {tab === 'basics' && hasResults ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-[15px] font-semibold text-ink">{t.learn.basics.title}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-2">
                  {t.learn.basics.intro}
                </p>
              </div>
              <ol className="space-y-3">
                {basicSteps.map((step, index) => (
                  <li key={step.title} className="rounded-lg border border-border bg-surface-2/30 p-4">
                    <p className="flex items-baseline gap-2">
                      <span className="num text-[11px] text-ink-3">0{index + 1}</span>
                      <span className="text-[13px] font-semibold text-ink">{step.title}</span>
                    </p>
                    <p className="mt-2 text-[12px] leading-relaxed text-ink-2">{step.why}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-warning">⚠ {step.mistake}</p>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {tab === 'components' && hasResults ? (
            <div className="space-y-5">
              <div>
                <h3 className="text-[15px] font-semibold text-ink">{t.learn.components.title}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-2">
                  {t.learn.components.intro}
                </p>
              </div>
              {componentSections.map(({ kind, label, category, items }) => (
                <section
                  key={kind}
                  className="space-y-2 border-t border-border/70 pt-4 first:border-t-0 first:pt-0"
                >
                  <h4 className="text-[13px] font-semibold text-ink">{label}</h4>
                  <p className="text-[12px] leading-relaxed text-ink-2">{category.what}</p>
                  <p className="text-[12px] leading-relaxed text-ink-2">
                    <span className="font-medium text-ink">{t.learn.components.use}:</span>{' '}
                    {category.use}
                  </p>
                  <ul className="space-y-1 text-[11px] leading-relaxed text-ink-3">
                    {category.risks.map((risk) => (
                      <li key={risk}>• {risk}</li>
                    ))}
                  </ul>
                  <details className="rounded-md border border-border/70 bg-surface-2/20">
                    <summary className="cursor-pointer px-3 py-2 text-[11px] font-medium text-ink-2">
                      {t.learn.components.items} ({items.length})
                    </summary>
                    <div className="space-y-2 border-t border-border/70 p-3">
                      {items.map((item) => (
                        <details
                          key={item.id}
                          className="rounded-md border border-border/60 bg-surface p-2"
                        >
                          <summary className="cursor-pointer text-[12px] text-ink">
                            {item.name}
                          </summary>
                          <div className="mt-2">
                            <ComponentMeta kind={kind} item={item} />
                          </div>
                        </details>
                      ))}
                    </div>
                  </details>
                </section>
              ))}
            </div>
          ) : null}

          {tab === 'risks' && hasResults ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-[15px] font-semibold text-ink">{t.learn.risks.title}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-2">
                  {t.learn.risks.intro}
                </p>
              </div>
              <ul className="space-y-3">
                {visibleRisks.map((entry) => (
                  <li key={entry.code} className="rounded-lg border border-border bg-surface-2/30 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-[13px] font-semibold text-ink">
                        {validationCopy[entry.code] ?? entry.code}
                      </h4>
                      <Badge tone={severityTone(entry.severity)}>
                        {t.common.severity[entry.severity]}
                      </Badge>
                    </div>
                    <p className="mt-2 text-[12px] leading-relaxed text-ink-2">
                      <span className="font-medium text-ink">{t.learn.risks.what}:</span> {entry.what}
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-ink-2">
                      <span className="font-medium text-ink">{t.learn.risks.fix}:</span> {entry.fix}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {tab === 'glossary' && hasResults ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-[15px] font-semibold text-ink">{t.learn.glossary.title}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-2">
                  {t.learn.glossary.intro}
                </p>
              </div>
              <dl className="space-y-3">
                {terms.map((item) => (
                  <div key={item.term} className="rounded-lg border border-border bg-surface-2/30 p-4">
                    <dt className="text-[13px] font-semibold text-ink">{item.term}</dt>
                    <dd className="mt-1 text-[12px] leading-relaxed text-ink-2">
                      {item.definition}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {tab === 'model' && hasResults ? (
            <div className="space-y-3">
              <h3 className="text-[15px] font-semibold text-ink">{t.game.model.title}</h3>
              <ul className="space-y-2 text-[12px] leading-relaxed text-ink-2">
                {modelLines.map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
              <p className="text-[10px] leading-relaxed text-ink-3">{t.game.model.sources}</p>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  )
}
