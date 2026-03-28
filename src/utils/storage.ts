import { MoodEntry } from '../types';
import { generateSampleData } from './sampleData';

const STORAGE_KEY = 'mood-diary-entries';

// загружаем записи из localStorage
export function loadEntries(): MoodEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // первый запуск — заполняем демо данными
    const sample = generateSampleData();
    saveEntries(sample);
    return sample;
  } catch (e) {
    console.error('Ошибка загрузки данных:', e);
    return [];
  }
}

export function saveEntries(entries: MoodEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addEntry(entry: MoodEntry): MoodEntry[] {
  const entries = loadEntries();
  entries.unshift(entry);
  saveEntries(entries);
  return entries;
}

export function deleteEntry(id: string): MoodEntry[] {
  const entries = loadEntries().filter(e => e.id !== id);
  saveEntries(entries);
  return entries;
}
