// Календарь-хитмэп — круглые ячейки как GitHub contributions
import React, { useState, useCallback } from 'react';
import { MoodEntry, MOOD_CONFIGS } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths, isAfter } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Props {
  entries: MoodEntry[];
}

interface TooltipData {
  text: string;
  date: string;
  mood: string;
  x: number;
  y: number;
}

const HeatmapCalendar: React.FC<Props> = ({ entries }) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const today = new Date();

  // Карта дат к записям для быстрого поиска
  const entryMap = new Map<string, MoodEntry>();
  entries.forEach((e) => {
    entryMap.set(e.date, e);
  });

  // Генерируем 3 месяца
  const months = [subMonths(today, 2), subMonths(today, 1), today];
  const dayLabels = ['Пн', '', 'Ср', '', 'Пт', '', 'Вс'];

  const handleMouseEnter = useCallback((e: React.MouseEvent, entry: MoodEntry) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltip({
      text: entry.text,
      date: format(new Date(entry.date), 'd MMMM yyyy', { locale: ru }),
      mood: MOOD_CONFIGS[entry.mood].label,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <div className="heatmap">
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {months.map((monthDate) => {
          const start = startOfMonth(monthDate);
          const end = endOfMonth(monthDate);
          const days = eachDayOfInterval({ start, end });
          const startDayOfWeek = (getDay(start) + 6) % 7; // Пн=0
          const monthLabel = format(monthDate, 'LLLL', { locale: ru });

          return (
            <div key={monthLabel} style={{ minWidth: '160px' }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginBottom: '0.5rem',
                textTransform: 'capitalize',
                fontWeight: 500,
              }}>
                {monthLabel}
              </div>
              <div style={{ display: 'flex', gap: '2px' }}>
                {/* Лейблы дней */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '4px' }}>
                  {dayLabels.map((label, i) => (
                    <div key={i} className="heatmap-day-label" style={{ height: '18px', lineHeight: '18px' }}>
                      {label}
                    </div>
                  ))}
                </div>
                {/* Сетка */}
                <div style={{
                  display: 'grid',
                  gridTemplateRows: 'repeat(7, 18px)',
                  gridAutoFlow: 'column',
                  gap: '2px',
                }}>
                  {/* Пустые ячейки перед первым днём */}
                  {Array.from({ length: startDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ width: '18px', height: '18px' }} />
                  ))}
                  {days.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const entry = entryMap.get(dateStr);
                    const isFuture = isAfter(day, today);

                    return (
                      <div
                        key={dateStr}
                        className={`heatmap-cell ${entry ? 'has-entry' : ''} ${isFuture ? 'future' : ''}`}
                        style={entry ? {
                          background: MOOD_CONFIGS[entry.mood].gradient,
                          borderColor: 'transparent',
                        } : undefined}
                        onMouseEnter={entry ? (e) => handleMouseEnter(e, entry) : undefined}
                        onMouseLeave={entry ? handleMouseLeave : undefined}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="heatmap-tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="heatmap-tooltip-date">{tooltip.date} — {tooltip.mood}</div>
          <div>{tooltip.text}</div>
        </div>
      )}
    </div>
  );
};

export default HeatmapCalendar;
