interface NavProps {
  isDemoMode?: boolean
  onSignIn?: () => void
  onSignOut: () => void
}

export function Nav({ isDemoMode, onSignIn, onSignOut }: NavProps) {
  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50 h-14 relative flex items-center justify-center px-6">
      <div className="flex items-center gap-2.5 text-[15px] font-semibold tracking-wide text-[#1C1C1A]">
        <svg width="22" height="22" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 256 405 Q 244 290 252 148" stroke="#4A6741" strokeWidth="16" strokeLinecap="round"/>
          <g transform="translate(249 332) rotate(-42)">
            <path d="M 0 0 C 38 -12 44 -70 0 -90 C -44 -70 -38 -12 0 0 Z" fill="#4A6741"/>
          </g>
          <g transform="translate(251 248) rotate(38)">
            <path d="M 0 0 C 38 -12 44 -70 0 -90 C -44 -70 -38 -12 0 0 Z" fill="#4A6741"/>
          </g>
          <g transform="translate(251 178) rotate(-10)">
            <path d="M 0 0 C 38 -12 44 -70 0 -90 C -44 -70 -38 -12 0 0 Z" fill="#4A6741"/>
          </g>
        </svg>
        one in one out
      </div>
      {isDemoMode ? (
        <button
          onClick={onSignIn}
          className="absolute right-4 text-[12px] font-semibold text-accent hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg hover:bg-accent/10"
        >
          Sign in
        </button>
      ) : (
        <button
          onClick={onSignOut}
          title="Sign out"
          className="absolute right-4 text-muted hover:text-[#1C1C1A] transition-colors p-2 rounded-lg hover:bg-bg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      )}
    </nav>
  )
}
