/**
 * Brief — real scenario menu.
 * Owner: Track B (Experience).
 *
 * Reads domain copy from src/content (Track C) and scenario specs from the
 * engine fixtures. It never computes physics: it only selects a scenario and
 * a player count, then hands the configuration to the mission store.
 */
import { useState } from 'react'
import { scenarioContent } from '@/content/scenarios'
import { scenarioFixtures } from '@/engine/__fixtures__/scenario-fixture'
import { syncShareUrl } from '@/app/share-url'
import type { ScenarioId } from '@/engine/types'
import { useMissionStore } from '@/store/mission'
import { useI18n } from '@/store/ui'
import { cx } from '@/ui/cx'
import { MenuPanel } from '@/ui/menu/MenuPanel'

const scenarioIds: ScenarioId[] = ['storm-watch', 'andes-flood-watch']

export function Brief() {
  const { t, lang } = useI18n()
  const draft = useMissionStore((state) => state.draft)
  const players = useMissionStore((state) => state.players)
  const startScenario = useMissionStore((state) => state.startScenario)
  const setPlayers = useMissionStore((state) => state.setPlayers)
  const loadExample = useMissionStore((state) => state.loadExample)
  const [scenarioId, setScenarioId] = useState<ScenarioId | null>(draft.scenarioId ?? null)

  function startMission() {
    if (!scenarioId) {
      return
    }
    startScenario(scenarioId)
    window.location.hash = '#/design'
    syncShareUrl(useMissionStore.getState().shareCode())
  }

  function startExample() {
    loadExample()
    window.location.hash = '#/design'
    syncShareUrl(useMissionStore.getState().shareCode())
  }

  return (
    <div className="space-y-8">
      <header className="max-w-3xl space-y-3">
        <p className="label-caps text-ink-3">{t.brief.eyebrow}</p>
        <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {t.brief.title}
        </h1>
        <p className="text-[15px] leading-relaxed text-ink-2">{t.brief.lead}</p>
      </header>

      <fieldset className="grid gap-4 md:grid-cols-2">
        <legend className="sr-only">{t.brief.title}</legend>
        {scenarioIds.map((id) => {
          const spec = scenarioFixtures[id]
          const copy = scenarioContent[lang][id]
          const selected = id === scenarioId
          return (
            <label
              key={id}
              className={cx(
                'relative flex h-full cursor-pointer flex-col rounded-3xl border p-5 transition-colors',
                'focus-within:ring-2 focus-within:ring-cream focus-within:ring-offset-2 focus-within:ring-offset-bg',
                selected
                  ? 'border-jade/60 bg-jade/10'
                  : 'border-border bg-surface hover:border-border-strong hover:bg-surface-2/60',
              )}
            >
              <input
                type="radio"
                name="scenario"
                value={id}
                checked={selected}
                onChange={() => setScenarioId(id)}
                className="sr-only"
              />

              <span className="flex items-start justify-between gap-3">
                <span className="font-display text-xl font-semibold text-ink">{copy.title}</span>
                {selected ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-jade/40 bg-jade/10 px-2.5 py-0.5 text-[11px] font-medium text-jade">
                    <span aria-hidden="true">✓</span>
                    {t.brief.selected}
                  </span>
                ) : null}
              </span>

              <span className="mt-2 block text-pretty text-[13px] leading-relaxed text-ink-2">
                {copy.summary}
              </span>
              <span className="mt-3 block text-pretty text-[13px] leading-relaxed text-ink-3">
                {copy.brief}
              </span>

              <span className="mt-auto grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
                <span className="block">
                  <span className="label-caps block text-ink-3">{t.brief.budget}</span>
                  <span className="num mt-1 block text-[13px] text-ink">
                    {'$'}
                    {spec.budgetUsdM}M
                  </span>
                </span>
                <span className="block">
                  <span className="label-caps block text-ink-3">{t.brief.duration}</span>
                  <span className="num mt-1 block text-[13px] text-ink">
                    {spec.durationDays} {t.brief.days}
                  </span>
                </span>
                <span className="block">
                  <span className="label-caps block text-ink-3">{t.brief.launchWindow}</span>
                  <span className="num mt-1 block text-[13px] text-ink">
                    {spec.launchWindowDays} {t.brief.days}
                  </span>
                </span>
                <span className="block">
                  <span className="label-caps block text-ink-3">{t.brief.requirements}</span>
                  <span className="num mt-1 block text-[13px] text-ink">
                    {spec.requirements.length}
                  </span>
                </span>
              </span>
            </label>
          )
        })}
      </fieldset>

      <MenuPanel className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="label-caps text-ink-3">{t.brief.players}</p>
          <div
            className="flex items-center gap-2"
            role="group"
            aria-label={t.brief.players}
            aria-describedby="players-hint"
          >
            {[1, 2, 3, 4].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setPlayers(count)}
                aria-pressed={players === count}
                aria-label={count === 1 ? t.brief.solo : `${count} ${t.brief.players}`}
                className={cx(
                  'grid size-10 place-items-center rounded-full border text-[13px] font-medium transition-colors',
                  players === count
                    ? 'border-cream bg-cream text-bg'
                    : 'border-border bg-surface-2 text-ink-2 hover:text-ink',
                )}
              >
                {count}
              </button>
            ))}
          </div>
          <p id="players-hint" className="text-[11px] text-ink-3">
            {t.brief.playersHint}
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <p id="requirements-hint" className="text-[11px] text-ink-3">
            {t.brief.requirementsHint}
          </p>
          <button
            type="button"
            onClick={startMission}
            disabled={!scenarioId}
            aria-describedby="requirements-hint"
            className="cta-glow inline-flex h-12 w-full items-center justify-center rounded-full bg-cream px-6 font-display text-sm font-semibold tracking-wide text-bg transition-colors duration-200 hover:bg-coral hover:text-on-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            {t.brief.start}
          </button>
          <button
            type="button"
            onClick={startExample}
            className="inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-[12px] text-ink-2 transition-colors hover:border-border-strong hover:text-ink"
          >
            {t.brief.loadExample}
          </button>
        </div>
      </MenuPanel>
    </div>
  )
}
