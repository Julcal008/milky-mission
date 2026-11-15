import { useState } from 'react'
import { cx } from '@/ui/cx'
import { visualUrl } from './assets'

export interface VisualImageProps {
  file: string
  fallback?: string
  alt?: string
  width: number
  height: number
  className?: string
  imgClassName?: string
  priority?: boolean
  decorative?: boolean
}

/**
 * Image with a local fallback. Assets are static; no runtime network calls.
 * Owner: Track B.
 */
export function VisualImage({
  file,
  fallback,
  alt = '',
  width,
  height,
  className,
  imgClassName,
  priority = false,
  decorative = false,
}: VisualImageProps) {
  const [src, setSrc] = useState(() => visualUrl(file))
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <span aria-hidden="true" className={cx('block bg-surface-2', className)} />
  }

  const handleError = () => {
    if (fallback && src !== visualUrl(fallback)) {
      setSrc(visualUrl(fallback))
      return
    }
    setFailed(true)
  }

  return (
    <span className={cx('block', className)}>
      <img
        src={src}
        alt={decorative ? '' : alt}
        aria-hidden={decorative ? true : undefined}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={cx('h-auto w-full object-contain', imgClassName)}
        onError={handleError}
      />
    </span>
  )
}
