/**
 * Button primitive — one primary action per screen (milk), everything else secondary/ghost.
 * Owner: Track B. Do not add colors inline; use tokens from src/styles/tokens.css.
 */
import type { ButtonHTMLAttributes } from 'react'
import { cx } from './cx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  primary:
    'bg-milk text-[#141013] hover:bg-milk-strong border border-transparent font-semibold shadow-sm',
  secondary:
    'bg-surface-2 text-ink border border-border hover:border-border-strong hover:bg-surface-2/80',
  ghost: 'bg-transparent text-ink-2 hover:text-ink hover:bg-white/5 border border-transparent',
  danger: 'bg-danger/15 text-danger border border-danger/40 hover:bg-danger/25',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4 text-sm',
}

export function Button({ variant = 'secondary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-md transition-colors duration-150',
        'disabled:cursor-not-allowed disabled:opacity-40',
        variants[variant],
        sizes[size],
        className,
      )}
    />
  )
}
