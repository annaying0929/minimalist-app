import { useMemo } from 'react'
import type { Category, Entry } from '../types'
import { CategoryCard } from './CategoryCard'

interface Props {
  entries: Entry[]
  categories: Category[]
  onLogEntry: (categoryId?: string) => void
}

interface Badge {
  id: string
  icon: string
  label: string
  description: string
  unlocked: boolean
}

function getMonthKey(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(key: string) {
  const [y, m] = key.split('-')
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-GB', { month: 'short' })
}

function fmt(n: number) {
  return `£ ${n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function Stats({ entries, categories, onLogEntry }: Props) {
  const financials = useMemo(() => {
    let totalSpent = 0, totalDiscardedValue = 0
    for (const e of entries) {
      if (e.type === 'bought') totalSpent += e.estimatedValue
      else totalDiscardedValue += e.estimatedValue
    }
    return { totalSpent, totalDiscardedValue }
  }, [entries])

  const totalDiscarded = useMemo(
    () => entries.filter(e => e.type === 'discarded').reduce((s, e) => s + e.quantity, 0),
    [entries]
  )

  const clearedCategories = useMemo(() => {
    const bought: Record<string, number> = {}
    const discarded: Record<string, number> = {}
    for (const e of entries) {
      if (e.type === 'bought') bought[e.categoryId] = (bought[e.categoryId] ?? 0) + e.quantity
      else discarded[e.categoryId] = (discarded[e.categoryId] ?? 0) + e.quantity
    }
    const allIds = new Set([...Object.keys(bought), ...Object.keys(discarded)])
    return [...allIds].filter(id => (discarded[id] ?? 0) >= (bought[id] ?? 0)).length
  }, [entries])

  const badges: Badge[] = [
    { id: 'first', icon: '🌱', label: 'First step', description: 'Log your first discard', unlocked: totalDiscarded >= 1 },
    { id: 'ten', icon: '⭐', label: 'Getting lighter', description: 'Discard 10 items', unlocked: totalDiscarded >= 10 },
    { id: 'twenty', icon: '🌟', label: 'On a roll', description: 'Discard 20 items', unlocked: totalDiscarded >= 20 },
    { id: 'fifty', icon: '💫', label: 'Minimalist', description: 'Discard 50 items', unlocked: totalDiscarded >= 50 },
    { id: 'hundred', icon: '🏆', label: 'Champion', description: 'Discard 100 items', unlocked: totalDiscarded >= 100 },
    { id: 'cat1', icon: '✨', label: 'Balanced', description: 'Clear your first category', unlocked: clearedCategories >= 1 },
    { id: 'cat5', icon: '🎯', label: 'Focused', description: 'Clear 5 categories', unlocked: clearedCategories >= 5 },
    { id: 'catall', icon: '👑', label: 'All clear', description: 'Every category balanced', unlocked: clearedCategories >= categories.length && categories.length > 0 },
  ]

  // Monthly chart — last 6 months
  const chartData = useMemo(() => {
    const now = new Date()
    const months: string[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    }
    const bought: Record<string, number> = {}
    const discarded: Record<string, number> = {}
    for (const e of entries) {
      const k = getMonthKey(e.date)
      if (e.type === 'bought') bought[k] = (bought[k] ?? 0) + e.quantity
      else discarded[k] = (discarded[k] ?? 0) + e.quantity
    }
    return months.map(m => ({
      label: monthLabel(m),
      bought: bought[m] ?? 0,
      discarded: discarded[m] ?? 0,
    }))
  }, [entries])

  const maxVal = Math.max(...chartData.flatMap(d => [d.bought, d.discarded]), 1)

  const sortedCategories = useMemo(() => {
    const debtMap: Record<string, number> = {}
    for (const e of entries) {
      debtMap[e.categoryId] = (debtMap[e.categoryId] ?? 0) + (e.type === 'bought' ? e.quantity : -e.quantity)
    }
    return [...categories].sort((a, b) => (debtMap[b.id] ?? 0) - (debtMap[a.id] ?? 0))
  }, [entries, categories])

  return (
    <main className="max-w-4xl mx-auto px-6 py-7 pb-28">

      {/* Financial summary */}
      <div className="grid grid-cols-2 gap-3 mb-7">
        <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
          <div className="text-[11px] text-muted uppercase tracking-wide mb-1.5">Spent on bought</div>
          <div className="text-[22px] font-semibold tracking-tight text-warn">{fmt(financials.totalSpent)}</div>
          <div className="text-[11px] text-muted mt-0.5">estimated total</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
          <div className="text-[11px] text-muted uppercase tracking-wide mb-1.5">Value discarded</div>
          <div className="text-[22px] font-semibold tracking-tight text-accent">{fmt(financials.totalDiscardedValue)}</div>
          <div className="text-[11px] text-muted mt-0.5">estimated value freed</div>
        </div>
      </div>

      {/* Category balance grid */}
      <h2 className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">Category balance</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-7">
        {sortedCategories.map(cat => (
          <CategoryCard
            key={cat.id}
            category={cat}
            entries={entries}
            onLogEntry={() => onLogEntry(cat.id)}
          />
        ))}
        <button
          onClick={() => onLogEntry()}
          className="flex flex-col items-center justify-center gap-2 bg-surface border-2 border-dashed border-border rounded-xl p-4 shadow-sm text-muted hover:border-accent hover:text-accent transition-colors min-h-[100px]"
        >
          <span className="text-2xl font-light leading-none">+</span>
          <span className="text-[12px] font-medium">Add category</span>
        </button>
      </div>

      {/* Monthly chart */}
      <h2 className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">Monthly snapshot</h2>
      <div className="bg-surface border border-border rounded-xl shadow-sm p-5 mb-7">
        <div className="flex items-end justify-between gap-2" style={{ height: 120 }}>
          {chartData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end gap-0.5" style={{ height: 96 }}>
                <div
                  className="flex-1 rounded-t-sm bg-warn/70 transition-all"
                  style={{ height: `${(d.bought / maxVal) * 96}px`, minHeight: d.bought > 0 ? 2 : 0 }}
                />
                <div
                  className="flex-1 rounded-t-sm bg-accent/70 transition-all"
                  style={{ height: `${(d.discarded / maxVal) * 96}px`, minHeight: d.discarded > 0 ? 2 : 0 }}
                />
              </div>
              <span className="text-[10px] text-muted">{d.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-warn/70" />
            <span className="text-[11px] text-muted">Bought</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-accent/70" />
            <span className="text-[11px] text-muted">Discarded</span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <h2 className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">Achievements</h2>
      <div className="grid grid-cols-2 gap-3">
        {badges.map(b => (
          <div
            key={b.id}
            className={`bg-surface border rounded-xl p-4 shadow-sm flex items-center gap-3 ${
              b.unlocked ? 'border-accent/30' : 'border-border opacity-40'
            }`}
          >
            <span className="text-3xl" style={b.unlocked ? {} : { filter: 'grayscale(1)' }}>
              {b.icon}
            </span>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold truncate">{b.label}</div>
              <div className="text-[11px] text-muted leading-snug">{b.description}</div>
              {b.unlocked && (
                <div className="text-[10px] text-accent font-semibold mt-0.5">Unlocked ✓</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
