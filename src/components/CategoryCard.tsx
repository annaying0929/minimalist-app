import type { Category, Entry } from '../types';

interface Props {
  category: Category;
  entries: Entry[];
  onLogEntry: (categoryId: string) => void;
}

export function CategoryCard({ category, entries, onLogEntry }: Props) {
  const bought = entries.filter(e => e.categoryId === category.id && e.type === 'bought')
    .reduce((s, e) => s + e.quantity, 0);
  const discarded = entries.filter(e => e.categoryId === category.id && e.type === 'discarded')
    .reduce((s, e) => s + e.quantity, 0);
  const debt = bought - discarded;
  const hasDebt = debt > 0;
  const progress = bought === 0 ? 100 : Math.min(100, Math.round((discarded / bought) * 100));

  const spent = entries
    .filter(e => e.categoryId === category.id && e.type === 'bought')
    .reduce((s, e) => s + e.estimatedValue, 0);

  return (
    <div
      onClick={() => onLogEntry(category.id)}
      className={`bg-surface border rounded-xl p-4 shadow-sm cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-md ${
        hasDebt ? 'border-l-[3px] border-l-warn border-border' : 'border-l-[3px] border-l-accent border-border'
      }`}
    >
      <div className="flex items-start justify-between mb-2.5">
        <span className="text-xl leading-none">{category.icon}</span>
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            hasDebt ? 'bg-warn-lt text-warn' : 'bg-accent-lt text-accent'
          }`}
        >
          {hasDebt ? `${debt} to discard` : 'Clear'}
        </span>
      </div>
      <div className="text-[13px] font-medium mb-1">{category.name}</div>
      <div className="text-[11px] text-muted">
        {bought} bought · {discarded} discarded
        {spent > 0 && ` · £ ${spent.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} spent`}
      </div>
      <div className="mt-2.5 h-[3px] bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${hasDebt ? 'bg-warn' : 'bg-accent'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
