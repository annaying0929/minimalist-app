import { createContext, useContext, useState } from 'react'
import type { Category } from '../types'
import { CATEGORIES } from '../data/categories'

interface CategoryStore {
  overrides: Record<string, { name: string; icon: string }>
  custom: Category[]
}

function load(): CategoryStore {
  try {
    return JSON.parse(localStorage.getItem('category-store') ?? 'null') ?? { overrides: {}, custom: [] }
  } catch {
    return { overrides: {}, custom: [] }
  }
}

function persist(store: CategoryStore) {
  localStorage.setItem('category-store', JSON.stringify(store))
}

interface ContextValue {
  categories: Category[]
  builtinIds: Set<string>
  updateCategory: (id: string, name: string, icon: string) => void
  addCategory: (name: string, icon: string) => void
  deleteCategory: (id: string) => void
}

const CategoryContext = createContext<ContextValue | null>(null)

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<CategoryStore>(load)

  const categories: Category[] = [
    ...CATEGORIES.map(c => ({ ...c, ...(store.overrides[c.id] ?? {}) })),
    ...store.custom,
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
      },
      deleteCategory(id) {
        update({ ...store, custom: store.custom.filter(c => c.id !== id) })
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
