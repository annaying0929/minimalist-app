import { useState, useEffect } from 'react';
import type { EntryType } from '../types';
import { CATEGORIES } from '../data/categories';

interface Props {
  open: boolean;
  initialCategoryId?: string;
  onClose: () => void;
  onSave: (entry: { type: EntryType; categoryId: string; name: string; quantity: number; estimatedValue: number }) => void;
  debtMap: Record<string, number>;
}

export function LogModal({ open, initialCategoryId, onClose, onSave, debtMap }: Props) {
  const [type, setType] = useState<EntryType>('bought');
  const [categoryId, setCategoryId] = useState(initialCategoryId ?? CATEGORIES[0].id);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (open) {
      setCategoryId(initialCategoryId ?? CATEGORIES[0].id);
      setName('');
      setQuantity(1);
      setValue('');
      setType('bought');
    }
  }, [open, initialCategoryId]);

  const debt = debtMap[categoryId] ?? 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ type, categoryId, name: name.trim(), quantity, estimatedValue: parseFloat(value) || 0 });
    onClose();
  }

  if (!open) return null;

  const notice = () => {
    if (type === 'bought') {
      const after = debt + quantity;
      if (debt > 0) {
        return { text: `${CATEGORIES.find(c => c.id === categoryId)?.name} already has ${debt} pending discard${debt > 1 ? 's' : ''}. After this you'll owe ${after} item${after > 1 ? 's' : ''}.`, style: 'bg-warn-lt border-warn/30 text-warn' };
      }
      return { text: `${CATEGORIES.find(c => c.id === categoryId)?.name} is clear. This purchase will require ${quantity} discard${quantity > 1 ? 's' : ''}.`, style: 'bg-accent-lt border-accent/30 text-accent' };
    } else {
      if (debt > 0) {
        const after = Math.max(0, debt - quantity);
        return { text: `This will reduce the ${CATEGORIES.find(c => c.id === categoryId)?.name} debt to ${after} item${after !== 1 ? 's' : ''}.`, style: 'bg-accent-lt border-accent/30 text-accent' };
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
        <h3 className="text-base font-semibold mb-5">Log an entry</h3>

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
            <label className="block text-[11px] font-medium text-muted uppercase tracking-wide mb-1.5">Item name</label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Winter coat, Baby grows ×3…"
              className="w-full px-3 py-2.5 border border-border rounded-lg text-[13px] bg-bg focus:outline-none focus:border-accent focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-muted uppercase tracking-wide mb-1.5">Category</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-[13px] bg-bg focus:outline-none focus:border-accent focus:bg-white transition-colors"
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-muted uppercase tracking-wide mb-1.5">Quantity</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
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
              Save entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
