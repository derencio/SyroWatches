import { useEffect, useRef, useState } from 'react'

/** Wink sequence length (1.25x faster than original 2000ms) — keep in sync with `.syro-watch.is-winking` in styles.css. */
const WINK_MS = 1600

const CX = 50
const CY = 70

const TICKS = Array.from({ length: 60 }, (_, i) => i)

type Lang = 'en' | 'pt'

/**
 * A thin-line wristwatch showing the visitor's local time with smoothly
 * sweeping hands. Clicking or tapping turns it into a friendly two-eyed
 * smiling face that gives a warm welcoming wink, then returns to the watch.
 */
export function WristWatch({ lang = 'en' }: { lang?: Lang }) {
  const hourRef = useRef<SVGLineElement>(null)
  const minuteRef = useRef<SVGLineElement>(null)
  const secondRef = useRef<SVGGElement>(null)
  const [label, setLabel] = useState(
    lang === 'pt'
      ? 'Relógio de pulso mostrando a hora atual'
      : 'Wristwatch showing the current time',
  )
  const [winking, setWinking] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    let frame = 0
    let lastMinute = -1
    const locale = lang === 'pt' ? 'pt-BR' : undefined
    const fmt = new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
    })

    const updateLabel = (now: Date) => {
      const formatted = fmt.format(now)
      setLabel(
        lang === 'pt'
          ? `São ${formatted}. Toque para piscar.`
          : `The time is ${formatted}. Tap to wink.`,
      )
    }

    const tick = () => {
      // Local time in the visitor's own time zone.
      const now = new Date()
      const s = now.getSeconds() + now.getMilliseconds() / 1000
      const m = now.getMinutes() + s / 60
      const h = (now.getHours() % 12) + m / 60

      hourRef.current?.setAttribute(
        'transform',
        `rotate(${h * 30} ${CX} ${CY})`,
      )
      minuteRef.current?.setAttribute(
        'transform',
        `rotate(${m * 6} ${CX} ${CY})`,
      )
      secondRef.current?.setAttribute(
        'transform',
        `rotate(${s * 6} ${CX} ${CY})`,
      )

      if (now.getMinutes() !== lastMinute) {
        lastMinute = now.getMinutes()
        updateLabel(now)
      }
      frame = requestAnimationFrame(tick)
    }

    updateLabel(new Date())
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer.current)
    }
  }, [lang])

  const wink = () => {
    if (winking) return
    setWinking(true)
    timer.current = window.setTimeout(() => setWinking(false), WINK_MS)
  }

  return (
    <button
      type="button"
      onClick={wink}
      className={`syro-watch${winking ? ' is-winking' : ''}`}
      aria-label={label}
      title={lang === 'pt' ? 'Toque aqui' : 'Tap me'}
    >
      <svg viewBox="0 0 100 140" aria-hidden="true" focusable="false">
        <g className="syro-watch__face">
          {/* Strap */}
          <path d="M37 38 L39 6 Q39 2 43 2 H57 Q61 2 61 6 L63 38" />
          <path d="M37 102 L39 134 Q39 138 43 138 H57 Q61 138 61 134 L63 102" />
          <line x1="40" y1="14" x2="60" y2="14" className="syro-watch__fine" />
          <line
            x1="40"
            y1="126"
            x2="60"
            y2="126"
            className="syro-watch__fine"
          />
          <circle cx="50" cy="120" r="1.6" className="syro-watch__fine" />

          {/* Crown */}
          <rect x="82.5" y="66" width="4" height="8" rx="1.2" />

          {/* Case + dial */}
          <circle cx={CX} cy={CY} r="33" />
          <circle cx={CX} cy={CY} r="29.5" className="syro-watch__fine" />

          {TICKS.map((i) => {
            const major = i % 5 === 0
            const quarter = i % 15 === 0
            return (
              <line
                key={i}
                x1={CX}
                y1={CY - 28}
                x2={CX}
                y2={CY - (quarter ? 23 : major ? 24.8 : 26.6)}
                transform={`rotate(${i * 6} ${CX} ${CY})`}
                className={major ? undefined : 'syro-watch__fine'}
              />
            )
          })}

          {/* Hands */}
          <line
            ref={hourRef}
            x1={CX}
            y1={CY + 3}
            x2={CX}
            y2={CY - 15}
            className="syro-watch__hour"
          />
          <line
            ref={minuteRef}
            x1={CX}
            y1={CY + 4}
            x2={CX}
            y2={CY - 22.5}
            className="syro-watch__minute"
          />
          <g ref={secondRef} className="syro-watch__second">
            <line x1={CX} y1={CY + 7} x2={CX} y2={CY - 26} />
          </g>
          <circle cx={CX} cy={CY} r="1.4" className="syro-watch__pin" />
        </g>

        <g className="syro-watch__eye">
          {/* Friendly two-eyed face outline, eyebrows & warm smile */}
          <g className="syro-watch__smile-face">
            <circle cx={CX} cy="72" r="38" className="syro-watch__fine" />
            {/* Left & Right Eyebrows */}
            <path d="M23 53 Q33 48 42 52" className="syro-watch__fine" />
            <path d="M58 52 Q67 47 77 52" className="syro-watch__fine" />
            {/* Warm welcoming smile */}
            <path d="M33 87 Q50 101 67 87" className="syro-watch__smile" />
            {/* Subtle smile corner dimples */}
            <path d="M31.5 85.5 Q33.5 87 32.5 89.5" className="syro-watch__fine" />
            <path d="M68.5 85.5 Q66.5 87 67.5 89.5" className="syro-watch__fine" />
          </g>

          {/* Left Eye (stays open and friendly) */}
          <g className="syro-watch__left-eye">
            <path d="M20 65 Q33 54 45 65 Q33 76 20 65 Z" />
            <circle cx="33" cy="65" r="5.5" />
            <circle cx="33" cy="65" r="2.4" className="syro-watch__pupil" />
            <circle cx="34.8" cy="63.3" r="0.9" className="syro-watch__glint" />
          </g>

          {/* Right Eye (open state before/after wink) */}
          <g className="syro-watch__lid">
            <path d="M55 65 Q67 54 80 65 Q67 76 55 65 Z" />
            <circle cx="67" cy="65" r="5.5" />
            <circle cx="67" cy="65" r="2.4" className="syro-watch__pupil" />
            <circle cx="68.8" cy="63.3" r="0.9" className="syro-watch__glint" />
          </g>

          {/* Right Eye (closed state: happy upward-curved wink with lashes) */}
          <g className="syro-watch__closed">
            <path d="M56 66 Q67 57 79 66" />
            <path d="M61 61 L59 57 M67 59.5 L67 55 M73 61 L75 57" />
          </g>
        </g>
      </svg>
    </button>
  )
}
