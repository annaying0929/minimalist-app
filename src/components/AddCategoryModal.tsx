import { useState } from 'react';
import { useCategories } from '../context/CategoryContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddCategoryModal({ open, onClose }: Props) {
  const { addCategory } = useCategories();
  const [icon, setIcon] = useState('');
  const [catName, setCatName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!catName.trim()) return;
    addCategory(catName.trim(), icon.trim() || '📦');
    setIcon('');
    setCatName('');
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface rounded-2xl p-7 w-full max-w-sm shadow-2xl animate-[slideUp_0.18s_ease]">
        <h3 className="text-base font-semibold mb-5">Add category</h3>
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="flex gap-3">
            <div className="w-20">
              <label className="block text-[11px] font-medium text-muted uppercase tracking-wide mb-1.5">Icon</label>
              <input
                value={icon}
                onChange={e => setIcon(e.target.value)}
                placeholder="📦"
                className="w-full text-center text-xl px-2 py-2.5 border border-border rounded-lg bg-bg focus:outline-none focus:border-accent focus:bg-white transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-medium text-muted uppercase tracking-wide mb-1.5">Name</label>
              <input
                required
                value={catName}
                onChange={e => setCatName(e.target.value)}
                placeholder="e.g. Handbags"
                autoFocus
                className="w-full px-3 py-2.5 border border-border rounded-lg text-[13px] bg-bg focus:outline-none focus:border-accent focus:bg-white transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-2.5 justify-end pt-1">
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
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
