/** Select field for game screens — Owner: Track A (UI sprint). */
import type { SelectHTMLAttributes } from 'react'
import { cx } from '@/ui/cx'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
}

export function Select({ label, children, className, ...props }: SelectProps) {
  return (
    <label className="block space-y-1.5">
      <span className="label-caps text-ink-3">{label}</span>
      <select
        {...props}
        className={cx(
          'h-10 w-full rounded-md border border-border bg-surface-2 px-3 text-[13px] text-ink',
          'transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-40',
          className,
        )}
      >
        {children}
      </select>
    </label>
  )
}
