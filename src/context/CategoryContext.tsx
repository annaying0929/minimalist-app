import { createContext, useContext, useState } from 'react'
import type { Category } from '../types'
import { CATEGORIES } from '../data/categories'

interface CategoryStore {
  overrides: Record<string, { name: string; icon: string }>
  custom: Category[]
  hidden: string[]
}

function load(): CategoryStore {
  try {
    const s = JSON.parse(localStorage.getItem('category-store') ?? 'null') ?? {}
    return { overrides: {}, custom: [], hidden: [], ...s }
  } catch {
    return { overrides: {}, custom: [], hidden: [] }
  }
}

function persist(store: CategoryStore) {
  localStorage.setItem('category-store', JSON.stringify(store))
}

interface ContextValue {
  categories: Category[]
  builtinIds: Set<string>
  updateCategory: (id: string, name: string, icon: string) => void
  addCategory: (name: string, icon: string) => string
  deleteCategory: (id: string) => void
}

const CategoryContext = createContext<ContextValue | null>(null)

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<CategoryStore>(load)

  const hiddenSet = new Set(store.hidden)
  const categories: Category[] = [
    ...CATEGORIES.filter(c => !hiddenSet.has(c.id)).map(c => ({ ...c, ...(store.overrides[c.id] ?? {}) })),
    ...store.custom.filter(c => !hiddenSet.has(c.id)),
  ]

  const builtinIds = new Set(CATEGORIES.map(c => c.id))

  function update(next: CategoryStore) {
    persist(next)
    setStore(next)
  }

  return (
    <CategoryContext.Provider value={{
      categories,
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
        update({
          ...store,
          custom: store.custom.filter(c => c.id !== id),
          hidden: store.hidden.includes(id) ? store.hidden : [...store.hidden, id],
        })
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
