export interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  color: string;
  note: string;
}

export const MOODS = [
  { name: 'Радость', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { name: 'Спокойствие', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  { name: 'Вдохновение', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  { name: 'Грусть', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { name: 'Тревога', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  { name: 'Злость', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
];
