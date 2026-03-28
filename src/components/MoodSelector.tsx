import React from 'react';
import { motion } from 'framer-motion';
import { MOODS } from '../types';

interface Props {
  selectedMood: string | null;
  onSelect: (mood: string) => void;
}

const MoodSelector: React.FC<Props> = ({ selectedMood, onSelect }) => {
  return (
    <motion.section
      className="mood-selector"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <h2 className="section-title">Как ты себя чувствуешь?</h2>
      <div className="mood-buttons">
        {MOODS.map((mood) => (
          <button
            key={mood.name}
            className={`mood-btn ${selectedMood === mood.name ? 'mood-btn--active' : ''}`}
            onClick={() => onSelect(mood.name)}
          >
            <span
              className="mood-circle"
              style={{
                background: mood.color,
                boxShadow: selectedMood === mood.name ? `0 0 20px ${mood.color}` : 'none',
              }}
            />
            <span className="mood-label">{mood.name}</span>
          </button>
        ))}
      </div>
    </motion.section>
  );
};

export default MoodSelector;
