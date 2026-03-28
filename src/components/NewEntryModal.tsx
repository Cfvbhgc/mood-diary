import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodType, moodConfig, MoodEntry } from '../types';
import { format } from 'date-fns';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: MoodEntry) => void;
}

// модалка создания новой записи
export const NewEntryModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (!selectedMood) return;
    const entry: MoodEntry = {
      id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
      mood: selectedMood,
      note: note.trim(),
      date: format(new Date(), 'yyyy-MM-dd'),
      createdAt: Date.now(),
    };
    onSave(entry);
    // reset
    setSelectedMood(null);
    setNote('');
    onClose();
  };

  const moods: MoodType[] = ['happy', 'calm', 'neutral', 'sad', 'angry'];

  // цветовая подсветка фона при выборе настроения
  const bgTint = selectedMood ? `${moodConfig[selectedMood].color}08` : 'transparent';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: `linear-gradient(135deg, #13131f, #0e0e1c)`,
              border: '1px solid #2a2a45',
              borderRadius: '20px',
              padding: '32px',
              width: '100%',
              maxWidth: '460px',
              position: 'relative',
              transition: 'background-color 0.3s',
              backgroundColor: bgTint,
            }}
          >
            {/* close btn */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#666',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              ✕
            </button>

            <h2 style={{ color: '#eee', fontSize: '20px', fontWeight: 600, margin: '0 0 8px' }}>
              Новая запись
            </h2>
            <p style={{ color: '#666', fontSize: '13px', margin: '0 0 24px' }}>
              {format(new Date(), 'dd.MM.yyyy')} — Как ты себя чувствуешь?
            </p>

            {/* mood selection */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {moods.map(mood => {
                const cfg = moodConfig[mood];
                const isSelected = selectedMood === mood;
                return (
                  <motion.button
                    key={mood}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isSelected ? { scale: 1.15 } : { scale: 1 }}
                    onClick={() => setSelectedMood(mood)}
                    style={{
                      width: '64px',
                      height: '72px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      borderRadius: '14px',
                      border: isSelected ? `2px solid ${cfg.color}` : '2px solid #2a2a45',
                      background: isSelected ? `${cfg.color}20` : '#1a1a2e',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? `0 0 20px ${cfg.color}33` : 'none',
                      padding: '0',
                    }}
                  >
                    <span style={{ fontSize: '28px' }}>{cfg.emoji}</span>
                    <span style={{ fontSize: '10px', color: isSelected ? cfg.color : '#777' }}>
                      {cfg.labelRu}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* note textarea */}
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Что произошло сегодня? (необязательно)"
              maxLength={300}
              style={{
                width: '100%',
                minHeight: '100px',
                background: '#0f0f1d',
                border: '1px solid #2a2a45',
                borderRadius: '12px',
                color: '#ddd',
                padding: '14px',
                fontSize: '14px',
                fontFamily: "'Space Grotesk', sans-serif",
                resize: 'vertical',
                outline: 'none',
                marginBottom: '20px',
                boxSizing: 'border-box',
              }}
            />

            {/* save button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={!selectedMood}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: selectedMood
                  ? `linear-gradient(135deg, #7c3aed, ${moodConfig[selectedMood].color})`
                  : '#2a2a45',
                color: selectedMood ? '#fff' : '#555',
                fontSize: '15px',
                fontWeight: 600,
                fontFamily: "'Space Grotesk', sans-serif",
                cursor: selectedMood ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s',
              }}
            >
              Сохранить
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
