import { useState } from 'react';
import type { Category, Entry } from '../types';

interface Props {
  category: Category;
  entries: Entry[];
  onLogEntry: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
}

export function CategoryCard({ category, entries, onLogEntry, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false);

  const bought = entries.filter(e => e.categoryId === category.id && e.type === 'bought')
    .reduce((s, e) => s + e.quantity, 0);
  const discarded = entries.filter(e => e.categoryId === category.id && e.type === 'discarded')
    .reduce((s, e) => s + e.quantity, 0);
  const debt = bought - discarded;
  const hasDebt = debt > 0;
  const progress = bought === 0 ? 100 : Math.min(100, Math.round((discarded / bought) * 100));

  const spent = entries
    .filter(e => e.categoryId === category.id && e.type === 'bought')
    .reduce((s, e) => s + e.estimatedValue, 0);

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirming) {
      onDelete(category.id);
    } else {
      setConfirming(true);
    }
  }

  return (
    <div
      onClick={() => { if (!confirming) onLogEntry(category.id); }}
      className={`relative bg-surface border rounded-xl p-4 shadow-sm cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-md ${
        confirming ? 'ring-1 ring-red-300' : ''
      } ${
        hasDebt ? 'border-l-[3px] border-l-warn border-border' : 'border-l-[3px] border-l-accent border-border'
      }`}
    >
      <div className="flex items-start justify-between mb-2.5">
        <span className="text-xl leading-none">{category.icon}</span>
        <div className="flex items-center gap-1.5">
          {!confirming && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              hasDebt ? 'bg-warn-lt text-warn' : 'bg-accent-lt text-accent'
            }`}>
              {hasDebt ? `${debt} to discard` : 'Clear'}
            </span>
          )}
          <button
            onClick={handleDelete}
            onBlur={() => setConfirming(false)}
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md transition-colors ${
              confirming
                ? 'text-red-600 bg-red-100 hover:bg-red-200'
                : 'text-border hover:text-red-400 hover:bg-red-50'
            }`}
          >
            {confirming ? 'Delete?' : '✕'}
          </button>
        </div>
      </div>
      <div className="text-[13px] font-medium mb-1">{category.name}</div>
      <div className="text-[11px] text-muted">
        {bought} bought · {discarded} discarded
        {spent > 0 && ` · £ ${spent.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} spent`}
      </div>
      <div className="mt-2.5 h-[3px] bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${hasDebt ? 'bg-warn' : 'bg-accent'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
