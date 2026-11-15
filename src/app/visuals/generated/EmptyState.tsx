export interface EmptyStateProps {
  title: string
  body: string
  actionLabel: string
  onAction: () => void
  illustrationSrc?: string
  className?: string
}

export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
  illustrationSrc,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      role="region"
      aria-label={title}
      className={`flex w-full max-w-lg flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/80 p-8 text-center ${className}`}
    >
      {illustrationSrc ? (
        <img
          src={illustrationSrc}
          alt=""
          aria-hidden="true"
          className="mb-5 h-32 w-48 object-contain opacity-90"
        />
      ) : (
        <div
          aria-hidden="true"
          className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface-2 font-mono text-xl text-ion"
        >
          ◎
        </div>
      )}

      <h3 className="font-sans text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-2">{body}</p>

      <button
        type="button"
        onClick={onAction}
        className="mt-6 inline-flex items-center justify-center rounded-xl border border-ion bg-ion/20 px-5 py-2.5 font-sans text-sm font-semibold text-ink transition-all duration-150 motion-reduce:transition-none hover:bg-ion/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ion active:scale-[0.98]"
      >
        {actionLabel}
      </button>
    </div>
  )
}
