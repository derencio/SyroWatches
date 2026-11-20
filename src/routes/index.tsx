import { useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Moon, Sun } from 'lucide-react'
import { WristWatch } from '@/components/wrist-watch'
import { DICTIONARY, type Locale } from '@/lib/i18n'

export const Route = createFileRoute('/')({
  component: Home,
})

type Theme = 'night' | 'day'
type View = 'home' | 'about'

/** Fade duration in ms — keep in sync with `.syro-view` transition in styles.css. */
const FADE_MS = 360

function ArtistPaletteIcon({ label }: { label: string }) {
  return (
    <span className="syro-teaser-icon" title={label} aria-label={label}>
      <svg viewBox="0 0 36 28" aria-hidden="true" focusable="false">
        <path
          d="M18 3C9.5 3 3 8.8 3 15.2C3 20.6 7.4 24.5 13.2 24.5C15.4 24.5 16.8 23.3 16.8 21.7C16.8 20.6 16.1 19.8 16.1 18.8C16.1 17.5 17.3 16.7 19.1 16.7H22.2C28.4 16.7 33 13.3 33 8.9C33 5.4 26.6 3 18 3Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="25.8"
          cy="10.2"
          r="2.1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <circle cx="9.2" cy="13.5" r="1.45" fill="#ff3b30" />
        <circle cx="12.6" cy="9.2" r="1.45" fill="#ffcc00" />
        <circle cx="18.2" cy="7.8" r="1.45" fill="#2ee86b" />
        <circle cx="9.6" cy="18.4" r="1.45" fill="#00b7ff" />
      </svg>
    </span>
  )
}

function SunMoonFlipIcon({ label }: { label: string }) {
  return (
    <span className="syro-teaser-icon" title={label} aria-label={label}>
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <circle
          cx="16"
          cy="16"
          r="11.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="2 2.2"
          opacity="0.45"
        />
        <line
          x1="7.5"
          y1="24.5"
          x2="24.5"
          y2="7.5"
          stroke="currentColor"
          strokeWidth="1.1"
          opacity="0.55"
        />
        <circle
          cx="11.5"
          cy="11.5"
          r="3.1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          d="M11.5 6.2V7.3M11.5 15.7V16.8M6.2 11.5H7.3M15.7 11.5H16.8M7.8 7.8L8.6 8.6M14.4 14.4L15.2 15.2"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
        <path
          d="M22.2 17.8C20.2 18.1 18.8 19.8 19.1 21.8C19.4 23.6 21 24.9 22.8 24.8C21.3 25.8 19.2 25.6 17.9 24.2C16.5 22.7 16.6 20.3 18.1 18.9C19.2 17.8 20.8 17.4 22.2 17.8Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function Home() {
  const [theme, setTheme] = useState<Theme>('night')
  const [targetView, setTargetView] = useState<View>('home')
  const [visibleView, setVisibleView] = useState<View | null>('home')
  const [locale] = useState<Locale>('en')
  const transitionTimer = useRef<number | undefined>(undefined)

  const t = DICTIONARY[locale]

  // Sync with whatever the pre-paint script in __root.tsx applied.
  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains('dark') ? 'night' : 'day',
    )
    return () => window.clearTimeout(transitionTimer.current)
  }, [])

  const switchView = (next: View) => {
    if (next === targetView) return
    setTargetView(next)
    // Fade out the current view completely before revealing the next view.
    setVisibleView(null)
    window.clearTimeout(transitionTimer.current)
    transitionTimer.current = window.setTimeout(() => {
      setVisibleView(next)
    }, FADE_MS)
  }

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

  return (
    <main className={`syro-page ${targetView === 'about' ? 'is-about' : ''}`}>
      <button
        type="button"
        onClick={toggleTheme}
        className="syro-toggle"
        aria-label={theme === 'night' ? t.themeToDay : t.themeToNight}
        title={theme === 'night' ? 'Day version' : 'Night version'}
      >
        {theme === 'night' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Primary Hero Stage */}
      <div
        className={`syro-stage syro-view ${visibleView === 'home' ? 'is-active' : 'is-hidden'}`}
        aria-hidden={visibleView !== 'home'}
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
      </div>

      {/* Sequential About Us Stage */}
      <section
        className={`syro-about syro-view ${visibleView === 'about' ? 'is-active' : 'is-hidden'}`}
        aria-hidden={visibleView !== 'about'}
        aria-labelledby="syro-about-heading"
      >
        {/* Official brand emblem (rings icon only, white on dark / dark on light) */}
        <div className="syro-about__emblem" aria-hidden="true" />

        <header className="syro-etymology">
          <p className="syro-etymology__entry">
            <strong className="syro-etymology__word">
              <em>{t.etymology.word}</em>
            </strong>{' '}
            <span className="syro-etymology__phonetic">
              {t.etymology.phonetic}
            </span>{' '}
            <span className="syro-etymology__origin">
              {t.etymology.origin}
            </span>
            <span className="syro-etymology__sep" aria-hidden="true">
              {' '}
              —{' '}
            </span>
            <span className="syro-etymology__def">
              {t.etymology.definition}
            </span>
          </p>

          <p className="syro-etymology__statement">
            <span className="syro-etymology__prefix">
              {t.etymology.statementPrefix}{' '}
            </span>
            <span className="syro-etymology__dropped" aria-hidden="true">
              {t.etymology.droppedPrefix}
            </span>
            <strong className="syro-etymology__brand">
              {t.etymology.brandName}
            </strong>
          </p>
        </header>

        <div className="syro-about__divider" aria-hidden="true" />

        <div className="syro-about__body">
          <h2 id="syro-about-heading" className="syro-about__title">
            {t.about.heading}
          </h2>

          {t.about.paragraphs.map((paragraph, idx) => (
            <p key={idx} className="syro-about__text">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="syro-teasers" role="group" aria-label="Upcoming concepts">
          <ArtistPaletteIcon label={t.teasers.paletteLabel} />
          <span className="syro-teasers__dot" aria-hidden="true" />
          <SunMoonFlipIcon label={t.teasers.dayNightLabel} />
        </div>
      </section>

      {/* Bottom center subtle navigation link */}
      <nav className="syro-bottom-nav" aria-label="Secondary">
        {targetView === 'home' ? (
          <button
            type="button"
            onClick={() => switchView('about')}
            className="syro-bottom-link"
          >
            {t.aboutLink}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => switchView('home')}
            className="syro-bottom-link syro-bottom-link--back"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>{t.backLink}</span>
          </button>
        )}
      </nav>

      <WristWatch />
    </main>
  )
}
