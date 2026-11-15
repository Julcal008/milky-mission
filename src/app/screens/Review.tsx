/**
 * Review screen — Owner: Track A (@Julcal008).
 * Budgets, chosen requirements and validation issues. If the draft is incomplete,
 * it shows exactly what is missing instead of pretending to validate.
 */
import { scenarioContent } from '@/content/scenarios'
import { scenarioFixtures } from '@/engine/__fixtures__/scenario-fixture'
import { MaskIcon } from '@/app/visuals/MaskIcon'
import { AiBackdrop } from '@/app/visuals/AiBackdrop'
import { useMissionStore } from '@/store/mission'
import { useI18n } from '@/store/ui'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { Panel } from '@/ui/Panel'
import { ResourceBar } from '@/ui/ResourceBar'

export function ReviewScreen() {
  const { t, lang } = useI18n()
  const config = useMissionStore((state) => state.config)
  const validation = useMissionStore((state) => state.validation)
  const missing = useMissionStore((state) => state.missing)
  const simulate = useMissionStore((state) => state.simulate)

  if (!config || !validation) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <header className="space-y-2">
          <p className="label-caps text-ink-3">{t.game.design.incomplete}</p>
          <h1 className="font-display text-3xl font-semibold text-ink">{t.game.review.title}</h1>
          <p className="text-[13px] text-ink-2">{t.game.design.validateAfter}</p>
        </header>
        <Panel className="space-y-3 border-warning/30 p-5">
          <h2 className="label-caps text-warning">{t.game.design.missingTitle}</h2>
          <ul className="space-y-1.5">
            {missing.map((key) => (
              <li key={key} className="flex items-start gap-2 text-[12px] text-ink-2">
                <span aria-hidden="true" className="mt-1.5 size-1.5 rounded-full bg-warning" />
                {t.game.design.missing[key]}
              </li>
            ))}
          </ul>
        </Panel>
        <Button variant="primary" onClick={() => (window.location.hash = '#/design')}>
          {t.game.review.back}
        </Button>
      </div>
    )
  }

  const scenario = scenarioFixtures[config.scenarioId]
  const copy = scenarioContent[lang][config.scenarioId]
  const budgets = validation.budgets
  const validationCopy = t.game.validation as Record<string, string>

  const massMarginPct =
    budgets.massCapacityKg > 0
      ? ((budgets.massCapacityKg - budgets.massKg) / budgets.massCapacityKg) * 100
      : 0
  const deliveredPct =
    budgets.dataGbPerDay > 0
      ? Math.min(100, (budgets.downlinkGbPerDay / budgets.dataGbPerDay) * 100)
      : 100

  const runSimulation = () => {
    const result = simulate()
    if (result) {
      window.location.hash = '#/simulate'
    }
  }

  return (
    <AiBackdrop file="review/summary-bg.webp" className="p-0">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <p className="label-caps text-ink-3">{copy.title}</p>
          <h1 className="font-display text-3xl font-semibold text-ink">{t.game.review.title}</h1>
          <p className="text-[13px] text-ink-2">{t.game.review.lead}</p>
        </header>

        <Panel className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <ResourceBar
            label={t.game.design.gauges.mass}
            value={budgets.massKg}
            max={budgets.massCapacityKg || 1}
            unit="kg"
            tone="mass"
            status={`${massMarginPct.toFixed(1)} % margin`}
            statusTone={massMarginPct < 0 ? 'danger' : massMarginPct < 20 ? 'warning' : 'success'}
          />
          <ResourceBar
            label={t.game.design.gauges.power}
            value={Math.max(0, budgets.powerMarginW)}
            max={100}
            unit="W"
            tone="power"
            status={`${budgets.powerMarginW.toFixed(1)} W margin`}
            statusTone={
              budgets.powerMarginW < 0
                ? 'danger'
                : budgets.powerMarginW < 20
                  ? 'warning'
                  : 'success'
            }
          />
          <ResourceBar
            label={t.game.design.gauges.budget}
            value={budgets.costUsdM}
            max={budgets.budgetUsdM}
            unit="$M"
            tone="budget"
            status={`$${(budgets.budgetUsdM - budgets.costUsdM).toFixed(1)}M remaining`}
            statusTone={budgets.costUsdM > budgets.budgetUsdM ? 'danger' : 'success'}
          />
          <ResourceBar
            label={t.game.design.gauges.data}
            value={budgets.downlinkGbPerDay}
            max={Math.max(budgets.dataGbPerDay, 0.001)}
            unit="Gb/day"
            tone="data"
            status={`${deliveredPct.toFixed(0)} % delivered`}
            statusTone={deliveredPct < 70 ? 'warning' : 'success'}
          />
          <ResourceBar
            label={t.game.design.gauges.time}
            value={budgets.lifetimeDays}
            max={scenario.durationDays}
            unit="days"
            tone="time"
            status={`${budgets.lifetimeDays} / ${scenario.durationDays} days`}
            statusTone={budgets.lifetimeDays < scenario.durationDays ? 'warning' : 'success'}
          />
          <div className="flex flex-col justify-center gap-1">
            <span className="label-caps text-ink-3">{t.game.review.reliability}</span>
            <span className="num text-[15px] text-ink">
              {(budgets.reliability * 100).toFixed(0)} %
            </span>
            <span className="text-[11px] text-ink-3">{t.game.review.reliabilityHint}</span>
          </div>
        </Panel>

        <div className="grid gap-5 lg:grid-cols-2">
          <Panel className="space-y-3 p-5">
            <h2 className="label-caps text-ink-2">{t.game.review.requirements}</h2>
            <ul className="space-y-2">
              {scenario.requirements
                .filter((requirement) => config.requirements.includes(requirement.id))
                .map((requirement) => {
                  const index = scenario.requirements.findIndex(
                    (item) => item.id === requirement.id,
                  )
                  const key = `r${index + 1}` as 'r1' | 'r2' | 'r3' | 'r4' | 'r5' | 'r6'
                  const requirementCopy = copy[key]
                  return (
                    <li key={requirement.id} className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[13px] font-medium text-ink">
                          {requirementCopy?.title ?? requirement.id}
                        </p>
                        <p className="mt-0.5 text-[11px] text-ink-3">
                          {requirementCopy?.description ?? ''}
                        </p>
                      </div>
                      <Badge tone="info" className="shrink-0 whitespace-nowrap">
                        {requirement.weight} pts
                      </Badge>
                    </li>
                  )
                })}
            </ul>
          </Panel>

          <Panel className="space-y-3 p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="label-caps text-ink-2">{t.game.review.issues}</h2>
              <Badge tone={validation.ok ? 'success' : 'danger'}>
                {validation.ok ? t.game.review.ok : t.game.review.blocking}
              </Badge>
            </div>
            {validation.issues.length === 0 ? (
              <p className="text-[12px] text-ink-3">{t.game.review.noIssues}</p>
            ) : (
              <ul className="space-y-2">
                {validation.issues.map((issue) => (
                  <li key={`${issue.code}-${issue.field}`} className="flex items-start gap-2">
                    <Badge
                      tone={
                        issue.severity === 'error'
                          ? 'danger'
                          : issue.severity === 'warning'
                            ? 'warning'
                            : 'info'
                      }
                    >
                      <MaskIcon
                        file={
                          issue.severity === 'error'
                            ? 'icons/review/nogo.svg'
                            : issue.severity === 'warning'
                              ? 'icons/review/conditional.svg'
                              : 'icons/simulate/anomaly.svg'
                        }
                        className="size-3.5"
                      />
                      {t.common.severity[issue.severity]}
                    </Badge>
                    <div>
                      <p className="text-[12px] leading-relaxed text-ink-2">
                        {validationCopy[issue.code] ?? issue.code}
                      </p>
                      {issue.detail ? (
                        <p className="num mt-0.5 text-[10px] text-ink-3">
                          {Object.entries(issue.detail)
                            .map(([key, value]) => `${key}=${String(value)}`)
                            .join(' · ')}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button variant="secondary" onClick={() => (window.location.hash = '#/design')}>
            {t.game.review.back}
          </Button>
          <Button variant="primary" onClick={runSimulation}>
            {t.game.review.simulate}
          </Button>
        </div>
      </div>
    </AiBackdrop>
  )
}
