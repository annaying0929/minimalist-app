import { useState } from 'react';
import type { Entry } from '../types';
import { useCategories } from '../context/CategoryContext';

interface Props {
  entries: Entry[]
  onDelete: (id: string) => void
  onEdit: (entry: Entry) => void
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

export function ActivityFeed({ entries, onDelete, onEdit }: Props) {
  const { categories } = useCategories();
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
        const cat = categories.find(c => c.id === entry.categoryId);
        const isBought = entry.type === 'bought';
        const isDonated = entry.discardMethod === 'donated';
        const confirming = confirmId === entry.id;
        return (
          <div
            key={entry.id}
            className={`flex items-center gap-3 px-5 py-3.5 ${i < recent.length - 1 ? 'border-b border-border' : ''} ${confirming ? 'bg-red-50' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 border-2 ${isBought ? 'bg-warn-lt border-warn/30' : 'bg-accent-lt border-accent/30'}`}>
              {cat?.icon ?? '📦'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium truncate">{entry.name}</div>
              <div className="text-[11px] text-muted mt-0.5 flex items-center gap-1.5">
                {!isBought && (
                  <span className={`font-medium ${isDonated ? 'text-accent' : 'text-muted'}`}>
                    {isDonated ? '💚 Donated' : '🗑️ Thrown'}
                  </span>
                )}
                {!isBought && <span>·</span>}
                <span>{cat?.name ?? entry.categoryId}</span>
                {entry.quantity > 1 && <span>· qty {entry.quantity}</span>}
              </div>
            </div>
            <div className="text-right flex-shrink-0 mr-2">
              <div className={`text-[13px] font-medium ${isBought ? 'text-warn' : 'text-accent'}`}>
                {isBought ? '+' : '−'} £ {entry.estimatedValue.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              {isDonated && entry.donationValue > 0 ? (
                <div className="text-[11px] text-accent mt-0.5">
                  💚 £ {entry.donationValue.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} resale
                </div>
              ) : (
                <div className="text-[11px] text-muted mt-0.5">{relativeDate(entry.date)}</div>
              )}
            </div>
            {!confirming && (
              <button
                onClick={() => onEdit(entry)}
                className="text-[11px] font-medium px-2 py-1 rounded-lg text-muted hover:text-accent hover:bg-accent-lt transition-colors flex-shrink-0"
              >
                ✎
              </button>
            )}
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
