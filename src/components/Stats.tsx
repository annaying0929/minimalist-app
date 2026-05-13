import { useMemo } from 'react'
import type { Category, Entry } from '../types'
import { CategoryCard } from './CategoryCard'
import { useAchievements } from '../hooks/useAchievements'

interface Props {
  entries: Entry[]
  categories: Category[]
  caps: Record<string, number>
  onLogEntry: (categoryId?: string, initialType?: 'bought' | 'discarded') => void
}

function fmt(n: number) {
  return `£ ${n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function Stats({ entries, categories, caps, onLogEntry }: Props) {
  const financials = useMemo(() => {
    let totalSpent = 0, totalDiscardedValue = 0, totalDonationResale = 0, totalDonatedItems = 0, totalSaleProceeds = 0
    for (const e of entries) {
      if (e.type === 'bought') {
        totalSpent += e.estimatedValue
      } else {
        totalDiscardedValue += e.estimatedValue
        if (e.discardMethod === 'donated') {
          totalDonationResale += e.donationValue
          totalDonatedItems += e.quantity
        }
        if (e.discardMethod === 'sold') {
          totalSaleProceeds += e.saleValue ?? 0
        }
      }
    }
    return { totalSpent, totalDiscardedValue, totalDonationResale, totalDonatedItems, totalSaleProceeds }
  }, [entries])

  const { badges } = useAchievements(entries, categories)

  const sortedCategories = useMemo(() => {
    const discardCount: Record<string, number> = {}
    for (const e of entries) {
      if (e.type === 'discarded') {
        discardCount[e.categoryId] = (discardCount[e.categoryId] ?? 0) + e.quantity
      }
    }
    return [...categories].sort((a, b) => (discardCount[b.id] ?? 0) - (discardCount[a.id] ?? 0))
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
            cap={caps[cat.id]}
            onLogEntry={() => onLogEntry(cat.id)}
            onLogDiscard={() => onLogEntry(cat.id, 'discarded')}
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
