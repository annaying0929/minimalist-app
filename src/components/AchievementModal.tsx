import type { Badge } from '../hooks/useAchievements'

interface Props {
  badge: Badge | null
  onClose: () => void
}

export function AchievementModal({ badge, onClose }: Props) {
  if (!badge) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl p-10 w-full max-w-sm shadow-2xl text-center animate-[slideUp_0.22s_ease]"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-[11px] font-semibold text-accent uppercase tracking-widest mb-4">
          Achievement unlocked
        </div>
        <div className="text-6xl mb-5">{badge.icon}</div>
        <h2 className="text-[22px] font-semibold text-[#1C1C1A] mb-2">{badge.label}</h2>
        <p className="text-[14px] text-muted mb-8">{badge.description}</p>
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-accent text-white rounded-xl text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          ✓ Nice
        </button>
      </div>
    </div>
  )
}
