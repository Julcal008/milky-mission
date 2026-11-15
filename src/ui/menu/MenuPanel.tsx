/**
 * MenuPanel — local panel for the Track B menu surfaces.
 * The shared Panel primitive is frozen at rounded-lg; the Brief needs 3xl.
 */
import type { ReactNode } from 'react'
import { cx } from '@/ui/cx'

export function MenuPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cx('rounded-3xl border border-border bg-surface', className)}>
      {children}
    </section>
  )
}
