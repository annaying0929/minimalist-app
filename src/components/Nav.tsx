type Page = 'dashboard' | 'history';

interface NavProps {
  page: Page;
  onPageChange: (p: Page) => void;
  onLogEntry: () => void;
}

export function Nav({ page, onPageChange, onLogEntry }: NavProps) {
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

      <button
        onClick={onLogEntry}
        className="bg-accent text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
      >
        + Log entry
      </button>
    </nav>
  );
}
