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
    let totalDonationResale = 0, totalDonatedItems = 0, totalSaleProceeds = 0, totalLetGoValue = 0
    for (const e of entries) {
      if (e.type === 'discarded') {
        if (e.discardMethod === 'donated') {
          totalDonationResale += e.donationValue
          totalDonatedItems += e.quantity
          totalLetGoValue += e.estimatedValue
        } else if (e.discardMethod === 'thrown') {
          totalLetGoValue += e.estimatedValue
        } else if (e.discardMethod === 'sold') {
          totalSaleProceeds += e.saleValue ?? 0
        }
      }
    }
    return { totalDonationResale, totalDonatedItems, totalSaleProceeds, totalLetGoValue }
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
      <div className="grid grid-cols-3 gap-3 mb-7">
        {[
          {
            icon: '🍂',
            label: 'Let go',
            sub: 'thrown & donated',
            value: fmt(financials.totalLetGoValue),
            active: financials.totalLetGoValue > 0,
          },
          {
            icon: '🌿',
            label: 'Sale proceeds',
            sub: 'from sold items',
            value: fmt(financials.totalSaleProceeds),
            active: financials.totalSaleProceeds > 0,
          },
          {
            icon: '🌱',
            label: 'Donation',
            sub: financials.totalDonationResale > 0
              ? `${financials.totalDonatedItems} item${financials.totalDonatedItems !== 1 ? 's' : ''}`
              : financials.totalDonatedItems > 0 ? 'items donated' : '',
            value: financials.totalDonationResale > 0
              ? fmt(financials.totalDonationResale)
              : financials.totalDonatedItems > 0 ? String(financials.totalDonatedItems) : '—',
            active: financials.totalDonatedItems > 0,
          },
        ].map(card => (
          <div
            key={card.label}
            className={`rounded-xl p-4 text-center shadow-sm border flex flex-col items-center justify-center gap-1 min-h-[110px] ${
              card.active ? 'bg-accent-lt border-accent/20' : 'bg-surface border-border'
            }`}
          >
            <span className={`text-xl leading-none mb-0.5 ${card.active ? '' : 'opacity-30'}`}>{card.icon}</span>
            <div className={`text-[21px] font-semibold tracking-tight leading-none ${card.active ? 'text-accent' : 'text-muted'}`}>
              {card.value}
            </div>
            <div className={`text-[10px] font-semibold uppercase tracking-widest leading-snug mt-0.5 ${card.active ? 'text-accent/60' : 'text-muted/60'}`}>
              {card.label}
            </div>
            {card.sub && card.active && (
              <div className="text-[10px] text-accent/50 leading-none">{card.sub}</div>
            )}
          </div>
        ))}
      </div>

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
