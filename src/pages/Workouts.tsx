import { useState, useEffect } from 'react';
import { storageService } from '@/services/storage';
import type { Workout } from '@/types';
import { formatDate } from '@/utils/helpers';

export const Workouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const loadedWorkouts = storageService.getWorkouts();
    setWorkouts(loadedWorkouts);
  }, []);

  const handleDelete = (id: string) => {
    storageService.deleteWorkout(id);
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Мои тренировки</h2>
      
      {workouts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">Тренировок пока нет</p>
          <p className="text-gray-400 mt-2">Добавьте первую тренировку!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map(workout => (
            <div key={workout.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{workout.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {formatDate(new Date(workout.date))}
                  </p>
                  <p className="text-gray-600 mt-2">
                    Упражнений: {workout.exercises.length}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(workout.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
