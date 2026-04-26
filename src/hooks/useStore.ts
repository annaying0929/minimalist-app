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

export function useStore(userId: string | undefined) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [saveError, setSaveError] = useState('')

  async function fetchEntries() {
    if (!userId) return
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('date', { ascending: false })
    if (error) console.error('Fetch error:', error)
    if (data) setEntries(data.map(toEntry))
    setLoading(false)
  }

  useEffect(() => {
    if (!userId) { setLoading(false); return }

    fetchEntries()

    const channel = supabase
      .channel('entries-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'entries' }, fetchEntries)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  async function addEntry(entry: Omit<Entry, 'id' | 'date'>) {
    if (!userId) return
    setSaveError('')

    const optimistic: Entry = { ...entry, id: crypto.randomUUID(), date: new Date().toISOString() }
    setEntries(prev => [optimistic, ...prev])

    const { error } = await supabase.from('entries').insert({
      type:            entry.type,
      category_id:     entry.categoryId,
      name:            entry.name,
      quantity:        entry.quantity,
      estimated_value: entry.estimatedValue,
      user_id:         userId,
    })

    if (error) {
      console.error('Insert error:', error)
      setSaveError(`Failed to save: ${error.message}`)
      setEntries(prev => prev.filter(e => e.id !== optimistic.id))
    }
  }

  async function deleteEntry(id: string) {
    setEntries(prev => prev.filter(e => e.id !== id))
    const { error } = await supabase.from('entries').delete().eq('id', id)
    if (error) console.error('Delete error:', error)
  }

  return { entries, loading, saveError, addEntry, deleteEntry }
}
