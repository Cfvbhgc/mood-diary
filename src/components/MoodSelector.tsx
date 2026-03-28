// Выбор эмоции через blob-формы с CSS анимацией
import React from 'react';
import { motion } from 'framer-motion';
import { MoodType, MOOD_CONFIGS } from '../types';

interface Props {
  selected: MoodType | null;
  onSelect: (mood: MoodType) => void;
}

const moods: MoodType[] = ['happy', 'calm', 'sad', 'angry', 'anxious'];

const MoodSelector: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="mood-selector">
      {moods.map((mood, i) => {
        const config = MOOD_CONFIGS[mood];
        const isActive = selected === mood;
        return (
          <motion.button
            key={mood}
            className={`mood-blob ${isActive ? 'active' : ''}`}
            style={{
              background: isActive ? config.gradient : config.bgTint,
              borderColor: isActive ? config.color : 'transparent',
              boxShadow: isActive ? `0 0 40px ${config.color}30` : 'none',
            }}
            onClick={() => onSelect(mood)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: isActive ? 1.2 : 1 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mood-blob-symbol" style={{ color: isActive ? '#fff' : config.color }}>
              {config.emoji}
            </span>
            <span className="mood-blob-label" style={{ color: isActive ? '#fff' : config.color }}>
              {config.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default MoodSelector;
