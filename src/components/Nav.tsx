type Page = 'dashboard' | 'history' | 'categories'

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
          onClick={() => onPageChange('categories')}
          title="Manage categories"
          className={`transition-colors p-2 rounded-lg hover:bg-bg ${page === 'categories' ? 'text-accent' : 'text-muted hover:text-[#1C1C1A]'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
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
