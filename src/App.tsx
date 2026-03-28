// Основной layout и state management дневника настроений
import React, { useState, useEffect, useCallback, Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import { MoodEntry, MoodType, getMoodConfig } from './types';
import { sampleEntries } from './data';
import Hero from './components/Hero';
import MoodSelector from './components/MoodSelector';
import EntryForm from './components/EntryForm';
import HeatmapCalendar from './components/HeatmapCalendar';
import MoodChart from './components/MoodChart';
import Timeline from './components/Timeline';
import StatsCards from './components/StatsCards';

// Error Boundary для перехвата runtime ошибок
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Mood Diary Error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '2rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>MOOD</h1>
          <p style={{ color: '#666' }}>Произошла ошибка: {this.state.error}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Ключ для localStorage
const STORAGE_KEY = 'mood-diary-entries';

// Загрузка записей из localStorage или sample данных
const VALID_MOODS: Set<string> = new Set(['happy', 'calm', 'sad', 'angry', 'anxious']);

const loadEntries = (): MoodEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Фильтруем записи с невалидным mood — защита от "Cannot read properties of undefined"
        return parsed.filter((e: MoodEntry) => e && e.mood && VALID_MOODS.has(e.mood));
      }
    }
  } catch {}
  // При первом запуске — загружаем демо-данные
  return sampleEntries;
};

const App: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>(loadEntries);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  // Сохранение в localStorage при изменении записей
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  // Обновление CSS переменных при смене настроения
  useEffect(() => {
    const root = document.documentElement;
    if (selectedMood) {
      const config = getMoodConfig(selectedMood);
      root.style.setProperty('--mood-color', config.color);
      root.style.setProperty('--mood-gradient', config.gradient);
      root.style.setProperty('--mood-bg-tint', config.bgTint);
    } else {
      // Значения по умолчанию — фиолетовый
      root.style.setProperty('--mood-color', '#8b5cf6');
      root.style.setProperty('--mood-gradient', 'linear-gradient(135deg, #8b5cf6, #6366f1)');
      root.style.setProperty('--mood-bg-tint', 'rgba(139, 92, 246, 0.06)');
    }
  }, [selectedMood]);

  // Добавление новой записи
  const handleAddEntry = useCallback((text: string, date: string) => {
    const newEntry: MoodEntry = {
      id: `u-${Date.now()}`,
      mood: selectedMood!,
      text,
      date,
      createdAt: Date.now(),
    };
    setEntries((prev) => [newEntry, ...prev]);
    setSelectedMood(null);
  }, [selectedMood]);

  // Удаление записи
  const handleDeleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // Анимация секций при скролле
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <div className="app-container">
          {/* Hero секция */}
          <Hero />

          {/* Выбор настроения + Форма — видимо сразу, анимируется при появлении */}
          <motion.section
            className="section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="section-title">Как ты сегодня?</h2>
            <p className="section-subtitle">Выбери своё настроение</p>
            <MoodSelector selected={selectedMood} onSelect={setSelectedMood} />
            <EntryForm selectedMood={selectedMood} onSubmit={handleAddEntry} />
          </motion.section>

          {/* Статистика */}
          <motion.section
            className="section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
          >
            <h2 className="section-title">Статистика</h2>
            <p className="section-subtitle">Твой эмоциональный профиль</p>
            <StatsCards entries={entries} />
          </motion.section>

          {/* Календарь-heatmap */}
          <motion.section
            className="section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
          >
            <h2 className="section-title">Календарь</h2>
            <p className="section-subtitle">Карта настроений за последние месяцы</p>
            <HeatmapCalendar entries={entries} />
          </motion.section>

          {/* D3 график */}
          <motion.section
            className="section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
          >
            <h2 className="section-title">Динамика</h2>
            <p className="section-subtitle">График изменения настроений</p>
            <MoodChart entries={entries} />
          </motion.section>

          {/* Timeline записей */}
          <motion.section
            className="section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={sectionVariants}
          >
            <h2 className="section-title">Записи</h2>
            <p className="section-subtitle">История твоих настроений</p>
            <Timeline entries={entries} onDelete={handleDeleteEntry} />
          </motion.section>

          {/* Футер */}
          <footer className="footer">
            MOOD — Цифровой дневник настроений
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
