import { ENABLE_VISUAL_LAYER } from './config'
import scoreRingAnimated from './svg/score-ring.svg?raw'
import scoreRingStatic from './svg/score-ring-static.svg?raw'
import { useReducedMotion } from './useReducedMotion'
import { VisualBoundary } from './VisualBoundary'

export interface ScoreRingProps {
  total: number
  grade: string
  labels?: {
    total?: string
    grade?: string
  }
}

/**
 * Report score ring. The SVG is inlined so the arc reflects the real score;
 * the number and grade stay as accessible HTML on top. Labels are passed in so
 * the component does not depend on a specific i18n dictionary.
 * Owner: Track B.
 */
export function ScoreRing({ total, grade, labels }: ScoreRingProps) {
  const reducedMotion = useReducedMotion()
  const totalLabel = labels?.total ?? 'Total'
  const gradeLabel = labels?.grade ?? 'Grade'

  const plainScore = (
    <div className="text-right">
      <p className="num text-3xl text-ink">
        {total}
        <span className="text-ink-2"> / 1000</span>
      </p>
      <p className="text-[11px] text-ink-2">
        {gradeLabel} <span className="text-ink">{grade}</span>
      </p>
    </div>
  )

  if (!ENABLE_VISUAL_LAYER) {
    return plainScore
  }

  const progress = Math.min(1, Math.max(0, total / 1000))
  const dash = (progress * 2 * Math.PI * 88).toFixed(1)
  const source = reducedMotion ? scoreRingStatic : scoreRingAnimated
  const svg = source
    .replace('<svg ', '<svg class="h-full w-full" ')
    .replace('stroke-dasharray="440 553"', `stroke-dasharray="${dash} 553"`)

  return (
    <VisualBoundary fallback={plainScore}>
      <div
        className="relative size-36 sm:size-40"
        role="img"
        aria-label={`${totalLabel}: ${total} / 1000. ${gradeLabel} ${grade}.`}
      >
        <div
          className="absolute inset-0"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
        >
          <span className="num text-2xl text-ink">{total}</span>
          <span className="text-[10px] text-ink-2">/ 1000</span>
          <span className="mt-1 text-[10px] text-ink-2">
            {gradeLabel} <span className="text-ink">{grade}</span>
          </span>
        </div>
      </div>
    </VisualBoundary>
  )
}
