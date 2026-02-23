import { useState, useEffect } from 'react';
import { storageService } from '@/services/storage';

export const Profile = () => {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalExercises: 0,
    totalHours: 0,
    streak: 7
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const workouts = storageService.getWorkouts();
    const totalWorkouts = workouts.length;
    const totalExercises = workouts.reduce((sum, w) => sum + w.exercises.length, 0);
    const totalMinutes = workouts.reduce((sum, w) => sum + (w.duration || 60), 0);
    const totalHours = Math.floor(totalMinutes / 60);

    setStats({
      totalWorkouts,
      totalExercises,
      totalHours,
      streak: 7
    });
  }, []);

  // Данные для графика активности (7 дней)
  const weekActivity = [
    { day: 'Пн', value: 5 },
    { day: 'Вт', value: 3 },
    { day: 'Ср', value: 7 },
    { day: 'Чт', value: 4 },
    { day: 'Пт', value: 8 },
    { day: 'Сб', value: 6 },
    { day: 'Вс', value: 5 },
  ];

  const maxValue = Math.max(...weekActivity.map(d => d.value));

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-[480px] mx-auto px-4">
        {/* Статус бар */}
        <div className="pt-3 pb-2 flex items-center justify-between text-sm text-gray-500">
          <span className="font-light">9:41</span>
          <div className="flex items-center gap-1">
            <span className="text-xs">LTE</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
        </div>

        {/* Шапка профиля */}
        <div className="pt-6 pb-8 flex flex-col items-center">
          {/* Аватар */}
          <div className="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-[#9d6fff] to-[#7C4DFF] flex items-center justify-center mb-3">
            <span className="text-white text-3xl font-bold">ДИ</span>
          </div>
          
          {/* Имя */}
          <h1 className="text-2xl font-bold text-black mb-1">Дмитрий Иванов</h1>
          
          {/* Email */}
          <p className="text-sm text-gray-500 mb-2">@dmitry.fit</p>
          
          {/* Кнопка редактирования */}
          <button className="px-4 py-2 bg-[#7C4DFF] text-white rounded-full text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Редактировать
          </button>
        </div>

        {/* Блок статистики */}
        <div className="grid grid-cols-4 gap-2 mb-8 px-2">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-black mb-1">{stats.totalWorkouts}</div>
            <div className="text-xs text-gray-500">Тренировок</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-black mb-1">{stats.totalExercises}</div>
            <div className="text-xs text-gray-500">Упражнений</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-black mb-1">{stats.totalHours}</div>
            <div className="text-xs text-gray-500">Часов</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-black mb-1">{stats.streak} 🔥</div>
            <div className="text-xs text-gray-500">дней подряд</div>
          </div>
        </div>

        {/* График активности */}
        <div className="mb-8 px-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-black">Активность за неделю</h2>
            <svg className="w-5 h-5 text-[#7C4DFF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          {/* Гистограмма */}
          <div className="flex items-end justify-between gap-2 h-32 bg-gray-50 rounded-xl p-3">
            {weekActivity.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-to-t from-[#7C4DFF] to-[#9d6fff] rounded-t"
                     style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '8px' }}>
                </div>
                <span className="text-xs text-gray-500">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Настройки профиля */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Настройки профиля</h3>
          <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
            <button className="w-full h-14 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-xl">👤</span>
                <span className="text-base text-black">Личные данные</span>
              </div>
              <svg className="w-5 h-5 text-[#7C4DFF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button className="w-full h-14 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-xl">🎯</span>
                <span className="text-base text-black">Цели</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Набор массы</span>
                <svg className="w-5 h-5 text-[#7C4DFF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            
            <div className="w-full h-14 px-4 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <span className="text-base text-black">Уведомления</span>
              </div>
              <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  notificationsEnabled ? 'bg-[#7C4DFF]' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <button className="w-full h-14 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">🎨</span>
                <span className="text-base text-black">Тема оформления</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Фиолетовая</span>
                <svg className="w-5 h-5 text-[#7C4DFF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Тренировки */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Тренировки</h3>
          <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
            <button className="w-full h-14 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-xl">📋</span>
                <span className="text-base text-black">Мои программы</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">3 программы</span>
                <svg className="w-5 h-5 text-[#7C4DFF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            
            <button className="w-full h-14 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-xl">📅</span>
                <span className="text-base text-black">История тренировок</span>
              </div>
              <svg className="w-5 h-5 text-[#7C4DFF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button className="w-full h-14 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">📎</span>
                <span className="text-base text-black">Шаблоны</span>
              </div>
              <svg className="w-5 h-5 text-[#7C4DFF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Данные */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Данные</h3>
          <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
            <button className="w-full h-14 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-xl">☁️</span>
                <span className="text-base text-black">Резервная копия</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Последняя: 22.02</span>
                <svg className="w-5 h-5 text-[#7C4DFF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            
            <button className="w-full h-14 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-xl">📤</span>
                <span className="text-base text-black">Экспорт данных</span>
              </div>
              <svg className="w-5 h-5 text-[#7C4DFF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button className="w-full h-14 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">🗑️</span>
                <span className="text-base text-red-600">Сбросить прогресс</span>
              </div>
            </button>
          </div>
        </div>

        {/* Достижения */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-base font-semibold text-black">Достижения</h2>
            <button className="text-sm text-[#7C4DFF] font-medium">Все</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 px-2">
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                <span className="text-2xl opacity-40">🏆</span>
              </div>
              <span className="text-xs text-gray-500 text-center">100<br/>тренировок</span>
            </div>
            
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#7C4DFF] flex items-center justify-center mb-2 shadow-lg">
                <span className="text-2xl">🔥</span>
              </div>
              <span className="text-xs text-gray-900 font-medium text-center">7 дней<br/>стрика</span>
            </div>
            
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#7C4DFF] flex items-center justify-center mb-2 shadow-lg">
                <span className="text-2xl">💪</span>
              </div>
              <span className="text-xs text-gray-900 font-medium text-center">1000 кг</span>
            </div>
            
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                <span className="text-2xl opacity-40">⚡</span>
              </div>
              <span className="text-xs text-gray-500 text-center">Новичок</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
