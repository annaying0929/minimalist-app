import { useState, useEffect, useRef } from 'react';
import type { Entry, EntryType } from '../types';
import { useCategories } from '../context/CategoryContext';

interface Props {
  open: boolean;
  initialCategoryId?: string;
  editEntry?: Entry;
  onClose: () => void;
  onSave: (entry: { type: EntryType; categoryId: string; name: string; quantity: number; estimatedValue: number }) => void;
  onUpdate?: (id: string, fields: { type: EntryType; categoryId: string; name: string; quantity: number; estimatedValue: number }) => void;
  debtMap: Record<string, number>;
}

export function LogModal({ open, initialCategoryId, editEntry, onClose, onSave, onUpdate, debtMap }: Props) {
  const { categories, addCategory } = useCategories();
  const [type, setType] = useState<EntryType>('bought');
  const [categoryName, setCategoryName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [value, setValue] = useState('');
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      if (editEntry) {
        setType(editEntry.type);
        const cat = categories.find(c => c.id === editEntry.categoryId);
        setCategoryName(cat?.name ?? editEntry.categoryId);
        setName(editEntry.name);
        setQuantity(String(editEntry.quantity));
        setValue(editEntry.estimatedValue > 0 ? String(editEntry.estimatedValue) : '');
      } else {
        const initCat = initialCategoryId ? categories.find(c => c.id === initialCategoryId) : null;
        setCategoryName(initCat?.name ?? '');
        setName('');
        setQuantity('1');
        setValue('');
        setType('bought');
      }
    }
  }, [open, initialCategoryId, editEntry]);

  const matchedCat = categories.find(c => c.name.toLowerCase() === categoryName.trim().toLowerCase());
  const isNew = categoryName.trim().length > 0 && !matchedCat;
  const resolvedId = matchedCat?.id ?? '';
  const debt = debtMap[resolvedId] ?? 0;
  const qty = Math.max(1, parseInt(quantity) || 1);

  const suggestions = categoryName.trim()
    ? categories.filter(c => c.name.toLowerCase().includes(categoryName.trim().toLowerCase()))
    : categories;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !categoryName.trim()) return;

    let catId: string;
    if (matchedCat) {
      catId = matchedCat.id;
    } else {
      catId = addCategory(categoryName.trim(), '📦');
    }

    const fields = { type, categoryId: catId, name: name.trim(), quantity: Math.max(1, parseInt(quantity) || 1), estimatedValue: parseFloat(value) || 0 };
    if (editEntry && onUpdate) {
      onUpdate(editEntry.id, fields);
    } else {
      onSave(fields);
    }
    onClose();
  }

  if (!open) return null;

  const notice = () => {
    if (!matchedCat) return null;
    if (type === 'bought') {
      const after = debt + qty;
      if (debt > 0) {
        return { text: `${matchedCat.name} already has ${debt} pending discard${debt > 1 ? 's' : ''}. After this you'll owe ${after} item${after > 1 ? 's' : ''}.`, style: 'bg-warn-lt border-warn/30 text-warn' };
      }
      return { text: `${matchedCat.name} is clear. This purchase will require ${qty} discard${qty > 1 ? 's' : ''}.`, style: 'bg-accent-lt border-accent/30 text-accent' };
    } else {
      if (debt > 0) {
        const after = Math.max(0, debt - qty);
        return { text: `This will reduce the ${matchedCat.name} debt to ${after} item${after !== 1 ? 's' : ''}.`, style: 'bg-accent-lt border-accent/30 text-accent' };
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
        <h3 className="text-base font-semibold mb-5">{editEntry ? 'Edit entry' : 'Log an entry'}</h3>

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

          <div className="relative">
            <label className="block text-[11px] font-medium text-muted uppercase tracking-wide mb-1.5">
              Category
              {isNew && <span className="ml-2 text-accent normal-case font-normal">— will be created</span>}
            </label>
            <input
              required
              value={categoryName}
              onChange={e => { setCategoryName(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => { hideTimer.current = setTimeout(() => setShowSuggestions(false), 150); }}
              placeholder="Type or pick a category…"
              autoComplete="off"
              className={`w-full px-3 py-2.5 border rounded-lg text-[13px] bg-bg focus:outline-none transition-colors focus:bg-white ${
                isNew ? 'border-accent' : 'border-border focus:border-accent'
              }`}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 left-0 right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                {suggestions.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onMouseDown={() => {
                      if (hideTimer.current) clearTimeout(hideTimer.current);
                      setCategoryName(c.name);
                      setShowSuggestions(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-left hover:bg-bg transition-colors ${
                      matchedCat?.id === c.id ? 'bg-accent-lt text-accent font-medium' : ''
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            )}
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
