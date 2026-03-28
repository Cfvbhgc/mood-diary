import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOODS } from '../types';

interface Props {
  selectedMood: string | null;
  noteText: string;
  onNoteChange: (text: string) => void;
  onSave: () => void;
}

const EntryForm: React.FC<Props> = ({ selectedMood, noteText, onNoteChange, onSave }) => {
  const moodData = MOODS.find((m) => m.name === selectedMood);

  return (
    <AnimatePresence>
      {selectedMood && (
        <motion.section
          className="entry-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="section-title">
            Запиши мысли
            <span
              className="mood-dot-inline"
              style={{ background: moodData?.color }}
            />
          </h2>
          <textarea
            className="entry-textarea"
            placeholder="Что произошло сегодня..."
            value={noteText}
            onChange={(e) => onNoteChange(e.target.value)}
            rows={3}
          />
          <button
            className="save-btn"
            onClick={onSave}
            style={{ background: moodData?.color }}
          >
            Сохранить
          </button>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default EntryForm;
