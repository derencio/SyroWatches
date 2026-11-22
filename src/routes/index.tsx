import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Moon, Sun } from 'lucide-react'
import { WristWatch } from '@/components/wrist-watch'

export const Route = createFileRoute('/')({
  component: Home,
})

type Theme = 'night' | 'day'
type Lang = 'en' | 'pt'
type View = 'home' | 'about'

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
    aboutNav: 'About Us',
    backNav: 'Back',
    aboutNavAria: 'Read about Syro',
    backNavAria: 'Return to main screen',
    etymologyWord: 'synchro',
    etymologyPhonetic: '/ˈsɪŋ.kroʊ/',
    etymologyOrigin: 'Greek · sýnkhronos',
    etymologyDef: 'occurring at the same time; moving in unison.',
    etymologyPrefix: 'We took the noise out of ',
    aboutTitle: 'About Us',
    aboutParagraphs: [
      'Syro is an independent watchmaking studio built on quiet precision, essential geometry, and the honest rhythm of mechanical and contemporary horology.',
      'Every timepiece is conceived to strip away excess—leaving only proportion, legibility, and the calm certainty of a moment shared in sync.',
    ],
    teaserWatchLabel: 'Timepieces',
    teaserCompassLabel: 'Engineering & Craft',
    teaserMoonSunLabel: 'Day & Night',
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
    aboutNav: 'Sobre Nós',
    backNav: 'Voltar',
    aboutNavAria: 'Conhecer a história da Syro',
    backNavAria: 'Voltar para a tela principal',
    etymologyWord: 'synchro',
    etymologyPhonetic: '/ˈsɪŋ.kroʊ/',
    etymologyOrigin: 'Grego · sýnkhronos',
    etymologyDef: 'que ocorre ao mesmo tempo; em uníssono.',
    etymologyPrefix: 'Tiramos o ruído de ',
    aboutTitle: 'Sobre Nós',
    aboutParagraphs: [
      'A Syro é um estúdio independente de relojoaria guiado pela precisão silenciosa, pela geometria essencial e pelo ritmo honesto entre a tradição mecânica e o design contemporâneo.',
      'Cada peça nasce para eliminar o excesso — preservando apenas a proporção, a legibilidade e a certeza serena de um instante em plena sintonia.',
    ],
    teaserWatchLabel: 'Relógios',
    teaserCompassLabel: 'Engenharia e Ofício',
    teaserMoonSunLabel: 'Dia e Noite',
  },
} as const

function Home() {
  const [theme, setTheme] = useState<Theme>('night')
  const [lang, setLang] = useState<Lang>('en')
  const [view, setView] = useState<View>('home')

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

  // Allow Escape key to return from About Us to the main view.
  useEffect(() => {
    if (view !== 'about') return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setView('home')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [view])

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

      {/* Home View */}
      <section
        className={`syro-view syro-stage${view === 'home' ? ' is-active' : ' is-hidden'}`}
        aria-hidden={view !== 'home'}
      >
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
      </section>

      {/* About Us View */}
      <section
        className={`syro-view syro-about${view === 'about' ? ' is-active' : ' is-hidden'}`}
        aria-hidden={view !== 'about'}
        aria-labelledby="syro-about-heading"
      >
        <div className="syro-about__emblem" aria-hidden="true" />

        <div className="syro-etymology">
          <p className="syro-etymology__entry">
            <span className="syro-etymology__word">{t.etymologyWord}</span>{' '}
            <span className="syro-etymology__phonetic">
              {t.etymologyPhonetic}
            </span>{' '}
            <span className="syro-etymology__origin">
              ({t.etymologyOrigin})
            </span>{' '}
            <span className="syro-etymology__sep">—</span>{' '}
            <span className="syro-etymology__def">{t.etymologyDef}</span>
          </p>

          <p className="syro-etymology__statement">
            <span className="syro-etymology__prefix">{t.etymologyPrefix}</span>
            <span className="syro-etymology__brand">sy</span>
            <span className="syro-etymology__dropped" aria-hidden="true">
              nch
            </span>
            <span className="syro-etymology__brand">ro</span>
            <span className="syro-etymology__prefix">.</span>
          </p>
        </div>

        <div className="syro-about__divider" aria-hidden="true" />

        <div className="syro-about__body">
          <h2 id="syro-about-heading" className="syro-about__title">
            {t.aboutTitle}
          </h2>
          {t.aboutParagraphs.map((paragraph, idx) => (
            <p key={idx} className="syro-about__text">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="syro-teasers" aria-hidden="true">
          <span className="syro-teaser-icon" title={t.teaserWatchLabel}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="6" />
              <polyline points="12 9 12 12 14 13.5" />
              <path d="M9 6.5V3h6v3.5" />
              <path d="M9 17.5V21h6v-3.5" />
            </svg>
          </span>

          <span className="syro-teasers__dot" />

          <span className="syro-teaser-icon" title={t.teaserCompassLabel}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="2" />
              <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
            </svg>
          </span>

          <span className="syro-teasers__dot" />

          <span className="syro-teaser-icon" title={t.teaserMoonSunLabel}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </span>
        </div>
      </section>

      <nav className="syro-bottom-nav" aria-label={t.aboutTitle}>
        <button
          type="button"
          onClick={() => setView(view === 'home' ? 'about' : 'home')}
          className="syro-bottom-link"
          aria-expanded={view === 'about'}
          aria-label={view === 'home' ? t.aboutNavAria : t.backNavAria}
        >
          {view === 'home' ? t.aboutNav : t.backNav}
        </button>
      </nav>

      <WristWatch lang={lang} />
    </main>
  )
}
