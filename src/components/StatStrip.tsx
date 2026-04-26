import { useMemo } from 'react';
import type { Entry } from '../types';
import { CATEGORIES } from '../data/categories';

interface Props { entries: Entry[] }

function fmt(n: number) {
  return `£ ${n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function StatStrip({ entries }: Props) {
  const stats = useMemo(() => {
    const debtMap: Record<string, number> = {};
    CATEGORIES.forEach(c => { debtMap[c.id] = 0; });

    let totalBought = 0, totalDiscarded = 0, totalSpent = 0, totalDiscardedValue = 0;

    for (const e of entries) {
      if (e.type === 'bought') {
        totalBought += e.quantity;
        totalSpent += e.estimatedValue;
        debtMap[e.categoryId] = (debtMap[e.categoryId] ?? 0) + e.quantity;
      } else {
        totalDiscarded += e.quantity;
        totalDiscardedValue += e.estimatedValue;
        debtMap[e.categoryId] = (debtMap[e.categoryId] ?? 0) - e.quantity;
      }
    }

    const pendingItems = Object.values(debtMap).filter(d => d > 0).reduce((a, b) => a + b, 0);
    const pendingCategories = Object.values(debtMap).filter(d => d > 0).length;

    return { totalBought, totalDiscarded, totalSpent, totalDiscardedValue, pendingItems, pendingCategories };
  }, [entries]);

  const cards = [
    {
      label: 'Items to discard',
      value: stats.pendingItems,
      sub: `across ${stats.pendingCategories} categor${stats.pendingCategories === 1 ? 'y' : 'ies'}`,
      valueClass: stats.pendingItems > 0 ? 'text-warn' : 'text-accent',
    },
    {
      label: 'Total bought',
      value: stats.totalBought,
      sub: `${fmt(stats.totalSpent)} estimated`,
      valueClass: 'text-[#1C1C1A]',
    },
    {
      label: 'Total discarded',
      value: stats.totalDiscarded,
      sub: `${fmt(stats.totalDiscardedValue)} estimated value`,
      valueClass: 'text-accent',
    },
    {
      label: 'Net cost awareness',
      value: fmt(stats.totalSpent - stats.totalDiscardedValue),
      sub: 'spent beyond discarded',
      valueClass: 'text-[#1C1C1A]',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
      {cards.map(card => (
        <div key={card.label} className="bg-surface border border-border rounded-xl p-4 shadow-sm">
          <div className="text-[11px] text-muted uppercase tracking-wide mb-1.5">{card.label}</div>
          <div className={`text-[22px] font-semibold tracking-tight ${card.valueClass}`}>{card.value}</div>
          <div className="text-[11px] text-muted mt-0.5">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
