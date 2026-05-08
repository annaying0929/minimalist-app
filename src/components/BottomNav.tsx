type Page = 'dashboard' | 'history' | 'stats' | 'categories'

interface Props {
  page: Page
  onPageChange: (p: Page) => void
  onLogEntry: () => void
}

export function BottomNav({ page, onPageChange, onLogEntry }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border safe-bottom">
      <div className="flex items-end justify-around max-w-md mx-auto h-16">

        {/* Home */}
        <button
          onClick={() => onPageChange('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${page === 'dashboard' ? 'text-accent' : 'text-muted'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="text-[10px] font-medium">Home</span>
        </button>

        {/* Stats */}
        <button
          onClick={() => onPageChange('stats')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${page === 'stats' ? 'text-accent' : 'text-muted'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
          <span className="text-[10px] font-medium">Stats</span>
        </button>

        {/* Centre + button */}
        <div className="flex flex-col items-center justify-center flex-1 h-full relative">
          <button
            onClick={onLogEntry}
            className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity -mt-6"
            style={{ boxShadow: '0 4px 18px rgba(74,103,65,0.35)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          <span className="text-[10px] font-medium text-muted mt-1">Log</span>
        </div>

        {/* History */}
        <button
          onClick={() => onPageChange('history')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${page === 'history' ? 'text-accent' : 'text-muted'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span className="text-[10px] font-medium">History</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => onPageChange('categories')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${page === 'categories' ? 'text-accent' : 'text-muted'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span className="text-[10px] font-medium">Settings</span>
        </button>

      </div>
    </nav>
  )
}
