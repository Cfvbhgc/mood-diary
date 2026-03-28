// Статистика с counter-анимацией
import React, { useEffect, useState } from 'react';
import { MoodEntry, MoodType, MOOD_CONFIGS } from '../types';

interface Props {
  entries: MoodEntry[];
}

// Хук для анимации счётчика
const useCounter = (target: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return count;
};

const StatsCards: React.FC<Props> = ({ entries }) => {
  // Подсчёт статистики
  const totalEntries = entries.length;
  const moodCounts: Record<MoodType, number> = {
    happy: 0, calm: 0, sad: 0, angry: 0, anxious: 0,
  };
  entries.forEach((e) => { moodCounts[e.mood]++; });

  // Доминирующее настроение
  const dominantMood = (Object.entries(moodCounts) as [MoodType, number][])
    .sort((a, b) => b[1] - a[1])[0];

  // Позитивный процент (happy + calm)
  const positivePercent = totalEntries > 0
    ? Math.round(((moodCounts.happy + moodCounts.calm) / totalEntries) * 100)
    : 0;

  // Серия дней (уникальные даты)
  const uniqueDates = new Set(entries.map((e) => e.date));
  const streak = uniqueDates.size;

  // Анимированные значения
  const animTotal = useCounter(totalEntries);
  const animPositive = useCounter(positivePercent);
  const animStreak = useCounter(streak);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-value">{animTotal}</div>
        <div className="stat-card-label">Всего записей</div>
      </div>

      <div className="stat-card">
        <div className="stat-card-value" style={{ color: dominantMood ? MOOD_CONFIGS[dominantMood[0]].color : undefined }}>
          {dominantMood ? MOOD_CONFIGS[dominantMood[0]].emoji : '—'}
        </div>
        <div className="stat-card-label">
          {dominantMood ? `${MOOD_CONFIGS[dominantMood[0]].label} — чаще всего` : 'Нет данных'}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-value">{animPositive}%</div>
        <div className="stat-card-label">Позитивных дней</div>
        <div className="stat-card-bar">
          <div
            className="stat-card-bar-fill"
            style={{
              width: `${positivePercent}%`,
              background: 'var(--mood-gradient)',
            }}
          />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-value">{animStreak}</div>
        <div className="stat-card-label">Дней с записями</div>
      </div>
    </div>
  );
};

export default StatsCards;
