import { MoodEntry, MoodType } from '../types';
import { subDays, format } from 'date-fns';

// генерируем демо-данные чтобы дэшборд не выглядел пустым
const moods: MoodType[] = ['happy', 'calm', 'neutral', 'sad', 'angry'];

const sampleNotes = [
  'Отличный день, прогулка в парке 🌳',
  'Работал над проектом, продуктивно',
  'Немного устал, но в целом ок',
  'Дождливый день, сидел дома',
  'Встретился с друзьями, было весело!',
  'Готовил ужин, получилось вкусно',
  'Прочитал интересную книгу',
  'Не выспался, тяжело было...',
  'Сходил в спортзал, чувствую себя отлично',
  'Поругался на работе, настроение так себе',
  'Обычный день, ничего особенного',
  'Смотрел фильм, расслабился',
  'Получил хорошие новости!',
  'Гулял с собакой, погода класс',
  'Дедлайн горит, стресс',
  'Выходной! Наконец-то отдых',
  'Позвонил маме, поговорили',
  'Учил TypeScript, голова кипит',
  'Пил кофе в новой кофейне',
  'Закончил важную задачу на работе',
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function generateSampleData(): MoodEntry[] {
  const entries: MoodEntry[] = [];
  const now = new Date();

  // создаём 18 записей за последние ~60 дней
  const daysAgo = [1, 2, 3, 5, 7, 9, 11, 14, 16, 19, 22, 25, 30, 35, 40, 45, 50, 55];

  daysAgo.forEach((days, i) => {
    const date = subDays(now, days);
    // немного рандома в выборе настроения, но с уклоном к позитиву
    const moodIdx = i < 5
      ? Math.floor(Math.random() * 2) // happy или calm
      : Math.floor(Math.random() * moods.length);

    entries.push({
      id: generateId(),
      mood: moods[moodIdx],
      note: sampleNotes[i % sampleNotes.length],
      date: format(date, 'yyyy-MM-dd'),
      createdAt: date.getTime(),
    });
  });

  return entries.sort((a, b) => b.createdAt - a.createdAt);
}
