import React from 'react';
import { MoodEntry, moodConfig, MoodType } from '../types';
import { subDays, format, startOfWeek, addDays } from 'date-fns';
import { motion } from 'framer-motion';

interface Props {
  entries: MoodEntry[];
}

// heatmap в стиле гитхаба, но с цветами эмоций
export const HeatmapCalendar: React.FC<Props> = ({ entries }) => {
  const today = new Date();
  const totalWeeks = 10; // показываем ~10 недель
  const totalDays = totalWeeks * 7;

  // маппинг дата -> entry
  const entryMap = new Map<string, MoodEntry>();
  entries.forEach(e => {
    if (!entryMap.has(e.date)) entryMap.set(e.date, e);
  });

  // генерим сетку дней
  const startDate = startOfWeek(subDays(today, totalDays - 1), { weekStartsOn: 1 });
  const weeks: { date: Date; dateStr: string; entry: MoodEntry | undefined }[][] = [];

  let currentDate = startDate;
  let currentWeek: typeof weeks[0] = [];

  for (let i = 0; i < totalDays; i++) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    currentWeek.push({
      date: new Date(currentDate),
      dateStr,
      entry: entryMap.get(dateStr),
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentDate = addDays(currentDate, 1);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const getCellColor = (entry: MoodEntry | undefined, dateStr: string): string => {
    // будущие даты
    if (dateStr > format(today, 'yyyy-MM-dd')) return 'transparent';
    if (!entry) return '#1a1a2e';
    return moodConfig[entry.mood].color;
  };

  const dayLabels = ['Пн', '', 'Ср', '', 'Пт', '', 'Вс'];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #12121f, #0d0d1a)',
      border: '1px solid #1e1e3a',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '24px',
    }}>
      <h3 style={{ margin: '0 0 16px', color: '#ccc', fontSize: '14px', fontWeight: 500 }}>
        Карта настроений
      </h3>
      <div style={{ display: 'flex', gap: '3px', overflowX: 'auto', paddingBottom: '8px' }}>
        {/* day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginRight: '4px', paddingTop: '0' }}>
          {dayLabels.map((label, i) => (
            <div key={i} style={{
              width: '20px', height: '14px', fontSize: '10px', color: '#555',
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            }}>
              {label}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {week.map((day, di) => (
              <motion.div
                key={day.dateStr}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (wi * 7 + di) * 0.005, duration: 0.2 }}
                title={`${day.dateStr}${day.entry ? ` — ${moodConfig[day.entry.mood].labelRu}` : ''}`}
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '3px',
                  backgroundColor: getCellColor(day.entry, day.dateStr),
                  opacity: day.entry ? 0.85 : 0.3,
                  cursor: day.entry ? 'pointer' : 'default',
                  boxShadow: day.entry ? `0 0 4px ${moodConfig[day.entry.mood].color}44` : 'none',
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* легенда */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
        {(Object.keys(moodConfig) as MoodType[]).map(mood => (
          <div key={mood} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#777' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '2px',
              backgroundColor: moodConfig[mood].color, opacity: 0.85,
            }} />
            {moodConfig[mood].labelRu}
          </div>
        ))}
      </div>
    </div>
  );
};
