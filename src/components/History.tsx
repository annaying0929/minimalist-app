import { useState, useMemo } from 'react';
import type { Entry } from '../types';
import { CATEGORIES } from '../data/categories';

interface Props {
  entries: Entry[]
  onDelete: (id: string) => void
}

export function History({ entries, onDelete }: Props) {
  const [typeFilter, setTypeFilter] = useState<'all' | 'bought' | 'discarded'>('all');
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const usedCatIds = useMemo(() => [...new Set(entries.map(e => e.categoryId))], [entries]);

  const filtered = useMemo(() => {
    return entries.filter(e => {
      if (typeFilter !== 'all' && e.type !== typeFilter) return false;
      if (catFilter && e.categoryId !== catFilter) return false;
      return true;
    });
  }, [entries, typeFilter, catFilter]);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function handleDelete(id: string) {
    if (confirmId === id) {
      onDelete(id)
      setConfirmId(null)
    } else {
      setConfirmId(id)
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-7 pb-16">
      <div className="flex flex-wrap gap-2 mb-5">
        {(['all', 'bought', 'discarded'] as const).map(f => (
          <button
            key={f}
            onClick={() => setTypeFilter(f)}
            className={`px-3 py-1 rounded-full border text-[12px] font-medium transition-colors capitalize ${
              typeFilter === f && !catFilter
                ? 'bg-accent text-white border-accent'
                : 'bg-surface text-muted border-border hover:text-[#1C1C1A]'
            }`}
          >
            {f === 'all' ? 'All entries' : f === 'bought' ? '🛍️ Bought' : '♻️ Discarded'}
          </button>
        ))}
        <div className="w-px bg-border mx-1" />
        {usedCatIds.map(id => {
          const cat = CATEGORIES.find(c => c.id === id);
          if (!cat) return null;
          return (
            <button
              key={id}
              onClick={() => setCatFilter(catFilter === id ? null : id)}
              className={`px-3 py-1 rounded-full border text-[12px] font-medium transition-colors ${
                catFilter === id
                  ? 'bg-accent text-white border-accent'
                  : 'bg-surface text-muted border-border hover:text-[#1C1C1A]'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-8 text-center text-muted text-sm shadow-sm">
          {entries.length === 0
            ? 'No entries yet. Press + Log entry to get started.'
            : 'No entries match the current filters.'}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-2.5 bg-bg border-b border-border text-[11px] font-medium text-muted uppercase tracking-wide">
            <div></div>
            <div>Item</div>
            <div>Value</div>
            <div className="hidden sm:block">Date</div>
            <div></div>
          </div>
          {filtered.map((entry, i) => {
            const cat = CATEGORIES.find(c => c.id === entry.categoryId);
            const isBought = entry.type === 'bought';
            const confirming = confirmId === entry.id;
            return (
              <div
                key={entry.id}
                className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-5 py-3 ${
                  i < filtered.length - 1 ? 'border-b border-border' : ''
                } ${confirming ? 'bg-red-50' : ''}`}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isBought ? 'bg-warn' : 'bg-accent'}`} />
                <div className="min-w-0">
                  <div className="text-[13px] font-medium truncate">
                    {entry.name}
                    {entry.quantity > 1 && <span className="text-muted font-normal"> ×{entry.quantity}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isBought ? 'bg-warn-lt text-warn' : 'bg-accent-lt text-accent'}`}>
                      {isBought ? 'Bought' : 'Discarded'}
                    </span>
                    <span className="text-[11px] text-muted">{cat?.icon} {cat?.name ?? entry.categoryId}</span>
                  </div>
                </div>
                <div className={`text-[13px] font-medium ${isBought ? 'text-warn' : 'text-accent'}`}>
                  {isBought ? '+' : '−'} £ {entry.estimatedValue.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <div className="hidden sm:block text-[12px] text-muted whitespace-nowrap">{formatDate(entry.date)}</div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  onBlur={() => setConfirmId(null)}
                  className={`text-[11px] font-medium px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    confirming
                      ? 'text-red-600 bg-red-100 hover:bg-red-200'
                      : 'text-muted hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  {confirming ? 'Confirm?' : '✕'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
