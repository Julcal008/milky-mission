/**
 * Home / placeholder screen.
 * This is NOT the game: it documents the foundation and points to the next phase.
 * Owner: Track B (Experience).
 */
import { useI18n } from '@/store/ui'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { Panel } from '@/ui/Panel'

export function Home() {
  const { t } = useI18n()

  const next = [t.home.nextItems.contract, t.home.nextItems.design, t.home.nextItems.simulation]

  return (
    <div className="space-y-12">
      <section className="max-w-3xl space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="info">{t.home.eyebrow}</Badge>
          <Badge tone="warning">{t.common.badgePrototype}</Badge>
        </div>
        <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-5xl">
          {t.home.title}
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-ink-2">{t.home.lead}</p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button variant="primary" disabled>
            {t.home.primaryCta}
          </Button>
          <a href="#/styleguide">
            <Button variant="secondary">{t.home.secondaryCta}</Button>
          </a>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel className="p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="label-caps text-ink-2">{t.home.statusTitle}</h2>
            <Badge tone="success">Phase 0</Badge>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">{t.home.statusLead}</p>
          <ul className="mt-5 space-y-2 text-[13px] text-ink-2">
            {[
              'Vite + React + TypeScript + Tailwind v4',
              'Design tokens and component primitives',
              'i18n scaffold (EN default, ES toggle)',
              'Engine contract and unit helpers',
              'Docs, CODEOWNERS, CI and Pages workflow',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1.5 size-1.5 rounded-full bg-success" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="p-6">
          <h2 className="label-caps text-ink-2">{t.home.nextTitle}</h2>
          <ol className="mt-4 space-y-4">
            {next.map((item, index) => (
              <li key={item.title} className="flex gap-3">
                <span className="num mt-0.5 text-[11px] text-ink-3">0{index + 1}</span>
                <div>
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-ink-3">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      </section>

      <section>
        <Panel className="border-border/70 bg-surface/60 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="label-caps text-ink-2">{t.home.sourcesTitle}</h2>
            <Badge tone="info">DONKI · POWER · GIBS</Badge>
          </div>
          <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-ink-3">
            {t.home.sourcesBody}
          </p>
        </Panel>
      </section>
    </div>
  )
}
