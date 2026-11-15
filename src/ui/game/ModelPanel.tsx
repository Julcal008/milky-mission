/** Model and NASA data transparency panel — Owner: Track A (UI sprint). */
import { useI18n } from '@/store/ui'
import { Panel } from '@/ui/Panel'

export function ModelPanel() {
  const { t } = useI18n()
  const model = t.game.model

  return (
    <Panel className="space-y-3 p-5">
      <h2 className="label-caps text-ink-2">{model.title}</h2>
      <ul className="grid gap-2 text-[12px] leading-relaxed text-ink-2 sm:grid-cols-2">
        <li>• {model.mass}</li>
        <li>• {model.power}</li>
        <li>• {model.link}</li>
        <li>• {model.data}</li>
        <li>• {model.events}</li>
        <li>• {model.limits}</li>
      </ul>
      <p className="text-[11px] text-ink-3">{model.sources}</p>
    </Panel>
  )
}
