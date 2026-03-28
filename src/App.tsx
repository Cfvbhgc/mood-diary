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

function loadEntries(): MoodEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
