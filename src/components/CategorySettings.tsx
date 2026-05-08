import { useState } from 'react'
import { useCategories } from '../context/CategoryContext'

interface Props { onBack: () => void }

export function CategorySettings({ onBack }: Props) {
  const { categories, builtinIds, updateCategory, addCategory, deleteCategory } = useCategories()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editIcon, setEditIcon] = useState('')
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('')

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
        <h2 className="text-base font-semibold">Categories</h2>
      </div>

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
                <>
                  <input
                    value={editIcon}
                    onChange={e => setEditIcon(e.target.value)}
                    className="w-12 text-center text-xl border border-border rounded-lg py-1.5 bg-bg focus:outline-none focus:border-accent"
                    placeholder="📦"
                  />
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
                </>
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

      <div className="bg-surface border border-border rounded-xl shadow-sm p-4">
        <h3 className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">Add category</h3>
        <div className="flex gap-2">
          <input
            value={newIcon}
            onChange={e => setNewIcon(e.target.value)}
            placeholder="📦"
            className="w-14 text-center text-xl border border-border rounded-lg py-2 bg-bg focus:outline-none focus:border-accent"
          />
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
    </main>
  )
}
