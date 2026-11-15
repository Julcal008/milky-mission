/** Visible watermark for AI-generated decorative imagery (Space Apps rule). */
import { useI18n } from '@/store/ui'
import { cx } from '@/ui/cx'

export function AiArtBadge({ className }: { className?: string }) {
  const { t } = useI18n()
  return (
    <span
      className={cx(
        'pointer-events-none inline-flex items-center rounded-full border border-white/20',
        'bg-bg/85 px-2.5 py-1 text-[10px] font-medium tracking-wide text-ink-2 backdrop-blur',
        className,
      )}
    >
      {t.common.aiArt}
    </span>
  )
}
