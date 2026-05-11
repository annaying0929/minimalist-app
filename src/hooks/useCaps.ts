import { useState, useCallback } from 'react'

const KEY = 'categoryCaps'

function load(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') } catch { return {} }
}

export function useCaps() {
  const [caps, setCapsState] = useState<Record<string, number>>(load)

  const setCap = useCallback((categoryId: string, cap: number | null) => {
    setCapsState(prev => {
      const next = { ...prev }
      if (cap === null || cap <= 0) delete next[categoryId]
      else next[categoryId] = cap
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { caps, setCap }
}
