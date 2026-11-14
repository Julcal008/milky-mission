/**
 * Start menu — solarpunk landing screen.
 * Owner: Track B (Experience).
 *
 * One primary action: start. The wordmark sits on the right in landscape and
 * stacks above the action in portrait. Decorations are limited to one sun and
 * two orbital arcs so the screen never competes with the call to action.
 */
import { useI18n } from '@/store/ui'

export function Home() {
  const { t } = useI18n()

  return (
    <section className="solar-bg relative isolate flex min-h-[70svh] items-center overflow-hidden">
      <div
        aria-hidden="true"
        className="solar-sun absolute right-1/2 top-1/2 size-[24rem] -translate-y-1/2 translate-x-1/2 rounded-full landscape:right-[-6%] landscape:size-[34rem] landscape:translate-x-0 lg:size-[40rem]"
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 800 800"
        className="pointer-events-none absolute right-1/2 top-1/2 h-[30rem] w-[30rem] -translate-y-1/2 translate-x-1/2 opacity-60 landscape:right-[-4%] landscape:h-[38rem] landscape:w-[38rem] landscape:translate-x-0 lg:h-[44rem] lg:w-[44rem]"
      >
        <circle
          cx="400"
          cy="400"
          r="250"
          fill="none"
          stroke="var(--color-jade)"
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeDasharray="2 10"
        />
        <circle
          cx="400"
          cy="400"
          r="330"
          fill="none"
          stroke="var(--color-indigo)"
          strokeOpacity="0.45"
          strokeWidth="1"
          strokeDasharray="1 14"
        />
        <circle cx="650" cy="400" r="4" fill="var(--color-cream)" />
      </svg>

      <div className="relative grid w-full items-center gap-10 landscape:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] landscape:gap-8 lg:gap-16">
        <div className="order-2 flex w-full flex-col items-start gap-4 landscape:order-1 landscape:max-w-sm">
          <a
            href="./menuprincipal/index.html"
            className="cta-glow inline-flex h-14 w-full items-center justify-center rounded-full bg-cream px-10 font-display text-lg font-semibold tracking-wide text-bg transition-colors duration-200 hover:bg-coral hover:text-on-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream sm:w-auto"
          >
            {t.start.cta}
          </a>
          <p className="max-w-[18rem] text-[13px] leading-relaxed text-ink-2 sm:text-sm">
            {t.start.tagline}
          </p>
        </div>

        <h1 className="sun-title order-1 text-left font-display text-[clamp(3rem,14vw,5rem)] font-bold uppercase leading-[0.82] tracking-[-0.03em] landscape:order-2 landscape:text-right landscape:text-[clamp(2.5rem,9vw,7.5rem)] lg:text-[clamp(4rem,9vw,8rem)]">
          <span className="block">Milky</span>
          <span className="block">Mission</span>
        </h1>
      </div>
    </section>
  )
}
