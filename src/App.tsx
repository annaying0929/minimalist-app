import { useState, useEffect, useMemo } from 'react'
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
import { DemoBanner } from './components/DemoBanner'
import { Onboarding } from './components/Onboarding'
import { Auth } from './components/Auth'
import { SEED_ENTRIES } from './data/seedEntries'
import type { DiscardMethod, Entry, EntryType } from './types'

type Page = 'stats' | 'trends' | 'history' | 'categories'

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [onboardingDone, setOnboardingDone] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [demoPromptOpen, setDemoPromptOpen] = useState(false)
  const isDemoMode = !session
  const [page, setPage] = useState<Page>('stats')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalCategoryId, setModalCategoryId] = useState<string | undefined>()
  const [editEntry, setEditEntry] = useState<Entry | undefined>()
  const [celebrationEntry, setCelebrationEntry] = useState<Entry | null>(null)
  const [celebrationDebt, setCelebrationDebt] = useState(0)
  const [debtFreeSeen, setDebtFreeSeen] = useState(() => localStorage.getItem('debtFreeSeen') === 'true')
  const { entries: realEntries, loading, saveError, addEntry, updateEntry, deleteEntry } = useStore(session?.user.id)
  const entries = isDemoMode ? SEED_ENTRIES : realEntries
  const { categories, deleteCategory } = useCategories()

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

  // Reset seen flag when user is no longer debt-free so banner can trigger again next time
  useEffect(() => {
    if (!isDebtFree && entries.length > 0 && debtFreeSeen) {
      localStorage.removeItem('debtFreeSeen')
      setDebtFreeSeen(false)
    }
  }, [isDebtFree, entries.length])

  const showDebtFree = isDebtFree && entries.length > 0 && !debtFreeSeen

  function goToAuth() {
    setShowAuth(true)
    setDemoPromptOpen(false)
  }

  function backToDemo() {
    setShowAuth(false)
  }

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
    if (isDemoMode) {
      setDemoPromptOpen(true)
      return
    }
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

  if (session === null && !onboardingDone) return (
    <Onboarding
      onSignUp={() => { setOnboardingDone(true); setShowAuth(true) }}
      onExploreDemo={() => setOnboardingDone(true)}
    />
  )

  if (session === null && showAuth) return <Auth onBackToDemo={backToDemo} />

  return (
    <div className="min-h-screen bg-bg font-sans">
      <Nav isDemoMode={isDemoMode} onSignIn={goToAuth} onSignOut={() => supabase.auth.signOut()} />
      {isDemoMode && <DemoBanner onSignIn={goToAuth} onBackToIntro={() => setOnboardingDone(false)} />}
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
        <History
          entries={entries}
          onDelete={isDemoMode ? () => setDemoPromptOpen(true) : deleteEntry}
          onEdit={isDemoMode ? () => setDemoPromptOpen(true) : openEditModal}
        />
      ) : (
        <CategorySettings />
      )}

      <BottomNav page={page} onPageChange={setPage} onLogEntry={() => openModal()} />

      {demoPromptOpen && (
        <div
          className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setDemoPromptOpen(false) }}
        >
          <div className="bg-surface rounded-2xl p-7 w-full max-w-sm shadow-2xl text-center">
            <div className="text-3xl mb-3">🏡</div>
            <h3 className="text-base font-semibold mb-2">Ready to start tracking?</h3>
            <p className="text-[13px] text-muted mb-6 leading-relaxed">
              Create your own household account to log entries and build your own history.
            </p>
            <button
              onClick={goToAuth}
              className="w-full bg-accent text-white py-2.5 rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity mb-2"
            >
              Create an account
            </button>
            <button
              onClick={() => setDemoPromptOpen(false)}
              className="w-full py-2.5 rounded-lg text-[13px] text-muted hover:text-ink transition-colors"
            >
              Keep exploring
            </button>
          </div>
        </div>
      )}

      <CelebrationModal
        entry={celebrationEntry}
        debtAfter={celebrationDebt}
        onClose={() => setCelebrationEntry(null)}
      />
      {showDebtFree && (
        <DebtFreeBanner onClose={() => { localStorage.setItem('debtFreeSeen', 'true'); setDebtFreeSeen(true) }} />
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
