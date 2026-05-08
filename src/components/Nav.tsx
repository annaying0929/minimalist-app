interface NavProps {
  onSignOut: () => void
}

export function Nav({ onSignOut }: NavProps) {
  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50 px-6 flex items-center justify-between h-14">
      <div className="font-semibold text-[15px] tracking-tight">
        one<span className="text-accent">in</span>oneout
      </div>
      <button
        onClick={onSignOut}
        title="Sign out"
        className="text-muted hover:text-[#1C1C1A] transition-colors p-2 rounded-lg hover:bg-bg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </nav>
  )
}
