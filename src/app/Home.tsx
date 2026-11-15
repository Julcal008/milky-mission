/**
 * Start menu — solarpunk landing screen.
 * Owner: Track B (Experience).
 *
 * One primary action: start. The wordmark sits on the right in landscape and
 * stacks above the action in portrait. The animated backdrop is decorative only.
 */
import { useI18n } from '@/store/ui'
import { MenuBackground } from '@/ui/menu/MenuBackground'

export function Home() {
  const { t } = useI18n()

  return (
    <section className="relative isolate flex min-h-[65svh] items-center overflow-hidden sm:min-h-[calc(100svh_-_15rem)]">
      <MenuBackground />

      <div className="relative z-10 grid w-full items-center gap-10 landscape:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] landscape:gap-8 lg:gap-16">
        <div className="order-2 flex w-full flex-col items-start gap-4 landscape:order-1 landscape:max-w-sm">
          <a
            href="#/brief"
            className="cta-glow inline-flex h-14 w-full items-center justify-center rounded-full bg-cream px-10 font-display text-lg font-semibold tracking-wide text-bg transition-colors duration-200 hover:bg-coral hover:text-on-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream sm:w-auto"
          >
            {t.start.cta}
          </a>
          <p className="max-w-[18rem] text-[13px] leading-relaxed text-ink-2 sm:text-sm">
            {t.start.tagline}
          </p>
        </div>

        <div className="order-1 landscape:order-2">
          <p className="label-caps mb-3 text-left text-ink-3 landscape:text-right">
            {t.start.eyebrow}
          </p>
          <h1 className="sun-title text-left text-[clamp(3rem,14vw,5rem)] landscape:text-right landscape:text-[clamp(2.5rem,9vw,7.5rem)] lg:text-[clamp(4rem,9vw,8rem)]">
            <span className="block">MILKY</span>
            <span className="block">MISSION</span>
          </h1>
        </div>
      </div>
    </section>
  )
}
