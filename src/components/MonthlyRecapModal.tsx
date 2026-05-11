import { useMemo } from 'react'
import type { Category, Entry } from '../types'

interface Props {
  monthKey: string // "2026-04"
  entries: Entry[]
  categories: Category[]
  onClose: () => void
}

function fmt(n: number) {
  return `£${n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function MonthlyRecapModal({ monthKey, entries, categories, onClose }: Props) {
  const [year, month] = monthKey.split('-').map(Number)
  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const currentMonthLabel = new Date().toLocaleDateString('en-GB', { month: 'long' })

  const stats = useMemo(() => {
    const monthEntries = entries.filter(e => e.date.startsWith(monthKey))
    let bought = 0, discarded = 0, spent = 0, freed = 0
    const catBought: Record<string, number> = {}
    const catDiscarded: Record<string, number> = {}

    for (const e of monthEntries) {
      if (e.type === 'bought') {
        bought += e.quantity
        spent += e.estimatedValue
        catBought[e.categoryId] = (catBought[e.categoryId] ?? 0) + e.quantity
      } else {
        discarded += e.quantity
        freed += e.estimatedValue
        catDiscarded[e.categoryId] = (catDiscarded[e.categoryId] ?? 0) + e.quantity
      }
    }

    const net = discarded - bought

    const bestCatId = Object.entries(catDiscarded).sort((a, b) => b[1] - a[1])[0]?.[0]
    const worstCatId = Object.entries(catBought)
      .sort((a, b) =>
        (b[1] - (catDiscarded[b[0]] ?? 0)) - (a[1] - (catDiscarded[a[0]] ?? 0))
      )[0]?.[0]

    return {
      total: monthEntries.length,
      bought, discarded, net, spent, freed,
      bestCat: categories.find(c => c.id === bestCatId),
      bestQty: bestCatId ? catDiscarded[bestCatId] : 0,
      worstCat: categories.find(c => c.id === worstCatId),
      worstDebt: worstCatId ? Math.max(0, (catBought[worstCatId] ?? 0) - (catDiscarded[worstCatId] ?? 0)) : 0,
    }
  }, [entries, categories, monthKey])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 bg-bg w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-accent/10 px-6 pt-6 pb-4 text-center border-b border-accent/15">
          <div className="text-2xl mb-2">📅</div>
          <div className="text-[11px] font-semibold text-accent uppercase tracking-widest mb-1">Monthly recap</div>
          <h2 className="text-[18px] font-semibold text-ink">{monthLabel}</h2>
        </div>

        <div className="px-6 py-5 space-y-4">
          {stats.total === 0 ? (
            <p className="text-[13px] text-muted text-center py-4">Nothing logged in {monthLabel}.</p>
          ) : (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-surface border border-border rounded-xl p-3 text-center">
                  <div className="text-[20px] font-semibold text-warn">{stats.bought}</div>
                  <div className="text-[10px] text-muted mt-0.5">Bought</div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-3 text-center">
                  <div className="text-[20px] font-semibold text-accent">{stats.discarded}</div>
                  <div className="text-[10px] text-muted mt-0.5">Discarded</div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-3 text-center">
                  <div className={`text-[20px] font-semibold ${stats.net >= 0 ? 'text-accent' : 'text-warn'}`}>
                    {stats.net >= 0 ? '+' : ''}{stats.net}
                  </div>
                  <div className="text-[10px] text-muted mt-0.5">Net</div>
                </div>
              </div>

              {/* Financials */}
              <div className="flex items-center justify-between text-[12px] bg-surface border border-border rounded-xl px-4 py-3">
                <span className="text-muted">Spent on bought</span>
                <span className="font-semibold text-warn">{fmt(stats.spent)}</span>
              </div>
              {stats.freed > 0 && (
                <div className="flex items-center justify-between text-[12px] bg-surface border border-border rounded-xl px-4 py-3">
                  <span className="text-muted">Freed by discards</span>
                  <span className="font-semibold text-accent">{fmt(stats.freed)}</span>
                </div>
              )}

              {/* Highlights */}
              {stats.bestCat && (
                <div className="flex items-center gap-3 bg-accent/8 border border-accent/20 rounded-xl px-4 py-3">
                  <span className="text-xl leading-none shrink-0">{stats.bestCat.icon}</span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold text-accent uppercase tracking-wide">Best clear-out</div>
                    <div className="text-[13px] font-medium text-ink truncate">{stats.bestCat.name}</div>
                    <div className="text-[11px] text-muted">{stats.bestQty} discarded</div>
                  </div>
                </div>
              )}
              {stats.worstCat && stats.worstDebt > 0 && (
                <div className="flex items-center gap-3 bg-warn/8 border border-warn/20 rounded-xl px-4 py-3">
                  <span className="text-xl leading-none shrink-0">{stats.worstCat.icon}</span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold text-warn uppercase tracking-wide">Watch this month</div>
                    <div className="text-[13px] font-medium text-ink truncate">{stats.worstCat.name}</div>
                    <div className="text-[11px] text-muted">{stats.worstDebt} still owed</div>
                  </div>
                </div>
              )}
            </>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 bg-accent text-white rounded-xl text-[13px] font-semibold hover:opacity-90 transition-opacity mt-2"
          >
            Start fresh in {currentMonthLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
