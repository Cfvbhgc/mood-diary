import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

import { useMoodEntries } from './hooks/useMoodEntries';
import { StatsCards } from './components/StatsCards';
import { MoodChart } from './components/MoodChart';
import { HeatmapCalendar } from './components/HeatmapCalendar';
import { RecentEntries } from './components/RecentEntries';
import { NewEntryModal } from './components/NewEntryModal';
import { History } from './components/History';

type TabType = 'dashboard' | 'history';

function App() {
  const { entries, add, remove } = useMoodEntries();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="app-container">
      {/* хэдер */}
      <header className="app-header">
        <h1 className="app-title">
          <span>Mood Diary</span>
        </h1>
        <button className="add-btn" onClick={() => setModalOpen(true)} title="Новая запись">
          +
        </button>
      </header>

      {/* навигация */}
      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Дэшборд
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          История
        </button>
      </nav>

      {/* контент с анимацией переключения */}
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <StatsCards entries={entries} />
            <MoodChart entries={entries} />
            <HeatmapCalendar entries={entries} />
            <RecentEntries entries={entries} />
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <History entries={entries} onDelete={remove} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* модалка новой записи */}
      <NewEntryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={add}
      />
    </div>
  );
}

export default App;
