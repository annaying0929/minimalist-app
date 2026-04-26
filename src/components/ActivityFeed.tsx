import { useState } from 'react';
import type { Entry } from '../types';
import { CATEGORIES } from '../data/categories';

interface Props {
  entries: Entry[]
  onDelete: (id: string) => void
}

function relativeDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function ActivityFeed({ entries, onDelete }: Props) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const recent = entries.slice(0, 10);

  function handleDelete(id: string) {
    if (confirmId === id) {
      onDelete(id)
      setConfirmId(null)
    } else {
      setConfirmId(id)
    }
  }

  if (recent.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center text-muted text-sm shadow-sm">
        No entries yet. Press <strong>+ Log entry</strong> to get started.
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
      {recent.map((entry, i) => {
        const cat = CATEGORIES.find(c => c.id === entry.categoryId);
        const isBought = entry.type === 'bought';
        const confirming = confirmId === entry.id;
        return (
          <div
            key={entry.id}
            className={`flex items-center gap-3 px-5 py-3.5 ${i < recent.length - 1 ? 'border-b border-border' : ''} ${confirming ? 'bg-red-50' : ''}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${isBought ? 'bg-warn-lt' : 'bg-accent-lt'}`}>
              {isBought ? '🛍️' : '♻️'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium truncate">{entry.name}</div>
              <div className="text-[11px] text-muted mt-0.5">
                {cat?.name ?? entry.categoryId}
                {entry.quantity > 1 && ` · qty ${entry.quantity}`}
              </div>
            </div>
            <div className="text-right flex-shrink-0 mr-2">
              <div className={`text-[13px] font-medium ${isBought ? 'text-warn' : 'text-accent'}`}>
                {isBought ? '+' : '−'} £ {entry.estimatedValue.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-muted mt-0.5">{relativeDate(entry.date)}</div>
            </div>
            <button
              onClick={() => handleDelete(entry.id)}
              onBlur={() => setConfirmId(null)}
              className={`text-[11px] font-medium px-2 py-1 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
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
  );
}
