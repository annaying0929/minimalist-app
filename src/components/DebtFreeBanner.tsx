interface Props {
  onClose: () => void
}

export function DebtFreeBanner({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center animate-[slideUp_0.22s_ease]"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-5xl mb-4 animate-[slideUp_0.3s_ease]">👑</div>
        <div className="flex justify-center gap-2 text-2xl mb-4">
          <span>🎊</span><span>🎉</span><span>🎊</span>
        </div>

        <h2 className="text-[24px] font-bold text-[#1C1C1A] mb-2">You did it!</h2>
        <p className="text-[14px] text-muted mb-1">Every category is balanced.</p>
        <p className="text-[13px] text-muted mb-6">Your home is in perfect harmony — zero debt across the board.</p>

        <div className="bg-accent-lt border border-accent/20 rounded-xl px-4 py-3.5 mb-6">
          <p className="text-[13px] text-accent font-semibold">✨ All categories clear ✨</p>
          <p className="text-[12px] text-muted mt-1">The one-in-one-out rule: achieved</p>
        </div>

        <div className="flex justify-center gap-2 text-xl mb-6">
          <span>⭐</span><span>🌟</span><span>💫</span><span>🌟</span><span>⭐</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-accent text-white rounded-xl text-[14px] font-semibold hover:opacity-90 transition-opacity"
        >
          Celebrate! 🥂
        </button>
      </div>
    </div>
  )
}
