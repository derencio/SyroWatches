import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Moon, Sun } from 'lucide-react'
import { WristWatch } from '@/components/wrist-watch'

export const Route = createFileRoute('/')({
  component: Home,
})

type Theme = 'night' | 'day'
type Lang = 'en' | 'pt'

const COPY = {
  en: {
    tagline: 'Time is ticking',
    switchToDay: 'Switch to day version',
    switchToNight: 'Switch to night version',
    dayTitle: 'Day version',
    nightTitle: 'Night version',
    langGroupLabel: 'Language selector',
    switchToEn: 'Switch language to English',
    switchToPt: 'Switch language to Portuguese (Brazil)',
    documentLang: 'en',
  },
  pt: {
    tagline: 'O tempo está passando',
    switchToDay: 'Mudar para versão diurna',
    switchToNight: 'Mudar para versão noturna',
    dayTitle: 'Versão diurna',
    nightTitle: 'Versão noturna',
    langGroupLabel: 'Seletor de idioma',
    switchToEn: 'Mudar idioma para Inglês',
    switchToPt: 'Mudar idioma para Português (Brasil)',
    documentLang: 'pt-BR',
  },
} as const

function Home() {
  const [theme, setTheme] = useState<Theme>('night')
  const [lang, setLang] = useState<Lang>('en')

  // Sync with whatever the pre-paint script in __root.tsx applied and restore saved language (default: EN).
  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains('dark') ? 'night' : 'day',
    )
    try {
      const savedLang = localStorage.getItem('syro-lang')
      if (savedLang === 'pt' || savedLang === 'en') {
        setLang(savedLang)
        document.documentElement.lang = COPY[savedLang].documentLang
      }
    } catch {
      /* storage unavailable — keep default EN */
    }
  }, [])

  const toggleTheme = () => {
    const next: Theme = theme === 'night' ? 'day' : 'night'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'night')
    try {
      localStorage.setItem('syro-theme', next)
    } catch {
      /* storage unavailable — theme still switches for this visit */
    }
  }

  const selectLang = (next: Lang) => {
    setLang(next)
    document.documentElement.lang = COPY[next].documentLang
    try {
      localStorage.setItem('syro-lang', next)
    } catch {
      /* storage unavailable — language still switches for this visit */
    }
  }

  const t = COPY[lang]

  return (
    <main className="syro-page">
      <div className="syro-controls">
        <div
          className="syro-lang-switch"
          role="group"
          aria-label={t.langGroupLabel}
        >
          <button
            type="button"
            onClick={() => selectLang('pt')}
            className={`syro-lang-btn${lang === 'pt' ? ' is-active' : ''}`}
            aria-pressed={lang === 'pt'}
            aria-label={t.switchToPt}
            title="Português (BR)"
          >
            BR
          </button>
          <button
            type="button"
            onClick={() => selectLang('en')}
            className={`syro-lang-btn${lang === 'en' ? ' is-active' : ''}`}
            aria-pressed={lang === 'en'}
            aria-label={t.switchToEn}
            title="English (EN)"
          >
            EN
          </button>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="syro-toggle"
          aria-label={theme === 'night' ? t.switchToDay : t.switchToNight}
          title={theme === 'night' ? t.dayTitle : t.nightTitle}
        >
          {theme === 'night' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="syro-stage">
        <h1 className="syro-logo" role="img" aria-label="Syro">
          <span className="sr-only">Syro</span>
        </h1>

        <div className="syro-bar" aria-hidden="true">
          <div className="syro-bar__glow" />
          <div className="syro-bar__line" />
        </div>

        <p className="syro-tagline">
          {t.tagline}
          <span className="syro-dots" aria-hidden="true">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
          <span className="sr-only">...</span>
        </p>
      </div>

      <WristWatch lang={lang} />
    </main>
  )
}
