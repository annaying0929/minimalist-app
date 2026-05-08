import { createContext, useContext, useState } from 'react'
import type { Category } from '../types'
import { CATEGORIES } from '../data/categories'

interface CategoryStore {
  overrides: Record<string, { name: string; icon: string }>
  custom: Category[]
  hidden: string[]
  deletedCustom: Category[]
}

function load(): CategoryStore {
  try {
    const s = JSON.parse(localStorage.getItem('category-store') ?? 'null') ?? {}
    return { overrides: {}, custom: [], hidden: [], deletedCustom: [], ...s }
  } catch {
    return { overrides: {}, custom: [], hidden: [], deletedCustom: [] }
  }
}

function persist(store: CategoryStore) {
  localStorage.setItem('category-store', JSON.stringify(store))
}

interface ContextValue {
  categories: Category[]
  deletedCategories: Category[]
  builtinIds: Set<string>
  updateCategory: (id: string, name: string, icon: string) => void
  addCategory: (name: string, icon: string) => string
  deleteCategory: (id: string) => void
  restoreCategory: (id: string) => void
}

const CategoryContext = createContext<ContextValue | null>(null)

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<CategoryStore>(load)

  const builtinIds = new Set(CATEGORIES.map(c => c.id))
  const hiddenSet = new Set(store.hidden)

  const categories: Category[] = [
    ...CATEGORIES.filter(c => !hiddenSet.has(c.id)).map(c => ({ ...c, ...(store.overrides[c.id] ?? {}) })),
    ...store.custom.filter(c => !hiddenSet.has(c.id)),
  ]

  // Hidden built-ins (with overrides applied) + soft-deleted custom categories
  const deletedCategories: Category[] = [
    ...CATEGORIES.filter(c => hiddenSet.has(c.id)).map(c => ({ ...c, ...(store.overrides[c.id] ?? {}) })),
    ...store.deletedCustom,
  ]

  function update(next: CategoryStore) {
    persist(next)
    setStore(next)
  }

  return (
    <CategoryContext.Provider value={{
      categories,
      deletedCategories,
      builtinIds,
      updateCategory(id, name, icon) {
        update({ ...store, overrides: { ...store.overrides, [id]: { name, icon } } })
      },
      addCategory(name, icon) {
        const id = `custom-${crypto.randomUUID()}`
        update({ ...store, custom: [...store.custom, { id, name, icon }] })
        return id
      },
      deleteCategory(id) {
        if (builtinIds.has(id)) {
          // Built-in: just hide it (easily restorable)
          update({ ...store, hidden: hiddenSet.has(id) ? store.hidden : [...store.hidden, id] })
        } else {
          // Custom: move to deletedCustom so it can be restored
          const cat = store.custom.find(c => c.id === id)
          update({
            ...store,
            custom: store.custom.filter(c => c.id !== id),
            deletedCustom: cat ? [...store.deletedCustom, cat] : store.deletedCustom,
          })
        }
      },
      restoreCategory(id) {
        if (builtinIds.has(id)) {
          update({ ...store, hidden: store.hidden.filter(h => h !== id) })
        } else {
          const cat = store.deletedCustom.find(c => c.id === id)
          update({
            ...store,
            custom: cat ? [...store.custom, cat] : store.custom,
            deletedCustom: store.deletedCustom.filter(c => c.id !== id),
          })
        }
      },
    }}>
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategories() {
  const ctx = useContext(CategoryContext)
  if (!ctx) throw new Error('useCategories outside CategoryProvider')
  return ctx
}
