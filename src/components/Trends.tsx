import { useMemo } from 'react'
import type { Entry } from '../types'

interface Props {
  entries: Entry[]
}

function getMonthKey(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(key: string) {
  const [y, m] = key.split('-')
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-GB', { month: 'short' })
}

export function Trends({ entries }: Props) {
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
      key: m,
      label: monthLabel(m),
      bought: bought[m] ?? 0,
      discarded: discarded[m] ?? 0,
    }))
  }, [entries])

  const maxVal = Math.max(...chartData.flatMap(d => [d.bought, d.discarded]), 1)

  const totalBoughtPeriod = chartData.reduce((s, d) => s + d.bought, 0)
  const totalDiscardedPeriod = chartData.reduce((s, d) => s + d.discarded, 0)
  const balance = totalDiscardedPeriod - totalBoughtPeriod

  return (
    <main className="max-w-4xl mx-auto px-6 py-7 pb-28">
      <h2 className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">Last 6 months</h2>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface border border-border rounded-xl p-4 shadow-sm text-center">
          <div className="text-[20px] font-semibold text-warn">{totalBoughtPeriod}</div>
          <div className="text-[11px] text-muted mt-0.5">Bought</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 shadow-sm text-center">
          <div className="text-[20px] font-semibold text-accent">{totalDiscardedPeriod}</div>
          <div className="text-[11px] text-muted mt-0.5">Discarded</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 shadow-sm text-center">
          <div className={`text-[20px] font-semibold ${balance >= 0 ? 'text-accent' : 'text-warn'}`}>
            {balance >= 0 ? '+' : ''}{balance}
          </div>
          <div className="text-[11px] text-muted mt-0.5">Net</div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-surface border border-border rounded-xl shadow-sm p-5 mb-6">
        <div className="flex items-end justify-between gap-3" style={{ height: 160 }}>
          {chartData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex items-end gap-1" style={{ height: 130 }}>
                <div className="flex-1 flex flex-col justify-end">
                  <div
                    className="w-full rounded-t-md bg-warn/70 transition-all"
                    style={{ height: `${(d.bought / maxVal) * 130}px`, minHeight: d.bought > 0 ? 3 : 0 }}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <div
                    className="w-full rounded-t-md bg-accent/70 transition-all"
                    style={{ height: `${(d.discarded / maxVal) * 130}px`, minHeight: d.discarded > 0 ? 3 : 0 }}
                  />
                </div>
              </div>
              <span className="text-[10px] text-muted">{d.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5 mt-4 justify-center">
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

      {/* Per-month breakdown */}
      <h2 className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">Monthly breakdown</h2>
      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        {chartData.slice().reverse().map((d, i) => {
          const net = d.discarded - d.bought
          return (
            <div
              key={d.key}
              className={`flex items-center gap-4 px-5 py-3.5 ${i < chartData.length - 1 ? 'border-b border-border' : ''}`}
            >
              <div className="w-10 text-[12px] font-medium text-muted">{d.label}</div>
              <div className="flex-1 flex items-center gap-3 text-[12px]">
                <span className="text-warn">{d.bought} bought</span>
                <span className="text-muted">·</span>
                <span className="text-accent">{d.discarded} discarded</span>
              </div>
              <div className={`text-[12px] font-semibold ${net >= 0 ? 'text-accent' : 'text-warn'}`}>
                {net >= 0 ? '+' : ''}{net}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
