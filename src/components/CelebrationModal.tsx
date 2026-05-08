import type { Entry } from '../types';
import { useCategories } from '../context/CategoryContext';

interface Props {
  entry: Entry | null;
  debtAfter: number;
  onClose: () => void;
}

export function CelebrationModal({ entry, debtAfter, onClose }: Props) {
  const { categories } = useCategories();
  if (!entry) return null;

  const cat = categories.find(c => c.id === entry.categoryId);
  const cleared = debtAfter <= 0;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center animate-[slideUp_0.22s_ease]"
        onClick={e => e.stopPropagation()}
      >
        {/* Stars */}
        <div className="flex justify-center gap-1 text-3xl mb-1 animate-[slideUp_0.3s_ease]">
          <span>⭐</span><span>🌟</span><span>⭐</span>
        </div>
        <div className="flex justify-center gap-2 text-xl mb-5">
          <span>✨</span><span>✨</span><span>✨</span>
        </div>

        <h2 className="text-[22px] font-semibold text-[#1C1C1A] mb-1">Congratulations!</h2>
        <p className="text-[13px] text-muted mb-5">One step closer to balance</p>

        {/* What was discarded */}
        <div className="bg-accent-lt border border-accent/20 rounded-xl px-4 py-3.5 mb-4 text-left">
          <p className="text-[11px] text-accent font-semibold uppercase tracking-wide mb-1">Discarded</p>
          <p className="text-[15px] font-medium text-[#1C1C1A]">
            {entry.name}{entry.quantity > 1 ? ` ×${entry.quantity}` : ''}
          </p>
          {cat && (
            <p className="text-[12px] text-muted mt-0.5">{cat.icon} {cat.name}</p>
          )}
        </div>

        {/* Debt status */}
        {cleared ? (
          <div className="flex items-center justify-center gap-2 mb-5 text-accent">
            <span className="text-xl">🎊</span>
            <span className="text-[13px] font-semibold">
              {cat?.name ?? 'Category'} is now clear!
            </span>
            <span className="text-xl">🎊</span>
          </div>
        ) : (
          <p className="text-[12px] text-muted mb-5">
            {debtAfter} item{debtAfter !== 1 ? 's' : ''} still to go in {cat?.name ?? 'this category'}
          </p>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-accent text-white rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          Keep going! 💪
        </button>
      </div>
    </div>
  );
}
