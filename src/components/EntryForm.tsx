// Форма создания записи — эмоция + текст + дата
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodType, getMoodConfig } from '../types';

interface Props {
  selectedMood: MoodType | null;
  onSubmit: (text: string, date: string) => void;
}

const EntryForm: React.FC<Props> = ({ selectedMood, onSubmit }) => {
  const [text, setText] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
    if (!selectedMood || !text.trim()) return;
    onSubmit(text.trim(), date);
    setText('');
  };

  return (
    <AnimatePresence>
      {selectedMood && (
        <motion.div
          className="entry-form"
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="entry-form-header">
            <div
              className="entry-form-mood-badge"
              style={{ background: getMoodConfig(selectedMood).gradient }}
            >
              {getMoodConfig(selectedMood).emoji}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                {getMoodConfig(selectedMood).label}
              </div>
              <input
                type="date"
                className="entry-form-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>
          <textarea
            placeholder="Что произошло сегодня? Как ты себя чувствуешь?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="entry-form-actions">
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!text.trim()}
            >
              Сохранить
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntryForm;
