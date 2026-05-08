import { useState } from 'react'
import { useCategories } from '../context/CategoryContext'
import { IconPicker } from './IconPicker'


const BG_COLOR_GROUPS = [
  {
    label: 'Neutral',
    colors: [
      { name: 'Warm White',  value: '#F7F6F3' },
      { name: 'Warm Sand',   value: '#EDE9E0' },
      { name: 'Warm Stone',  value: '#E0DDD5' },
    ],
  },
  {
    label: 'Pink',
    colors: [
      { name: 'Dusty Pink',  value: '#FAF0F0' },
      { name: 'Rose',        value: '#F2D9D9' },
      { name: 'Deep Rose',   value: '#E8C4C4' },
    ],
  },
  {
    label: 'Blue',
    colors: [
      { name: 'Powder Blue', value: '#EDF4FB' },
      { name: 'Sky Blue',    value: '#D5E8F5' },
      { name: 'Steel Blue',  value: '#BDDAEE' },
    ],
  },
  {
    label: 'Lavender',
    colors: [
      { name: 'Soft Lavender', value: '#F2EEF8' },
      { name: 'Lavender',      value: '#DDD4F0' },
      { name: 'Deep Lavender', value: '#C8BAE8' },
    ],
  },
  {
    label: 'Green',
    colors: [
      { name: 'Sage Mist',   value: '#EEF4EE' },
      { name: 'Sage',        value: '#D3E5D3' },
      { name: 'Deep Sage',   value: '#B8D5B8' },
    ],
  },
  {
    label: 'Peach',
    colors: [
      { name: 'Peach Cream', value: '#FBF2E9' },
      { name: 'Peach',       value: '#F5E0CB' },
      { name: 'Deep Peach',  value: '#EDCBAA' },
    ],
  },
  {
    label: 'Yellow',
    colors: [
      { name: 'Butter',      value: '#F9F5E4' },
      { name: 'Honey',       value: '#F3E8C2' },
      { name: 'Maize',       value: '#EDD99A' },
    ],
  },
  {
    label: 'Mint',
    colors: [
      { name: 'Mint',        value: '#EBF6F1' },
      { name: 'Teal Mist',   value: '#CEEAE0' },
      { name: 'Deep Teal',   value: '#B0DCCF' },
    ],
  },
  {
    label: 'Blush',
    colors: [
      { name: 'Blush',       value: '#F8EEED' },
      { name: 'Blush Rose',  value: '#F0D5D2' },
      { name: 'Deep Blush',  value: '#E6BFBB' },
    ],
  },
  {
    label: 'Lilac',
    colors: [
      { name: 'Lilac Mist',  value: '#F0EDF8' },
      { name: 'Lilac',       value: '#E0D4F0' },
      { name: 'Deep Lilac',  value: '#CFC0E8' },
    ],
  },
]

function getActiveBg() {
  return localStorage.getItem('bg-color') ?? '#F7F6F3'
}

function applyBg(value: string) {
  document.documentElement.style.setProperty('--color-bg', value)
  localStorage.setItem('bg-color', value)
}

interface Props { onBack: () => void }

export function CategorySettings({ onBack }: Props) {
  const { categories, deletedCategories, builtinIds, updateCategory, addCategory, deleteCategory, restoreCategory } = useCategories()
  const [activeBg, setActiveBg] = useState(getActiveBg)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editIcon, setEditIcon] = useState('')
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('')

  function handleBgSelect(value: string) {
    applyBg(value)
    setActiveBg(value)
  }

  function startEdit(cat: { id: string; name: string; icon: string }) {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditIcon(cat.icon)
  }

  function saveEdit() {
    if (editingId && editName.trim()) {
      updateCategory(editingId, editName.trim(), editIcon || '📦')
    }
    setEditingId(null)
  }

  function handleAdd() {
    if (!newName.trim()) return
    addCategory(newName.trim(), newIcon || '📦')
    setNewName('')
    setNewIcon('')
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-7 pb-16">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="text-[13px] text-muted hover:text-[#1C1C1A] transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-base font-semibold">Settings</h2>
      </div>

      {/* Background colour */}
      <div className="bg-surface border border-border rounded-xl shadow-sm p-4 mb-6">
        <h3 className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-4">Background colour</h3>
        <div className="space-y-3">
          {BG_COLOR_GROUPS.map(group => (
            <div key={group.label} className="flex items-center gap-3">
              <span className="text-[10px] text-muted w-14 flex-shrink-0 uppercase tracking-wide">{group.label}</span>
              <div className="flex gap-2">
                {group.colors.map(c => (
                  <button
                    key={c.value}
                    onClick={() => handleBgSelect(c.value)}
                    title={c.name}
                    className="relative w-9 h-9 rounded-full border-2 transition-all hover:scale-110"
                    style={{
                      backgroundColor: c.value,
                      borderColor: activeBg === c.value ? '#4A6741' : '#E8E7E3',
                    }}
                  >
                    {activeBg === c.value && (
                      <span className="absolute inset-0 flex items-center justify-center text-accent text-[13px] font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-muted">
          {BG_COLOR_GROUPS.flatMap(g => g.colors).find(c => c.value === activeBg)?.name ?? 'Custom'}
        </div>
      </div>

      {/* Categories */}
      <h3 className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">Categories</h3>
      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden mb-6">
        {categories.map((cat, i) => {
          const isCustom = !builtinIds.has(cat.id)
          const isEditing = editingId === cat.id
          return (
            <div
              key={cat.id}
              className={`flex items-center gap-3 px-4 py-3 ${i < categories.length - 1 ? 'border-b border-border' : ''}`}
            >
              {isEditing ? (
                <div className="flex-1 space-y-2">
                  <IconPicker value={editIcon} onChange={setEditIcon} />
                  <div className="flex gap-2">
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveEdit()}
                      autoFocus
                      className="flex-1 px-3 py-1.5 border border-border rounded-lg text-[13px] bg-bg focus:outline-none focus:border-accent"
                    />
                    <button
                      onClick={saveEdit}
                      className="text-[12px] font-medium px-3 py-1.5 bg-accent text-white rounded-lg hover:opacity-90 whitespace-nowrap"
                    >Save</button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-[12px] text-muted px-2 py-1.5 hover:text-[#1C1C1A] whitespace-nowrap"
                    >Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-xl w-8 text-center flex-shrink-0">{cat.icon}</span>
                  <span className="flex-1 text-[13px] font-medium">{cat.name}</span>
                  {!builtinIds.has(cat.id) && (
                    <span className="text-[10px] text-muted bg-bg border border-border rounded-full px-2 py-0.5 mr-1">custom</span>
                  )}
                  <button
                    onClick={() => startEdit(cat)}
                    className="text-[11px] font-medium px-2 py-1 rounded-lg text-muted hover:text-accent hover:bg-accent-lt transition-colors"
                  >✎</button>
                  {isCustom && (
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="text-[11px] font-medium px-2 py-1 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                    >✕</button>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>

      {deletedCategories.length > 0 && (
        <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-[11px] font-semibold text-muted uppercase tracking-widest">Deleted categories</h3>
            <p className="text-[11px] text-muted mt-0.5">Your history is safe — restore to bring them back</p>
          </div>
          {deletedCategories.map((cat, i) => (
            <div
              key={cat.id}
              className={`flex items-center gap-3 px-4 py-3 opacity-60 ${i < deletedCategories.length - 1 ? 'border-b border-border' : ''}`}
            >
              <span className="text-xl w-8 text-center flex-shrink-0">{cat.icon}</span>
              <span className="flex-1 text-[13px] font-medium">{cat.name}</span>
              <button
                onClick={() => restoreCategory(cat.id)}
                className="text-[12px] font-medium px-3 py-1.5 rounded-lg text-accent bg-accent-lt hover:opacity-80 transition-opacity whitespace-nowrap"
              >
                Restore
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl shadow-sm p-4">
        <h3 className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">Add category</h3>
        <div className="space-y-2">
          <IconPicker value={newIcon || '📦'} onChange={setNewIcon} />
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Category name"
              className="flex-1 px-3 py-2 border border-border rounded-lg text-[13px] bg-bg focus:outline-none focus:border-accent"
            />
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="px-4 py-2 bg-accent text-white rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
            >Add</button>
          </div>
        </div>
      </div>
    </main>
  )
}
