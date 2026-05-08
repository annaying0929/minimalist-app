interface Props {
  onClose: () => void
}

export function DebtFreeBanner({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl p-10 w-full max-w-sm shadow-2xl text-center animate-[slideUp_0.22s_ease]"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-5xl mb-6">🌿</div>
        <h2 className="text-[24px] font-semibold text-[#1C1C1A] mb-3">Perfect balance.</h2>
        <p className="text-[14px] text-muted leading-relaxed mb-8">
          Every category is clear.<br />Your home is in harmony.
        </p>
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-accent text-white rounded-xl text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          ✓ Beautiful
        </button>
      </div>
    </div>
  )
}
