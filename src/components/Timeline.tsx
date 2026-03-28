// Вертикальный timeline записей с blob-элементами
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodEntry, getMoodConfig } from '../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Props {
  entries: MoodEntry[];
  onDelete: (id: string) => void;
}

const Timeline: React.FC<Props> = ({ entries, onDelete }) => {
  // Сортировка от новых к старым
  const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="timeline">
      <AnimatePresence>
        {sorted.map((entry) => {
          const config = getMoodConfig(entry.mood);
          return (
            <motion.div
              key={entry.id}
              className="timeline-item"
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="timeline-dot"
                style={{ background: config.gradient }}
              />
              <div className="timeline-item-header">
                <span className="timeline-item-mood" style={{ color: config.color }}>
                  {config.emoji} {config.label}
                </span>
                <span className="timeline-item-date">
                  {format(new Date(entry.date), 'd MMMM yyyy', { locale: ru })}
                </span>
              </div>
              <p className="timeline-item-text">{entry.text}</p>
              <button
                className="timeline-item-delete"
                onClick={() => onDelete(entry.id)}
                title="Удалить запись"
              >
                ×
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Timeline;
