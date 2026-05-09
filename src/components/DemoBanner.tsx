interface Props {
  onSignIn: () => void
  onBackToIntro: () => void
}

export function DemoBanner({ onSignIn, onBackToIntro }: Props) {
  return (
    <div className="bg-accent/10 border-b border-accent/20 px-4 py-2.5 flex items-center justify-between gap-3">
      <button
        onClick={onBackToIntro}
        className="text-[11px] text-accent/60 hover:text-accent transition-colors shrink-0"
      >
        ← Intro
      </button>
      <button
        onClick={onSignIn}
        className="text-[12px] font-semibold text-accent hover:opacity-70 transition-opacity shrink-0"
      >
        Create an account or sign in →
      </button>
    </div>
  )
}
