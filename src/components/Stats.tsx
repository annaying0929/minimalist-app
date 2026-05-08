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

function fmt(n: number) {
  return `£ ${n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function Stats({ entries, categories, onLogEntry }: Props) {
  const financials = useMemo(() => {
    let totalSpent = 0, totalDiscardedValue = 0, totalDonationResale = 0, totalDonatedItems = 0
    for (const e of entries) {
      if (e.type === 'bought') {
        totalSpent += e.estimatedValue
      } else {
        totalDiscardedValue += e.estimatedValue
        if (e.discardMethod === 'donated') {
          totalDonationResale += e.donationValue
          totalDonatedItems += e.quantity
        }
      }
    }
    return { totalSpent, totalDiscardedValue, totalDonationResale, totalDonatedItems }
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
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
          <div className="text-[11px] text-muted uppercase tracking-wide mb-1.5">Spent on bought</div>
          <div className="text-[22px] font-semibold tracking-tight text-warn">{fmt(financials.totalSpent)}</div>
          <div className="text-[11px] text-muted mt-0.5">estimated total</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
          <div className="text-[11px] text-muted uppercase tracking-wide mb-1.5">Value freed</div>
          <div className="text-[22px] font-semibold tracking-tight text-accent">{fmt(financials.totalDiscardedValue)}</div>
          <div className="text-[11px] text-muted mt-0.5">from all discards</div>
        </div>
      </div>

      {/* Donation impact */}
      {financials.totalDonatedItems > 0 && (
        <div className="bg-accent-lt border border-accent/25 rounded-xl p-4 shadow-sm mb-7">
          <div className="text-[11px] text-accent font-semibold uppercase tracking-wide mb-2">💚 Donation impact</div>
          <div className="flex items-baseline gap-2">
            <div className="text-[22px] font-semibold tracking-tight text-accent">{financials.totalDonatedItems}</div>
            <div className="text-[13px] text-accent">item{financials.totalDonatedItems !== 1 ? 's' : ''} donated</div>
            {financials.totalDonationResale > 0 && (
              <>
                <div className="text-muted mx-1">·</div>
                <div className="text-[22px] font-semibold tracking-tight text-accent">{fmt(financials.totalDonationResale)}</div>
                <div className="text-[13px] text-accent">estimated resale</div>
              </>
            )}
          </div>
          {financials.totalDonationResale > 0 && (
            <div className="text-[11px] text-accent/70 mt-1">That's money going back into the community</div>
          )}
        </div>
      )}
      {financials.totalDonatedItems === 0 && <div className="mb-7" />}

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
