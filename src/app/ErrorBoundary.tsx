/**
 * Global error boundary — last resort for an unexpected render error.
 * Owner: Track B. Shared links are untrusted, so a bad payload must never
 * leave the player on a blank page.
 */
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application error boundary', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    const isSpanish = typeof document !== 'undefined' && document.documentElement.lang === 'es'
    const href = typeof window !== 'undefined' ? `${window.location.pathname}#/brief` : '#/brief'

    return (
      <div className="space-bg flex min-h-screen items-center justify-center px-6">
        <section className="w-full max-w-md space-y-4 rounded-lg border border-border bg-surface p-6 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ion">MILKY MISSION</p>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {isSpanish ? 'Algo salió mal' : 'Something went wrong'}
          </h1>
          <p className="text-[13px] leading-relaxed text-ink-2">
            {isSpanish
              ? 'No pudimos cargar esta misión. Vuelve al briefing y empieza de nuevo.'
              : 'We could not load this mission. Return to the brief and start again.'}
          </p>
          <a
            href={href}
            className="inline-flex h-11 items-center justify-center rounded-full bg-cream px-6 font-display text-sm font-semibold text-bg transition-colors hover:bg-coral hover:text-on-primary"
          >
            {isSpanish ? 'Volver al briefing' : 'Back to brief'}
          </a>
        </section>
      </div>
    )
  }
}
