import React from 'react';
import { motion } from 'framer-motion';
import { MoodEntry } from '../types';

interface Props {
  entries: MoodEntry[];
}

const HeatmapCalendar: React.FC<Props> = ({ entries }) => {
  // Build 35 cells (5 weeks) ending today
  const today = new Date();
  const cells: { date: string; color: string | null; tooltip: string }[] = [];

  for (let i = 34; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const entry = entries.find((e) => e.date === dateStr);
    const dayNum = d.getDate();
    const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    const tooltip = entry
      ? `${dayNum} ${monthNames[d.getMonth()]}: ${entry.mood}`
      : `${dayNum} ${monthNames[d.getMonth()]}`;

    cells.push({
      date: dateStr,
      color: entry ? entry.color : null,
      tooltip,
    });
  }

  return (
    <motion.section
      className="heatmap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <h2 className="section-title">Календарь</h2>
      <div className="heatmap-grid">
        {cells.map((cell) => (
          <div
            key={cell.date}
            className="heatmap-cell"
            data-tooltip={cell.tooltip}
            style={{
              background: cell.color || '#1a1a2e',
              opacity: cell.color ? 1 : 0.4,
            }}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default HeatmapCalendar;
