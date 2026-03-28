import React, { useEffect, useState } from 'react';
import { MoodEntry, moodConfig, MoodType } from '../types';
import { motion } from 'framer-motion';

interface Props {
  entries: MoodEntry[];
}

// анимированный счётчик
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 800;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [value]);

  return <>{display}</>;
}

export const StatsCards: React.FC<Props> = ({ entries }) => {
  const totalEntries = entries.length;

  // считаем самое частое настроение
  const moodCounts: Record<string, number> = {};
  entries.forEach(e => {
    moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  // streak — дней подряд с записями (упрощённый)
  const uniqueDays = new Set(entries.map(e => e.date)).size;

  const cards = [
    {
      title: 'Всего записей',
      value: totalEntries,
      icon: '📝',
      gradient: 'linear-gradient(135deg, #7c3aed33, #7c3aed11)',
      border: '#7c3aed55',
    },
    {
      title: 'Частое настроение',
      value: topMood ? moodCounts[topMood[0]] : 0,
      icon: topMood ? moodConfig[topMood[0] as MoodType].emoji : '🤷',
      subtitle: topMood ? moodConfig[topMood[0] as MoodType].labelRu : '',
      gradient: 'linear-gradient(135deg, #06b6d433, #06b6d411)',
      border: '#06b6d455',
    },
    {
      title: 'Уникальных дней',
      value: uniqueDays,
      icon: '📅',
      gradient: 'linear-gradient(135deg, #ec489933, #ec489911)',
      border: '#ec489955',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    }}>
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          style={{
            background: card.gradient,
            border: `1px solid ${card.border}`,
            borderRadius: '16px',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>{card.icon}</div>
          <div style={{ fontSize: '12px', color: '#8888aa', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {card.title}
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
            <AnimatedNumber value={card.value} />
          </div>
          {card.subtitle && (
            <div style={{ fontSize: '13px', color: '#a78bfa', marginTop: '4px' }}>{card.subtitle}</div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
