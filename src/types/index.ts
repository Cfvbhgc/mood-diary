// типы для дневника настроений

export type MoodType = 'happy' | 'calm' | 'neutral' | 'sad' | 'angry';

export interface MoodEntry {
  id: string;
  mood: MoodType;
  note: string;
  date: string; // ISO string
  createdAt: number; // timestamp
}

// конфигурация настроений — цвета и эмодзи
export const moodConfig: Record<MoodType, { emoji: string; label: string; color: string; labelRu: string }> = {
  happy: { emoji: '😊', label: 'Happy', color: '#facc15', labelRu: 'Счастье' },
  calm: { emoji: '😌', label: 'Calm', color: '#06b6d4', labelRu: 'Спокойствие' },
  neutral: { emoji: '😐', label: 'Neutral', color: '#a78bfa', labelRu: 'Нейтрально' },
  sad: { emoji: '😢', label: 'Sad', color: '#3b82f6', labelRu: 'Грусть' },
  angry: { emoji: '😠', label: 'Angry', color: '#ef4444', labelRu: 'Злость' },
};

export const moodNumericValue: Record<MoodType, number> = {
  angry: 1,
  sad: 2,
  neutral: 3,
  calm: 4,
  happy: 5,
};
