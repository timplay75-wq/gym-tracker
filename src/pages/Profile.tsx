import { Card, Button } from '@/components';
import { loadTestWorkouts } from '@/utils/testData';
import { storageService } from '@/services/storage';
import { useState, useEffect } from 'react';

export const Profile = () => {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalExercises: 0,
    totalVolume: 0,
    streak: 0
  });

  useEffect(() => {
    const workouts = storageService.getWorkouts();
    const totalWorkouts = workouts.length;
    const totalExercises = workouts.reduce((sum, w) => sum + w.exercises.length, 0);
    const totalVolume = workouts.reduce((sum, w) => {
      return sum + w.exercises.reduce((exSum, ex) => {
        return exSum + ex.sets.reduce((setSum, set) => {
          return set.completed ? setSum + (set.weight || 0) * (set.reps || 0) : setSum;
        }, 0);
      }, 0);
    }, 0) / 1000; // в тоннах

    // Простой подсчет streak (подряд идущие дни)
    const streak = 0; // TODO: реализовать логику подсчета

    setStats({
      totalWorkouts,
      totalExercises,
      totalVolume: Math.round(totalVolume * 10) / 10,
      streak
    });
  }, []);

  const handleLoadTestData = () => {
    loadTestWorkouts();
    alert('✅ Загружено ~30 тестовых тренировок!\n\n🔄 Обновите страницу или перейдите в раздел "Тренировки"');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-[480px] mx-auto px-5">
        {/* Header */}
        <header className="pt-6 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Профиль
          </h1>
        </header>

        <div className="space-y-5">
          {/* User Info */}
          <Card padding="lg" className="text-center border-2 border-[#9333ea]">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#9333ea] flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-lg shadow-[#9333ea]/20">
                👤
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                user@example.com
              </h2>
            </div>
          </Card>

          {/* Статистика - 3 основные метрики */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 shadow-md text-center border-2 border-[#9333ea]">
              <p className="text-2xl font-bold text-[#7c3aed]">{stats.totalWorkouts}</p>
              <p className="text-xs text-[#7c3aed]/70 mt-1 font-medium">тренировок</p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-md text-center border-2 border-[#9333ea]">
              <p className="text-2xl font-bold text-[#7c3aed]">{stats.totalVolume}т</p>
              <p className="text-xs text-[#7c3aed]/70 mt-1 font-medium">тоннаж</p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-md text-center border-2 border-[#9333ea]">
              <p className="text-2xl font-bold text-[#7c3aed]">{stats.streak === 0 ? '😔' : '🔥'}</p>
              <p className="text-xs text-[#7c3aed]/70 mt-1 font-medium">streak</p>
            </div>
          </div>

          {/* Настройки */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Настройки
            </h3>
            <Card padding="none" className="shadow-sm">
              <button
                onClick={handleLoadTestData}
                className="w-full flex items-center justify-between p-4 hover:bg-[#e9d5ff] transition-colors rounded-xl border-2 border-[#9333ea]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📊</span>
                  <span className="font-medium text-gray-900">
                    Загрузить тестовые данные
                  </span>
                </div>
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
