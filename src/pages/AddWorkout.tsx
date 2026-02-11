import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '@/services/storage';
import { generateId } from '@/utils/helpers';
import type { Workout } from '@/types';
import { Card, Button } from '@/components';

export const AddWorkout = () => {
  const navigate = useNavigate();
  const [workoutName, setWorkoutName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workoutName.trim()) return;

    const newWorkout: Workout = {
      id: generateId(),
      name: workoutName,
      date: new Date(),
      exercises: [],
      status: 'planned',
    };

    // Сохраняем тренировку и переходим в конструктор для добавления упражнений
    storageService.saveWorkout(newWorkout);
    navigate('/builder', { state: { workout: newWorkout } });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-6 pb-4 flex items-center justify-between">
          <h1 className="text-4xl sm:text-5xl font-bold text-light-primary dark:text-white">
            Новая тренировка
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Назад"
          >
            <svg className="w-6 h-6 text-light-secondary dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="mt-6">
          <form onSubmit={handleSubmit}>
            <Card padding="lg">
              <div className="mb-6">
                <label 
                  htmlFor="workoutName" 
                  className="block text-sm font-medium text-light-primary dark:text-gray-200 mb-2"
                >
                  Название тренировки
                </label>
                <input
                  type="text"
                  id="workoutName"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-light-primary dark:text-white placeholder-text-light-tertiary dark:placeholder-gray-500 outline-none transition-all"
                  placeholder="Например: Грудь и трицепс"
                  required
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                Создать тренировку
              </Button>
            </Card>
          </form>

          {/* Quick Templates */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-light-primary dark:text-white mb-3">
              Быстрые шаблоны
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Грудь и трицепс', 'Спина и бицепс', 'Ноги', 'Плечи'].map((template) => (
                <Card 
                  key={template}
                  variant="interactive"
                  padding="md"
                  onClick={() => setWorkoutName(template)}
                >
                  <p className="font-medium text-light-primary dark:text-white">
                    {template}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
