import { useState } from 'react';

export const ICON_OPTIONS = [
  '📦','👗','👔','👕','👖','👟','👠','👡','👢','👒','🧣','🧤','🧥',
  '👜','👝','👛','💍','💎','📚','📖','📝','✏️','📓','📒',
  '📱','💻','🖥️','📷','🎧','📺','🎮','🖨️','⌨️',
  '🍳','🥘','☕','🍽️','🫖','🥄','🍴','🧁','🍷',
  '🛋️','🪑','🛏️','🪞','🚿','🪴','🖼️','🪟',
  '🕯️','🎨','🪆','🧺','🧹','🧴','🧼',
  '🧸','🎲','🎯','🃏','🪁','🎪','🧩',
  '🛼','🍼','🧷','🎠','🛒',
  '🏃','⚽','🏀','🎾','🏊','🚴','🏋️','⛷️','🎿','🧘',
  '🧶','🪡','🧵','🛁',
  '💄','🪥','💊','🌡️','🪒',
  '🌸','🌿','🍀','🌙','⭐','🔑','🎁','💰',
];

interface Props {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2.5 border border-border rounded-lg bg-bg hover:border-accent transition-colors w-full"
      >
        <span className="text-xl">{value}</span>
        <span className="text-[13px] text-muted flex-1 text-left">Choose icon</span>
        <span className="text-muted text-[11px]">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="mt-2 p-2 border border-border rounded-lg bg-bg max-h-44 overflow-y-auto">
          <div className="grid grid-cols-8 gap-1">
            {ICON_OPTIONS.map(e => (
              <button
                key={e}
                type="button"
                onClick={() => { onChange(e); setOpen(false); }}
                className={`text-xl p-1.5 rounded-lg hover:bg-surface transition-colors ${value === e ? 'bg-accent-lt ring-1 ring-accent' : ''}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
