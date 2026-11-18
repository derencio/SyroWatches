import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Moon, Sun } from 'lucide-react'
import { WristWatch } from '@/components/wrist-watch'

export const Route = createFileRoute('/')({
  component: Home,
})

type Theme = 'night' | 'day'

function Home() {
  const [theme, setTheme] = useState<Theme>('night')

  // Sync with whatever the pre-paint script in __root.tsx applied.
  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains('dark') ? 'night' : 'day',
    )
  }, [])

  const toggle = () => {
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
    <main className="syro-page">
      <button
        type="button"
        onClick={toggle}
        className="syro-toggle"
        aria-label={
          theme === 'night'
            ? 'Switch to day version'
            : 'Switch to night version'
        }
        title={theme === 'night' ? 'Day version' : 'Night version'}
      >
        {theme === 'night' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="syro-stage">
        <h1 className="syro-logo" role="img" aria-label="Syro">
          <span className="sr-only">Syro</span>
        </h1>

        <div className="syro-bar" aria-hidden="true">
          <div className="syro-bar__glow" />
          <div className="syro-bar__line" />
        </div>

        <p className="syro-tagline">
          Time is ticking
          <span className="syro-dots" aria-hidden="true">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
          <span className="sr-only">...</span>
        </p>
      </div>

      <WristWatch />
    </main>
  )
}
