interface Props {
  onSignIn: () => void
}

export function DemoBanner({ onSignIn }: Props) {
  return (
    <div className="bg-accent/10 border-b border-accent/20 px-4 py-2.5 flex items-center justify-between gap-3">
      <p className="text-[12px] text-accent leading-tight">
        You're exploring a demo household
      </p>
      <button
        onClick={onSignIn}
        className="text-[12px] font-semibold text-accent hover:opacity-70 transition-opacity shrink-0"
      >
        Sign in to track yours →
      </button>
    </div>
  )
}
