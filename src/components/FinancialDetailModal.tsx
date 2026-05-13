import { useMemo } from 'react'
import type { Category, Entry } from '../types'

export type FinancialDetailType = 'letgo' | 'sales' | 'donations'

interface Props {
  type: FinancialDetailType | null
  entries: Entry[]
  categories: Category[]
  onClose: () => void
}

function fmt(n: number) {
  return `£ ${n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
}

export function FinancialDetailModal({ type, entries, categories, onClose }: Props) {
  const catMap = useMemo(() =>
    Object.fromEntries(categories.map(c => [c.id, c])),
    [categories]
  )

  // --- Let go data ---
  const letGoData = useMemo(() => {
    if (type !== 'letgo') return null
    let totalDiscarded = 0, totalSales = 0
    const byCat: Record<string, number> = {}
    for (const e of entries) {
      if (e.type !== 'discarded') continue
      totalDiscarded += e.estimatedValue
      if (e.discardMethod === 'sold') {
        totalSales += e.saleValue ?? 0
      } else {
        byCat[e.categoryId] = (byCat[e.categoryId] ?? 0) + e.estimatedValue
      }
    }
    const total = Math.max(0, totalDiscarded - totalSales)
    const rows = Object.entries(byCat)
      .map(([id, value]) => ({ cat: catMap[id], value }))
      .filter(r => r.cat && r.value > 0)
      .sort((a, b) => b.value - a.value)
    const max = rows[0]?.value ?? 1
    return { total, totalDiscarded, totalSales, rows, max }
  }, [type, entries, catMap])

  // --- Sales data ---
  const salesData = useMemo(() => {
    if (type !== 'sales') return null
    const items = entries
      .filter(e => e.type === 'discarded' && e.discardMethod === 'sold')
      .sort((a, b) => b.date.localeCompare(a.date))
    const total = items.reduce((s, e) => s + (e.saleValue ?? 0), 0)
    return { items, total }
  }, [type, entries])

  // --- Donations data ---
  const donationsData = useMemo(() => {
    if (type !== 'donations') return null
    const items = entries
      .filter(e => e.type === 'discarded' && e.discardMethod === 'donated')
      .sort((a, b) => b.date.localeCompare(a.date))
    const totalItems = items.reduce((s, e) => s + e.quantity, 0)
    const totalResale = items.reduce((s, e) => s + (e.donationValue ?? 0), 0)
    return { items, totalItems, totalResale }
  }, [type, entries])

  if (!type) return null

  const config = {
    letgo:     { icon: '🍂', title: 'Let go',          accent: 'accent' },
    sales:     { icon: '🌿', title: 'Sale proceeds',    accent: 'accent' },
    donations: { icon: '🌱', title: 'Donation impact',  accent: 'accent' },
  }[type]

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-bg w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-xl">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border sticky top-0 bg-bg z-10">
          <span className="text-2xl leading-none">{config.icon}</span>
          <h2 className="flex-1 text-[15px] font-semibold">{config.title}</h2>
          <button onClick={onClose} className="text-muted hover:text-[#1C1C1A] text-2xl leading-none w-8 h-8 flex items-center justify-center">×</button>
        </div>

        <div className="px-5 py-5 pb-10 space-y-5">

          {/* ── LET GO ── */}
          {letGoData && (
            <>
              {/* Total + formula */}
              <div className="bg-accent-lt border border-accent/20 rounded-xl p-4">
                <div className="text-[11px] text-accent/60 uppercase tracking-widest mb-1">Total let go</div>
                <div className="text-[32px] font-semibold tracking-tight text-accent leading-none mb-2">
                  {fmt(letGoData.total)}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-accent/70">
                  <span>{fmt(letGoData.totalDiscarded)} discarded</span>
                  <span>−</span>
                  <span>{fmt(letGoData.totalSales)} from sales</span>
                </div>
              </div>

              {/* Category breakdown */}
              {letGoData.rows.length > 0 && (
                <div>
                  <div className="text-[10px] text-muted uppercase tracking-widest mb-3">By category</div>
                  <div className="space-y-2.5">
                    {letGoData.rows.map(({ cat, value }) => (
                      <div key={cat.id} className="flex items-center gap-3">
                        <span className="text-base w-6 text-center flex-shrink-0">{cat.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[12px] font-medium truncate">{cat.name}</span>
                            <span className="text-[12px] text-accent font-medium ml-2 flex-shrink-0">{fmt(value)}</span>
                          </div>
                          <div className="h-1.5 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent/50 rounded-full"
                              style={{ width: `${(value / letGoData.max) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {letGoData.rows.length === 0 && (
                <p className="text-[13px] text-muted text-center py-4">No thrown or donated items yet.</p>
              )}
            </>
          )}

          {/* ── SALES ── */}
          {salesData && (
            <>
              <div className="bg-accent-lt border border-accent/20 rounded-xl p-4">
                <div className="text-[11px] text-accent/60 uppercase tracking-widest mb-1">Total proceeds</div>
                <div className="text-[32px] font-semibold tracking-tight text-accent leading-none">
                  {fmt(salesData.total)}
                </div>
                <div className="text-[11px] text-accent/70 mt-1">
                  {salesData.items.length} item{salesData.items.length !== 1 ? 's' : ''} sold
                </div>
              </div>

              {salesData.items.length > 0 ? (
                <div>
                  <div className="text-[10px] text-muted uppercase tracking-widest mb-3">All sales</div>
                  <div className="bg-surface border border-border rounded-xl overflow-hidden">
                    {salesData.items.map((e, i) => (
                      <div key={e.id} className={`flex items-center gap-3 px-4 py-3 ${i < salesData.items.length - 1 ? 'border-b border-border' : ''}`}>
                        <span className="text-base w-6 text-center flex-shrink-0">{catMap[e.categoryId]?.icon ?? '📦'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium truncate">{e.name}</div>
                          <div className="text-[11px] text-muted">{catMap[e.categoryId]?.name} · {fmtDate(e.date)}</div>
                        </div>
                        <div className="text-[13px] font-semibold text-accent flex-shrink-0">{fmt(e.saleValue ?? 0)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[13px] text-muted text-center py-4">No sold items yet.</p>
              )}
            </>
          )}

          {/* ── DONATIONS ── */}
          {donationsData && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-accent-lt border border-accent/20 rounded-xl p-4">
                  <div className="text-[11px] text-accent/60 uppercase tracking-widest mb-1">Items donated</div>
                  <div className="text-[32px] font-semibold tracking-tight text-accent leading-none">
                    {donationsData.totalItems}
                  </div>
                </div>
                <div className="bg-accent-lt border border-accent/20 rounded-xl p-4">
                  <div className="text-[11px] text-accent/60 uppercase tracking-widest mb-1">Est. resale</div>
                  <div className="text-[32px] font-semibold tracking-tight text-accent leading-none">
                    {fmt(donationsData.totalResale)}
                  </div>
                </div>
              </div>

              {donationsData.items.length > 0 ? (
                <div>
                  <div className="text-[10px] text-muted uppercase tracking-widest mb-3">All donations</div>
                  <div className="bg-surface border border-border rounded-xl overflow-hidden">
                    {donationsData.items.map((e, i) => (
                      <div key={e.id} className={`flex items-center gap-3 px-4 py-3 ${i < donationsData.items.length - 1 ? 'border-b border-border' : ''}`}>
                        <span className="text-base w-6 text-center flex-shrink-0">{catMap[e.categoryId]?.icon ?? '📦'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium truncate">{e.name}{e.quantity > 1 ? ` ×${e.quantity}` : ''}</div>
                          <div className="text-[11px] text-muted">{catMap[e.categoryId]?.name} · {fmtDate(e.date)}</div>
                        </div>
                        {e.donationValue > 0 && (
                          <div className="text-[13px] font-semibold text-accent flex-shrink-0">{fmt(e.donationValue)}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[13px] text-muted text-center py-4">No donated items yet.</p>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}
