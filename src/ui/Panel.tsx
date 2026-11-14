/** Panel primitive: the only container used for cards and sections. */
import type { ReactNode } from 'react'
import { cx } from './cx'

export function Panel({
  children,
  className,
  as: Tag = 'section',
}: {
  children: ReactNode
  className?: string
  as?: 'section' | 'div' | 'article'
}) {
  return (
    <Tag className={cx('rounded-lg border border-border bg-surface', className)}>{children}</Tag>
  )
}
