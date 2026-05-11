import { useMemo } from 'react'
import type { Category, Entry } from '../types'

interface Props {
  category: Category | null
  entries: Entry[]
  onClose: () => void
  onLogDiscard?: (categoryId: string) => void
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
  return `£${n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function CategoryDetailModal({ category, entries, onClose, onLogDiscard }: Props) {
  const catEntries = useMemo(() => {
    if (!category) return []
    return entries.filter(e => e.categoryId === category.id)
  }, [category, entries])

  const stats = useMemo(() => {
    let totalBoughtQty = 0, totalDiscardedQty = 0, totalSpent = 0, totalFreed = 0
    for (const e of catEntries) {
      if (e.type === 'bought') {
        totalBoughtQty += e.quantity
        totalSpent += e.estimatedValue
      } else {
        totalDiscardedQty += e.quantity
        totalFreed += e.estimatedValue
      }
    }
    return { totalBoughtQty, totalDiscardedQty, debt: totalBoughtQty - totalDiscardedQty, totalSpent, totalFreed }
  }, [catEntries])

  const recentBought = useMemo(() =>
    [...catEntries].filter(e => e.type === 'bought').sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
  , [catEntries])

  const recentDiscarded = useMemo(() =>
    [...catEntries].filter(e => e.type === 'discarded').sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
  , [catEntries])

  const chartData = useMemo(() => {
    const now = new Date()
    const months: string[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    }
    const bought: Record<string, number> = {}
    const discarded: Record<string, number> = {}
    for (const e of catEntries) {
      const k = getMonthKey(e.date)
      if (e.type === 'bought') bought[k] = (bought[k] ?? 0) + e.quantity
      else discarded[k] = (discarded[k] ?? 0) + e.quantity
    }
    return months.map(m => ({
      key: m,
      label: monthLabel(m),
      bought: bought[m] ?? 0,
      discarded: discarded[m] ?? 0,
    }))
  }, [catEntries])

  const maxVal = Math.max(...chartData.flatMap(d => [d.bought, d.discarded]), 1)

  const insight = useMemo(() => {
    if (!category) return null
    const lastBought = recentBought[0]
    const daysSinceLastBuy = lastBought
      ? Math.floor((Date.now() - new Date(lastBought.date).getTime()) / 86400000)
      : null

    if (stats.debt > 0) {
      if (daysSinceLastBuy !== null && daysSinceLastBuy < 30) {
        return `You bought from this category ${daysSinceLastBuy}d ago. Pause buying until you discard ${stats.debt} more item${stats.debt > 1 ? 's' : ''}.`
      }
      return `${stats.debt} item${stats.debt > 1 ? 's' : ''} still owed. Discard before buying more in this category.`
    } else {
      const surplus = -stats.debt
      return `You've cleared ${surplus} more than you've bought — great discipline! Room to bring in ${surplus} new item${surplus > 1 ? 's' : ''}.`
    }
  }, [category, recentBought, stats])

  if (!category) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 bg-bg w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border sticky top-0 bg-bg z-10">
          <span className="text-2xl leading-none">{category.icon}</span>
          <h2 className="flex-1 text-[15px] font-semibold text-ink">{category.name}</h2>
          <button onClick={onClose} className="text-muted hover:text-ink text-2xl leading-none w-8 h-8 flex items-center justify-center">×</button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Status badge */}
          <div className={`inline-flex items-center rounded-full px-4 py-1.5 text-[12px] font-semibold ${stats.debt > 0 ? 'bg-warn/10 text-warn' : 'bg-accent/10 text-accent'}`}>
            {stats.debt > 0
              ? `Discard ${stats.debt} more item${stats.debt > 1 ? 's' : ''} to clear`
              : `+${-stats.debt} surplus — all balanced`
            }
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface border border-border rounded-xl p-3">
              <div className="text-[11px] text-muted uppercase tracking-wide mb-1">Bought</div>
              <div className="text-[22px] font-semibold text-warn">{stats.totalBoughtQty}</div>
              <div className="text-[11px] text-muted">{fmt(stats.totalSpent)} spent</div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3">
              <div className="text-[11px] text-muted uppercase tracking-wide mb-1">Discarded</div>
              <div className="text-[22px] font-semibold text-accent">{stats.totalDiscardedQty}</div>
              <div className="text-[11px] text-muted">{fmt(stats.totalFreed)} freed</div>
            </div>
          </div>

          {/* Mini 6-month chart */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="text-[10px] text-muted uppercase tracking-widest mb-3">6-month trend</div>
            <div className="flex items-end justify-between gap-2" style={{ height: 80 }}>
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-0.5" style={{ height: 60 }}>
                    <div className="flex-1 flex flex-col justify-end">
                      <div
                        className="w-full rounded-t bg-warn/70"
                        style={{ height: `${(d.bought / maxVal) * 60}px`, minHeight: d.bought > 0 ? 2 : 0 }}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-end">
                      <div
                        className="w-full rounded-t bg-accent/70"
                        style={{ height: `${(d.discarded / maxVal) * 60}px`, minHeight: d.discarded > 0 ? 2 : 0 }}
                      />
                    </div>
                  </div>
                  <span className="text-[9px] text-muted">{d.label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 justify-center">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-warn/70" />
                <span className="text-[10px] text-muted">Bought</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-accent/70" />
                <span className="text-[10px] text-muted">Discarded</span>
              </div>
            </div>
          </div>

          {/* Recent purchases */}
          {recentBought.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-warn uppercase tracking-widest mb-2">Recent purchases</div>
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                {recentBought.map((e, i) => (
                  <div key={e.id} className={`flex items-center gap-3 px-3 py-2.5 ${i < recentBought.length - 1 ? 'border-b border-border' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium text-ink truncate">{e.name}</div>
                      <div className="text-[11px] text-muted">{fmtDate(e.date)}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[12px] font-medium text-ink">×{e.quantity}</div>
                      {e.estimatedValue > 0 && <div className="text-[11px] text-muted">{fmt(e.estimatedValue)}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent discards */}
          {recentDiscarded.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-accent uppercase tracking-widest mb-2">Recent discards</div>
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                {recentDiscarded.map((e, i) => (
                  <div key={e.id} className={`flex items-center gap-3 px-3 py-2.5 ${i < recentDiscarded.length - 1 ? 'border-b border-border' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium text-ink truncate">{e.name}</div>
                      <div className="text-[11px] text-muted">
                        {fmtDate(e.date)}{e.discardMethod === 'donated' ? ' · donated' : ''}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[12px] font-medium text-ink">×{e.quantity}</div>
                      {e.estimatedValue > 0 && <div className="text-[11px] text-muted">{fmt(e.estimatedValue)}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insight */}
          {insight && (
            <div className={`rounded-xl border p-4 ${stats.debt > 0 ? 'border-warn/25 bg-warn/5' : 'border-accent/25 bg-accent/5'}`}>
              <div className={`text-[10px] font-semibold uppercase tracking-widest mb-1.5 ${stats.debt > 0 ? 'text-warn' : 'text-accent'}`}>
                {stats.debt > 0 ? 'Action needed' : 'Great work'}
              </div>
              <p className="text-[13px] leading-relaxed text-ink">{insight}</p>
            </div>
          )}

          {stats.debt > 0 && onLogDiscard && (
            <button
              onClick={() => { onClose(); onLogDiscard(category.id) }}
              className="w-full py-3 bg-warn text-white rounded-xl text-[13px] font-semibold hover:opacity-90 transition-opacity"
            >
              Log a discard in {category.name}
            </button>
          )}

          <div className="pb-8" />
        </div>
      </div>
    </div>
  )
}
