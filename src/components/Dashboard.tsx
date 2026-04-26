import type { Entry } from '../types';
import { CATEGORIES } from '../data/categories';
import { StatStrip } from './StatStrip';
import { CategoryCard } from './CategoryCard';
import { ActivityFeed } from './ActivityFeed';

interface Props {
  entries: Entry[];
  onLogEntry: (categoryId?: string) => void;
  onDelete: (id: string) => void;
}

export function Dashboard({ entries, onLogEntry, onDelete }: Props) {
  return (
    <main className="max-w-4xl mx-auto px-6 py-7 pb-16">
      <StatStrip entries={entries} />

      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-[11px] font-semibold text-muted uppercase tracking-widest">Categories</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {CATEGORIES.map(cat => (
          <CategoryCard
            key={cat.id}
            category={cat}
            entries={entries}
            onLogEntry={() => onLogEntry(cat.id)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-[11px] font-semibold text-muted uppercase tracking-widest">Recent activity</h2>
      </div>
      <ActivityFeed entries={entries} onDelete={onDelete} />
    </main>
  );
}
