export interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  as?: 'h1' | 'h2'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  as: Heading = 'h2',
  className = '',
}: SectionHeadingProps) {
  return (
    <header className={`flex w-full flex-col gap-1 ${className}`}>
      {eyebrow ? (
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-ion">
          {eyebrow}
        </span>
      ) : null}
      <Heading className="font-sans text-2xl font-bold tracking-tight text-ink">{title}</Heading>
      {subtitle ? <p className="text-sm leading-relaxed text-ink-2">{subtitle}</p> : null}
    </header>
  )
}
