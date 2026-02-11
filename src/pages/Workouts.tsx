import { useState, useEffect } from 'react';
import { storageService } from '@/services/storage';
import type { Workout } from '@/types';
import { formatDate } from '@/utils/helpers';
import { Card } from '@/components';

export const Workouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const loadedWorkouts = storageService.getWorkouts();
    setWorkouts(loadedWorkouts);
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Удалить эту тренировку?')) {
      storageService.deleteWorkout(id);
      setWorkouts(workouts.filter(w => w.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-gray-900 pb-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-6 pb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-text-light-primary dark:text-white">
            Тренировки
          </h1>
        </header>

        <div className="mt-6">
          {workouts.length === 0 ? (
            <Card padding="lg" className="text-center">
              <div className="py-8">
                <p className="text-lg text-text-light-secondary dark:text-gray-400 mb-2">
                  Тренировок пока нет
                </p>
                <p className="text-sm text-text-light-tertiary dark:text-gray-500">
                  Добавьте первую тренировку!
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {workouts.map(workout => (
                <Card key={workout.id} padding="md" variant="interactive">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-light-primary dark:text-white">
                        {workout.name}
                      </h3>
                      <p className="text-sm text-text-light-secondary dark:text-gray-400 mt-1">
                        {formatDate(new Date(workout.date))}
                      </p>
                      <p className="text-sm text-text-light-secondary dark:text-gray-400 mt-2">
                        Упражнений: {workout.exercises.length}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(workout.id);
                      }}
                      className="p-2 text-error-600 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors"
                      aria-label="Удалить"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
