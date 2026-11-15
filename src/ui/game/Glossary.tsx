/** Plain-language glossary for the report — Owner: Track A (Report). */
import { Panel } from '@/ui/Panel'
import type { ReportCopy } from '@/app/screens/report-copy.en'

export function Glossary({ copy }: { copy: ReportCopy['glossary'] }) {
  const terms = Object.values(copy.terms) as Array<{ term: string; definition: string }>

  return (
    <Panel className="space-y-4 p-5">
      <div className="space-y-1">
        <h2 className="label-caps text-ink-2">{copy.title}</h2>
        <p className="text-[12px] leading-relaxed text-ink-2">{copy.lead}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {terms.map((item) => (
          <details key={item.term} className="rounded-md border border-border bg-surface-2/30 p-3">
            <summary className="cursor-pointer select-none text-[12px] font-medium text-ink hover:text-milk-strong">
              {item.term}
            </summary>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{item.definition}</p>
          </details>
        ))}
      </div>
    </Panel>
  )
}
