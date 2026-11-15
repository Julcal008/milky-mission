import { cx } from '@/ui/cx'
import { visualUrl } from './assets'

/**
 * Icon from the visual pack. The v2 SVGs carry their own palette, so they are
 * rendered as images instead of masks (a mask would flatten the opaque fills).
 * Owner: Track B.
 */
export function Icon({ file, className }: { file: string; className?: string }) {
  return (
    <img
      src={visualUrl(file)}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      className={cx('inline-block size-3.5 shrink-0', className)}
    />
  )
}
