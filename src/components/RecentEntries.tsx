import React from 'react';
import { MoodEntry, moodConfig } from '../types';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface Props {
  entries: MoodEntry[];
}

// последние 5 записей на дэшборде
export const RecentEntries: React.FC<Props> = ({ entries }) => {
  const recent = entries.slice(0, 5);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #12121f, #0d0d1a)',
      border: '1px solid #1e1e3a',
      borderRadius: '16px',
      padding: '20px',
    }}>
      <h3 style={{ margin: '0 0 16px', color: '#ccc', fontSize: '14px', fontWeight: 500 }}>
        Последние записи
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {recent.map((entry, i) => {
          const cfg = moodConfig[entry.mood];
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '12px',
                background: `${cfg.color}0a`,
                border: `1px solid ${cfg.color}22`,
              }}
            >
              <span style={{ fontSize: '24px' }}>{cfg.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', color: '#ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {entry.note || 'Без заметки'}
                </div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                  {format(parseISO(entry.date), 'd MMMM', { locale: ru })}
                </div>
              </div>
              <div style={{
                fontSize: '11px',
                color: cfg.color,
                padding: '2px 8px',
                borderRadius: '8px',
                background: `${cfg.color}15`,
                whiteSpace: 'nowrap',
              }}>
                {cfg.labelRu}
              </div>
            </motion.div>
          );
        })}
        {recent.length === 0 && (
          <div style={{ color: '#555', textAlign: 'center', padding: '20px' }}>
            Пока нет записей
          </div>
        )}
      </div>
    </div>
  );
};
