import React, { useState, useMemo } from 'react';
import { MoodEntry, moodConfig, MoodType } from '../types';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  entries: MoodEntry[];
  onDelete: (id: string) => void;
}

// страница истории с поиском и фильтрацией
export const History: React.FC<Props> = ({ entries, onDelete }) => {
  const [search, setSearch] = useState('');
  const [filterMood, setFilterMood] = useState<MoodType | 'all'>('all');

  const filtered = useMemo(() => {
    return entries.filter(e => {
      const matchSearch = search === '' ||
        e.note.toLowerCase().includes(search.toLowerCase()) ||
        moodConfig[e.mood].labelRu.toLowerCase().includes(search.toLowerCase());
      const matchMood = filterMood === 'all' || e.mood === filterMood;
      return matchSearch && matchMood;
    });
  }, [entries, search, filterMood]);

  const moodFilters: (MoodType | 'all')[] = ['all', 'happy', 'calm', 'neutral', 'sad', 'angry'];

  return (
    <div>
      {/* поиск и фильтры */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по заметкам..."
          style={{
            width: '100%',
            padding: '12px 16px',
            background: '#12121f',
            border: '1px solid #2a2a45',
            borderRadius: '12px',
            color: '#ddd',
            fontSize: '14px',
            fontFamily: "'Space Grotesk', sans-serif",
            outline: 'none',
            marginBottom: '12px',
            boxSizing: 'border-box',
          }}
        />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {moodFilters.map(m => {
            const isActive = filterMood === m;
            const label = m === 'all' ? 'Все' : moodConfig[m].emoji + ' ' + moodConfig[m].labelRu;
            const color = m === 'all' ? '#7c3aed' : moodConfig[m].color;
            return (
              <button
                key={m}
                onClick={() => setFilterMood(m)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: `1px solid ${isActive ? color : '#2a2a45'}`,
                  background: isActive ? `${color}22` : 'transparent',
                  color: isActive ? color : '#666',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <AnimatePresence>
          {filtered.map((entry) => {
            const cfg = moodConfig[entry.mood];
            return (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, x: -100 }}
                transition={{ duration: 0.25 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '16px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #12121f, #0d0d1a)',
                  border: `1px solid ${cfg.color}18`,
                }}
              >
                <span style={{ fontSize: '28px', lineHeight: 1 }}>{cfg.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: cfg.color, fontWeight: 500 }}>
                      {cfg.labelRu}
                    </span>
                    <span style={{ fontSize: '11px', color: '#555' }}>
                      {format(parseISO(entry.date), 'd MMMM yyyy', { locale: ru })}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#aaa', lineHeight: 1.5 }}>
                    {entry.note || <span style={{ color: '#444', fontStyle: 'italic' }}>Без заметки</span>}
                  </div>
                </div>
                <button
                  onClick={() => onDelete(entry.id)}
                  style={{
                    background: 'none',
                    border: '1px solid #331111',
                    borderRadius: '8px',
                    color: '#ef4444',
                    padding: '6px 10px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    opacity: 0.6,
                    transition: 'opacity 0.2s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
                  title="Удалить запись"
                >
                  🗑
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#555' }}>
            {search || filterMood !== 'all' ? 'Ничего не найдено' : 'Пока нет записей'}
          </div>
        )}
      </div>
    </div>
  );
};
