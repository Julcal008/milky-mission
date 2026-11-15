import { cx } from '@/ui/cx'
import { visualUrl } from './assets'

/**
 * Tintable mask icon for the v4 stroke-only SVG set.
 * The alpha channel becomes the mask and `currentColor` is the fill.
 * Owner: Track B.
 */
export function MaskIcon({ file, className }: { file: string; className?: string }) {
  const url = visualUrl(file)

  return (
    <span
      aria-hidden="true"
      className={cx('inline-block size-4 shrink-0 bg-current', className)}
      style={{
        maskImage: `url(${url})`,
        WebkitMaskImage: `url(${url})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  )
}
