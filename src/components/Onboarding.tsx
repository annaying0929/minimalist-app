import { useState, useEffect, useRef } from 'react'

interface Props {
  onSignUp: () => void
  onExploreDemo: () => void
}

function Sprig({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none">
      <path d="M 256 405 Q 244 290 252 148" stroke="#4A6741" strokeWidth="16" strokeLinecap="round"/>
      <g transform="translate(249 332) rotate(-42)"><path d="M 0 0 C 38 -12 44 -70 0 -90 C -44 -70 -38 -12 0 0 Z" fill="#4A6741"/></g>
      <g transform="translate(251 248) rotate(38)"><path d="M 0 0 C 38 -12 44 -70 0 -90 C -44 -70 -38 -12 0 0 Z" fill="#4A6741"/></g>
      <g transform="translate(251 178) rotate(-10)"><path d="M 0 0 C 38 -12 44 -70 0 -90 C -44 -70 -38 -12 0 0 Z" fill="#4A6741"/></g>
    </svg>
  )
}

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative shrink-0" style={{ width: 200, height: 360 }}>
      <div className="absolute inset-0 rounded-[34px] shadow-2xl" style={{ background: '#1C1C1A' }} />
      <div className="absolute overflow-hidden rounded-[27px]" style={{ inset: 6, background: '#F7F6F3' }}>
        <div className="h-5 flex items-center justify-between px-4" style={{ background: '#F7F6F3' }}>
          <span className="text-[7px] font-semibold" style={{ color: '#999' }}>9:41</span>
          <div className="flex items-center" style={{ gap: 2 }}>
            <div className="rounded-sm border" style={{ width: 20, height: 10, borderColor: '#999', position: 'relative' }}>
              <div className="absolute rounded-sm" style={{ left: 1, top: 1, bottom: 1, width: 14, background: '#999' }} />
            </div>
          </div>
        </div>
        <div style={{ height: 'calc(100% - 20px)', overflow: 'hidden' }}>{children}</div>
      </div>
    </div>
  )
}

function Dots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center justify-center" style={{ gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="rounded-full transition-all duration-300" style={{
          width: i === current ? 18 : 6, height: 6,
          background: i === current ? '#4A6741' : 'rgba(74,103,65,0.25)',
        }} />
      ))}
    </div>
  )
}

// --- Screen 1: category dashboard ---
function StatsScreen({ active }: { active: boolean }) {
  const [cleared, setCleared] = useState(false)
  useEffect(() => {
    if (!active) { setCleared(false); return }
    const t = setTimeout(() => setCleared(true), 1600)
    return () => clearTimeout(t)
  }, [active])

  const cats = [
    { icon: '🧸', name: 'Baby clothes', debt: -8 },
    { icon: '📚', name: 'Books', debt: -6 },
    { icon: '👗', name: 'Clothing', debt: -2 },
    { icon: '🛏️', name: 'Bedding', debt: 3 },
    { icon: '📱', name: 'Electronics', debt: 1 },
    { icon: '🛼', name: 'Baby gear', debt: 1, clearable: true },
  ]

  return (
    <Phone>
      <div className="h-7 flex items-center justify-center border-b" style={{ borderColor: '#E8E6E1' }}>
        <span className="text-[8px] font-semibold" style={{ color: '#1C1C1A' }}>one in one out</span>
      </div>
      <div className="grid grid-cols-3 gap-1 px-2 pt-1.5 pb-1">
        {[['4','In debt','#C4704F'],['11','Clear','#4A6741'],['29','Total','#999']].map(([v,l,c]) => (
          <div key={l} className="rounded-lg py-1 text-center" style={{ background: 'white', border: '1px solid #E8E6E1' }}>
            <div className="text-[10px] font-semibold" style={{ color: c as string }}>{v}</div>
            <div className="text-[6px]" style={{ color: '#999' }}>{l}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1 px-2">
        {cats.map((cat, i) => {
          const isDebt = cat.debt > 0
          const nowClear = cat.clearable ? cleared : !isDebt
          return (
            <div key={i} className="rounded-xl p-1.5 transition-all duration-700" style={{
              background: nowClear ? 'rgba(74,103,65,0.07)' : 'rgba(196,112,79,0.07)',
              border: `1px solid ${nowClear ? 'rgba(74,103,65,0.2)' : 'rgba(196,112,79,0.2)'}`,
            }}>
              <div style={{ fontSize: 13 }}>{cat.icon}</div>
              <div className="text-[7px] font-medium truncate" style={{ color: '#1C1C1A' }}>{cat.name}</div>
              <div className="text-[6px] transition-all duration-700 font-medium" style={{ color: nowClear ? '#4A6741' : '#C4704F' }}>
                {cat.clearable && cleared ? 'All clear ✓' : nowClear ? 'All clear' : `${cat.debt} to discard`}
              </div>
            </div>
          )
        })}
      </div>
    </Phone>
  )
}

// --- Screen 2: log entry form ---
function LogScreen({ active }: { active: boolean }) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (!active) { setStep(0); return }
    const t1 = setTimeout(() => setStep(1), 500)
    const t2 = setTimeout(() => setStep(2), 1300)
    const t3 = setTimeout(() => setStep(3), 2100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [active])

  return (
    <Phone>
      <div className="h-7 flex items-center px-3 border-b" style={{ borderColor: '#E8E6E1' }}>
        <span className="text-[8px] font-semibold" style={{ color: '#1C1C1A' }}>Log an entry</span>
      </div>
      <div className="px-2.5 py-2 flex flex-col gap-1.5">
        {/* Toggle */}
        <div className="grid grid-cols-2 rounded-lg p-0.5" style={{ background: '#EEECE8' }}>
          {(['Bought', 'Getting rid of'] as const).map((label, i) => (
            <div key={label} className="rounded-md py-1 text-center text-[7px] font-medium transition-all duration-400"
              style={{ background: (i === 0 && step < 1) || (i === 1 && step >= 1) ? 'white' : 'transparent', color: '#1C1C1A', boxShadow: (i === 0 && step < 1) || (i === 1 && step >= 1) ? '0 1px 2px rgba(0,0,0,0.08)' : 'none' }}>
              {i === 0 ? '🛍️ ' : '♻️ '}{label}
            </div>
          ))}
        </div>
        {/* Category */}
        <div>
          <div className="text-[6px] font-semibold uppercase mb-0.5" style={{ color: '#999' }}>Category</div>
          <div className="rounded-lg px-2 py-1.5 text-[7px] border transition-colors duration-500"
            style={{ background: '#F7F6F3', borderColor: step >= 1 ? '#4A6741' : '#E0DDD7', color: step >= 1 ? '#1C1C1A' : '#bbb' }}>
            {step >= 1 ? '🧸  Baby & Kids Clothing' : 'Select a category…'}
          </div>
        </div>
        {/* Name */}
        <div>
          <div className="text-[6px] font-semibold uppercase mb-0.5" style={{ color: '#999' }}>Item name</div>
          <div className="rounded-lg px-2 py-1.5 text-[7px] border transition-colors duration-500"
            style={{ background: '#F7F6F3', borderColor: step >= 2 ? '#4A6741' : '#E0DDD7', color: step >= 2 ? '#1C1C1A' : '#bbb' }}>
            {step >= 2 ? 'Old 3–6 month grows' : 'e.g. Winter coat…'}
          </div>
        </div>
        {/* Qty / value */}
        <div className="grid grid-cols-2 gap-1.5">
          {[['Qty', step >= 2 ? '6' : '1'], ['Value (£)', '']].map(([label, val]) => (
            <div key={label}>
              <div className="text-[6px] font-semibold uppercase mb-0.5" style={{ color: '#999' }}>{label}</div>
              <div className="rounded-lg px-2 py-1.5 text-[7px] border" style={{ background: '#F7F6F3', borderColor: '#E0DDD7', color: val ? '#1C1C1A' : '#bbb' }}>
                {val || '0.00'}
              </div>
            </div>
          ))}
        </div>
        {/* Save */}
        <div className="rounded-lg py-1.5 text-center text-[8px] font-medium text-white transition-all duration-300"
          style={{ background: '#4A6741', opacity: step >= 3 ? 1 : 0.55, transform: step >= 3 ? 'scale(1.03)' : 'scale(1)' }}>
          Save entry
        </div>
      </div>
    </Phone>
  )
}

// --- Screen 3: trends ---
function TrendsScreen({ active }: { active: boolean }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    if (!active) { setAnimated(false); return }
    const t = setTimeout(() => setAnimated(true), 150)
    return () => clearTimeout(t)
  }, [active])

  const bars = [
    { label: 'D', b: 0, d: 0 }, { label: 'J', b: 0, d: 0 },
    { label: 'F', b: 47, d: 100 }, { label: 'M', b: 40, d: 73 },
    { label: 'A', b: 33, d: 20 }, { label: 'M', b: 0, d: 0 },
  ]

  return (
    <Phone>
      <div className="h-7 flex items-center justify-center border-b" style={{ borderColor: '#E8E6E1' }}>
        <span className="text-[8px] font-semibold" style={{ color: '#1C1C1A' }}>Trends</span>
      </div>
      <div className="px-2 pt-1.5 flex flex-col gap-1.5">
        {/* Bar chart */}
        <div className="rounded-xl p-2" style={{ background: 'white', border: '1px solid #E8E6E1' }}>
          <div className="flex items-end justify-between" style={{ height: 56, gap: 4 }}>
            {bars.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center" style={{ gap: 2 }}>
                <div className="w-full flex items-end" style={{ height: 46, gap: 1 }}>
                  {[{h: d.b, color: 'rgba(196,112,79,0.7)'}, {h: d.d, color: 'rgba(74,103,65,0.7)'}].map((bar, j) => (
                    <div key={j} className="flex-1 rounded-t-sm transition-all duration-700"
                      style={{ height: animated ? `${bar.h}%` : '0%', background: bar.color, transitionDelay: `${i * 60 + j * 30}ms` }} />
                  ))}
                </div>
                <span style={{ fontSize: 6, color: '#999' }}>{d.label}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-1" style={{ gap: 10 }}>
            {[['rgba(196,112,79,0.7)','Bought'],['rgba(74,103,65,0.7)','Discarded']].map(([color, label]) => (
              <div key={label} className="flex items-center" style={{ gap: 3 }}>
                <div className="rounded-sm" style={{ width: 8, height: 8, background: color as string }} />
                <span style={{ fontSize: 6, color: '#999' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Rankings */}
        <div className="grid grid-cols-2" style={{ gap: 6 }}>
          {[
            { title: 'Leaders', color: '#4A6741', rows: [['🧸','Baby','14'],['📚','Books','7'],['👗','Clothing','5']] },
            { title: 'Watch list', color: '#C4704F', rows: [['🛏️','Bedding','+3'],['🛼','Baby gear','+1'],['📱','Electronics','+1']] },
          ].map(({ title, color, rows }) => (
            <div key={title} className="rounded-xl overflow-hidden" style={{ background: 'white', border: '1px solid #E8E6E1' }}>
              <div className="px-2 py-1 border-b" style={{ borderColor: '#E8E6E1' }}>
                <div className="text-[6px] font-semibold uppercase tracking-wide" style={{ color }}>{title}</div>
              </div>
              {rows.map(([icon, name, count], i) => (
                <div key={i} className="flex items-center px-1.5 py-1 border-b last:border-0" style={{ gap: 3, borderColor: '#E8E6E1' }}>
                  <span className="text-[7px] font-bold" style={{ color }}>#{i+1}</span>
                  <span style={{ fontSize: 10 }}>{icon}</span>
                  <span className="flex-1 truncate text-[7px] font-medium" style={{ color: '#1C1C1A' }}>{name}</span>
                  <span className="text-[8px] font-semibold" style={{ color }}>{count}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Phone>
  )
}

// --- Main onboarding component ---
const SCREEN_SLIDES = [
  { Screen: StatsScreen,  headline: 'Track every category',          body: 'When you buy something it creates a discard debt. Clear it by letting something go — the card turns green.' },
  { Screen: LogScreen,    headline: 'One tap to log',                body: 'Log a purchase or a discard in seconds. The app tells you what you owe before you even confirm.' },
  { Screen: TrendsScreen, headline: 'Watch your habits change',      body: 'See which categories you clear first and where clutter builds. Month by month, less is more.' },
]
const TOTAL_SLIDES = 2 + SCREEN_SLIDES.length // hero + screens + cta

export function Onboarding({ onSignUp, onExploreDemo }: Props) {
  const [slide, setSlide] = useState(0)
  const touchStart = useRef(0)

  function next() { setSlide(s => Math.min(s + 1, TOTAL_SLIDES - 1)) }
  function prev() { setSlide(s => Math.max(s - 1, 0)) }

  function onTouchStart(e: React.TouchEvent) { touchStart.current = e.touches[0].clientX }
  function onTouchEnd(e: React.TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStart.current
    if (dx < -50) next()
    if (dx > 50) prev()
  }

  // slide 0 = hero, slides 1–3 = screens, slide 4 = cta
  const isCta = slide === TOTAL_SLIDES - 1
  const isHero = slide === 0

  return (
    <div className="fixed inset-0 font-sans overflow-hidden select-none" style={{ background: '#F7F6F3' }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

      {/* Slide container */}
      <div className="relative h-full overflow-hidden">
        {/* Hero */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center transition-transform duration-350 ease-in-out"
          style={{ transform: `translateX(${(0 - slide) * 100}%)` }}>
          <Sprig size={44} />
          <div className="mt-8 mb-7">
            <h1 className="text-[28px] font-semibold leading-snug tracking-tight" style={{ color: '#1C1C1A' }}>
              The things you own<br />shouldn't own you.
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed" style={{ color: '#888' }}>
              One in, one out — a simple rule<br />for a lighter, calmer home.
            </p>
          </div>
          <button onClick={next}
            className="px-8 py-3 rounded-xl text-[14px] font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: '#4A6741' }}>
            See how it works
          </button>
        </div>

        {/* Screen slides */}
        {SCREEN_SLIDES.map(({ Screen, headline, body }, i) => {
          const slideIndex = i + 1
          return (
            <div key={slideIndex} className="absolute inset-0 flex flex-col transition-transform duration-350 ease-in-out"
              style={{ transform: `translateX(${(slideIndex - slide) * 100}%)` }}>
              {/* Phone mockup */}
              <div className="flex-1 flex items-center justify-center pt-7 pb-3">
                <Screen active={slide === slideIndex} />
              </div>
              {/* Text */}
              <div className="px-8 pb-2">
                <h2 className="text-[19px] font-semibold mb-1.5 tracking-tight" style={{ color: '#1C1C1A' }}>{headline}</h2>
                <p className="text-[13px] leading-relaxed" style={{ color: '#888' }}>{body}</p>
              </div>
              {/* Dots + button */}
              <div className="px-8 pb-10 pt-4 flex flex-col items-center gap-5">
                <Dots total={TOTAL_SLIDES} current={slide} />
                <button onClick={next}
                  className="w-full py-3 rounded-xl text-[14px] font-medium text-white transition-opacity hover:opacity-90"
                  style={{ background: '#4A6741' }}>
                  Continue
                </button>
              </div>
            </div>
          )
        })}

        {/* CTA */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center transition-transform duration-350 ease-in-out"
          style={{ transform: `translateX(${(TOTAL_SLIDES - 1 - slide) * 100}%)` }}>
          <Sprig size={40} />
          <div className="mt-7 mb-8">
            <h2 className="text-[22px] font-semibold mb-3 tracking-tight" style={{ color: '#1C1C1A' }}>Start your household</h2>
            <p className="text-[14px] leading-relaxed" style={{ color: '#888' }}>
              Fully private. No ads.<br />Just you, your partner, and a calmer home.
            </p>
          </div>
          <div className="w-full flex flex-col" style={{ gap: 10 }}>
            <button onClick={onSignUp}
              className="w-full py-3 rounded-xl text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: '#4A6741' }}>
              Create an account
            </button>
            <button onClick={onExploreDemo}
              className="w-full py-2.5 rounded-xl text-[13px] transition-colors"
              style={{ color: '#888' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#4A6741')}
              onMouseLeave={e => (e.currentTarget.style.color = '#888')}>
              Explore the demo first →
            </button>
          </div>
          <div className="mt-8">
            <Dots total={TOTAL_SLIDES} current={slide} />
          </div>
        </div>
      </div>

      {/* Skip / back — only on non-hero, non-cta slides */}
      {!isHero && !isCta && (
        <button onClick={() => setSlide(TOTAL_SLIDES - 1)}
          className="absolute top-5 right-5 text-[12px] transition-colors"
          style={{ color: '#bbb' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#888')}
          onMouseLeave={e => (e.currentTarget.style.color = '#bbb')}>
          Skip
        </button>
      )}
    </div>
  )
}
