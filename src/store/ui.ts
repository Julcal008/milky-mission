/**
 * UI store — language, density and other presentation-only state.
 * Owner: Track B (Experience). Never store mission design data here:
 * that belongs to the engine contract in src/engine/types.ts.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lang } from '@/i18n'
import { dictionaries } from '@/i18n'

export type Density = 'compact' | 'presentation'

interface UiState {
  lang: Lang
  density: Density
  setLang: (lang: Lang) => void
  toggleLang: () => void
  setDensity: (density: Density) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      lang: 'en',
      density: 'compact',
      setLang: (lang) => set({ lang }),
      toggleLang: () => set((state) => ({ lang: state.lang === 'en' ? 'es' : 'en' })),
      setDensity: (density) => set({ density }),
    }),
    { name: 'milky-ui' },
  ),
)

/** Returns the active dictionary plus a language setter, for use in components. */
export function useI18n() {
  const lang = useUiStore((state) => state.lang)
  const setLang = useUiStore((state) => state.setLang)
  const toggleLang = useUiStore((state) => state.toggleLang)
  return { lang, setLang, toggleLang, t: dictionaries[lang] }
}

export type GuideTab = 'basics' | 'components' | 'risks' | 'glossary' | 'model'

interface GuideState {
  open: boolean
  tab: GuideTab
  query: string
  openGuide: (tab?: GuideTab) => void
  closeGuide: () => void
  setGuideTab: (tab: GuideTab) => void
  setGuideQuery: (query: string) => void
}

/** Field-guide drawer state. Not persisted: the guide always opens closed. */
export const useGuideStore = create<GuideState>((set) => ({
  open: false,
  tab: 'basics',
  query: '',
  openGuide: (tab = 'basics') => set({ open: true, tab, query: '' }),
  closeGuide: () => set({ open: false }),
  setGuideTab: (tab) => set({ tab, query: '' }),
  setGuideQuery: (query) => set({ query }),
}))
