import { useState } from 'react';
import type { Category, Entry } from '../types';
import { useCategories } from '../context/CategoryContext';

interface Props {
  category: Category | null;
  entries: Entry[];
  onClose: () => void;
  onLogEntry: (categoryId: string) => void;
}

export function CategoryModal({ category, entries, onClose, onLogEntry }: Props) {
  const { deleteCategory } = useCategories();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!category) return null;

  const catEntries = entries.filter(e => e.categoryId === category.id);
  const bought = catEntries.filter(e => e.type === 'bought').reduce((s, e) => s + e.quantity, 0);
  const discarded = catEntries.filter(e => e.type === 'discarded').reduce((s, e) => s + e.quantity, 0);
  const debt = bought - discarded;
  const spent = catEntries.filter(e => e.type === 'bought').reduce((s, e) => s + e.estimatedValue, 0);
  const hasDebt = debt > 0;

  function handleDelete() {
    if (confirmDelete) {
      deleteCategory(category!.id);
      onClose();
    } else {
      setConfirmDelete(true);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/35 z-50 flex items-end sm:items-center justify-center sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) { setConfirmDelete(false); onClose(); } }}
    >
      <div className="bg-surface rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm shadow-2xl animate-[slideUp_0.18s_ease]">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <h3 className="text-base font-semibold">{category.name}</h3>
            <p className={`text-[12px] font-medium mt-0.5 ${hasDebt ? 'text-warn' : 'text-accent'}`}>
              {hasDebt ? `${debt} item${debt !== 1 ? 's' : ''} to discard` : 'All clear'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: 'Bought', value: bought },
            { label: 'Discarded', value: discarded },
            { label: 'Spent', value: `£${spent.toLocaleString('en-GB', { maximumFractionDigits: 0 })}` },
          ].map(s => (
            <div key={s.label} className="bg-bg rounded-lg p-3 text-center">
              <div className="text-[17px] font-semibold text-[#1C1C1A]">{s.value}</div>
              <div className="text-[10px] text-muted mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-[4px] bg-border rounded-full overflow-hidden mb-5">
          <div
            className={`h-full rounded-full transition-all ${hasDebt ? 'bg-warn' : 'bg-accent'}`}
            style={{ width: bought === 0 ? '100%' : `${Math.min(100, Math.round((discarded / bought) * 100))}%` }}
          />
        </div>

        {/* Actions */}
        <button
          onClick={() => { onClose(); onLogEntry(category.id); }}
          className="w-full py-2.5 bg-accent text-white rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity mb-2"
        >
          Log entry
        </button>

        {confirmDelete ? (
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 py-2.5 border border-border rounded-lg text-[13px] text-muted hover:text-[#1C1C1A] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity"
            >
              Confirm delete
            </button>
          </div>
        ) : (
          <button
            onClick={handleDelete}
            className="w-full py-2.5 border border-border rounded-lg text-[13px] text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
          >
            Delete category
          </button>
        )}
      </div>
    </div>
  );
}
