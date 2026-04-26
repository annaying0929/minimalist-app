import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Entry } from '../types'

type Row = Record<string, unknown>

function toEntry(row: Row): Entry {
  return {
    id:             row.id as string,
    type:           row.type as 'bought' | 'discarded',
    categoryId:     row.category_id as string,
    name:           row.name as string,
    quantity:       row.quantity as number,
    estimatedValue: row.estimated_value as number,
    date:           row.date as string,
  }
}

export function useStore() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchEntries() {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .order('date', { ascending: false })
    if (data) setEntries(data.map(toEntry))
    setLoading(false)
  }

  useEffect(() => {
    fetchEntries()

    const channel = supabase
      .channel('entries-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'entries' }, fetchEntries)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function addEntry(entry: Omit<Entry, 'id' | 'date'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Optimistic update so UI feels instant
    const optimistic: Entry = { ...entry, id: crypto.randomUUID(), date: new Date().toISOString() }
    setEntries(prev => [optimistic, ...prev])

    await supabase.from('entries').insert({
      type:            entry.type,
      category_id:     entry.categoryId,
      name:            entry.name,
      quantity:        entry.quantity,
      estimated_value: entry.estimatedValue,
      user_id:         user.id,
    })
  }

  async function deleteEntry(id: string) {
    // Optimistic update
    setEntries(prev => prev.filter(e => e.id !== id))
    await supabase.from('entries').delete().eq('id', id)
  }

  return { entries, loading, addEntry, deleteEntry }
}
