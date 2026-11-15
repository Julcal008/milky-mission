/** Header button that opens the field guide. Owner: Track B. */
import { useI18n, useGuideStore } from '@/store/ui'

export function GuideButton() {
  const { t } = useI18n()
  const open = useGuideStore((state) => state.open)
  const openGuide = useGuideStore((state) => state.openGuide)

  return (
    <button
      type="button"
      onClick={() => openGuide()}
      aria-label={t.learn.open}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls="field-guide"
      title={t.learn.open}
      className="flex size-8 items-center justify-center rounded-full border border-border bg-surface text-[13px] font-semibold text-ink-2 transition-colors hover:border-border-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
    >
      ?
    </button>
  )
}
