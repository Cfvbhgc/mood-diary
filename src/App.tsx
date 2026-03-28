import React, { useState, useEffect } from 'react';
import './App.css';
import { MoodEntry, MOODS } from './types';
import { defaultEntries } from './data';
import Hero from './components/Hero';
import MoodSelector from './components/MoodSelector';
import EntryForm from './components/EntryForm';
import StatsBar from './components/StatsBar';
import HeatmapCalendar from './components/HeatmapCalendar';
import RecentEntries from './components/RecentEntries';

const STORAGE_KEY = 'mood-diary-entries';

const MOOD_MAP: Record<string, { name: string; color: string }> = {
  happy: { name: 'Радость', color: '#f59e0b' },
  calm: { name: 'Спокойствие', color: '#06b6d4' },
  sad: { name: 'Грусть', color: '#6366f1' },
  angry: { name: 'Злость', color: '#ef4444' },
  anxious: { name: 'Тревога', color: '#ec4899' },
};

function migrateEntry(e: Record<string, unknown>): MoodEntry | null {
  const id = typeof e.id === 'string' ? e.id : String(e.id ?? Date.now());
  const date = typeof e.date === 'string' ? e.date.split('T')[0] : '';
  if (!date) return null;

  const moodRaw = typeof e.mood === 'string' ? e.mood : '';
  const mapped = MOOD_MAP[moodRaw];

  const validMoodNames = MOODS.map((m) => m.name);
  let mood: string;
  let color: string;

  if (mapped) {
    mood = mapped.name;
    color = mapped.color;
  } else if (validMoodNames.includes(moodRaw)) {
    mood = moodRaw;
    const found = MOODS.find((m) => m.name === moodRaw);
    color = typeof e.color === 'string' && e.color ? e.color : (found?.color ?? '#8b5cf6');
  } else {
    return null;
  }

  const note =
    typeof e.note === 'string' && e.note
      ? e.note
      : typeof e.text === 'string' && e.text
        ? e.text
        : 'Без заметки';

  return { id, date, mood, color, note };
}

function loadEntries(): MoodEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const migrated = parsed
          .map((e: Record<string, unknown>) => migrateEntry(e))
          .filter((e): e is MoodEntry => e !== null);
        if (migrated.length > 0) return migrated;
      }
    }
  } catch {}
  return defaultEntries;
}

const App: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>(loadEntries);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    const mood = MOODS.find((m) => m.name === selectedMood);
    if (mood) {
      document.documentElement.style.setProperty('--accent-color', mood.color);
    } else {
      document.documentElement.style.setProperty('--accent-color', '#8b5cf6');
    }
  }, [selectedMood]);

  const addEntry = () => {
    if (!selectedMood) return;
    const mood = MOODS.find((m) => m.name === selectedMood);
    if (!mood) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: mood.name,
      color: mood.color,
      note: noteText || 'Без заметки',
    };

    setEntries((prev) => [newEntry, ...prev]);
    setNoteText('');
    setSelectedMood(null);
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="app">
      <div className="container">
        <Hero />
        <MoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />
        <EntryForm
          selectedMood={selectedMood}
          noteText={noteText}
          onNoteChange={setNoteText}
          onSave={addEntry}
        />
        <StatsBar entries={entries} />
        <HeatmapCalendar entries={entries} />
        <RecentEntries entries={entries} onDelete={deleteEntry} />
      </div>
    </div>
  );
};

export default App;
