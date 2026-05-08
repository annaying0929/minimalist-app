import type { Entry } from '../types';
import { useCategories } from '../context/CategoryContext';

interface Props {
  entry: Entry | null;
  debtAfter: number;
  onClose: () => void;
}

function fmt(n: number) {
  return `£ ${n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function CelebrationModal({ entry, debtAfter, onClose }: Props) {
  const { categories } = useCategories();
  if (!entry) return null;

  const cat = categories.find(c => c.id === entry.categoryId);
  const cleared = debtAfter <= 0;
  const isDonated = entry.discardMethod === 'donated';

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl p-10 w-full max-w-sm shadow-2xl text-center animate-[slideUp_0.22s_ease]"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-5xl mb-6">{isDonated ? '🎁' : '🍃'}</div>

        <h2 className="text-[24px] font-semibold text-[#1C1C1A] mb-2">
          {isDonated ? 'It found a new home.' : 'One less thing.'}
        </h2>

        <p className="text-[14px] text-muted mb-1">
          {entry.name}{entry.quantity > 1 ? ` ×${entry.quantity}` : ''}
        </p>

        {isDonated && entry.donationValue > 0 && (
          <p className="text-[13px] text-accent mb-1">{fmt(entry.donationValue)} est. resale</p>
        )}

        <p className="text-[13px] text-muted mb-8">
          {cleared
            ? `${cat?.name ?? 'Category'} is now clear.`
            : `${debtAfter} still to go in ${cat?.name ?? 'this category'}.`}
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-accent text-white rounded-xl text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          {isDonated ? '✓ Keep giving' : '✓ Keep going'}
        </button>
      </div>
    </div>
  );
}
