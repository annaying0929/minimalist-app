import { useState, useMemo } from 'react';
import { useStore } from './hooks/useStore';
import { CATEGORIES } from './data/categories';
import { Nav } from './components/Nav';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { LogModal } from './components/LogModal';
import type { EntryType } from './types';

type Page = 'dashboard' | 'history';

export default function App() {
  const { entries, addEntry } = useStore();
  const [page, setPage] = useState<Page>('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategoryId, setModalCategoryId] = useState<string | undefined>();

  const debtMap = useMemo(() => {
    const map: Record<string, number> = {};
    CATEGORIES.forEach(c => { map[c.id] = 0; });
    for (const e of entries) {
      map[e.categoryId] = (map[e.categoryId] ?? 0) + (e.type === 'bought' ? e.quantity : -e.quantity);
    }
    return map;
  }, [entries]);

  function openModal(categoryId?: string) {
    setModalCategoryId(categoryId);
    setModalOpen(true);
  }

  function handleSave(entry: { type: EntryType; categoryId: string; name: string; quantity: number; estimatedValue: number }) {
    addEntry(entry);
  }

  return (
    <div className="min-h-screen bg-bg font-sans">
      <Nav page={page} onPageChange={setPage} onLogEntry={() => openModal()} />
      {page === 'dashboard'
        ? <Dashboard entries={entries} onLogEntry={openModal} />
        : <History entries={entries} />
      }
      <LogModal
        open={modalOpen}
        initialCategoryId={modalCategoryId}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        debtMap={debtMap}
      />
    </div>
  );
}
