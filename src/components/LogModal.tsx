import { useState, useEffect } from 'react';
import type { Entry, EntryType } from '../types';
import { useCategories } from '../context/CategoryContext';

interface Props {
  open: boolean;
  initialCategoryId?: string;
  editEntry?: Entry;
  onClose: () => void;
  onSave: (entry: { type: EntryType; categoryId: string; name: string; quantity: number; estimatedValue: number }) => void;
  onUpdate?: (id: string, fields: { type: EntryType; categoryId: string; name: string; quantity: number; estimatedValue: number }) => void;
  onDeleteCategory?: (id: string) => void;
  debtMap: Record<string, number>;
}

export function LogModal({ open, initialCategoryId, editEntry, onClose, onSave, onUpdate, onDeleteCategory, debtMap }: Props) {
  const { categories } = useCategories();
  const [type, setType] = useState<EntryType>('bought');
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [value, setValue] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open) {
      setConfirmDelete(false);
      if (editEntry) {
        setType(editEntry.type);
        setCategoryId(editEntry.categoryId);
        setName(editEntry.name);
        setQuantity(String(editEntry.quantity));
        setValue(editEntry.estimatedValue > 0 ? String(editEntry.estimatedValue) : '');
      } else {
        setCategoryId(initialCategoryId ?? categories[0]?.id ?? '');
        setName('');
        setQuantity('1');
        setValue('');
        setType('bought');
      }
    }
  }, [open, initialCategoryId, editEntry]);

  const selectedCat = categories.find(c => c.id === categoryId);
  const debt = debtMap[categoryId] ?? 0;
  const qty = Math.max(1, parseInt(quantity) || 1);

  const showDeleteBtn = !!initialCategoryId && !editEntry && !!onDeleteCategory;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;
    const fields = { type, categoryId, name: name.trim(), quantity: Math.max(1, parseInt(quantity) || 1), estimatedValue: parseFloat(value) || 0 };
    if (editEntry && onUpdate) {
      onUpdate(editEntry.id, fields);
    } else {
      onSave(fields);
    }
    onClose();
  }

  if (!open) return null;

  const notice = () => {
    if (!selectedCat) return null;
    if (type === 'bought') {
      const after = debt + qty;
      if (debt > 0) {
        return { text: `${selectedCat.name} already has ${debt} pending discard${debt > 1 ? 's' : ''}. After this you'll owe ${after} item${after > 1 ? 's' : ''}.`, style: 'bg-warn-lt border-warn/30 text-warn' };
      }
      return { text: `${selectedCat.name} is clear. This purchase will require ${qty} discard${qty > 1 ? 's' : ''}.`, style: 'bg-accent-lt border-accent/30 text-accent' };
    } else {
      if (debt > 0) {
        const after = Math.max(0, debt - qty);
        return { text: `This will reduce the ${selectedCat.name} debt to ${after} item${after !== 1 ? 's' : ''}.`, style: 'bg-accent-lt border-accent/30 text-accent' };
      }
      return null;
    }
  };

  const n = notice();

  return (
    <div
      className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface rounded-2xl p-7 w-full max-w-md shadow-2xl animate-[slideUp_0.18s_ease]">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold">{editEntry ? 'Edit entry' : 'Log an entry'}</h3>
          {showDeleteBtn && (
            <button
              type="button"
              onClick={() => setConfirmDelete(c => !c)}
              className={`text-[13px] font-medium px-2 py-1 rounded-lg transition-colors ${
                confirmDelete ? 'text-red-600 bg-red-100' : 'text-muted hover:text-red-500 hover:bg-red-50'
              }`}
            >
              ✕
            </button>
          )}
        </div>

        {/* Delete confirmation */}
        {confirmDelete && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-[12px] text-red-700 flex-1">Delete this category?</span>
            <button
              type="button"
              onClick={() => { onDeleteCategory!(initialCategoryId!); onClose(); }}
              className="text-[12px] font-semibold text-red-600 hover:text-red-700"
            >Delete</button>
            <span className="text-border">·</span>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-[12px] text-muted hover:text-[#1C1C1A]"
            >Cancel</button>
          </div>
        )}

        {/* Toggle */}
        <div className="grid grid-cols-2 bg-bg rounded-lg p-0.5 mb-5">
          {(['bought', 'discarded'] as EntryType[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`py-2 rounded-md text-[13px] font-medium transition-all ${
                type === t ? 'bg-surface text-[#1C1C1A] shadow-sm' : 'text-muted'
              }`}
            >
              {t === 'bought' ? '🛍️  Bought' : '♻️  Discarded'}
            </button>
          ))}
        </div>

        {/* Debt notice */}
        {n && (
          <div className={`border rounded-lg px-3.5 py-3 mb-4 text-[12px] leading-relaxed ${n.style}`}>
            {n.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-medium text-muted uppercase tracking-wide mb-1.5">Category</label>
            <div className="relative">
              <select
                required
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 pr-8 border border-border rounded-lg text-[13px] bg-bg focus:outline-none focus:border-accent focus:bg-white transition-colors appearance-none"
              >
                <option value="" disabled>Select a category…</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none text-[10px]">▾</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-muted uppercase tracking-wide mb-1.5">Item name</label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Winter coat, Baby grows ×3…"
              className="w-full px-3 py-2.5 border border-border rounded-lg text-[13px] bg-bg focus:outline-none focus:border-accent focus:bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-muted uppercase tracking-wide mb-1.5">Quantity</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                onBlur={e => { if (!e.target.value || parseInt(e.target.value) < 1) setQuantity('1'); }}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-[13px] bg-bg focus:outline-none focus:border-accent focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-muted uppercase tracking-wide mb-1.5">Est. value (£)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2.5 border border-border rounded-lg text-[13px] bg-bg focus:outline-none focus:border-accent focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-2.5 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg text-[13px] text-muted hover:border-[#1C1C1A] hover:text-[#1C1C1A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-white rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity"
            >
              {editEntry ? 'Update entry' : 'Save entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
