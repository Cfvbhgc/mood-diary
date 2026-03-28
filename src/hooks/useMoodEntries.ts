import { useState, useCallback } from 'react';
import { MoodEntry } from '../types';
import { loadEntries, addEntry, deleteEntry } from '../utils/storage';

// хук для работы с записями
export function useMoodEntries() {
  const [entries, setEntries] = useState<MoodEntry[]>(() => loadEntries());

  const add = useCallback((entry: MoodEntry) => {
    const updated = addEntry(entry);
    setEntries(updated);
  }, []);

  const remove = useCallback((id: string) => {
    const updated = deleteEntry(id);
    setEntries(updated);
  }, []);

  return { entries, add, remove };
}
