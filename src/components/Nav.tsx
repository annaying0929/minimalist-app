type Page = 'dashboard' | 'history'

interface NavProps {
  page: Page
  onPageChange: (p: Page) => void
  onLogEntry: () => void
  onSignOut: () => void
}

export function Nav({ page, onPageChange, onLogEntry, onSignOut }: NavProps) {
  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50 px-6 flex items-center justify-between h-14">
      <div className="font-semibold text-[15px] tracking-tight">
        one<span className="text-accent">in</span>oneout
      </div>

      <div className="flex gap-1">
        {(['dashboard', 'history'] as Page[]).map(p => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors capitalize ${
              page === p
                ? 'bg-bg text-[#1C1C1A] font-semibold'
                : 'text-muted hover:bg-bg hover:text-[#1C1C1A]'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onLogEntry}
          className="bg-accent text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          + Log entry
        </button>
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
      </div>
    </nav>
  )
}
