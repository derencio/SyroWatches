import { useEffect, useRef, useState } from 'react'

/** Wink sequence length (1.25x faster than original 2000ms) — keep in sync with `.syro-watch.is-winking` in styles.css. */
const WINK_MS = 1600

const CX = 50
const CY = 70

const TICKS = Array.from({ length: 60 }, (_, i) => i)

/**
 * A thin-line wristwatch showing the visitor's local time with smoothly
 * sweeping hands. Clicking or tapping turns it into an eye that winks with
 * a warm, welcoming smile, then it turns back into the watch.
 */
export function WristWatch() {
  const hourRef = useRef<SVGLineElement>(null)
  const minuteRef = useRef<SVGLineElement>(null)
  const secondRef = useRef<SVGGElement>(null)
  const [label, setLabel] = useState('Wristwatch showing the current time')
  const [winking, setWinking] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    let frame = 0
    let lastMinute = -1
    const fmt = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    })

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
        setLabel(`The time is ${fmt.format(now)}. Tap to wink.`)
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer.current)
    }
  }, [])

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
      title="Tap me"
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
          {/* Friendly welcoming face outline + warm smile */}
          <g className="syro-watch__smile-face">
            <circle cx={CX} cy="78" r="39" className="syro-watch__fine" />
            {/* Eyebrow */}
            <path d="M32 50 Q50 42 68 50" className="syro-watch__fine" />
            {/* Warm welcoming smile */}
            <path d="M33 93 Q50 107 67 93" className="syro-watch__smile" />
            {/* Subtle smile corner dimples */}
            <path d="M31.5 91.5 Q33.5 93 32.5 95.5" className="syro-watch__fine" />
            <path d="M68.5 91.5 Q66.5 93 67.5 95.5" className="syro-watch__fine" />
          </g>

          <g className="syro-watch__lid">
            <path d="M22 68 Q50 45 78 68 Q50 91 22 68 Z" />
            <circle cx={CX} cy="68" r="10.5" />
            <circle cx={CX} cy="68" r="4.5" className="syro-watch__pupil" />
            <circle cx="53.5" cy="64.5" r="1.5" className="syro-watch__glint" />
          </g>

          {/* Closed eye: a happy upward-curved smile wink with soft lashes */}
          <g className="syro-watch__closed">
            <path d="M24 69 Q50 54 76 69" />
            <path d="M33 63 L30 57 M44 60 L43 53 M56 60 L57 53 M67 63 L70 57" />
          </g>
        </g>
      </svg>
    </button>
  )
}
