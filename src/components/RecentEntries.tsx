import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodEntry } from '../types';

interface Props {
  entries: MoodEntry[];
  onDelete: (id: string) => void;
}

const RecentEntries: React.FC<Props> = ({ entries, onDelete }) => {
  const recent = [...entries]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    const day = d.getDate();
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return `${day} ${months[d.getMonth()]}`;
  };

  return (
    <motion.section
      className="recent"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <h2 className="section-title">Последние записи</h2>
      <div className="recent-list">
        <AnimatePresence>
          {recent.map((entry) => (
            <motion.div
              key={entry.id}
              className="recent-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ borderLeft: `3px solid ${entry.color}` }}
            >
              <div className="recent-header">
                <div className="recent-meta">
                  <span
                    className="recent-dot"
                    style={{ background: entry.color }}
                  />
                  <span className="recent-mood">{entry.mood}</span>
                  <span className="recent-date">{formatDate(entry.date)}</span>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(entry.id)}
                  aria-label="Удалить"
                >
                  &times;
                </button>
              </div>
              <p className="recent-note">{entry.note}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default RecentEntries;
