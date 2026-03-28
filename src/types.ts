// Типы для дневника настроений

export type MoodType = 'happy' | 'calm' | 'sad' | 'angry' | 'anxious';

export interface MoodEntry {
  id: string;
  mood: MoodType;
  text: string;
  date: string; // ISO строка
  createdAt: number; // timestamp
}

// Конфигурация каждого настроения — цвета, эмодзи, лейбл
export interface MoodConfig {
  label: string;
  emoji: string;
  color: string;
  gradient: string;
  bgTint: string;
}

// Дефолтный конфиг — fallback на случай undefined mood
export const DEFAULT_MOOD_CONFIG: MoodConfig = {
  label: 'Настроение',
  emoji: '◯',
  color: '#8b5cf6',
  gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
  bgTint: 'rgba(139, 92, 246, 0.06)',
};

// Безопасный доступ к конфигу настроения
export const getMoodConfig = (mood: MoodType | string | undefined | null): MoodConfig => {
  if (mood && mood in MOOD_CONFIGS) {
    return MOOD_CONFIGS[mood as MoodType];
  }
  return DEFAULT_MOOD_CONFIG;
};

export const MOOD_CONFIGS: Record<MoodType, MoodConfig> = {
  happy: {
    label: 'Радость',
    emoji: '✦',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
    bgTint: 'rgba(245, 158, 11, 0.06)',
  },
  calm: {
    label: 'Спокойствие',
    emoji: '◯',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    bgTint: 'rgba(99, 102, 241, 0.06)',
  },
  sad: {
    label: 'Грусть',
    emoji: '◇',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    bgTint: 'rgba(59, 130, 246, 0.06)',
  },
  angry: {
    label: 'Злость',
    emoji: '△',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
    bgTint: 'rgba(239, 68, 68, 0.06)',
  },
  anxious: {
    label: 'Тревога',
    emoji: '⬡',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
    bgTint: 'rgba(168, 85, 247, 0.06)',
  },
};
