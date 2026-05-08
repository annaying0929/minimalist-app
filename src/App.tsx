import { useState, useEffect, useMemo, useRef } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { useStore } from './hooks/useStore'
import { useCategories } from './context/CategoryContext'
import { Nav } from './components/Nav'
import { BottomNav } from './components/BottomNav'
import { History } from './components/History'
import { Stats } from './components/Stats'
import { Trends } from './components/Trends'
import { CategorySettings } from './components/CategorySettings'
import { LogModal } from './components/LogModal'
import { CelebrationModal } from './components/CelebrationModal'
import { DebtFreeBanner } from './components/DebtFreeBanner'
import { Auth } from './components/Auth'
import type { DiscardMethod, Entry, EntryType } from './types'

type Page = 'stats' | 'trends' | 'history' | 'categories'

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [page, setPage] = useState<Page>('stats')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalCategoryId, setModalCategoryId] = useState<string | undefined>()
  const [editEntry, setEditEntry] = useState<Entry | undefined>()
  const [celebrationEntry, setCelebrationEntry] = useState<Entry | null>(null)
  const [celebrationDebt, setCelebrationDebt] = useState(0)
  const [debtFreeSeen, setDebtFreeSeen] = useState(false)
  const [showDebtFree, setShowDebtFree] = useState(false)
  const { entries, loading, saveError, addEntry, updateEntry, deleteEntry } = useStore(session?.user.id)
  const { categories, deleteCategory } = useCategories()

  const prevDebtFreeRef = useRef(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const debtMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const e of entries) {
      map[e.categoryId] = (map[e.categoryId] ?? 0) + (e.type === 'bought' ? e.quantity : -e.quantity)
    }
    return map
  }, [entries])

  const isDebtFree = useMemo(() => {
    if (entries.length === 0) return false
    return categories.every(cat => (debtMap[cat.id] ?? 0) <= 0)
  }, [entries, categories, debtMap])

  useEffect(() => {
    if (isDebtFree && prevDebtFreeRef.current === false && entries.length > 0 && !debtFreeSeen) {
      setShowDebtFree(true)
    }
    prevDebtFreeRef.current = isDebtFree
  }, [isDebtFree, entries.length, debtFreeSeen])

  function openModal(categoryId?: string) {
    setEditEntry(undefined)
    setModalCategoryId(categoryId)
    setModalOpen(true)
  }

  function openEditModal(entry: Entry) {
    setEditEntry(entry)
    setModalOpen(true)
  }

  function handleSave(entry: { type: EntryType; categoryId: string; name: string; quantity: number; estimatedValue: number; discardMethod: DiscardMethod | null; donationValue: number }) {
    addEntry(entry)
    if (entry.type === 'discarded') {
      const debtAfter = Math.max(0, (debtMap[entry.categoryId] ?? 0) - entry.quantity)
      const optimistic: Entry = { ...entry, id: '', date: new Date().toISOString() }
      setCelebrationEntry(optimistic)
      setCelebrationDebt(debtAfter)
    }
  }

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center font-sans">
        <div className="text-muted text-sm">Loading…</div>
      </div>
    )
  }

  if (!session) return <Auth />

  return (
    <div className="min-h-screen bg-bg font-sans">
      <Nav onSignOut={() => supabase.auth.signOut()} />
      {saveError && (
        <div className="bg-warn-lt border-b border-warn/20 text-warn text-[12px] text-center py-2 px-4">
          {saveError} — check your internet connection and try again.
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center pt-20 text-muted text-sm">Loading entries…</div>
      ) : page === 'stats' ? (
        <Stats entries={entries} categories={categories} onLogEntry={openModal} />
      ) : page === 'trends' ? (
        <Trends entries={entries} />
      ) : page === 'history' ? (
        <History entries={entries} onDelete={deleteEntry} onEdit={openEditModal} />
      ) : (
        <CategorySettings />
      )}

      <BottomNav page={page} onPageChange={setPage} onLogEntry={() => openModal()} />

      <CelebrationModal
        entry={celebrationEntry}
        debtAfter={celebrationDebt}
        onClose={() => setCelebrationEntry(null)}
      />
      {showDebtFree && (
        <DebtFreeBanner onClose={() => { setShowDebtFree(false); setDebtFreeSeen(true) }} />
      )}
      <LogModal
        open={modalOpen}
        initialCategoryId={modalCategoryId}
        editEntry={editEntry}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onUpdate={(id, fields) => updateEntry(id, fields)}
        onDeleteCategory={deleteCategory}
        debtMap={debtMap}
      />
    </div>
  )
}
