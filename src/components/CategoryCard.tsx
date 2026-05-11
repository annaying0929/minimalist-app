import { useRef } from 'react';
import type { Category, Entry } from '../types';

interface Props {
  category: Category;
  entries: Entry[];
  cap?: number;
  onLogEntry: (categoryId: string) => void;
  onLogDiscard?: (categoryId: string) => void;
}

export function CategoryCard({ category, entries, cap, onLogEntry, onLogDiscard }: Props) {
  const bought = entries.filter(e => e.categoryId === category.id && e.type === 'bought')
    .reduce((s, e) => s + e.quantity, 0);
  const discarded = entries.filter(e => e.categoryId === category.id && e.type === 'discarded')
    .reduce((s, e) => s + e.quantity, 0);
  const debt = bought - discarded;
  const hasDebt = debt > 0;
  const owned = Math.max(0, debt);

  const spent = entries
    .filter(e => e.categoryId === category.id && e.type === 'bought')
    .reduce((s, e) => s + e.estimatedValue, 0);

  // Progress bar: cap-based if cap set, otherwise discarded/bought
  const hasCap = cap !== undefined && cap > 0
  const barFill = hasCap
    ? Math.min(100, Math.round((owned / cap) * 100))
    : (bought === 0 ? 100 : Math.min(100, Math.round((discarded / bought) * 100)))
  const isAtCap = hasCap && owned >= cap
  const isNearCap = hasCap && owned >= cap * 0.8 && !isAtCap
  const barColor = hasCap
    ? (isAtCap || isNearCap ? 'bg-warn' : 'bg-accent')
    : (hasDebt ? 'bg-warn' : 'bg-accent')

  // Swipe-to-discard detection
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const didSwipe = useRef(false)

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    didSwipe.current = false
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (dx < -60 && Math.abs(dx) > Math.abs(dy) && hasDebt && onLogDiscard) {
      didSwipe.current = true
      onLogDiscard(category.id)
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  function handleClick() {
    if (didSwipe.current) { didSwipe.current = false; return }
    onLogEntry(category.id)
  }

  return (
    <div
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`bg-surface border rounded-xl p-4 shadow-sm cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-md ${
        hasDebt ? 'border-l-[3px] border-l-warn border-border' : 'border-l-[3px] border-l-accent border-border'
      }`}
    >
      <div className="flex items-start justify-between mb-2.5">
        <span className="text-xl leading-none">{category.icon}</span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
          isAtCap ? 'bg-warn-lt text-warn'
          : hasDebt ? 'bg-warn-lt text-warn'
          : 'bg-accent-lt text-accent'
        }`}>
          {isAtCap ? 'At limit' : hasDebt ? `${debt} to discard` : 'Clear'}
        </span>
      </div>
      <div className="text-[13px] font-medium mb-1">{category.name}</div>
      <div className="text-[11px] text-muted">
        {bought} bought · {discarded} discarded
        {spent > 0 && ` · £ ${spent.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} spent`}
        {hasCap && ` · max ${cap}`}
      </div>
      <div className="mt-2.5 h-[5px] bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${barFill}%` }}
        />
      </div>
    </div>
  );
}
