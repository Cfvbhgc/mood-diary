import React from 'react';
import { motion } from 'framer-motion';
import { MoodEntry, MOODS } from '../types';

interface Props {
  entries: MoodEntry[];
}

const StatsBar: React.FC<Props> = ({ entries }) => {
  const counts = MOODS.map((mood) => ({
    ...mood,
    count: entries.filter((e) => e.mood === mood.name).length,
  }));

  const maxCount = Math.max(...counts.map((c) => c.count), 1);

  return (
    <motion.section
      className="stats-bar"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h2 className="section-title">Статистика</h2>
      <div className="stats-chart">
        {counts.map((item) => (
          <div className="stats-column" key={item.name}>
            <div className="stats-bar-wrapper">
              <div
                className="stats-bar-fill"
                style={{
                  height: `${(item.count / maxCount) * 100}%`,
                  background: item.color,
                }}
              />
            </div>
            <span className="stats-label">{item.name}</span>
            <span className="stats-count" style={{ color: item.color }}>
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default StatsBar;
