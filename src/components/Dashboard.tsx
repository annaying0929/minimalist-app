import { useState, useMemo } from 'react';
import type { Category, Entry } from '../types';
import { StatStrip } from './StatStrip';
import { CategoryCard } from './CategoryCard';
import { ActivityFeed } from './ActivityFeed';
import { AddCategoryModal } from './AddCategoryModal';

interface Props {
  entries: Entry[];
  categories: Category[];
  onLogEntry: (categoryId?: string) => void;
  onDelete: (id: string) => void;
  onEdit: (entry: Entry) => void;
}

export function Dashboard({ entries, categories, onLogEntry, onDelete, onEdit }: Props) {
  const [addCatOpen, setAddCatOpen] = useState(false);

  const sortedCategories = useMemo(() => {
    const discardCount: Record<string, number> = {};
    for (const e of entries) {
      if (e.type === 'discarded') {
        discardCount[e.categoryId] = (discardCount[e.categoryId] ?? 0) + e.quantity;
      }
    }
    return [...categories].sort((a, b) => (discardCount[b.id] ?? 0) - (discardCount[a.id] ?? 0));
  }, [entries, categories]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-7 pb-16">
      <StatStrip entries={entries} />

      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-[11px] font-semibold text-muted uppercase tracking-widest">Categories</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {sortedCategories.map(cat => (
          <CategoryCard
            key={cat.id}
            category={cat}
            entries={entries}
            onLogEntry={() => onLogEntry(cat.id)}
          />
        ))}
        <button
          onClick={() => setAddCatOpen(true)}
          className="flex flex-col items-center justify-center gap-2 bg-surface border-2 border-dashed border-border rounded-xl p-4 shadow-sm text-muted hover:border-accent hover:text-accent transition-colors min-h-[100px]"
        >
          <span className="text-2xl font-light leading-none">+</span>
          <span className="text-[12px] font-medium">Add category</span>
        </button>
      </div>

      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-[11px] font-semibold text-muted uppercase tracking-widest">Recent activity</h2>
      </div>
      <ActivityFeed entries={entries} onDelete={onDelete} onEdit={onEdit} />

      <AddCategoryModal open={addCatOpen} onClose={() => setAddCatOpen(false)} />
    </main>
  );
}
