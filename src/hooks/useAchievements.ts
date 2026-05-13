import { useMemo, useState, useEffect } from 'react'
import type { Category, Entry } from '../types'

export interface Badge {
  id: string
  icon: string
  label: string
  description: string
  unlocked: boolean
}

const STORAGE_KEY = 'seenBadgeIds'

function getSeenIds(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')) }
  catch { return new Set() }
}

function saveSeenIds(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

export function useAchievements(entries: Entry[], categories: Category[]) {
  const [pendingQueue, setPendingQueue] = useState<Badge[]>([])

  const badges: Badge[] = useMemo(() => {
    let totalDiscarded = 0, totalBought = 0, hasSale = false
    let totalDonatedItems = 0, totalSaleProceeds = 0
    for (const e of entries) {
      if (e.type === 'bought') {
        totalBought += e.quantity
      } else {
        totalDiscarded += e.quantity
        if (e.discardMethod === 'sold') { hasSale = true; totalSaleProceeds += e.saleValue ?? 0 }
        if (e.discardMethod === 'donated') totalDonatedItems += e.quantity
      }
    }
    const netItems = totalDiscarded - totalBought

    const bought: Record<string, number> = {}
    const discarded: Record<string, number> = {}
    for (const e of entries) {
      if (e.type === 'bought') bought[e.categoryId] = (bought[e.categoryId] ?? 0) + e.quantity
      else discarded[e.categoryId] = (discarded[e.categoryId] ?? 0) + e.quantity
    }
    const clearedCategories = categories.filter(
      c => (discarded[c.id] ?? 0) >= (bought[c.id] ?? 0) && (bought[c.id] ?? 0) > 0
    ).length
    const allClear =
      categories.every(c => (bought[c.id] ?? 0) <= (discarded[c.id] ?? 0)) &&
      entries.some(e => e.type === 'bought')

    return [
      { id: 'first',    icon: '🍃', label: 'First discard',    description: 'Log your first discard',           unlocked: totalDiscarded >= 1 },
      { id: 'net1',     icon: '🌱', label: 'More out than in', description: 'Discard more than you\'ve bought', unlocked: netItems >= 1 },
      { id: 'net10',    icon: '🌿', label: 'Making space',      description: 'Net 10 more discarded than bought', unlocked: netItems >= 10 },
      { id: 'net25',    icon: '🌳', label: 'Declutter master',  description: 'Net 25 more discarded than bought', unlocked: netItems >= 25 },
      { id: 'net50',    icon: '🏔️', label: 'True minimalist',  description: 'Net 50 more discarded than bought', unlocked: netItems >= 50 },
      { id: 'hundred',  icon: '💯', label: 'Century club',      description: 'Discard 100 items',                unlocked: totalDiscarded >= 100 },
      { id: 'cat1',     icon: '⚖️', label: 'First balance',    description: 'Clear your first category',        unlocked: clearedCategories >= 1 },
      { id: 'catall',   icon: '🎋', label: 'Focused',           description: 'Every category at zero debt',      unlocked: allClear },
      { id: 'sold1',    icon: '💰', label: 'First sale',        description: 'Sell your first item',             unlocked: hasSale },
      { id: 'sold100',  icon: '💸', label: 'Cash from clutter', description: 'Raise £100 from sales',            unlocked: totalSaleProceeds >= 100 },
      { id: 'donate10', icon: '💚', label: 'Give back',         description: 'Donate 10 items',                  unlocked: totalDonatedItems >= 10 },
    ]
  }, [entries, categories])

  useEffect(() => {
    const seen = getSeenIds()
    const unlockedIds = badges.filter(b => b.unlocked).map(b => b.id)

    // First ever load: silently mark all current unlocks as seen, no popups
    if (!localStorage.getItem(STORAGE_KEY)) {
      saveSeenIds(new Set(unlockedIds))
      return
    }

    const newlyUnlocked = badges.filter(b => b.unlocked && !seen.has(b.id))
    if (newlyUnlocked.length === 0) return

    // Mark seen immediately so rerender doesn't re-queue them
    saveSeenIds(new Set([...seen, ...newlyUnlocked.map(b => b.id)]))
    setPendingQueue(prev => {
      const queued = new Set(prev.map(b => b.id))
      return [...prev, ...newlyUnlocked.filter(b => !queued.has(b.id))]
    })
  }, [badges])

  function dismissPending() {
    setPendingQueue(prev => prev.slice(1))
  }

  return { badges, pendingBadge: pendingQueue[0] ?? null, dismissPending }
}
