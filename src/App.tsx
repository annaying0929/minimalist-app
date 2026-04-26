import { useState, useEffect, useMemo } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { useStore } from './hooks/useStore'
import { CATEGORIES } from './data/categories'
import { Nav } from './components/Nav'
import { Dashboard } from './components/Dashboard'
import { History } from './components/History'
import { LogModal } from './components/LogModal'
import { Auth } from './components/Auth'
import type { EntryType } from './types'

type Page = 'dashboard' | 'history'

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [page, setPage] = useState<Page>('dashboard')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalCategoryId, setModalCategoryId] = useState<string | undefined>()
  const { entries, loading, addEntry } = useStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const debtMap = useMemo(() => {
    const map: Record<string, number> = {}
    CATEGORIES.forEach(c => { map[c.id] = 0 })
    for (const e of entries) {
      map[e.categoryId] = (map[e.categoryId] ?? 0) + (e.type === 'bought' ? e.quantity : -e.quantity)
    }
    return map
  }, [entries])

  function openModal(categoryId?: string) {
    setModalCategoryId(categoryId)
    setModalOpen(true)
  }

  function handleSave(entry: { type: EntryType; categoryId: string; name: string; quantity: number; estimatedValue: number }) {
    addEntry(entry)
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
      <Nav
        page={page}
        onPageChange={setPage}
        onLogEntry={() => openModal()}
        onSignOut={() => supabase.auth.signOut()}
      />
      {loading ? (
        <div className="flex items-center justify-center pt-20 text-muted text-sm">Loading entries…</div>
      ) : page === 'dashboard' ? (
        <Dashboard entries={entries} onLogEntry={openModal} />
      ) : (
        <History entries={entries} />
      )}
      <LogModal
        open={modalOpen}
        initialCategoryId={modalCategoryId}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        debtMap={debtMap}
      />
    </div>
  )
}
