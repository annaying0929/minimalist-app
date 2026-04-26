import { useState, useEffect } from 'react';
import type { Entry, AppState } from '../types';

const STORAGE_KEY = 'one-in-one-out-v1';

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppState;
  } catch {
    // ignore
  }
  return { entries: [] };
}

export function useStore() {
  const [state, setState] = useState<AppState>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function addEntry(entry: Omit<Entry, 'id' | 'date'>) {
    const newEntry: Entry = {
      ...entry,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setState(prev => ({ entries: [newEntry, ...prev.entries] }));
  }

  return { entries: state.entries, addEntry };
}
