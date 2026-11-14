/**
 * Internal styleguide (route #/styleguide).
 * Purpose: both contributors build the same UI without guessing tokens.
 * This page is not part of the game flow and never ships in the demo narrative.
 */
import { useI18n } from '@/store/ui'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { Panel } from '@/ui/Panel'
import { ResourceBar } from '@/ui/ResourceBar'

interface Swatch {
  name: string
  hex: string
  className: string
}

const baseSwatches: Swatch[] = [
  { name: 'bg', hex: '#070A12', className: 'bg-bg' },
  { name: 'surface', hex: '#0D1320', className: 'bg-surface' },
  { name: 'surface-2', hex: '#131B2C', className: 'bg-surface-2' },
  { name: 'border', hex: '#223049', className: 'bg-border' },
  { name: 'ink', hex: '#E9EEF8', className: 'bg-ink' },
  { name: 'ink-2', hex: '#A7B3C9', className: 'bg-ink-2' },
  { name: 'ink-3', hex: '#6B7A93', className: 'bg-ink-3' },
]

const brandSwatches: Swatch[] = [
  { name: 'milk', hex: '#F4E3C1', className: 'bg-milk' },
  { name: 'milk-strong', hex: '#FFD79A', className: 'bg-milk-strong' },
  { name: 'ion', hex: '#6EA8FF', className: 'bg-ion' },
]

const semanticSwatches: Swatch[] = [
  { name: 'success', hex: '#3DDC97', className: 'bg-success' },
  { name: 'warning', hex: '#FFC857', className: 'bg-warning' },
  { name: 'danger', hex: '#FF6B6B', className: 'bg-danger' },
  { name: 'info', hex: '#6EA8FF', className: 'bg-info' },
]

const roleSwatches: Swatch[] = [
  { name: 'director', hex: '#F5B84C', className: 'bg-role-director' },
  { name: 'systems', hex: '#6EA8FF', className: 'bg-role-systems' },
  { name: 'science', hex: '#C084FC', className: 'bg-role-science' },
  { name: 'comms', hex: '#2DD4BF', className: 'bg-role-comms' },
]

const resourceSwatches: Swatch[] = [
  { name: 'mass', hex: '#FF8A5B', className: 'bg-res-mass' },
  { name: 'power', hex: '#FFD166', className: 'bg-res-power' },
  { name: 'budget', hex: '#3DDC97', className: 'bg-res-budget' },
  { name: 'data', hex: '#6EA8FF', className: 'bg-res-data' },
  { name: 'link', hex: '#2DD4BF', className: 'bg-res-link' },
  { name: 'time', hex: '#C084FC', className: 'bg-res-time' },
]

function SwatchGrid({ items }: { items: Swatch[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.name} className="rounded-md border border-border bg-surface-2/40 p-3">
          <div className={`h-10 w-full rounded-sm ${item.className}`} />
          <p className="mt-2 text-[12px] font-medium text-ink">{item.name}</p>
          <p className="num text-[10px] text-ink-3">{item.hex}</p>
        </div>
      ))}
    </div>
  )
}

function SectionTitle({ children }: { children: string }) {
  return <h2 className="label-caps mb-4 text-ink-2">{children}</h2>
}

export function Styleguide() {
  const { t } = useI18n()

  return (
    <div className="space-y-12">
      <header className="max-w-3xl">
        <h1 className="font-display text-3xl font-semibold text-ink">{t.styleguide.title}</h1>
        <p className="mt-2 text-[15px] text-ink-2">{t.styleguide.lead}</p>
      </header>

      <section>
        <SectionTitle>{t.styleguide.base}</SectionTitle>
        <SwatchGrid items={baseSwatches} />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <SectionTitle>{t.styleguide.brand}</SectionTitle>
          <SwatchGrid items={brandSwatches} />
        </div>
        <div>
          <SectionTitle>{t.styleguide.semantic}</SectionTitle>
          <SwatchGrid items={semanticSwatches} />
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <SectionTitle>{t.styleguide.roles}</SectionTitle>
          <SwatchGrid items={roleSwatches} />
        </div>
        <div>
          <SectionTitle>{t.styleguide.resources}</SectionTitle>
          <SwatchGrid items={resourceSwatches} />
        </div>
      </section>

      <section>
        <SectionTitle>{t.styleguide.typography}</SectionTitle>
        <Panel className="space-y-6 p-6">
          <div>
            <p className="mb-2 text-[10px] text-ink-3">Space Grotesk · 48 / 600</p>
            <p className="font-display text-5xl font-semibold leading-none text-ink">
              Orbit at 550 km
            </p>
          </div>
          <div>
            <p className="mb-2 text-[10px] text-ink-3">Space Grotesk · 32 / 600</p>
            <p className="font-display text-3xl font-semibold text-ink">Mission board</p>
          </div>
          <div>
            <p className="mb-2 text-[10px] text-ink-3">Inter · 15 / 400</p>
            <p className="max-w-2xl text-[15px] leading-relaxed text-ink-2">
              Adding a more capable instrument increases scientific value while also increasing
              mass, power consumption, data volume and cost. Every decision has a price.
            </p>
          </div>
          <div>
            <p className="mb-2 text-[10px] text-ink-3">Label caps · 11 / 600</p>
            <p className="label-caps text-ink-2">Mass budget · 412 / 500 kg</p>
          </div>
          <div>
            <p className="mb-2 text-[10px] text-ink-3">JetBrains Mono · tabular numbers</p>
            <p className="num text-[13px] text-ink">1 234.5 kWh · 12.4 Mbps · $43.2M · 97.4°</p>
          </div>
        </Panel>
      </section>

      <section>
        <SectionTitle>{t.styleguide.buttons}</SectionTitle>
        <Panel className="flex flex-wrap items-center gap-3 p-6">
          <Button variant="primary">Simulate mission</Button>
          <Button variant="secondary">Review design</Button>
          <Button variant="ghost">Skip</Button>
          <Button variant="danger">Abort launch</Button>
          <Button variant="primary" disabled>
            Locked
          </Button>
        </Panel>
      </section>

      <section>
        <SectionTitle>{t.styleguide.badges}</SectionTitle>
        <Panel className="flex flex-wrap items-center gap-2 p-6">
          <Badge>Neutral</Badge>
          <Badge tone="success">Requirement met</Badge>
          <Badge tone="warning">Margin below 20%</Badge>
          <Badge tone="danger">Over budget</Badge>
          <Badge tone="info">NASA DONKI</Badge>
        </Panel>
      </section>

      <section>
        <SectionTitle>{t.styleguide.gauges}</SectionTitle>
        <Panel className="grid gap-6 p-6 md:grid-cols-2">
          <ResourceBar
            label="Mass"
            value={198}
            max={250}
            unit="kg"
            tone="mass"
            status="20.8% margin"
            statusTone="warning"
          />
          <ResourceBar
            label="Power"
            value={153}
            max={220}
            unit="W"
            tone="power"
            status="30.5% margin"
            statusTone="success"
          />
          <ResourceBar
            label="Budget"
            value={43.2}
            max={50}
            unit="$M"
            tone="budget"
            status="$6.8M remaining"
            statusTone="success"
          />
          <ResourceBar
            label="Science data"
            value={3.5}
            max={4.06}
            unit="Gb/day"
            tone="data"
            status="86% downlinked"
            statusTone="success"
          />
          <ResourceBar
            label="Downlink"
            value={3.5}
            max={6}
            unit="Gb/day"
            tone="link"
            status="S-band · 6 passes/day"
          />
          <ResourceBar
            label="Mission time"
            value={274}
            max={365}
            unit="days"
            tone="time"
            status="Day 274 · nominal ops"
          />
        </Panel>
      </section>

      <section>
        <SectionTitle>{t.styleguide.usage}</SectionTitle>
        <Panel className="p-6">
          <ul className="grid gap-2 text-[13px] text-ink-2 sm:grid-cols-2">
            {[
              'One primary (milk) action per screen.',
              'Never communicate state by color alone: pair it with text or an icon.',
              'All numbers use .num and show their unit.',
              'Two accents maximum per screen: milk for action, ion for data.',
              'No hardcoded hex values in components: use tokens.',
              'Empty slots use a dashed border, never a disabled-looking box.',
              'Motion: 150-250 ms, ease-out; respect prefers-reduced-motion.',
              'British or American English? Pick one: American English.',
            ].map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ion" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </section>
    </div>
  )
}
