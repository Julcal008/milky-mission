import type { ReactNode } from 'react'
import { AmbientLayer } from './AmbientLayer'
import { ENABLE_VISUAL_LAYER } from './config'
import { VisualBoundary } from './VisualBoundary'

/** Shared report background and content stacking. Owner: Track B. */
export function ReportFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate">
      {ENABLE_VISUAL_LAYER ? (
        <VisualBoundary fallback={null}>
          <AmbientLayer />
        </VisualBoundary>
      ) : null}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
