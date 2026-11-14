/** Shared placeholder for screens that are still being built (scaffolding). */
import { Panel } from '@/ui/Panel'

export function ScreenPlaceholder({ title, owner }: { title: string; owner: string }) {
  return (
    <Panel className="p-6">
      <p className="label-caps text-ink-3">Coming soon</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">{title}</h1>
      <p className="mt-2 text-[13px] text-ink-2">{owner}</p>
    </Panel>
  )
}
