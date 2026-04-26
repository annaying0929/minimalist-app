import type { Entry } from '../types';
import { CATEGORIES } from '../data/categories';

interface Props { entries: Entry[] }

function relativeDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function ActivityFeed({ entries }: Props) {
  const recent = entries.slice(0, 10);

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
        return (
          <div
            key={entry.id}
            className={`flex items-start gap-3 px-5 py-3.5 ${i < recent.length - 1 ? 'border-b border-border' : ''}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5 ${isBought ? 'bg-warn-lt' : 'bg-accent-lt'}`}>
              {isBought ? '🛍️' : '♻️'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium truncate">{entry.name}</div>
              <div className="text-[11px] text-muted mt-0.5">
                {cat?.name ?? entry.categoryId}
                {entry.quantity > 1 && ` · qty ${entry.quantity}`}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className={`text-[13px] font-medium ${isBought ? 'text-warn' : 'text-accent'}`}>
                {isBought ? '+' : '−'} £ {entry.estimatedValue.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-muted mt-0.5">{relativeDate(entry.date)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
